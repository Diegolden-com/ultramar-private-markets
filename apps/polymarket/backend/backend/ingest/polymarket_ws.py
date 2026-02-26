import asyncio
import json
import logging

import websockets

logger = logging.getLogger(__name__)


async def stream_orderbook(ws_url: str, market_id: str, on_message) -> None:
    async with websockets.connect(ws_url) as ws:
        await ws.send(json.dumps({"type": "subscribe", "market_id": market_id}))
        async for message in ws:
            on_message(message)


def run(ws_url: str, market_id: str, on_message) -> None:
    asyncio.run(stream_orderbook(ws_url, market_id, on_message))
