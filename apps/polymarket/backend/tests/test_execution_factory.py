from __future__ import annotations

import pytest

from backend.execution.factory import build_trading_gateway
from backend.execution.paper_gateway import PaperTradingGateway
from backend.execution.polymarket_sdk_gateway import PolymarketSDKTradingGateway


def test_build_trading_gateway_paper_mode():
    gateway = build_trading_gateway(
        mode="paper",
        host="https://clob.polymarket.com",
        chain_id=137,
        private_key=None,
    )
    assert isinstance(gateway, PaperTradingGateway)


def test_build_trading_gateway_live_shadow_mode():
    gateway = build_trading_gateway(
        mode="live_shadow",
        host="https://clob.polymarket.com",
        chain_id=137,
        private_key="0xabc",
    )
    assert isinstance(gateway, PolymarketSDKTradingGateway)
    assert gateway.config.submit_live is False


def test_build_trading_gateway_live_mode():
    gateway = build_trading_gateway(
        mode="live",
        host="https://clob.polymarket.com",
        chain_id=137,
        private_key="0xabc",
    )
    assert isinstance(gateway, PolymarketSDKTradingGateway)
    assert gateway.config.submit_live is True


def test_build_trading_gateway_requires_private_key_for_non_paper():
    with pytest.raises(ValueError, match="POLYMARKET_PRIVATE_KEY"):
        build_trading_gateway(
            mode="live_shadow",
            host="https://clob.polymarket.com",
            chain_id=137,
            private_key=None,
        )


def test_build_trading_gateway_rejects_invalid_mode():
    with pytest.raises(ValueError, match="invalid execution mode"):
        build_trading_gateway(
            mode="invalid",
            host="https://clob.polymarket.com",
            chain_id=137,
            private_key=None,
        )

