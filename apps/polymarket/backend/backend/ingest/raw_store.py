from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path


class RawStore:
    def __init__(self, root: str = "./data/raw") -> None:
        self.root = Path(root)
        self.root.mkdir(parents=True, exist_ok=True)

    def write(self, venue: str, payload: dict) -> Path:
        ts = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
        filename = self.root / venue / f"{ts}.json"
        filename.parent.mkdir(parents=True, exist_ok=True)
        filename.write_text(json.dumps(payload))
        return filename
