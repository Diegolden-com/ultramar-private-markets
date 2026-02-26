import httpx


class DeribitClient:
    def __init__(self, base_url: str, timeout: float = 10.0) -> None:
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    def _get(self, path: str, params: dict | None = None) -> dict:
        url = f"{self.base_url}{path}"
        with httpx.Client(timeout=self.timeout) as client:
            resp = client.get(url, params=params)
            resp.raise_for_status()
            return resp.json()

    def get_instruments(self, currency: str = "BTC", kind: str = "option") -> dict:
        return self._get("/public/get_instruments", {"currency": currency, "kind": kind})

    def get_orderbook(self, instrument_name: str) -> dict:
        return self._get("/public/get_order_book", {"instrument_name": instrument_name})

    def get_index_price(self, index_name: str) -> dict:
        return self._get("/public/get_index_price", {"index_name": index_name})
