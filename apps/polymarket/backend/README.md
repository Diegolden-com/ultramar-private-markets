# Ultramar Polymarket Backend

MVP backend services for data ingestion, pricing, signals, and execution planning.

## Polymarket SDK Migration (Phase 1)

The backend now uses an SDK-first market data gateway with legacy HTTP fallback.

- `POLYMARKET_MARKET_DATA_MODE=auto` (default): try SDK first, fallback to legacy REST.
- `POLYMARKET_MARKET_DATA_MODE=sdk`: SDK only (or fallback if enabled).
- `POLYMARKET_MARKET_DATA_MODE=legacy`: existing REST client only.
- `POLYMARKET_DUAL_RUN_COMPARE=true` (default): fetch SDK + legacy and log parity mismatches.
- `POLYMARKET_SDK_FALLBACK_TO_LEGACY=true` (default): fallback when SDK errors.

Current WebSocket default is aligned to the CLOB market channel:

- `POLYMARKET_WS_URL=wss://ws-subscriptions-clob.polymarket.com/ws/market`

Note: the official Python SDK may need environment-specific installation depending on your
Python/pip setup. If unavailable, `auto` mode transparently uses the legacy client.
