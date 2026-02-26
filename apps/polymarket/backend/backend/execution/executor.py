from __future__ import annotations

import logging
from dataclasses import dataclass
from datetime import datetime

from sqlalchemy.orm import Session, attributes

from ..analytics.pnl import simple_pnl
from ..config import settings
from ..db.models import Position, Signal, Trade
from ..execution.deribit_hedge import hedge_notional
from ..execution.order_intents import (
    append_order_state_event,
    build_order_idempotency_key,
    get_or_create_order_intent,
)
from ..execution.paper_gateway import PaperTradingGateway
from ..execution.trading_gateway import LimitOrderRequest, TradingGateway
from ..risk.kelly import fractional_kelly
from ..risk.limits import check_risk_limits

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class ExecutionConfig:
    bankroll_usd: float
    max_position_usd: float
    max_portfolio_usd: float
    daily_loss_limit_usd: float
    min_trade_usd: float
    kelly_fraction: float
    delta_band_fraction: float
    min_hedge_notional_usd: float

    @classmethod
    def from_settings(cls) -> "ExecutionConfig":
        return cls(
            bankroll_usd=settings.max_capital_usd,
            max_position_usd=settings.max_position_usd,
            max_portfolio_usd=settings.max_portfolio_usd,
            daily_loss_limit_usd=settings.daily_loss_limit_usd,
            min_trade_usd=settings.min_trade_usd,
            kelly_fraction=settings.kelly_fraction,
            delta_band_fraction=settings.delta_band_fraction,
            min_hedge_notional_usd=settings.min_hedge_notional_usd,
        )


@dataclass(frozen=True)
class ExecutionResult:
    executed: bool
    reason: str
    trade_id: int | None = None
    hedge_plan: dict | None = None


def _price_for_side(implied_prob: float, side: str) -> float:
    if side == "sell":
        return max(1.0 - implied_prob, 1e-6)
    return max(implied_prob, 1e-6)


def _odds_for_price(price: float) -> float:
    return max(0.0, (1.0 / price) - 1.0)


def _position_notional(position: Position) -> float:
    if position.size >= 0:
        return position.size * position.avg_price
    return abs(position.size) * max(1.0 - position.avg_price, 0.0)


def _market_key_for_signal(signal: Signal) -> str:
    meta = signal.meta or {}
    return meta.get("token_id") or meta.get("market_slug") or str(signal.market_id)


def _position_matches(position: Position, market_key: str) -> bool:
    meta = position.meta or {}
    return meta.get("market_key") == market_key or str(position.market_id) == market_key


def _daily_pnl(trades: list[Trade]) -> float:
    return simple_pnl([{"side": t.side, "price": t.price, "size": t.size} for t in trades])


def _upsert_position(
    db: Session,
    market_id: int,
    market_key: str,
    market_slug: str | None,
    venue: str,
    side: str,
    price: float,
    size: float,
) -> Position:
    positions = db.query(Position).filter(Position.venue == venue).all()
    position = next((p for p in positions if _position_matches(p, market_key)), None)
    signed_size = size if side == "buy" else -size
    if position is None:
        position = Position(
            market_id=market_id,
            venue=venue,
            size=signed_size,
            avg_price=price,
            meta={"market_key": market_key, "market_slug": market_slug},
        )
        db.add(position)
        return position

    new_size = position.size + signed_size
    if position.size == 0 or (position.size > 0) == (signed_size > 0):
        total_notional = abs(position.size) * position.avg_price + abs(signed_size) * price
        position.avg_price = total_notional / max(abs(new_size), 1e-9)
    elif new_size == 0:
        position.avg_price = 0.0
    else:
        position.avg_price = price

    position.size = new_size
    meta = position.meta or {}
    meta.update({"market_key": market_key, "market_slug": market_slug})
    position.meta = meta
    return position


def _plan_hedge(
    notional: float, side: str, spot: float | None, config: ExecutionConfig
) -> dict | None:
    if spot is None or spot <= 0:
        return None
    delta_exposure = notional if side == "buy" else -notional
    allowed_band = abs(notional) * config.delta_band_fraction
    hedge_needed = max(0.0, abs(delta_exposure) - allowed_band)
    if hedge_needed <= 0:
        return None
    if hedge_needed < config.min_hedge_notional_usd:
        return {
            "status": "defer",
            "target_delta_usd": hedge_needed,
            "reason": "below_minimum",
        }
    target_delta = -hedge_needed if delta_exposure > 0 else hedge_needed
    plan = hedge_notional(target_delta, spot)
    plan.update({"target_delta_usd": hedge_needed, "target_delta_signed": target_delta})
    return plan


