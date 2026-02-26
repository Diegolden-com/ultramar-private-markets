import asyncio
import json

import websockets


async def stream_orderbook(ws_url: str, instrument_name: str, on_message) -> None:
    async with websockets.connect(ws_url) as ws:
        await ws.send(
            json.dumps(
                {
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "public/subscribe",
                    "params": {"channels": [f"book.{instrument_name}.raw"]},
                }
            )
        )
        async for message in ws:
            on_message(message)


def run(ws_url: str, instrument_name: str, on_message) -> None:
    asyncio.run(stream_orderbook(ws_url, instrument_name, on_message))
