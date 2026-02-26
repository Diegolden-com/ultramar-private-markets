from __future__ import annotations


def probability_spread(implied: float, theoretical: float) -> float:
    return theoretical - implied


def is_actionable(spread: float, threshold: float = 0.15) -> bool:
    return abs(spread) >= threshold
