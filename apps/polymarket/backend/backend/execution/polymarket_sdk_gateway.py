from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Any

from .trading_gateway import LimitOrderRequest, OrderPlacement


class PolymarketSDKUnavailableError(RuntimeError):
    """Raised when SDK client dependencies cannot be loaded."""


@dataclass(frozen=True)
class PolymarketSDKGatewayConfig:
    host: str
    chain_id: int
    private_key: str
    signature_type: int | None = None
    funder: str | None = None
    api_key: str | None = None
    api_secret: str | None = None
    api_passphrase: str | None = None
    submit_live: bool = False


def _to_serializable(value: Any) -> Any:
    if isinstance(value, (str, int, float, bool)) or value is None:
        return value

    if isinstance(value, dict):
        return {k: _to_serializable(v) for k, v in value.items()}

    if isinstance(value, (list, tuple)):
        return [_to_serializable(v) for v in value]

    attrs = getattr(value, "__dict__", None)
    if isinstance(attrs, dict):
        return {
            k: _to_serializable(v)
            for k, v in attrs.items()
            if not k.startswith("_")
        }

    return value


def _extract_order_id(payload: Any) -> str | None:
    if not isinstance(payload, dict):
        return None

    for key in ("orderID", "orderId", "order_id", "id"):
        value = payload.get(key)
        if value:
            return str(value)

    order = payload.get("order")
    if isinstance(order, dict):
        for key in ("orderID", "orderId", "order_id", "id"):
            value = order.get(key)
            if value:
                return str(value)

    return None


class _PolymarketSDKClient:
    def __init__(self, config: PolymarketSDKGatewayConfig) -> None:
        self.config = config
        self._client = None
        self._order_args_cls = None
        self._order_type_enum = None
        self._api_creds_cls = None
        self._load_error: Exception | None = None
        self._loaded = False
        self._has_l2_creds = False

    def _load(self) -> None:
        if self._loaded:
            return
        self._loaded = True

        try:
            from py_clob_client.client import ClobClient
            from py_clob_client.clob_types import ApiCreds, OrderArgs, OrderType
        except Exception as exc:  # pragma: no cover - optional dependency at runtime
            self._load_error = exc
            return

        kwargs = {
            "host": self.config.host,
            "chain_id": self.config.chain_id,
            "key": self.config.private_key,
        }
        if self.config.signature_type is not None:
            kwargs["signature_type"] = self.config.signature_type
        if self.config.funder:
            kwargs["funder"] = self.config.funder

        try:
            self._client = ClobClient(**kwargs)
            self._order_args_cls = OrderArgs
            self._order_type_enum = OrderType
            self._api_creds_cls = ApiCreds
        except Exception as exc:  # pragma: no cover - runtime SDK init issues
            self._load_error = exc
            return

        if self.config.api_key and self.config.api_secret and self.config.api_passphrase:
            creds = ApiCreds(
                api_key=self.config.api_key,
                api_secret=self.config.api_secret,
                api_passphrase=self.config.api_passphrase,
            )
            self._client.set_api_creds(creds)
            self._has_l2_creds = True

    def _require_client(self):
        self._load()
        if self._client is None or self._order_args_cls is None:
            raise PolymarketSDKUnavailableError(
                f"Polymarket SDK unavailable: {self._load_error or 'unknown import error'}"
            )
        return self._client

    def create_limit_order(
        self,
        token_id: str,
        side: str,
        price: float,
        size: float,
    ):
        client = self._require_client()
        order_args = self._order_args_cls(
            token_id=token_id,
            side=side,
            price=price,
            size=size,
        )
        return client.create_order(order_args)

    def post_order(self, signed_order, time_in_force: str = "GTC", post_only: bool = False):
        client = self._require_client()
        self._ensure_l2_creds(client)

        order_type = self._resolve_order_type(time_in_force)
        return client.post_order(signed_order, orderType=order_type, post_only=post_only)

    def _resolve_order_type(self, time_in_force: str):
        if self._order_type_enum is None:
            raise PolymarketSDKUnavailableError("OrderType enum unavailable")
        key = (time_in_force or "GTC").upper()
        return getattr(self._order_type_enum, key, self._order_type_enum.GTC)

    def _ensure_l2_creds(self, client) -> None:
        if self._has_l2_creds:
            return

        creds = client.create_or_derive_api_creds()
        if creds is None:
            raise RuntimeError("failed to derive polymarket api creds")
        client.set_api_creds(creds)
        self._has_l2_creds = True


class PolymarketSDKTradingGateway:
    venue = "polymarket"

    def __init__(
        self,
        config: PolymarketSDKGatewayConfig,
        sdk_client: _PolymarketSDKClient | None = None,
    ) -> None:
        self.config = config
        self.sdk_client = sdk_client or _PolymarketSDKClient(config)

    def place_limit_order(self, request: LimitOrderRequest) -> OrderPlacement:
        submitted_at = datetime.utcnow().isoformat()

        if not request.token_id:
            return OrderPlacement(
                venue=self.venue,
                market_key=request.market_key,
                side=request.side,
                price=request.price,
                size=request.size,
                status="rejected",
                submitted_at=submitted_at,
                error="token_id_required",
            )

        try:
            signed_order = self.sdk_client.create_limit_order(
                token_id=request.token_id,
                side=request.side,
                price=request.price,
                size=request.size,
            )
        except Exception as exc:
            return OrderPlacement(
                venue=self.venue,
                market_key=request.market_key,
                side=request.side,
                price=request.price,
                size=request.size,
                status="rejected",
                submitted_at=submitted_at,
                error=f"create_order_failed:{exc}",
            )

        signed_payload = _to_serializable(signed_order)
        if not self.config.submit_live:
            return OrderPlacement(
                venue=self.venue,
                market_key=request.market_key,
                side=request.side,
                price=request.price,
                size=request.size,
                status="prepared",
                submitted_at=submitted_at,
                live_submitted=False,
                payload={
                    "signed_order": signed_payload,
                    "time_in_force": request.time_in_force,
                    "post_only": request.post_only,
                },
            )

        try:
            response = self.sdk_client.post_order(
                signed_order=signed_order,
                time_in_force=request.time_in_force,
                post_only=request.post_only,
            )
        except Exception as exc:
            return OrderPlacement(
                venue=self.venue,
                market_key=request.market_key,
                side=request.side,
                price=request.price,
                size=request.size,
                status="rejected",
                submitted_at=submitted_at,
                live_submitted=False,
                payload={"signed_order": signed_payload},
                error=f"post_order_failed:{exc}",
            )

        response_payload = _to_serializable(response)
        return OrderPlacement(
            venue=self.venue,
            market_key=request.market_key,
            side=request.side,
            price=request.price,
            size=request.size,
            status="pending",
            submitted_at=submitted_at,
            order_id=_extract_order_id(response_payload),
            live_submitted=True,
            payload={"signed_order": signed_payload, "response": response_payload},
        )

