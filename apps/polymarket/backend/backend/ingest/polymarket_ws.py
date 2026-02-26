import asyncio
import json
import logging
from typing import Iterable

import websockets

logger = logging.getLogger(__name__)


def _coerce_asset_ids(asset_ids: str | Iterable[str]) -> list[str]:
    if isinstance(asset_ids, str):
        return [asset_ids]
    return [asset_id for asset_id in asset_ids if asset_id]


async def stream_orderbook(
    ws_url: str,
    asset_ids: str | Iterable[str],
    on_message,
) -> None:
    subscribe_ids = _coerce_asset_ids(asset_ids)
    if not subscribe_ids:
        raise ValueError("at least one Polymarket asset_id is required")

    async with websockets.connect(ws_url) as ws:
        await ws.send(json.dumps({"type": "market", "assets_ids": subscribe_ids}))
        logger.info(
            "polymarket websocket subscribed",
            extra={"assets_ids": subscribe_ids},
        )
        async for message in ws:
            on_message(message)


def run(
    ws_url: str,
    asset_ids: str | Iterable[str],
    on_message,
) -> None:
    asyncio.run(stream_orderbook(ws_url, asset_ids, on_message))
