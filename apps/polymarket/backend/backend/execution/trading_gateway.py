from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Protocol


@dataclass(frozen=True)
class LimitOrderRequest:
    market_key: str
    side: str
    price: float
    size: float
    token_id: str | None = None
    market_id: str | None = None
    client_order_id: str | None = None
    post_only: bool = False
    time_in_force: str = "GTC"
    meta: dict[str, Any] = field(default_factory=dict)


@dataclass(frozen=True)
class OrderPlacement:
    venue: str
    market_key: str
    side: str
    price: float
    size: float
    status: str
    submitted_at: str
    filled_at: str | None = None
    order_id: str | None = None
    live_submitted: bool = False
    payload: dict[str, Any] | None = None
    error: str | None = None


class TradingGateway(Protocol):
    venue: str

    def place_limit_order(self, request: LimitOrderRequest) -> OrderPlacement:
        ...

