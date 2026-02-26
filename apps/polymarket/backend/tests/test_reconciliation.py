from __future__ import annotations

from datetime import datetime, timedelta

from backend.db.models import OrderIntent, OrderStateEvent, Signal
from backend.execution.order_intents import (
    build_order_idempotency_key,
    get_or_create_order_intent,
)
from backend.execution.reconciliation import reconcile_open_order_intents


class StubGateway:
    venue = "polymarket"

    def __init__(self, orders: dict[str, dict] | None = None):
        self.orders = orders or {}

    def get_order(self, order_id: str):
        return self.orders.get(order_id, {"order": {"id": order_id, "status": "LIVE"}})


def _create_signal(
    db_session,
    *,
    status: str = "submitted",
    gateway_status: str = "pending",
) -> Signal:
    signal = Signal(
        market_id=1,
        implied_prob=0.45,
        theoretical_prob=0.7,
        spread=0.25,
        meta={
            "status": status,
            "token_id": "token-1",
            "execution_gateway_status": gateway_status,
        },
    )
    db_session.add(signal)
    db_session.commit()
    return signal


def test_reconcile_pending_with_rest_fallback(db_session):
    signal = _create_signal(db_session, status="submitted", gateway_status="pending")
    key = build_order_idempotency_key(
        signal_id=signal.id,
        market_key="token-1",
        side="buy",
        price=0.45,
        size=20.0,
    )
    intent, _ = get_or_create_order_intent(
        db_session,
        signal_id=signal.id,
        venue="polymarket",
        market_key="token-1",
        token_id="token-1",
        side="buy",
        price=0.45,
        size=20.0,
        idempotency_key=key,
    )
    intent.status = "pending"
    intent.external_order_id = "ord-1"
    db_session.add(intent)
    db_session.commit()

    summary = reconcile_open_order_intents(
        db=db_session,
        gateway=StubGateway(orders={"ord-1": {"order": {"id": "ord-1", "status": "CONFIRMED"}}}),
        mode="live",
        stream_events=[],
    )

    refreshed = db_session.query(OrderIntent).filter(OrderIntent.id == intent.id).one()
    updated_signal = db_session.query(Signal).filter(Signal.id == signal.id).one()
    assert summary["updated"] >= 1
    assert refreshed.status == "filled"
    assert updated_signal.meta.get("execution_gateway_status") == "filled"
    assert db_session.query(OrderStateEvent).count() >= 2


def test_reconcile_user_stream_cancellation_event(db_session):
    signal = _create_signal(db_session, status="submitted", gateway_status="pending")
    key = build_order_idempotency_key(
        signal_id=signal.id,
        market_key="token-1",
        side="buy",
        price=0.45,
        size=20.0,
    )
    intent, _ = get_or_create_order_intent(
        db_session,
        signal_id=signal.id,
        venue="polymarket",
        market_key="token-1",
        token_id="token-1",
        side="buy",
        price=0.45,
        size=20.0,
        idempotency_key=key,
    )
    intent.status = "pending"
    intent.external_order_id = "ord-2"
    db_session.add(intent)
    db_session.commit()

    reconcile_open_order_intents(
        db=db_session,
        gateway=StubGateway(),
        mode="live",
        rest_fallback_enabled=False,
        stream_events=[{"event_type": "order", "id": "ord-2", "type": "CANCELLATION"}],
    )

    refreshed = db_session.query(OrderIntent).filter(OrderIntent.id == intent.id).one()
    assert refreshed.status == "cancelled"


def test_reconcile_shadow_prepared_finalization(db_session):
    signal = _create_signal(db_session, status="submitted", gateway_status="prepared")
    key = build_order_idempotency_key(
        signal_id=signal.id,
        market_key="token-1",
        side="buy",
        price=0.45,
        size=20.0,
    )
    intent, _ = get_or_create_order_intent(
        db_session,
        signal_id=signal.id,
        venue="polymarket",
        market_key="token-1",
        token_id="token-1",
        side="buy",
        price=0.45,
        size=20.0,
        idempotency_key=key,
    )
    intent.status = "prepared"
    intent.live_submitted = False
    intent.updated_at = datetime.utcnow() - timedelta(seconds=120)
    db_session.add(intent)
    db_session.commit()

    reconcile_open_order_intents(
        db=db_session,
        gateway=StubGateway(),
        mode="live_shadow",
        rest_fallback_enabled=False,
        shadow_finalize_seconds=1.0,
        stream_events=[],
    )

    refreshed = db_session.query(OrderIntent).filter(OrderIntent.id == intent.id).one()
    updated_signal = db_session.query(Signal).filter(Signal.id == signal.id).one()
    assert refreshed.status == "shadow_finalized"
    assert updated_signal.meta.get("execution_gateway_status") == "shadow_finalized"


def test_reconcile_noop_status_does_not_increment_updated_count(db_session):
    signal = _create_signal(db_session, status="submitted", gateway_status="pending")
    key = build_order_idempotency_key(
        signal_id=signal.id,
        market_key="token-1",
        side="buy",
        price=0.45,
        size=20.0,
    )
    intent, _ = get_or_create_order_intent(
        db_session,
        signal_id=signal.id,
        venue="polymarket",
        market_key="token-1",
        token_id="token-1",
        side="buy",
        price=0.45,
        size=20.0,
        idempotency_key=key,
    )
    intent.status = "pending"
    intent.external_order_id = "ord-noop"
    db_session.add(intent)
    db_session.commit()

    summary = reconcile_open_order_intents(
        db=db_session,
        gateway=StubGateway(
            orders={"ord-noop": {"order": {"id": "ord-noop", "status": "PENDING"}}}
        ),
        mode="live",
        stream_events=[],
    )
    assert summary["updated"] == 0
    assert summary["events_applied"] == 0
