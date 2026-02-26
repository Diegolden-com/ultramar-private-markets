from __future__ import annotations

from dataclasses import dataclass


def within_limit(value: float, limit: float) -> bool:
    return abs(value) <= limit


@dataclass(frozen=True)
class RiskCheck:
    allowed: bool
    reasons: tuple[str, ...]
    market_notional: float
    portfolio_notional: float
    daily_pnl: float


def check_risk_limits(
    proposed_notional: float,
    market_notional: float,
    portfolio_notional: float,
    daily_pnl: float,
    max_position_usd: float,
    max_portfolio_usd: float,
    daily_loss_limit_usd: float,
) -> RiskCheck:
    reasons: list[str] = []
    if market_notional + proposed_notional > max_position_usd:
        reasons.append("per_market_limit")
    if portfolio_notional + proposed_notional > max_portfolio_usd:
        reasons.append("portfolio_limit")
    if daily_pnl <= -daily_loss_limit_usd:
        reasons.append("daily_loss_limit")
    return RiskCheck(
        allowed=not reasons,
        reasons=tuple(reasons),
        market_notional=market_notional,
        portfolio_notional=portfolio_notional,
        daily_pnl=daily_pnl,
    )
