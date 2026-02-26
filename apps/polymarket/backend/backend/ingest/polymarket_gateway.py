from __future__ import annotations

import logging
from typing import Any

from .polymarket_client import PolymarketClient

logger = logging.getLogger(__name__)


class PolymarketSDKUnavailableError(RuntimeError):
    """Raised when the official Polymarket Python SDK is not importable."""


def _to_serializable(value: Any) -> Any:
    if isinstance(value, (str, int, float, bool)) or value is None:
        return value
    if isinstance(value, dict):
        return {k: _to_serializable(v) for k, v in value.items()}
    if isinstance(value, (list, tuple)):
        return [_to_serializable(v) for v in value]

    model_dump = getattr(value, "model_dump", None)
    if callable(model_dump):
        return _to_serializable(model_dump())

    to_dict = getattr(value, "dict", None)
    if callable(to_dict):
        return _to_serializable(to_dict())

    attrs = getattr(value, "__dict__", None)
    if isinstance(attrs, dict):
        return {
            k: _to_serializable(v)
            for k, v in attrs.items()
            if not k.startswith("_")
        }

    return value


def _normalize_price_level(level: Any) -> dict[str, float] | list[Any] | Any:
    if isinstance(level, dict):
        price = level.get("price")
        size = level.get("size", level.get("amount"))
        normalized = dict(level)
        if price is not None:
            normalized["price"] = float(price)
        if size is not None:
            normalized["size"] = float(size)
        return normalized

    if isinstance(level, (list, tuple)):
        normalized = list(level)
        if normalized:
            normalized[0] = float(normalized[0])
        if len(normalized) > 1 and normalized[1] is not None:
            normalized[1] = float(normalized[1])
        return normalized

    return level


def _normalize_levels(levels: Any) -> list:
    if not isinstance(levels, list):
        return []
    return [_normalize_price_level(level) for level in levels]


def _extract_top(levels: list) -> tuple[float | None, float | None]:
    if not levels:
        return None, None

    level = levels[0]
    if isinstance(level, dict):
        price = level.get("price")
        size = level.get("size", level.get("amount"))
        price_value = float(price) if price is not None else None
        size_value = float(size) if size is not None else None
        return price_value, size_value

    if isinstance(level, (list, tuple)):
        price = level[0] if len(level) > 0 else None
        size = level[1] if len(level) > 1 else None
        price_value = float(price) if price is not None else None
        size_value = float(size) if size is not None else None
        return price_value, size_value

    return None, None


class PolymarketSDKMarketDataClient:
    def __init__(self, host: str) -> None:
        self.host = host.rstrip("/")
        self._client = None
        self._book_params_cls = None
        self._load_error: Exception | None = None
        self._loaded = False

    def _load(self) -> None:
        if self._loaded:
            return

        self._loaded = True
        try:
            from py_clob_client.client import ClobClient
            from py_clob_client.clob_types import BookParams
        except Exception as exc:  # pragma: no cover - depends on optional dependency
            self._load_error = exc
            return

        try:
            self._client = ClobClient(self.host)
            self._book_params_cls = BookParams
        except Exception as exc:  # pragma: no cover - runtime SDK init issues
            self._load_error = exc

    def get_orderbook_by_token(self, token_id: str) -> dict:
        self._load()
        if self._client is None:
            raise PolymarketSDKUnavailableError(
                f"Polymarket SDK unavailable: {self._load_error or 'unknown import error'}"
            )

        params = self._book_params_cls(token_id=token_id) if self._book_params_cls else token_id
        raw = self._client.get_order_book(params)
        payload = _to_serializable(raw)
        if not isinstance(payload, dict):
            payload = {"raw": payload}

        payload["token_id"] = payload.get("token_id") or payload.get("asset_id") or token_id
        payload["asset_id"] = payload.get("asset_id") or payload["token_id"]
        payload["market_id"] = payload.get("market_id") or payload.get("market")
        payload["bids"] = _normalize_levels(payload.get("bids", []))
        payload["asks"] = _normalize_levels(payload.get("asks", []))
        return payload


