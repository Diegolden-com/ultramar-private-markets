from __future__ import annotations


def build_limit_order(market_id: str, side: str, price: float, size: float) -> dict:
    return {
        "market_id": market_id,
        "side": side,
        "price": price,
        "size": size,
        "type": "limit",
    }
