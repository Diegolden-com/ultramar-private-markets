from __future__ import annotations

import logging
from datetime import datetime
from typing import Any

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session, attributes

from ..config import settings
from ..db.models import OrderIntent, Signal
from .order_intents import append_order_state_event
from .trading_gateway import TradingGateway
from .user_stream import collect_user_channel_events

logger = logging.getLogger(__name__)

TERMINAL_STATUSES = {"filled", "cancelled", "failed", "expired", "shadow_finalized", "rejected"}
ACTIVE_STATUSES = {"created", "prepared", "pending", "submitted"}


def _map_external_status(raw_status: Any) -> str | None:
    if raw_status is None:
        return None

    value = str(raw_status).strip().lower()
    if not value:
        return None

    if value in {
        "live",
        "delayed",
        "unmatched",
        "matched",
        "mined",
        "retrying",
        "open",
        "pending",
        "placement",
        "update",
        "partially_filled",
        "partiallyfilled",
    }:
        return "pending"
    if value in {"confirmed", "filled"}:
        return "filled"
    if value in {"cancelled", "canceled", "cancellation"}:
        return "cancelled"
    if value in {"failed", "rejected"}:
        return "failed"
    if value in {"expired"}:
        return "expired"

    return None


def _extract_order_id(payload: dict[str, Any]) -> str | None:
    for key in ("id", "orderID", "orderId", "order_id"):
        value = payload.get(key)
        if value:
            return str(value)

    order = payload.get("order")
    if isinstance(order, dict):
        for key in ("id", "orderID", "orderId", "order_id"):
            value = order.get(key)
            if value:
                return str(value)
    return None


def _extract_rest_status(payload: Any) -> str | None:
    if not isinstance(payload, dict):
        return None

    for key in ("status", "state"):
        mapped = _map_external_status(payload.get(key))
        if mapped:
            return mapped

    order = payload.get("order")
    if isinstance(order, dict):
        for key in ("status", "state"):
            mapped = _map_external_status(order.get(key))
            if mapped:
                return mapped
    return None


def _extract_user_event_status(event: dict[str, Any]) -> str | None:
    event_type = str(event.get("event_type", "")).strip().lower()
    if event_type == "order":
        mapped = _map_external_status(event.get("type"))
        if mapped:
            return mapped
        return _map_external_status(event.get("status"))
    if event_type == "trade":
        mapped = _map_external_status(event.get("status"))
        if mapped:
            return mapped
    return None


def _extract_user_event_order_ids(event: dict[str, Any]) -> set[str]:
    order_ids: set[str] = set()
    direct = _extract_order_id(event)
    if direct:
        order_ids.add(direct)

    taker_order = event.get("taker_order")
    if isinstance(taker_order, dict):
        taker_id = _extract_order_id(taker_order)
        if taker_id:
            order_ids.add(taker_id)

    maker_orders = event.get("maker_orders")
    if isinstance(maker_orders, list):
        for maker_order in maker_orders:
            if not isinstance(maker_order, dict):
                continue
            maker_id = _extract_order_id(maker_order)
            if maker_id:
                order_ids.add(maker_id)

    return order_ids


def _sync_signal_meta(
    db: Session,
    intent: OrderIntent,
    *,
    status: str,
    reason: str,
    error: str | None,
    payload: dict[str, Any],
) -> None:
    signal = db.query(Signal).filter(Signal.id == intent.signal_id).one_or_none()
    if signal is None:
        return

    meta = signal.meta or {}
    meta.update(
        {
            "execution_order_intent_id": intent.id,
            "execution_idempotency_key": intent.idempotency_key,
            "execution_order_id": intent.external_order_id,
            "execution_gateway_status": status,
            "execution_live_submitted": intent.live_submitted,
            "execution_reconciliation_reason": reason,
            "execution_reconciliation_error": error,
            "execution_reconciliation_payload": payload,
            "execution_reconciled_at": datetime.utcnow().isoformat(),
        }
    )
    signal.meta = meta
    attributes.flag_modified(signal, "meta")
    db.add(signal)


def _apply_intent_status(
    db: Session,
    intent: OrderIntent,
    *,
    status: str,
    reason: str,
    payload: dict[str, Any],
    error: str | None = None,
    external_order_id: str | None = None,
) -> bool:
    if status == intent.status and not error:
        return False

    append_order_state_event(
        db,
        intent,
        status=status,
        reason=reason,
        error=error,
        payload=payload,
        external_order_id=external_order_id or intent.external_order_id,
    )
    _sync_signal_meta(
        db,
        intent,
        status=status,
        reason=reason,
        error=error,
        payload=payload,
    )
    return True