class PolymarketMarketDataGateway:
    VALID_MODES = {"legacy", "sdk", "auto"}

    def __init__(
        self,
        base_url: str,
        api_key: str | None = None,
        timeout: float = 10.0,
        mode: str = "auto",
        dual_run_compare: bool = False,
        fallback_to_legacy: bool = True,
        legacy_client: PolymarketClient | None = None,
        sdk_client: PolymarketSDKMarketDataClient | None = None,
    ) -> None:
        self.mode = (mode or "auto").lower()
        if self.mode not in self.VALID_MODES:
            raise ValueError(f"Invalid polymarket gateway mode: {self.mode}")

        self.dual_run_compare = dual_run_compare
        self.fallback_to_legacy = fallback_to_legacy
        self.legacy_client = legacy_client or PolymarketClient(
            base_url=base_url,
            api_key=api_key,
            timeout=timeout,
        )
        self.sdk_client = sdk_client or PolymarketSDKMarketDataClient(base_url)

    def get_markets(self) -> dict:
        # Market discovery still uses the existing HTTP path.
        return self.legacy_client.get_markets()

    def get_orderbook_by_token(self, token_id: str) -> dict:
        if self.mode == "legacy":
            return self.legacy_client.get_orderbook_by_token(token_id)

        sdk_raw = None
        sdk_error: Exception | None = None
        try:
            sdk_raw = self.sdk_client.get_orderbook_by_token(token_id)
        except Exception as exc:
            sdk_error = exc
            logger.warning(
                "polymarket sdk fetch failed",
                extra={"token_id": token_id, "error": str(exc)},
            )

        legacy_raw = None
        if self.dual_run_compare and sdk_raw is not None:
            try:
                legacy_raw = self.legacy_client.get_orderbook_by_token(token_id)
                self._log_parity(token_id, sdk_raw, legacy_raw)
            except Exception as exc:
                logger.warning(
                    "polymarket legacy parity fetch failed",
                    extra={"token_id": token_id, "error": str(exc)},
                )

        if sdk_raw is not None:
            return sdk_raw

        if self.mode == "sdk" and not self.fallback_to_legacy:
            raise RuntimeError(
                f"SDK mode failed and fallback is disabled for token_id={token_id}"
            ) from sdk_error

        if legacy_raw is not None:
            return legacy_raw

        return self.legacy_client.get_orderbook_by_token(token_id)

    def _log_parity(self, token_id: str, sdk_raw: dict, legacy_raw: dict) -> None:
        sdk_bids = sdk_raw.get("bids", [])
        sdk_asks = sdk_raw.get("asks", [])
        legacy_bids = legacy_raw.get("bids", [])
        legacy_asks = legacy_raw.get("asks", [])

        sdk_top_bid = _extract_top(sdk_bids)
        sdk_top_ask = _extract_top(sdk_asks)
        legacy_top_bid = _extract_top(legacy_bids)
        legacy_top_ask = _extract_top(legacy_asks)

        mismatches = []
        if len(sdk_bids) != len(legacy_bids):
            mismatches.append("bid_depth")
        if len(sdk_asks) != len(legacy_asks):
            mismatches.append("ask_depth")
        if sdk_top_bid != legacy_top_bid:
            mismatches.append("top_bid")
        if sdk_top_ask != legacy_top_ask:
            mismatches.append("top_ask")

        if mismatches:
            logger.warning(
                "polymarket orderbook parity mismatch",
                extra={
                    "token_id": token_id,
                    "mismatches": mismatches,
                    "sdk_top_bid": sdk_top_bid,
                    "legacy_top_bid": legacy_top_bid,
                    "sdk_top_ask": sdk_top_ask,
                    "legacy_top_ask": legacy_top_ask,
                },
            )
