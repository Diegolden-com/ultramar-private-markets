from __future__ import annotations

from datetime import datetime

from .paper import PaperOrder, simulate_fill
from .trading_gateway import LimitOrderRequest, OrderPlacement


class PaperTradingGateway:
    venue = "polymarket"

    def place_limit_order(self, request: LimitOrderRequest) -> OrderPlacement:
        order = PaperOrder(
            venue=self.venue,
            market_key=request.market_key,
            side=request.side,
            price=request.price,
            size=request.size,
            created_at=datetime.utcnow(),
        )
        fill = simulate_fill(order)
        return OrderPlacement(
            venue=self.venue,
            market_key=request.market_key,
            side=request.side,
            price=request.price,
            size=request.size,
            status="filled",
            submitted_at=order.created_at.isoformat(),
            filled_at=fill.get("filled_at"),
            live_submitted=False,
            payload={"engine": "paper"},
        )

