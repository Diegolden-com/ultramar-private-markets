from __future__ import annotations

import logging

from ..execution.deribit_hedge import hedge_notional

logger = logging.getLogger(__name__)


def plan_hedge(target_delta: float, spot: float) -> dict:
    return hedge_notional(target_delta, spot)


if __name__ == "__main__":
    plan = plan_hedge(target_delta=1000, spot=100000)
    logger.info("hedge plan", extra=plan)
