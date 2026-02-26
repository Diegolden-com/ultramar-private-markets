from __future__ import annotations

import logging

from ..db.session import SessionLocal
from ..execution.executor import execute_signals_once

logger = logging.getLogger(__name__)


def run_once(limit: int = 50) -> None:
    with SessionLocal() as db:
        executed = execute_signals_once(db, limit=limit)
    logger.info("execution cycle complete", extra={"executed": executed})


if __name__ == "__main__":
    run_once()