def execute_signal(
    db: Session,
    signal: Signal,
    config: ExecutionConfig | None = None,
    trading_gateway: TradingGateway | None = None,
) -> ExecutionResult:
    config = config or ExecutionConfig.from_settings()
    trading_gateway = trading_gateway or PaperTradingGateway()
    meta = signal.meta or {}
    status = meta.get("status")
    if status in {"executed", "blocked"}:
        return ExecutionResult(False, "already_processed")
    if status == "submitted" and meta.get("execution_gateway_status") in {"prepared", "pending"}:
        return ExecutionResult(False, "awaiting_reconciliation")

    implied = signal.implied_prob
    theoretical = signal.theoretical_prob
    if implied <= 0 or implied >= 1:
        return ExecutionResult(False, "invalid_implied")

    edge = theoretical - implied
    if edge == 0:
        return ExecutionResult(False, "no_edge")

    side = "buy" if edge > 0 else "sell"
    price_for_size = _price_for_side(implied, side)
    odds = _odds_for_price(price_for_size)
    kelly_fraction = fractional_kelly(abs(edge), odds, config.kelly_fraction)
    notional = min(config.max_position_usd, config.bankroll_usd * kelly_fraction)

    if notional < config.min_trade_usd:
        meta.update({"status": "blocked", "reason": "min_trade"})
        signal.meta = meta
        attributes.flag_modified(signal, "meta")
        db.add(signal)
        db.commit()
        return ExecutionResult(False, "min_trade")

    size = notional / price_for_size
    market_key = _market_key_for_signal(signal)
    market_slug = meta.get("market_slug")
    token_id = meta.get("token_id")

    positions = db.query(Position).all()
    market_positions = [p for p in positions if _position_matches(p, market_key)]
    market_notional = sum(_position_notional(p) for p in market_positions)
    portfolio_notional = sum(_position_notional(p) for p in positions)

    start_of_day = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    trades_today = db.query(Trade).filter(Trade.traded_at >= start_of_day).all()
    daily_pnl = _daily_pnl(trades_today)

    risk = check_risk_limits(
        proposed_notional=notional,
        market_notional=market_notional,
        portfolio_notional=portfolio_notional,
        daily_pnl=daily_pnl,
        max_position_usd=config.max_position_usd,
        max_portfolio_usd=config.max_portfolio_usd,
        daily_loss_limit_usd=config.daily_loss_limit_usd,
    )
    if not risk.allowed:
        meta.update(
            {
                "status": "blocked",
                "risk_reasons": list(risk.reasons),
                "market_notional": risk.market_notional,
                "portfolio_notional": risk.portfolio_notional,
                "daily_pnl": risk.daily_pnl,
            }
        )
        signal.meta = meta
        attributes.flag_modified(signal, "meta")
        db.add(signal)
        db.commit()
        logger.info("signal blocked", extra={"signal_id": signal.id, "reasons": risk.reasons})
        return ExecutionResult(False, "risk_blocked")

    idempotency_key = build_order_idempotency_key(
        signal_id=signal.id,
        market_key=market_key,
        side=side,
        price=implied,
        size=size,
    )
    order_intent, created_intent = get_or_create_order_intent(
        db,
        signal_id=signal.id,
        venue=trading_gateway.venue,
        market_key=market_key,
        token_id=token_id,
        side=side,
        price=implied,
        size=size,
        idempotency_key=idempotency_key,
        request_meta={
            "market_slug": market_slug,
            "signal_id": signal.id,
            "implied_prob": implied,
            "theoretical_prob": theoretical,
            "spread": signal.spread,
            "notional": notional,
        },
    )
    if (not created_intent) and order_intent.status in {"prepared", "pending", "filled"}:
        meta.update(
            {
                "status": "submitted",
                "execution_gateway_status": order_intent.status,
                "execution_order_id": order_intent.external_order_id,
                "execution_order_intent_id": order_intent.id,
                "execution_idempotency_key": order_intent.idempotency_key,
                "execution_live_submitted": order_intent.live_submitted,
            }
        )
        signal.meta = meta
        attributes.flag_modified(signal, "meta")
        db.add(signal)
        db.commit()
        return ExecutionResult(False, "duplicate_order_intent")

    placement = trading_gateway.place_limit_order(
        LimitOrderRequest(
            market_key=market_key,
            market_id=str(signal.market_id),
            token_id=token_id,
            side=side,
            price=implied,
            size=size,
            meta={"signal_id": signal.id, "market_slug": market_slug},
        )
    )
    placement_payload = {
        "order_id": placement.order_id,
        "live_submitted": placement.live_submitted,
        "payload": placement.payload or {},
    }
    append_order_state_event(
        db,
        order_intent,
        status=placement.status,
        reason="gateway_placement",
        error=placement.error,
        payload=placement_payload,
        external_order_id=placement.order_id,
        live_submitted=placement.live_submitted,
    )
    hedge_plan = _plan_hedge(notional, side, meta.get("spot"), config)

    if placement.status != "filled":
        meta.update(
            {
                "status": "submitted" if placement.status in {"prepared", "pending"} else "blocked",
                "execution_gateway_status": placement.status,
                "execution_order_id": placement.order_id,
                "execution_order_intent_id": order_intent.id,
                "execution_idempotency_key": order_intent.idempotency_key,
                "execution_live_submitted": placement.live_submitted,
                "execution_payload": placement.payload,
                "execution_error": placement.error,
            }
        )
        signal.meta = meta
        attributes.flag_modified(signal, "meta")
        db.add(signal)
        db.commit()
        if placement.status == "prepared":
            return ExecutionResult(False, "order_prepared", hedge_plan=hedge_plan)
        if placement.status == "pending":
            return ExecutionResult(False, "order_pending", hedge_plan=hedge_plan)
        return ExecutionResult(False, "order_rejected", hedge_plan=hedge_plan)

    trade = Trade(
        venue=placement.venue,
        market_key=placement.market_key,
        price=placement.price,
        size=placement.size,
        side=placement.side,
        meta={
            "signal_id": signal.id,
            "order_intent_id": order_intent.id,
            "idempotency_key": order_intent.idempotency_key,
            "implied_prob": implied,
            "theoretical_prob": theoretical,
            "spread": signal.spread,
            "notional": notional,
            "filled_at": placement.filled_at,
            "execution_status": placement.status,
            "execution_order_id": placement.order_id,
            "execution_live_submitted": placement.live_submitted,
            "hedge_plan": hedge_plan,
        },
    )
    db.add(trade)
    db.flush()

    position = _upsert_position(
        db,
        market_id=signal.market_id,
        market_key=market_key,
        market_slug=market_slug,
        venue=placement.venue,
        side=side,
        price=placement.price,
        size=placement.size,
    )
    db.flush()

    append_order_state_event(
        db,
        order_intent,
        status="filled",
        reason="trade_recorded",
        payload={
            "trade_id": trade.id,
            "position_id": position.id,
            "filled_at": placement.filled_at,
        },
        external_order_id=placement.order_id,
        live_submitted=placement.live_submitted,
    )

    meta.update(
        {
            "status": "executed",
            "executed_at": datetime.utcnow().isoformat(),
            "side": side,
            "size": size,
            "notional": notional,
            "trade_id": trade.id,
            "position_id": position.id,
            "execution_order_id": placement.order_id,
            "execution_order_intent_id": order_intent.id,
            "execution_idempotency_key": order_intent.idempotency_key,
            "execution_live_submitted": placement.live_submitted,
        }
    )
    signal.meta = meta
    attributes.flag_modified(signal, "meta")
    db.add(signal)
    db.commit()

    logger.info(
        "signal executed",
        extra={"signal_id": signal.id, "trade_id": trade.id, "side": side, "size": size},
    )
    return ExecutionResult(True, "executed", trade_id=trade.id, hedge_plan=hedge_plan)


def execute_signals_once(
    db: Session,
    limit: int = 50,
    trading_gateway: TradingGateway | None = None,
) -> int:
    signals = db.query(Signal).order_by(Signal.id.desc()).limit(limit).all()
    executed = 0
    for signal in signals:
        result = execute_signal(db, signal, trading_gateway=trading_gateway)
        if result.executed:
            executed += 1
    return executed
