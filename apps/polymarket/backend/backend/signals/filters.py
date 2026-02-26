from __future__ import annotations


def has_min_depth(bids: list, asks: list, min_levels: int = 1) -> bool:
    return len(bids) >= min_levels and len(asks) >= min_levels
