from __future__ import annotations


def parse_index_price(raw: dict) -> float | None:
    result = raw.get("result", {})
    return result.get("index_price")
