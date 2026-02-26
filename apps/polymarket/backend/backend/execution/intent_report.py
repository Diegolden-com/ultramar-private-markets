"""Deterministic reporting for order intent backlog and SLA health.

Run standalone:
    python -m backend.execution.intent_report

Returns structured JSON to stdout for piping into dashboards or alerting.
"""
from __future__ import annotations

import json
import sys
from datetime import datetime
from typing import Any

from sqlalchemy.orm import Session

from ..db.models import OrderIntent
from .reconciliation import ACTIVE_STATUSES


def intent_backlog_report(
    db: Session,
    *,
    sla_seconds: float = 300.0,
    now: datetime | None = None,
) -> dict[str, Any]:
    """Return a deterministic snapshot of order intent health."""
    now = now or datetime.utcnow()

    active_intents = (
        db.query(OrderIntent)
        .filter(OrderIntent.status.in_(ACTIVE_STATUSES))
        .order_by(OrderIntent.updated_at.asc())
        .all()
    )

    status_counts: dict[str, int] = {}
    for intent in active_intents:
        status_counts[intent.status] = status_counts.get(intent.status, 0) + 1

    sla_breaches: list[dict[str, Any]] = []
    ages: list[float] = []

    for intent in active_intents:
        age = (now - intent.updated_at).total_seconds()
        ages.append(age)
        if age > sla_seconds:
            sla_breaches.append({
                "id": intent.id,
                "status": intent.status,
                "market_key": intent.market_key,
                "side": intent.side,
                "age_seconds": round(age, 1),
                "external_order_id": intent.external_order_id,
                "live_submitted": intent.live_submitted,
                "created_at": intent.created_at.isoformat() if intent.created_at else None,
                "updated_at": intent.updated_at.isoformat() if intent.updated_at else None,
            })

    max_age = max(ages) if ages else 0.0
    avg_age = (sum(ages) / len(ages)) if ages else 0.0

    return {
        "timestamp": now.isoformat(),
        "active_count": len(active_intents),
        "status_counts": status_counts,
        "sla_seconds": sla_seconds,
        "sla_ok": len(sla_breaches) == 0,
        "sla_breach_count": len(sla_breaches),
        "sla_breaches": sla_breaches,
        "max_age_seconds": round(max_age, 1),
        "avg_age_seconds": round(avg_age, 1),
    }


def main() -> None:
    from ..config import settings
    from ..db.session import SessionLocal

    with SessionLocal() as db:
        report = intent_backlog_report(db, sla_seconds=settings.polymarket_reconcile_sla_seconds)
    json.dump(report, sys.stdout, indent=2)
    sys.stdout.write("\n")
    sys.exit(0 if report["sla_ok"] else 1)


if __name__ == "__main__":
    main()
