"""Canary and ramp-ladder configuration profiles.

Provides pre-defined, auditable config profiles for each stage of the
capital ramp. Profiles are version-controlled and should only be changed
via PR with owner approval.

Standalone check:
    python -m backend.execution.canary
"""
from __future__ import annotations

import json
import sys
from dataclasses import asdict, dataclass
from typing import Any


@dataclass(frozen=True)
class CanaryProfile:
    name: str
    max_capital_usd: float
    max_position_usd: float
    max_portfolio_usd: float
    daily_loss_limit_usd: float
    min_trade_usd: float
    hold_days: int
    promotion_criteria: str
    rollback_criteria: str


RAMP_LADDER: list[CanaryProfile] = [
    CanaryProfile(
        name="canary",
        max_capital_usd=500.0,
        max_position_usd=100.0,
        max_portfolio_usd=500.0,
        daily_loss_limit_usd=50.0,
        min_trade_usd=5.0,
        hold_days=7,
        promotion_criteria=(
            "Zero SLA breaches; zero unresolved intents > 5 min; "
            "daily PnL within -50 to +inf; no SEV-1/SEV-2 incidents"
        ),
        rollback_criteria=(
            "Any SLA breach; any unresolved intent > 10 min; "
            "daily loss > 50 USD; any SEV-1 incident"
        ),
    ),
    CanaryProfile(
        name="ramp_2x",
        max_capital_usd=1000.0,
        max_position_usd=200.0,
        max_portfolio_usd=1000.0,
        daily_loss_limit_usd=100.0,
        min_trade_usd=10.0,
        hold_days=7,
        promotion_criteria=(
            "Stable PnL (no single-day loss > 2% of capital); "
            "reconciliation backlog avg < 2 min; no incidents"
        ),
        rollback_criteria=(
            "Single-day loss > 3% of capital; "
            "reconciliation backlog > SLA; any SEV-1 incident"
        ),
    ),
    CanaryProfile(
        name="ramp_5x",
        max_capital_usd=2500.0,
        max_position_usd=500.0,
        max_portfolio_usd=2500.0,
        daily_loss_limit_usd=250.0,
        min_trade_usd=10.0,
        hold_days=7,
        promotion_criteria=(
            "Cumulative PnL positive; max drawdown < 5% of capital; "
            "no incidents; all reconciliation within SLA"
        ),
        rollback_criteria=(
            "Drawdown > 7% of capital; any SEV-1/SEV-2 incident; "
            "reconciliation backlog age > 10 min"
        ),
    ),
    CanaryProfile(
        name="ramp_10x",
        max_capital_usd=5000.0,
        max_position_usd=1000.0,
        max_portfolio_usd=5000.0,
        daily_loss_limit_usd=500.0,
        min_trade_usd=10.0,
        hold_days=14,
        promotion_criteria=(
            "Risk owner sign-off; 14-day hold with no incidents; "
            "Sharpe > 0 over hold period; all systems nominal"
        ),
        rollback_criteria=(
            "Any SEV-1 incident; drawdown > 10% of capital; "
            "risk owner revokes approval"
        ),
    ),
]


def validate_settings_against_profile(
    profile_name: str,
    *,
    max_capital_usd: float,
    max_position_usd: float,
    daily_loss_limit_usd: float,
    max_portfolio_usd: float | None = None,
    min_trade_usd: float | None = None,
) -> dict[str, Any]:
    """Check that runtime settings do not exceed the named profile caps."""
    profile = next((p for p in RAMP_LADDER if p.name == profile_name), None)
    if profile is None:
        return {"errors": [f"unknown profile: {profile_name}"]}

    violations: list[str] = []
    if max_capital_usd > profile.max_capital_usd:
        violations.append(
            f"max_capital_usd {max_capital_usd} exceeds profile cap {profile.max_capital_usd}"
        )
    if max_position_usd > profile.max_position_usd:
        violations.append(
            f"max_position_usd {max_position_usd} exceeds profile cap {profile.max_position_usd}"
        )
    if daily_loss_limit_usd > profile.daily_loss_limit_usd:
        violations.append(
            f"daily_loss_limit_usd {daily_loss_limit_usd} exceeds profile cap "
            f"{profile.daily_loss_limit_usd}"
        )
    if max_portfolio_usd is not None and max_portfolio_usd > profile.max_portfolio_usd:
        violations.append(
            f"max_portfolio_usd {max_portfolio_usd} exceeds profile cap {profile.max_portfolio_usd}"
        )
    if min_trade_usd is not None and min_trade_usd < profile.min_trade_usd:
        violations.append(
            f"min_trade_usd {min_trade_usd} is below profile floor {profile.min_trade_usd}"
        )
    return {"profile": profile_name, "ok": len(violations) == 0, "violations": violations}


def assert_profile_limits(
    profile_name: str | None,
    *,
    max_capital_usd: float,
    max_position_usd: float,
    max_portfolio_usd: float,
    daily_loss_limit_usd: float,
    min_trade_usd: float,
) -> None:
    if not profile_name:
        return
    result = validate_settings_against_profile(
        profile_name,
        max_capital_usd=max_capital_usd,
        max_position_usd=max_position_usd,
        max_portfolio_usd=max_portfolio_usd,
        daily_loss_limit_usd=daily_loss_limit_usd,
        min_trade_usd=min_trade_usd,
    )
    if result.get("errors"):
        raise ValueError("; ".join(result["errors"]))
    if not result.get("ok", False):
        violations = ", ".join(result.get("violations", []))
        raise ValueError(f"runtime settings violate canary profile '{profile_name}': {violations}")


def assert_settings_profile_limits() -> None:
    from ..config import settings

    assert_profile_limits(
        settings.polymarket_canary_profile,
        max_capital_usd=settings.max_capital_usd,
        max_position_usd=settings.max_position_usd,
        max_portfolio_usd=settings.max_portfolio_usd,
        daily_loss_limit_usd=settings.daily_loss_limit_usd,
        min_trade_usd=settings.min_trade_usd,
    )


def main() -> None:
    output = {
        "ramp_ladder": [asdict(p) for p in RAMP_LADDER],
        "profile_count": len(RAMP_LADDER),
    }
    json.dump(output, sys.stdout, indent=2)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
