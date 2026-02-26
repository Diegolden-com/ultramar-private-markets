from __future__ import annotations

from datetime import datetime

from .black_scholes import d2
from .cdf import normal_cdf


def time_to_expiry(expiry: str | datetime) -> float:
    if isinstance(expiry, str):
        expiry_dt = datetime.fromisoformat(expiry.replace("Z", "+00:00"))
    else:
        expiry_dt = expiry
    now = datetime.utcnow().replace(tzinfo=expiry_dt.tzinfo)
    delta = expiry_dt - now
    return max(delta.total_seconds(), 0) / (365.0 * 24 * 3600)


def prob_above_strike(S: float, K: float, T: float, r: float, sigma: float) -> float:
    if T <= 0 or sigma <= 0:
        return 1.0 if S > K else 0.0
    return normal_cdf(d2(S, K, T, r, sigma))


def prob_below_strike(S: float, K: float, T: float, r: float, sigma: float) -> float:
    return 1.0 - prob_above_strike(S, K, T, r, sigma)


def prob_between_strikes(
    S: float, K_low: float, K_high: float, T: float, r: float, sigma: float
) -> float:
    if K_low >= K_high:
        return 0.0
    return max(
        0.0,
        prob_below_strike(S, K_high, T, r, sigma) - prob_below_strike(S, K_low, T, r, sigma),
    )
