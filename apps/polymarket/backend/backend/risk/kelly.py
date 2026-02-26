from __future__ import annotations


def fractional_kelly(edge: float, odds: float, fraction: float = 0.25) -> float:
    if odds <= 0:
        return 0.0
    kelly = edge / odds
    return max(0.0, kelly * fraction)
