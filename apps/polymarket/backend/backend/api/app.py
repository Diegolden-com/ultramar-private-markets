from fastapi import FastAPI

from ..logging import configure_logging
from .routes import positions, signals

configure_logging()

app = FastAPI(title="Ultramar Polymarket MVP")

app.include_router(signals.router)
app.include_router(positions.router)


@app.get("/health")
async def health():
    return {"status": "ok"}