def _collect_stream_events(
    gateway: TradingGateway,
    *,
    ws_url: str,
    duration_seconds: float,
    user_stream_enabled: bool,
) -> list[dict[str, Any]]:
    if not user_stream_enabled:
        return []

    get_auth = getattr(gateway, "get_user_channel_auth", None)
    if not callable(get_auth):
        return []

    try:
        auth = get_auth()
    except Exception:
        logger.exception("unable to bootstrap user-channel auth")
        return []

    try:
        return collect_user_channel_events(
            ws_url=ws_url,
            auth=auth,
            duration_seconds=duration_seconds,
        )
    except Exception:
        logger.exception("user stream consume failed")
        return []


def reconcile_open_order_intents(
    db: Session,
    gateway: TradingGateway,
    *,
    mode: str,
    max_intents: int = 200,
    user_stream_enabled: bool = True,
    user_stream_duration_seconds: float = 5.0,
    user_stream_ws_url: str = "wss://ws-subscriptions-clob.polymarket.com/ws/user",
    rest_fallback_enabled: bool = True,
    shadow_finalize_seconds: float = 30.0,
    stream_events: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    try:
        intents = (
            db.query(OrderIntent)
            .filter(OrderIntent.status.in_(ACTIVE_STATUSES))
            .order_by(OrderIntent.updated_at.asc())
            .limit(max_intents)
            .all()
        )
    except SQLAlchemyError as exc:
        logger.warning(
            "reconciliation skipped: missing schema or unavailable db",
            extra={"error": str(exc)},
        )
        return {
            "processed": 0,
            "updated": 0,
            "events_applied": 0,
            "skipped": True,
            "error": str(exc),
        }
    if not intents:
        return {"processed": 0, "updated": 0, "events_applied": 0}

    intents_by_order_id = {
        intent.external_order_id: intent
        for intent in intents
        if intent.external_order_id
    }

    applied = 0
    reconciled = 0
    now = datetime.utcnow()

    events = stream_events
    if events is None:
        events = _collect_stream_events(
            gateway,
            ws_url=user_stream_ws_url,
            duration_seconds=user_stream_duration_seconds,
            user_stream_enabled=user_stream_enabled,
        )

    for event in events:
        mapped_status = _extract_user_event_status(event)
        if not mapped_status:
            continue
        order_ids = _extract_user_event_order_ids(event)
        for order_id in order_ids:
            intent = intents_by_order_id.get(order_id)
            if intent is None:
                continue
            changed = _apply_intent_status(
                db,
                intent,
                status=mapped_status,
                reason="user_stream_event",
                payload={"event": event},
                external_order_id=order_id,
            )
            if changed:
                applied += 1
                reconciled += 1

    get_order = getattr(gateway, "get_order", None)
    if rest_fallback_enabled and callable(get_order):
        for intent in intents:
            if intent.status in TERMINAL_STATUSES:
                continue
            if not intent.external_order_id:
                continue

            try:
                response = get_order(intent.external_order_id)
            except Exception as exc:
                changed = _apply_intent_status(
                    db,
                    intent,
                    status=intent.status,
                    reason="rest_fallback_error",
                    error=str(exc),
                    payload={"order_id": intent.external_order_id},
                )
                if changed:
                    reconciled += 1
                continue

            status = _extract_rest_status(response)
            if not status:
                continue
            changed = _apply_intent_status(
                db,
                intent,
                status=status,
                reason="rest_fallback",
                payload={"response": response},
                external_order_id=intent.external_order_id,
            )
            if changed:
                reconciled += 1

    if mode == "live_shadow":
        for intent in intents:
            if intent.status != "prepared":
                continue
            if intent.live_submitted:
                continue
            age = (now - intent.updated_at).total_seconds()
            if age < shadow_finalize_seconds:
                continue
            changed = _apply_intent_status(
                db,
                intent,
                status="shadow_finalized",
                reason="shadow_timeout_finalize",
                payload={"age_seconds": age},
            )
            if changed:
                reconciled += 1

    db.commit()

    # Compute backlog age metrics for monitoring.
    ages = [(now - i.updated_at).total_seconds() for i in intents if i.status in ACTIVE_STATUSES]
    max_age = max(ages) if ages else 0.0
    remaining_active = len(ages)

    return {
        "processed": len(intents),
        "updated": reconciled,
        "events_applied": applied,
        "remaining_active": remaining_active,
        "max_age_seconds": round(max_age, 1),
    }


def reconcile_from_settings(
    db: Session,
    gateway: TradingGateway,
) -> dict[str, Any]:
    return reconcile_open_order_intents(
        db=db,
        gateway=gateway,
        mode=settings.polymarket_execution_mode,
        max_intents=settings.polymarket_reconcile_max_intents,
        user_stream_enabled=settings.polymarket_reconcile_user_stream_enabled,
        user_stream_duration_seconds=settings.polymarket_reconcile_stream_timeout_seconds,
        user_stream_ws_url=settings.polymarket_user_ws_url,
        rest_fallback_enabled=settings.polymarket_reconcile_rest_fallback_enabled,
        shadow_finalize_seconds=settings.polymarket_reconcile_shadow_finalize_seconds,
    )
