from __future__ import annotations

import httpx


class GammaClient:
    def __init__(self, base_url: str, timeout: float = 10.0) -> None:
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    def get_markets_by_slug(self, slug: str) -> list[dict]:
        url = f"{self.base_url}/markets"
        with httpx.Client(timeout=self.timeout) as client:
            resp = client.get(url, params={"slug": slug})
            resp.raise_for_status()
            return resp.json()
