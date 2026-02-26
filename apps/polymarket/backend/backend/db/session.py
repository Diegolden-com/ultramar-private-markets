from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from ..config import settings

engine_args = {"pool_pre_ping": True}
if settings.database_url.startswith("sqlite"):
    engine_args["connect_args"] = {"check_same_thread": False}
engine = create_engine(settings.database_url, **engine_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
