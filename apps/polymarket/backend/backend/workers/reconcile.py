from __future__ import annotations

import logging

from ..config import settings
from ..db.session import SessionLocal
from ..execution.factory import build_trading_gateway_from_settings
from ..execution.reconciliation import reconcile_from_settings

logger = logging.getLogger(__name__)


def run_once() -> None:
    if not settings.polymarket_reconcile_enabled:
        return

    gateway = build_trading_gateway_from_settings()
    with SessionLocal() as db:
        result = reconcile_from_settings(db=db, gateway=gateway)
    logger.info(
        "reconciliation cycle complete",
        extra={
            "execution_mode": settings.polymarket_execution_mode,
            "processed": result["processed"],
            "updated": result["updated"],
            "events_applied": result["events_applied"],
        },
    )


if __name__ == "__main__":
    run_once()

