from __future__ import annotations

from backend.execution.canary import RAMP_LADDER, validate_settings_against_profile


def test_ramp_ladder_has_four_profiles():
    assert len(RAMP_LADDER) == 4
    names = [p.name for p in RAMP_LADDER]
    assert names == ["canary", "ramp_2x", "ramp_5x", "ramp_10x"]


def test_ramp_ladder_caps_are_monotonically_increasing():
    for i in range(1, len(RAMP_LADDER)):
        prev = RAMP_LADDER[i - 1]
        curr = RAMP_LADDER[i]
        assert curr.max_capital_usd > prev.max_capital_usd, f"{curr.name} capital <= {prev.name}"
        assert curr.daily_loss_limit_usd > prev.daily_loss_limit_usd


def test_every_profile_has_promotion_and_rollback_criteria():
    for p in RAMP_LADDER:
        assert len(p.promotion_criteria) > 10, f"{p.name} missing promotion criteria"
        assert len(p.rollback_criteria) > 10, f"{p.name} missing rollback criteria"
        assert p.hold_days >= 7


def test_validate_within_profile():
    result = validate_settings_against_profile(
        "canary",
        max_capital_usd=400.0,
        max_position_usd=80.0,
        daily_loss_limit_usd=40.0,
    )
    assert result["ok"] is True
    assert result["violations"] == []


def test_validate_exceeds_profile():
    result = validate_settings_against_profile(
        "canary",
        max_capital_usd=1000.0,
        max_position_usd=80.0,
        daily_loss_limit_usd=40.0,
    )
    assert result["ok"] is False
    assert len(result["violations"]) == 1
    assert "max_capital_usd" in result["violations"][0]


def test_validate_unknown_profile():
    result = validate_settings_against_profile(
        "nonexistent",
        max_capital_usd=100.0,
        max_position_usd=50.0,
        daily_loss_limit_usd=10.0,
    )
    assert "errors" in result
