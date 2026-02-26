from __future__ import annotations


def simple_pnl(trades: list[dict]) -> float:
    pnl = 0.0
    for t in trades:
        side = t.get("side")
        price = t.get("price", 0.0)
        size = t.get("size", 0.0)
        if side == "buy":
            pnl -= price * size
        elif side == "sell":
            pnl += price * size
    return pnl
