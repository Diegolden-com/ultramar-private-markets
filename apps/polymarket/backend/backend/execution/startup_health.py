from __future__ import annotations

import logging
from datetime import datetime
from typing import Any

from sqlalchemy import text

from ..config import settings
from ..db.session import SessionLocal
from .factory import build_trading_gateway_from_settings
from .trading_gateway import TradingGateway

logger = logging.getLogger(__name__)

EXPECTED_ALEMBIC_HEAD = "0002_order_intents"

_LAST_STARTUP_HEALTH_REPORT: dict[str, Any] | None = None


def _check_database() -> dict[str, Any]:
    try:
        with SessionLocal() as db:
            db.execute(text("SELECT 1"))
        return {"name": "database", "ok": True, "status": "ok"}
    except Exception as exc:
        return {"name": "database", "ok": False, "status": "error", "error": str(exc)}


def _check_migration_head() -> dict[str, Any]:
    try:
        with SessionLocal() as db:
            result = db.execute(text("SELECT version_num FROM alembic_version"))
            row = result.fetchone()
            if row is None:
                return {
                    "name": "migration_head",
                    "ok": False,
                    "status": "error",
                    "error": "no alembic version found — migrations have not been applied",
                }
            current = row[0]
            if current != EXPECTED_ALEMBIC_HEAD:
                return {
                    "name": "migration_head",
                    "ok": False,
                    "status": "error",
                    "error": f"migration drift: db at {current}, expected {EXPECTED_ALEMBIC_HEAD}",
                }
            return {
                "name": "migration_head",
                "ok": True,
                "status": "ok",
                "detail": f"db at expected head {current}",
            }
    except Exception as exc:
        detail = str(exc)
        if "alembic_version" in detail.lower() or "no such table" in detail.lower():
            return {
                "name": "migration_head",
                "ok": False,
                "status": "error",
                "error": "alembic_version table missing — run 'alembic upgrade head'",
            }
        return {"name": "migration_head", "ok": False, "status": "error", "error": detail}


def _check_execution_gateway(
    mode: str,
    gateway: TradingGateway | None = None,
) -> dict[str, Any]:
    if mode == "paper":
        return {
            "name": "execution_gateway",
            "ok": True,
            "status": "skipped",
            "detail": "paper mode does not require polymarket l2 bootstrap",
        }

    if gateway is None:
        try:
            gateway = build_trading_gateway_from_settings()
        except Exception as exc:
            return {
                "name": "execution_gateway",
                "ok": False,
                "status": "error",
                "error": f"gateway_build_failed:{exc}",
            }

    startup_healthcheck = getattr(gateway, "startup_healthcheck", None)
    if not callable(startup_healthcheck):
        return {
            "name": "execution_gateway",
            "ok": False,
            "status": "error",
            "error": "gateway_missing_startup_healthcheck",
        }

    try:
        result = startup_healthcheck(
            verify_l2_access=settings.polymarket_startup_healthcheck_verify_l2_access
        )
    except Exception as exc:
        return {
            "name": "execution_gateway",
            "ok": False,
            "status": "error",
            "error": f"startup_healthcheck_failed:{exc}",
        }

    return {
        "name": "execution_gateway",
        "ok": True,
        "status": "ok",
        "detail": "polymarket sdk l2 bootstrap verified",
        "data": result,
    }


def run_startup_health_checks(
    mode: str | None = None,
    gateway: TradingGateway | None = None,
) -> dict[str, Any]:
    selected_mode = (mode or settings.polymarket_execution_mode or "paper").lower()
    checks = [
        _check_database(),
        _check_migration_head(),
        _check_execution_gateway(selected_mode, gateway=gateway),
    ]
    report = {
        "checked_at": datetime.utcnow().isoformat(),
        "execution_mode": selected_mode,
        "ok": all(check["ok"] for check in checks),
        "checks": checks,
    }

    global _LAST_STARTUP_HEALTH_REPORT
    _LAST_STARTUP_HEALTH_REPORT = report
    return report


def get_last_startup_health_report() -> dict[str, Any] | None:
    return _LAST_STARTUP_HEALTH_REPORT

