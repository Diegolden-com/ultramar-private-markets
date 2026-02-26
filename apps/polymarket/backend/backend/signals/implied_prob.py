from __future__ import annotations


def implied_prob_mid(bids: list, asks: list) -> float | None:
    if not bids or not asks:
        return None
    best_bid = _price_from_level(bids[0])
    best_ask = _price_from_level(asks[0])
    if best_bid is None or best_ask is None:
        return None
    return float(best_bid + best_ask) / 2.0


def _price_from_level(level) -> float | None:
    if isinstance(level, dict):
        return float(level.get("price", 0)) if level.get("price") is not None else None
    if isinstance(level, (list, tuple)):
        return float(level[0]) if level else None
    if isinstance(level, (int, float)):
        return float(level)
    return None
