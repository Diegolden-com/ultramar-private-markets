from __future__ import annotations

from backend.execution.order_intents import (
    append_order_state_event,
    build_order_idempotency_key,
    get_or_create_order_intent,
)


def test_build_order_idempotency_key_is_stable():
    key1 = build_order_idempotency_key(
        signal_id=1,
        market_key="token-1",
        side="buy",
        price=0.45,
        size=10.0,
    )
    key2 = build_order_idempotency_key(
        signal_id=1,
        market_key="token-1",
        side="buy",
        price=0.45,
        size=10.0,
    )
    assert key1 == key2


def test_get_or_create_order_intent_dedupes(db_session):
    key = build_order_idempotency_key(
        signal_id=10,
        market_key="token-2",
        side="sell",
        price=0.6,
        size=12.0,
    )

    first, created_first = get_or_create_order_intent(
        db_session,
        signal_id=10,
        venue="polymarket",
        market_key="token-2",
        token_id="token-2",
        side="sell",
        price=0.6,
        size=12.0,
        idempotency_key=key,
    )
    second, created_second = get_or_create_order_intent(
        db_session,
        signal_id=10,
        venue="polymarket",
        market_key="token-2",
        token_id="token-2",
        side="sell",
        price=0.6,
        size=12.0,
        idempotency_key=key,
    )

    assert created_first is True
    assert created_second is False
    assert first.id == second.id

    append_order_state_event(
        db_session,
        first,
        status="pending",
        reason="gateway_placement",
        payload={"order_id": "abc"},
        external_order_id="abc",
        live_submitted=True,
    )
    db_session.commit()

    refreshed, created_third = get_or_create_order_intent(
        db_session,
        signal_id=10,
        venue="polymarket",
        market_key="token-2",
        token_id="token-2",
        side="sell",
        price=0.6,
        size=12.0,
        idempotency_key=key,
    )
    assert created_third is False
    assert refreshed.status == "pending"
    assert refreshed.external_order_id == "abc"
    assert refreshed.live_submitted is True

