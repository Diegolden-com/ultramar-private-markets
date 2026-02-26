from __future__ import annotations

import logging

from backend.ingest.polymarket_gateway import PolymarketMarketDataGateway


class StubLegacyClient:
    def __init__(self, orderbook: dict) -> None:
        self._orderbook = orderbook
        self.calls: list[str] = []

    def get_orderbook_by_token(self, token_id: str) -> dict:
        self.calls.append(token_id)
        return self._orderbook

    def get_markets(self) -> list[dict]:
        return [{"token_id": "legacy-market"}]


class StubSDKClient:
    def __init__(self, orderbook: dict | None = None, error: Exception | None = None) -> None:
        self._orderbook = orderbook or {}
        self._error = error
        self.calls: list[str] = []

    def get_orderbook_by_token(self, token_id: str) -> dict:
        self.calls.append(token_id)
        if self._error:
            raise self._error
        return self._orderbook


def test_legacy_mode_uses_legacy_client():
    legacy = StubLegacyClient(orderbook={"token_id": "123", "bids": [], "asks": []})
    sdk = StubSDKClient(orderbook={"token_id": "123", "bids": [{"price": 0.5}], "asks": []})
    gateway = PolymarketMarketDataGateway(
        base_url="https://clob.polymarket.com",
        mode="legacy",
        legacy_client=legacy,
        sdk_client=sdk,
    )

    raw = gateway.get_orderbook_by_token("123")
    assert raw["token_id"] == "123"
    assert legacy.calls == ["123"]
    assert sdk.calls == []


def test_auto_mode_falls_back_to_legacy_on_sdk_error():
    legacy = StubLegacyClient(
        orderbook={"token_id": "123", "bids": [{"price": 0.41}], "asks": [{"price": 0.62}]}
    )
    sdk = StubSDKClient(error=RuntimeError("sdk unavailable"))
    gateway = PolymarketMarketDataGateway(
        base_url="https://clob.polymarket.com",
        mode="auto",
        legacy_client=legacy,
        sdk_client=sdk,
    )

    raw = gateway.get_orderbook_by_token("123")
    assert raw["token_id"] == "123"
    assert sdk.calls == ["123"]
    assert legacy.calls == ["123"]


def test_dual_run_logs_parity_mismatch(caplog):
    legacy = StubLegacyClient(
        orderbook={"token_id": "123", "bids": [{"price": 0.41}], "asks": [{"price": 0.62}]}
    )
    sdk = StubSDKClient(
        orderbook={"token_id": "123", "bids": [{"price": 0.50}], "asks": [{"price": 0.51}]}
    )
    gateway = PolymarketMarketDataGateway(
        base_url="https://clob.polymarket.com",
        mode="sdk",
        dual_run_compare=True,
        legacy_client=legacy,
        sdk_client=sdk,
    )

    caplog.set_level(logging.WARNING)
    raw = gateway.get_orderbook_by_token("123")
    assert raw["token_id"] == "123"
    assert sdk.calls == ["123"]
    assert legacy.calls == ["123"]
    assert "polymarket orderbook parity mismatch" in caplog.text
