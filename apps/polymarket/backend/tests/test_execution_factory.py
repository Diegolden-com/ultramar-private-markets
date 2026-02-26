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
        private_key="0x" + "ab" * 32,
        api_key="ak_test",
        api_secret="as_test",
        api_passphrase="ap_test",
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


# --- live preflight guard tests ---


def test_live_preflight_rejects_blocked_key():
    with pytest.raises(ValueError, match="blocked test/example"):
        build_trading_gateway(
            mode="live",
            host="https://clob.polymarket.com",
            chain_id=137,
            private_key="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
            api_key="ak",
            api_secret="as",
            api_passphrase="ap",
        )


def test_live_preflight_rejects_short_key():
    with pytest.raises(ValueError, match="too short"):
        build_trading_gateway(
            mode="live",
            host="https://clob.polymarket.com",
            chain_id=137,
            private_key="0xabc",
            api_key="ak",
            api_secret="as",
            api_passphrase="ap",
        )


def test_live_preflight_rejects_missing_l2_creds():
    with pytest.raises(ValueError, match="live mode requires"):
        build_trading_gateway(
            mode="live",
            host="https://clob.polymarket.com",
            chain_id=137,
            private_key="0x" + "ab" * 32,
            api_key=None,
            api_secret=None,
            api_passphrase=None,
        )


def test_live_shadow_does_not_run_live_preflight():
    """live_shadow skips the strict live preflight — short key is allowed."""
    gateway = build_trading_gateway(
        mode="live_shadow",
        host="https://clob.polymarket.com",
        chain_id=137,
        private_key="0xabc",
    )
    assert isinstance(gateway, PolymarketSDKTradingGateway)
    assert gateway.config.submit_live is False

