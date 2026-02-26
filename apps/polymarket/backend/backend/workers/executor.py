from __future__ import annotations

import logging

from ..config import settings
from ..db.session import SessionLocal
from ..execution.executor import execute_signals_once
from ..execution.factory import build_trading_gateway_from_settings

logger = logging.getLogger(__name__)


def run_once(limit: int = 50) -> None:
    gateway = build_trading_gateway_from_settings()
    with SessionLocal() as db:
        executed = execute_signals_once(db, limit=limit, trading_gateway=gateway)
    logger.info(
        "execution cycle complete",
        extra={
            "executed": executed,
            "execution_mode": settings.polymarket_execution_mode,
            "gateway": gateway.__class__.__name__,
        },
    )


if __name__ == "__main__":
    run_once()
