from __future__ import annotations

from datetime import datetime

from backend.execution.paper_gateway import PaperTradingGateway
from backend.execution.polymarket_sdk_gateway import (
    PolymarketSDKGatewayConfig,
    PolymarketSDKTradingGateway,
)
from backend.execution.trading_gateway import LimitOrderRequest


class StubSDKClient:
    def __init__(
        self,
        create_result=None,
        post_result=None,
        raise_on_create=None,
        raise_on_post=None,
    ):
        self.create_result = create_result if create_result is not None else {"salt": "abc"}
        self.post_result = post_result if post_result is not None else {"orderID": "ord_1"}
        self.raise_on_create = raise_on_create
        self.raise_on_post = raise_on_post
        self.created: list[dict] = []
        self.posted: list[dict] = []

    def create_limit_order(self, token_id: str, side: str, price: float, size: float):
        self.created.append(
            {"token_id": token_id, "side": side, "price": price, "size": size}
        )
        if self.raise_on_create:
            raise self.raise_on_create
        return self.create_result

    def post_order(self, signed_order, time_in_force: str = "GTC", post_only: bool = False):
        self.posted.append(
            {
                "signed_order": signed_order,
                "time_in_force": time_in_force,
                "post_only": post_only,
            }
        )
        if self.raise_on_post:
            raise self.raise_on_post
        return self.post_result


def _request(**kwargs) -> LimitOrderRequest:
    return LimitOrderRequest(
        market_key=kwargs.get("market_key", "token-1"),
        token_id=kwargs.get("token_id", "token-1"),
        side=kwargs.get("side", "buy"),
        price=kwargs.get("price", 0.52),
        size=kwargs.get("size", 25.0),
    )


def _config(submit_live: bool = False) -> PolymarketSDKGatewayConfig:
    return PolymarketSDKGatewayConfig(
        host="https://clob.polymarket.com",
        chain_id=137,
        private_key="0xabc",
        submit_live=submit_live,
    )


def test_paper_gateway_fills_order():
    gateway = PaperTradingGateway()
    placement = gateway.place_limit_order(_request())

    assert placement.status == "filled"
    assert placement.live_submitted is False
    assert placement.filled_at is not None
    datetime.fromisoformat(placement.submitted_at)


def test_sdk_gateway_prepares_without_submitting_live():
    stub = StubSDKClient(create_result={"signed": True})
    gateway = PolymarketSDKTradingGateway(config=_config(submit_live=False), sdk_client=stub)

    placement = gateway.place_limit_order(_request(token_id="abc"))

    assert placement.status == "prepared"
    assert placement.live_submitted is False
    assert len(stub.created) == 1
    assert len(stub.posted) == 0


def test_sdk_gateway_submits_when_live_enabled():
    stub = StubSDKClient(
        create_result={"signed": True},
        post_result={"orderID": "ord_123"},
    )
    gateway = PolymarketSDKTradingGateway(config=_config(submit_live=True), sdk_client=stub)

    placement = gateway.place_limit_order(_request(token_id="abc"))

    assert placement.status == "pending"
    assert placement.live_submitted is True
    assert placement.order_id == "ord_123"
    assert len(stub.created) == 1
    assert len(stub.posted) == 1


def test_sdk_gateway_rejects_missing_token_id():
    stub = StubSDKClient()
    gateway = PolymarketSDKTradingGateway(config=_config(submit_live=False), sdk_client=stub)

    placement = gateway.place_limit_order(_request(token_id=None))

    assert placement.status == "rejected"
    assert placement.error == "token_id_required"
    assert len(stub.created) == 0
