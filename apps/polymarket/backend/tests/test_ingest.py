import respx
from httpx import Response

from backend.ingest.polymarket_client import PolymarketClient


@respx.mock
def test_get_markets():
    respx.get("https://clob.polymarket.com/markets").mock(
        return_value=Response(200, json=[{"token_id": "123"}])
    )
    client = PolymarketClient("https://clob.polymarket.com")
    markets = client.get_markets()
    assert isinstance(markets, list)
    assert markets[0]["token_id"] == "123"
