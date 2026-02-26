from fastapi import FastAPI

from ..config import settings
from ..execution.startup_health import (
    get_last_startup_health_report,
    run_startup_health_checks,
)
from ..logging import configure_logging
from .routes import positions, signals

configure_logging()

app = FastAPI(title="Ultramar Polymarket MVP")

app.include_router(signals.router)
app.include_router(positions.router)


@app.on_event("startup")
async def on_startup() -> None:
    if not settings.polymarket_startup_healthcheck_enabled:
        return

    report = run_startup_health_checks()
    if not report["ok"] and settings.polymarket_startup_healthcheck_fail_fast:
        raise RuntimeError("startup health checks failed")


@app.get("/health")
async def health():
    report = get_last_startup_health_report()
    status = "ok" if report is None or report.get("ok", False) else "degraded"
    return {"status": status, "startup": report}
