from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime


@dataclass
class PaperOrder:
    venue: str
    market_key: str
    side: str
    price: float
    size: float
    created_at: datetime


def simulate_fill(order: PaperOrder) -> dict:
    return {
        "venue": order.venue,
        "market_key": order.market_key,
        "side": order.side,
        "price": order.price,
        "size": order.size,
        "filled_at": datetime.utcnow().isoformat(),
    }
