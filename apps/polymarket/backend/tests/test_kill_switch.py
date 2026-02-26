from __future__ import annotations

from datetime import datetime, timedelta

from backend.db.models import OrderIntent
from backend.execution.kill_switch import check_kill_switch


def test_kill_switch_clean(db_session):
    result = check_kill_switch(db_session, max_backlog=50, max_age_seconds=600)
    assert result["triggered"] is False
    assert result["active_backlog"] == 0


def test_kill_switch_backlog_count_trigger(db_session):
    now = datetime.utcnow()
    for i in range(5):
        db_session.add(OrderIntent(
            signal_id=i,
            venue="polymarket",
            market_key=f"mkt-{i}",
            token_id=f"tok-{i}",
            side="buy",
            price=0.5,
            size=100.0,
            status="pending",
            idempotency_key=f"ks-backlog-{i}",
            external_order_id=f"ext-{i}",
            live_submitted=True,
            request_meta={},
            response_meta={},
            created_at=now - timedelta(seconds=10),
            updated_at=now - timedelta(seconds=10),
        ))
    db_session.flush()

    result = check_kill_switch(db_session, max_backlog=3, max_age_seconds=600, now=now)
    assert result["triggered"] is True
    assert any("backlog_count" in t for t in result["triggers"])


def test_kill_switch_backlog_age_trigger(db_session):
    now = datetime.utcnow()
    db_session.add(OrderIntent(
        signal_id=1,
        venue="polymarket",
        market_key="BTC-100k",
        token_id="tok1",
        side="buy",
        price=0.55,
        size=100.0,
        status="prepared",
        idempotency_key="ks-age-1",
        external_order_id=None,
        live_submitted=False,
        request_meta={},
        response_meta={},
        created_at=now - timedelta(seconds=900),
        updated_at=now - timedelta(seconds=900),
    ))
    db_session.flush()

    result = check_kill_switch(db_session, max_backlog=50, max_age_seconds=600, now=now)
    assert result["triggered"] is True
    assert any("backlog_age" in t for t in result["triggers"])


def test_kill_switch_daily_loss_trigger(db_session):
    result = check_kill_switch(
        db_session,
        max_backlog=50,
        max_age_seconds=600,
        daily_loss_limit_usd=1000.0,
        daily_pnl=-1500.0,
    )
    assert result["triggered"] is True
    assert any("daily_loss" in t for t in result["triggers"])


def test_kill_switch_no_trigger_within_limits(db_session):
    now = datetime.utcnow()
    db_session.add(OrderIntent(
        signal_id=1,
        venue="polymarket",
        market_key="BTC-100k",
        token_id="tok1",
        side="buy",
        price=0.55,
        size=100.0,
        status="pending",
        idempotency_key="ks-ok-1",
        external_order_id="ext1",
        live_submitted=True,
        request_meta={},
        response_meta={},
        created_at=now - timedelta(seconds=60),
        updated_at=now - timedelta(seconds=60),
    ))
    db_session.flush()

    result = check_kill_switch(
        db_session,
        max_backlog=50,
        max_age_seconds=600,
        daily_loss_limit_usd=1000.0,
        daily_pnl=-200.0,
        now=now,
    )
    assert result["triggered"] is False
