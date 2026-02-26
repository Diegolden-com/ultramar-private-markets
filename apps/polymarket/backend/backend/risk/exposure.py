from __future__ import annotations


def net_exposure(positions: list[dict]) -> float:
    return sum(p.get("size", 0.0) * p.get("avg_price", 0.0) for p in positions)
