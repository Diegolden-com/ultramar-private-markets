from __future__ import annotations

from datetime import datetime, timedelta

from backend.db.models import OrderIntent
from backend.execution.intent_report import intent_backlog_report


def test_empty_backlog(db_session):
    report = intent_backlog_report(db_session, sla_seconds=300)
    assert report["active_count"] == 0
    assert report["sla_ok"] is True
    assert report["sla_breach_count"] == 0
    assert report["max_age_seconds"] == 0.0


def test_active_intents_within_sla(db_session):
    now = datetime.utcnow()
    intent = OrderIntent(
        signal_id=1,
        venue="polymarket",
        market_key="BTC-100k",
        token_id="tok1",
        side="buy",
        price=0.55,
        size=100.0,
        status="pending",
        idempotency_key="abc123",
        external_order_id="ext1",
        live_submitted=True,
        request_meta={},
        response_meta={},
        created_at=now - timedelta(seconds=60),
        updated_at=now - timedelta(seconds=60),
    )
    db_session.add(intent)
    db_session.flush()

    report = intent_backlog_report(db_session, sla_seconds=300, now=now)
    assert report["active_count"] == 1
    assert report["sla_ok"] is True
    assert report["sla_breach_count"] == 0
    assert report["status_counts"] == {"pending": 1}
    assert 55.0 <= report["max_age_seconds"] <= 65.0


def test_sla_breach_detected(db_session):
    now = datetime.utcnow()
    intent = OrderIntent(
        signal_id=1,
        venue="polymarket",
        market_key="BTC-100k",
        token_id="tok1",
        side="buy",
        price=0.55,
        size=100.0,
        status="prepared",
        idempotency_key="def456",
        external_order_id=None,
        live_submitted=False,
        request_meta={},
        response_meta={},
        created_at=now - timedelta(seconds=600),
        updated_at=now - timedelta(seconds=600),
    )
    db_session.add(intent)
    db_session.flush()

    report = intent_backlog_report(db_session, sla_seconds=300, now=now)
    assert report["active_count"] == 1
    assert report["sla_ok"] is False
    assert report["sla_breach_count"] == 1
    breach = report["sla_breaches"][0]
    assert breach["status"] == "prepared"
    assert breach["age_seconds"] >= 595.0


def test_terminal_intents_excluded(db_session):
    now = datetime.utcnow()
    intent = OrderIntent(
        signal_id=1,
        venue="polymarket",
        market_key="BTC-100k",
        token_id="tok1",
        side="buy",
        price=0.55,
        size=100.0,
        status="filled",
        idempotency_key="ghi789",
        external_order_id="ext2",
        live_submitted=True,
        request_meta={},
        response_meta={},
        created_at=now - timedelta(seconds=600),
        updated_at=now - timedelta(seconds=600),
    )
    db_session.add(intent)
    db_session.flush()

    report = intent_backlog_report(db_session, sla_seconds=300, now=now)
    assert report["active_count"] == 0
    assert report["sla_ok"] is True
