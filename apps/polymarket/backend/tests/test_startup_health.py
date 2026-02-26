from __future__ import annotations

import pytest

from backend.execution import startup_health


class StubGateway:
    def __init__(self, error: Exception | None = None):
        self.error = error
        self.calls: list[bool] = []

    def startup_healthcheck(self, verify_l2_access: bool = True):
        self.calls.append(verify_l2_access)
        if self.error:
            raise self.error
        return {"l2_ready": True, "api_key_count": 1}


@pytest.fixture()
def patch_database_check(monkeypatch):
    monkeypatch.setattr(
        startup_health,
        "_check_database",
        lambda: {"name": "database", "ok": True, "status": "ok"},
    )


def test_startup_health_skips_gateway_in_paper_mode(patch_database_check):
    report = startup_health.run_startup_health_checks(mode="paper")

    assert report["ok"] is True
    gateway_check = next(
        check for check in report["checks"] if check["name"] == "execution_gateway"
    )
    assert gateway_check["status"] == "skipped"


def test_startup_health_checks_gateway_in_live_shadow_mode(
    patch_database_check,
    monkeypatch,
):
    monkeypatch.setattr(
        startup_health.settings,
        "polymarket_startup_healthcheck_verify_l2_access",
        True,
    )
    gateway = StubGateway()

    report = startup_health.run_startup_health_checks(mode="live_shadow", gateway=gateway)

    assert report["ok"] is True
    assert gateway.calls == [True]
    gateway_check = next(
        check for check in report["checks"] if check["name"] == "execution_gateway"
    )
    assert gateway_check["status"] == "ok"


def test_startup_health_fails_when_gateway_bootstrap_fails(patch_database_check):
    gateway = StubGateway(error=RuntimeError("boom"))

    report = startup_health.run_startup_health_checks(mode="live", gateway=gateway)

    assert report["ok"] is False
    gateway_check = next(
        check for check in report["checks"] if check["name"] == "execution_gateway"
    )
    assert gateway_check["status"] == "error"
    assert "startup_healthcheck_failed" in gateway_check["error"]
