from __future__ import annotations

from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    env: str = "dev"
    log_level: str = "INFO"
    database_url: str = "sqlite:///./ultramar.db"
    polymarket_base_url: str = "https://clob.polymarket.com"
    polymarket_execution_mode: str = "paper"
    polymarket_chain_id: int = 137
    polymarket_private_key: Optional[str] = None
    polymarket_signature_type: Optional[int] = None
    polymarket_funder: Optional[str] = None
    polymarket_api_key: Optional[str] = None
    polymarket_api_secret: Optional[str] = None
    polymarket_api_passphrase: Optional[str] = None
    polymarket_startup_healthcheck_enabled: bool = True
    polymarket_startup_healthcheck_fail_fast: bool = False
    polymarket_startup_healthcheck_verify_l2_access: bool = True
    polymarket_reconcile_enabled: bool = True
    polymarket_reconcile_max_intents: int = 200
    polymarket_reconcile_user_stream_enabled: bool = True
    polymarket_reconcile_stream_timeout_seconds: float = 5.0
    polymarket_reconcile_rest_fallback_enabled: bool = True
    polymarket_reconcile_shadow_finalize_seconds: float = 30.0
    polymarket_user_ws_url: str = "wss://ws-subscriptions-clob.polymarket.com/ws/user"
    polymarket_timeout_seconds: float = 10.0
    polymarket_market_data_mode: str = "auto"
    polymarket_dual_run_compare: bool = True
    polymarket_sdk_fallback_to_legacy: bool = True
    polymarket_ws_url: str = "wss://ws-subscriptions-clob.polymarket.com/ws/market"
    gamma_base_url: str = "https://gamma-api.polymarket.com"
    deribit_base_url: str = "https://www.deribit.com/api/v2"
    deribit_ws_url: str = "wss://www.deribit.com/ws/api/v2"
    raw_store_root: str = "./data/raw"
    max_capital_usd: float = 100000.0
    max_position_usd: float = 10000.0
    max_portfolio_usd: float = 100000.0
    daily_loss_limit_usd: float = 15000.0
    min_trade_usd: float = 10.0
    kelly_fraction: float = 0.25
    delta_band_fraction: float = 0.20
    min_hedge_notional_usd: float = 10.0


settings = Settings()
