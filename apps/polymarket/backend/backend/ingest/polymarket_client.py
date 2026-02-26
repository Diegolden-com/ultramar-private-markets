from __future__ import annotations

import httpx


class PolymarketClient:
    def __init__(self, base_url: str, api_key: str | None = None, timeout: float = 10.0) -> None:
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.timeout = timeout

    def _headers(self) -> dict:
        headers = {"accept": "application/json"}
        if self.api_key:
            headers["authorization"] = f"Bearer {self.api_key}"
        return headers

    def get_markets(self) -> dict:
        url = f"{self.base_url}/markets"
        with httpx.Client(timeout=self.timeout, headers=self._headers()) as client:
            resp = client.get(url)
            resp.raise_for_status()
            return resp.json()

    def get_orderbook_by_token(self, token_id: str) -> dict:
        url = f"{self.base_url}/book"
        with httpx.Client(timeout=self.timeout, headers=self._headers()) as client:
            resp = client.get(url, params={"token_id": token_id})
            resp.raise_for_status()
            return resp.json()
