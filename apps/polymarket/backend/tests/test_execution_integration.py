from datetime import datetime

import pytest

from backend.db.models import OrderIntent, OrderStateEvent, Position, Signal, Trade
from backend.execution.executor import ExecutionConfig, execute_signal
from backend.execution.trading_gateway import OrderPlacement


class PreparedOrderGateway:
    venue = "polymarket"

    def place_limit_order(self, request):
        return OrderPlacement(
            venue=self.venue,
            market_key=request.market_key,
            side=request.side,
            price=request.price,
            size=request.size,
            status="prepared",
            submitted_at=datetime.utcnow().isoformat(),
            live_submitted=False,
            payload={"signed_order": {"token_id": request.token_id}},
        )


class CrashingGateway:
    venue = "polymarket"

    def place_limit_order(self, request):
        raise RuntimeError("simulated crash after submission lock")


def test_signal_to_position_persistence(db_session):
    signal = Signal(
        market_id=1,
        implied_prob=0.4,
        theoretical_prob=0.7,
        spread=0.3,
        meta={"market_slug": "btc-above-100k", "token_id": "123", "spot": 100000},
    )
    db_session.add(signal)
    db_session.commit()

    config = ExecutionConfig(
        bankroll_usd=1000.0,
        max_position_usd=500.0,
        max_portfolio_usd=1000.0,
        daily_loss_limit_usd=500.0,
        min_trade_usd=10.0,
        kelly_fraction=0.5,
        delta_band_fraction=0.2,
        min_hedge_notional_usd=10.0,
    )

    result = execute_signal(db_session, signal, config)
    assert result.executed is True

    trade = db_session.query(Trade).one()
    position = db_session.query(Position).one()
    intent = db_session.query(OrderIntent).one()
    assert trade.market_key == "123"
    assert trade.meta.get("order_intent_id") == intent.id
    assert position.meta.get("market_key") == "123"
    assert signal.meta.get("status") == "executed"
    assert signal.meta.get("execution_order_intent_id") == intent.id
    assert db_session.query(OrderStateEvent).count() >= 2


def test_daily_loss_limit_blocks_trade(db_session):
    db_session.add(
        Trade(
            venue="polymarket",
            market_key="123",
            price=1.0,
            size=1000.0,
            side="buy",
            traded_at=datetime.utcnow(),
        )
    )
    db_session.commit()

    signal = Signal(
        market_id=1,
        implied_prob=0.45,
        theoretical_prob=0.7,
        spread=0.25,
        meta={"market_slug": "btc-above-100k", "token_id": "123", "spot": 100000},
    )
    db_session.add(signal)
    db_session.commit()

    config = ExecutionConfig(
        bankroll_usd=1000.0,
        max_position_usd=500.0,
        max_portfolio_usd=1000.0,
        daily_loss_limit_usd=500.0,
        min_trade_usd=10.0,
        kelly_fraction=0.5,
        delta_band_fraction=0.2,
        min_hedge_notional_usd=10.0,
    )

    result = execute_signal(db_session, signal, config)
    assert result.executed is False
    assert signal.meta.get("status") == "blocked"
    assert "daily_loss_limit" in signal.meta.get("risk_reasons", [])


def test_prepared_gateway_does_not_create_trade(db_session):
    signal = Signal(
        market_id=1,
        implied_prob=0.4,
        theoretical_prob=0.7,
        spread=0.3,
        meta={"market_slug": "btc-above-100k", "token_id": "123", "spot": 100000},
    )
    db_session.add(signal)
    db_session.commit()

    config = ExecutionConfig(
        bankroll_usd=1000.0,
        max_position_usd=500.0,
        max_portfolio_usd=1000.0,
        daily_loss_limit_usd=500.0,
        min_trade_usd=10.0,
        kelly_fraction=0.5,
        delta_band_fraction=0.2,
        min_hedge_notional_usd=10.0,
    )

    result = execute_signal(
        db_session,
        signal,
        config,
        trading_gateway=PreparedOrderGateway(),
    )
    assert result.executed is False
    assert result.reason == "order_prepared"
    assert signal.meta.get("status") == "submitted"
    assert signal.meta.get("execution_gateway_status") == "prepared"
    assert db_session.query(Trade).count() == 0
    assert db_session.query(OrderIntent).count() == 1
    assert db_session.query(OrderStateEvent).count() == 3


def test_prepared_signal_is_not_resent(db_session):
    signal = Signal(
        market_id=1,
        implied_prob=0.4,
        theoretical_prob=0.7,
        spread=0.3,
        meta={"market_slug": "btc-above-100k", "token_id": "123", "spot": 100000},
    )
    db_session.add(signal)
    db_session.commit()

    config = ExecutionConfig(
        bankroll_usd=1000.0,
        max_position_usd=500.0,
        max_portfolio_usd=1000.0,
        daily_loss_limit_usd=500.0,
        min_trade_usd=10.0,
        kelly_fraction=0.5,
        delta_band_fraction=0.2,
        min_hedge_notional_usd=10.0,
    )

    first = execute_signal(
        db_session,
        signal,
        config,
        trading_gateway=PreparedOrderGateway(),
    )
    second = execute_signal(
        db_session,
        signal,
        config,
        trading_gateway=PreparedOrderGateway(),
    )

    assert first.reason == "order_prepared"
    assert second.reason == "awaiting_reconciliation"
    assert db_session.query(OrderIntent).count() == 1


def test_submission_lock_blocks_resend_after_gateway_exception(db_session):
    signal = Signal(
        market_id=1,
        implied_prob=0.4,
        theoretical_prob=0.7,
        spread=0.3,
        meta={"market_slug": "btc-above-100k", "token_id": "123", "spot": 100000},
    )
    db_session.add(signal)
    db_session.commit()

    config = ExecutionConfig(
        bankroll_usd=1000.0,
        max_position_usd=500.0,
        max_portfolio_usd=1000.0,
        daily_loss_limit_usd=500.0,
        min_trade_usd=10.0,
        kelly_fraction=0.5,
        delta_band_fraction=0.2,
        min_hedge_notional_usd=10.0,
    )

    with pytest.raises(RuntimeError, match="submission lock"):
        execute_signal(
            db_session,
            signal,
            config,
            trading_gateway=CrashingGateway(),
        )

    persisted_signal = db_session.query(Signal).filter(Signal.id == signal.id).one()
    intent = db_session.query(OrderIntent).one()
    assert intent.status == "created"
    assert persisted_signal.meta.get("execution_gateway_status") == "created"
    assert persisted_signal.meta.get("execution_submission_lock") is not None
    assert (
        db_session.query(OrderStateEvent)
        .filter(OrderStateEvent.reason == "submission_lock_acquired")
        .count()
        == 1
    )

    retry = execute_signal(
        db_session,
        persisted_signal,
        config,
        trading_gateway=PreparedOrderGateway(),
    )
    assert retry.executed is False
    assert retry.reason == "awaiting_reconciliation"
