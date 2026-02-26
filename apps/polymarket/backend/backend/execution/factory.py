from __future__ import annotations

from ..config import settings
from .paper_gateway import PaperTradingGateway
from .polymarket_sdk_gateway import (
    PolymarketSDKGatewayConfig,
    PolymarketSDKTradingGateway,
)
from .trading_gateway import TradingGateway

VALID_EXECUTION_MODES = {"paper", "live_shadow", "live"}


def build_trading_gateway(
    mode: str,
    host: str,
    chain_id: int,
    private_key: str | None,
    signature_type: int | None = None,
    funder: str | None = None,
    api_key: str | None = None,
    api_secret: str | None = None,
    api_passphrase: str | None = None,
) -> TradingGateway:
    normalized_mode = (mode or "paper").lower()
    if normalized_mode not in VALID_EXECUTION_MODES:
        valid_modes = sorted(VALID_EXECUTION_MODES)
        raise ValueError(
            f"invalid execution mode: {normalized_mode}. expected one of {valid_modes}"
        )

    if normalized_mode == "paper":
        return PaperTradingGateway()

    if not private_key:
        raise ValueError("POLYMARKET_PRIVATE_KEY is required for live_shadow/live execution modes")

    config = PolymarketSDKGatewayConfig(
        host=host,
        chain_id=chain_id,
        private_key=private_key,
        signature_type=signature_type,
        funder=funder,
        api_key=api_key,
        api_secret=api_secret,
        api_passphrase=api_passphrase,
        submit_live=normalized_mode == "live",
    )
    return PolymarketSDKTradingGateway(config=config)


def build_trading_gateway_from_settings() -> TradingGateway:
    return build_trading_gateway(
        mode=settings.polymarket_execution_mode,
        host=settings.polymarket_base_url,
        chain_id=settings.polymarket_chain_id,
        private_key=settings.polymarket_private_key,
        signature_type=settings.polymarket_signature_type,
        funder=settings.polymarket_funder,
        api_key=settings.polymarket_api_key,
        api_secret=settings.polymarket_api_secret,
        api_passphrase=settings.polymarket_api_passphrase,
    )
