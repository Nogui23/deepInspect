# database/core.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database.base import Base

from models.activos import WhoisRecord, WhoisXmlRecord, ReverseWhoisRecord, DomainSubdomainRecord  # noqa: F401
from models.crud import CRUDBase, CRUDUsuario, CRUDEscaneo, CRUDPortRecord  # noqa: F401
from models.usuarios import Usuario  # noqa: F401
from models.vulnerabilidades import Escaneo, PortRecord, Port, CVEData  # noqa: F401


class DatabaseEngine:
    _instance = None

    @classmethod
    def get_instance(cls, db_url="sqlite:///./database/BBDD.db"):
        if cls._instance is None:
            cls._instance = create_engine(
                db_url,
                connect_args={"check_same_thread": False}
            )
            Base.metadata.create_all(cls._instance)
        return cls._instance


def get_session_factory():
    engine = DatabaseEngine.get_instance()
    return sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    """Retorna el engine singleton para la aplicación"""
    return DatabaseEngine.get_instance()
