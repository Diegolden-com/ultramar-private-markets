from __future__ import annotations

import logging

from ..config import settings
from ..db.session import SessionLocal
from ..execution.canary import assert_settings_profile_limits
from ..execution.executor import execute_signals_once
from ..execution.factory import build_trading_gateway_from_settings
from ..execution.kill_switch import check_kill_switch
from ..execution.startup_health import run_startup_health_checks

logger = logging.getLogger(__name__)
_STARTUP_HEALTH_OK = False


def run_once(limit: int = 50) -> None:
    global _STARTUP_HEALTH_OK
    if settings.polymarket_execution_mode != "paper":
        assert_settings_profile_limits()

    gateway = build_trading_gateway_from_settings()

    if settings.polymarket_startup_healthcheck_enabled and not _STARTUP_HEALTH_OK:
        report = run_startup_health_checks(
            mode=settings.polymarket_execution_mode,
            gateway=gateway,
        )
        if report["ok"]:
            _STARTUP_HEALTH_OK = True
        elif settings.polymarket_startup_healthcheck_fail_fast:
            raise RuntimeError("execution startup health checks failed")
        else:
            logger.warning("execution startup health checks failed", extra={"report": report})

    # Kill-switch check: halt execution if backlog is unhealthy.
    if settings.polymarket_execution_mode != "paper":
        with SessionLocal() as db:
            ks = check_kill_switch(
                db,
                max_backlog=settings.polymarket_kill_switch_max_backlog,
                max_age_seconds=settings.polymarket_kill_switch_max_age_seconds,
                daily_loss_limit_usd=settings.daily_loss_limit_usd,
            )
        if ks["triggered"]:
            logger.critical(
                "executor halted by kill-switch — skipping execution cycle",
                extra={"kill_switch": ks},
            )
            return

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
