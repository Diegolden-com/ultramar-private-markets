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
    monkeypatch.setattr(
        startup_health,
        "_check_migration_head",
        lambda: {"name": "migration_head", "ok": True, "status": "ok"},
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


# --- migration head check tests ---


def test_migration_head_ok(monkeypatch, db_session):
    from sqlalchemy import text

    db_session.execute(
        text("CREATE TABLE IF NOT EXISTS alembic_version (version_num VARCHAR(32) NOT NULL)")
    )
    db_session.execute(text("DELETE FROM alembic_version"))
    db_session.execute(
        text("INSERT INTO alembic_version (version_num) VALUES (:v)"),
        {"v": startup_health.EXPECTED_ALEMBIC_HEAD},
    )
    db_session.commit()

    monkeypatch.setattr(startup_health, "SessionLocal", lambda: db_session)
    result = startup_health._check_migration_head()
    assert result["ok"] is True
    assert result["status"] == "ok"


def test_migration_head_drift(monkeypatch, db_session):
    from sqlalchemy import text

    db_session.execute(
        text("CREATE TABLE IF NOT EXISTS alembic_version (version_num VARCHAR(32) NOT NULL)")
    )
    db_session.execute(text("DELETE FROM alembic_version"))
    db_session.execute(
        text("INSERT INTO alembic_version (version_num) VALUES (:v)"),
        {"v": "0001_initial"},
    )
    db_session.commit()

    monkeypatch.setattr(startup_health, "SessionLocal", lambda: db_session)
    result = startup_health._check_migration_head()
    assert result["ok"] is False
    assert "migration drift" in result["error"]


def test_migration_head_no_table(monkeypatch, db_session):
    monkeypatch.setattr(startup_health, "SessionLocal", lambda: db_session)
    result = startup_health._check_migration_head()
    assert result["ok"] is False


def test_startup_health_fails_when_canary_profile_violated(patch_database_check, monkeypatch):
    monkeypatch.setattr(startup_health.settings, "polymarket_canary_profile", "canary")
    monkeypatch.setattr(startup_health.settings, "max_capital_usd", 1000.0)
    monkeypatch.setattr(startup_health.settings, "max_position_usd", 200.0)
    monkeypatch.setattr(startup_health.settings, "max_portfolio_usd", 1000.0)
    monkeypatch.setattr(startup_health.settings, "daily_loss_limit_usd", 100.0)
    monkeypatch.setattr(startup_health.settings, "min_trade_usd", 10.0)
    gateway = StubGateway()

    report = startup_health.run_startup_health_checks(mode="live", gateway=gateway)

    assert report["ok"] is False
    canary_check = next(check for check in report["checks"] if check["name"] == "canary_profile")
    assert canary_check["status"] == "error"
