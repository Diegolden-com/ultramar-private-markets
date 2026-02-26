from __future__ import annotations

import logging
import time

from .executor import run_once as run_execute_once
from .ingest import run_polymarket_mapped
from .signals import run_once as run_signals_once

logger = logging.getLogger(__name__)


def run_loop(interval_seconds: int = 60) -> None:
    while True:
        started = time.time()
        try:
            run_polymarket_mapped()
            run_signals_once()
            run_execute_once()
        except Exception:
            logger.exception("scheduler loop error")
        elapsed = time.time() - started
        sleep_for = max(0.0, interval_seconds - elapsed)
        time.sleep(sleep_for)


if __name__ == "__main__":
    run_loop()
