from __future__ import annotations

import hashlib
from datetime import datetime

from sqlalchemy.orm import Session

from ..db.models import OrderIntent, OrderStateEvent


def build_order_idempotency_key(
    signal_id: int,
    market_key: str,
    side: str,
    price: float,
    size: float,
) -> str:
    raw = f"sig:{signal_id}|market:{market_key}|side:{side}|price:{price:.8f}|size:{size:.8f}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def get_or_create_order_intent(
    db: Session,
    *,
    signal_id: int,
    venue: str,
    market_key: str,
    token_id: str | None,
    side: str,
    price: float,
    size: float,
    idempotency_key: str,
    request_meta: dict | None = None,
) -> tuple[OrderIntent, bool]:
    existing = (
        db.query(OrderIntent)
        .filter(OrderIntent.idempotency_key == idempotency_key)
        .one_or_none()
    )
    if existing is not None:
        return existing, False

    now = datetime.utcnow()
    intent = OrderIntent(
        signal_id=signal_id,
        venue=venue,
        market_key=market_key,
        token_id=token_id,
        side=side,
        price=price,
        size=size,
        status="created",
        idempotency_key=idempotency_key,
        request_meta=request_meta or {},
        response_meta={},
        created_at=now,
        updated_at=now,
    )
    db.add(intent)
    db.flush()
    append_order_state_event(
        db,
        intent,
        status="created",
        reason="intent_created",
        payload={"request_meta": request_meta or {}},
    )
    return intent, True


def append_order_state_event(
    db: Session,
    intent: OrderIntent,
    *,
    status: str,
    reason: str | None = None,
    error: str | None = None,
    payload: dict | None = None,
    external_order_id: str | None = None,
    live_submitted: bool | None = None,
) -> OrderStateEvent:
    now = datetime.utcnow()
    intent.status = status
    intent.updated_at = now
    if external_order_id is not None:
        intent.external_order_id = external_order_id
    if live_submitted is not None:
        intent.live_submitted = live_submitted
    if payload is not None:
        intent.response_meta = payload

    event = OrderStateEvent(
        order_intent_id=intent.id,
        status=status,
        reason=reason,
        error=error,
        payload=payload or {},
        created_at=now,
    )
    db.add(intent)
    db.add(event)
    db.flush()
    return event

