from __future__ import annotations


def hedge_notional(target_delta: float, spot: float) -> dict:
    if spot <= 0:
        raise ValueError("spot must be positive")
    size = -target_delta / spot
    return {
        "instrument": "PERP",
        "size": size,
        "side": "sell" if size > 0 else "buy",
    }
