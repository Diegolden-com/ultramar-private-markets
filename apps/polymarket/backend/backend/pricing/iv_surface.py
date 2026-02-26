from __future__ import annotations


def nearest_iv(instruments: list[dict], strike: float) -> float | None:
    if not instruments:
        return None
    closest = min(instruments, key=lambda x: abs(x.get("strike", 0) - strike))
    return closest.get("iv")


def parse_mark_iv(raw: dict) -> float | None:
    result = raw.get("result", {})
    return result.get("mark_iv")
