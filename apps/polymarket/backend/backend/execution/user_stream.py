from __future__ import annotations

import asyncio
import json
import logging
from typing import Any

import websockets

logger = logging.getLogger(__name__)


async def _collect_user_channel_events(
    ws_url: str,
    auth: dict[str, str],
    markets: list[str] | None = None,
    duration_seconds: float = 5.0,
    ping_interval_seconds: float = 10.0,
) -> list[dict[str, Any]]:
    events: list[dict[str, Any]] = []
    subscribe_payload: dict[str, Any] = {
        "type": "user",
        "auth": auth,
    }
    if markets:
        subscribe_payload["markets"] = markets

    async with websockets.connect(ws_url) as ws:
        await ws.send(json.dumps(subscribe_payload))
        deadline = asyncio.get_event_loop().time() + max(duration_seconds, 0.1)
        last_ping = asyncio.get_event_loop().time()

        while asyncio.get_event_loop().time() < deadline:
            timeout = min(1.0, deadline - asyncio.get_event_loop().time())
            if timeout <= 0:
                break

            try:
                raw = await asyncio.wait_for(ws.recv(), timeout=timeout)
            except asyncio.TimeoutError:
                now = asyncio.get_event_loop().time()
                if now - last_ping >= ping_interval_seconds:
                    await ws.send("PING")
                    last_ping = now
                continue

            if isinstance(raw, bytes):
                raw = raw.decode("utf-8", errors="ignore")

            text = str(raw).strip()
            if text.upper() == "PING":
                await ws.send("PONG")
                continue
            if text.upper() == "PONG":
                continue

            try:
                parsed = json.loads(text)
            except json.JSONDecodeError:
                logger.warning("ignoring non-json user stream message", extra={"message": text})
                continue

            if isinstance(parsed, dict):
                events.append(parsed)

    return events


def collect_user_channel_events(
    ws_url: str,
    auth: dict[str, str],
    markets: list[str] | None = None,
    duration_seconds: float = 5.0,
    ping_interval_seconds: float = 10.0,
) -> list[dict[str, Any]]:
    return asyncio.run(
        _collect_user_channel_events(
            ws_url=ws_url,
            auth=auth,
            markets=markets,
            duration_seconds=duration_seconds,
            ping_interval_seconds=ping_interval_seconds,
        )
    )

