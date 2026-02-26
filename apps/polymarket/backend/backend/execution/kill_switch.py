"""Kill-switch guardrails for the execution pipeline.

Standalone check:
    python -m backend.execution.kill_switch

The executor worker calls `check_kill_switch` before each cycle. If any
condition fires, execution is halted and the reason is logged.
"""
from __future__ import annotations

import json
import logging
import sys
from datetime import datetime
from typing import Any

from sqlalchemy import func
from sqlalchemy.orm import Session

from ..db.models import OrderIntent
from .reconciliation import ACTIVE_STATUSES

logger = logging.getLogger(__name__)


def check_kill_switch(
    db: Session,
    *,
    max_backlog: int = 50,
    max_age_seconds: float = 600.0,
    daily_loss_limit_usd: float | None = None,
    daily_pnl: float | None = None,
    now: datetime | None = None,
) -> dict[str, Any]:
    """Evaluate kill-switch conditions. Returns a dict with `triggered` bool."""
    now = now or datetime.utcnow()
    triggers: list[str] = []

    # 1. Reconciliation backlog count
    active_count = (
        db.query(func.count(OrderIntent.id))
        .filter(OrderIntent.status.in_(ACTIVE_STATUSES))
        .scalar()
    ) or 0

    if active_count > max_backlog:
        triggers.append(f"backlog_count:{active_count}>{max_backlog}")

    # 2. Oldest unresolved intent age
    oldest_updated = (
        db.query(func.min(OrderIntent.updated_at))
        .filter(OrderIntent.status.in_(ACTIVE_STATUSES))
        .scalar()
    )
    oldest_age = (now - oldest_updated).total_seconds() if oldest_updated else 0.0
    if oldest_age > max_age_seconds:
        triggers.append(f"backlog_age:{oldest_age:.0f}s>{max_age_seconds:.0f}s")

    # 3. Daily loss limit (if provided)
    if daily_loss_limit_usd is not None and daily_pnl is not None:
        if daily_pnl <= -daily_loss_limit_usd:
            triggers.append(f"daily_loss:{daily_pnl:.2f}<=-{daily_loss_limit_usd:.2f}")

    result = {
        "timestamp": now.isoformat(),
        "triggered": len(triggers) > 0,
        "triggers": triggers,
        "active_backlog": active_count,
        "oldest_age_seconds": round(oldest_age, 1),
    }
    if triggers:
        logger.critical("KILL SWITCH TRIGGERED", extra=result)
    return result


def main() -> None:
    from ..config import settings
    from ..db.session import SessionLocal

    with SessionLocal() as db:
        result = check_kill_switch(
            db,
            max_backlog=settings.polymarket_kill_switch_max_backlog,
            max_age_seconds=settings.polymarket_kill_switch_max_age_seconds,
        )
    json.dump(result, sys.stdout, indent=2)
    sys.stdout.write("\n")
    sys.exit(1 if result["triggered"] else 0)


if __name__ == "__main__":
    main()
