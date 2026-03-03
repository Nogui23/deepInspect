from sqlalchemy import Column, String
from database.base import Base
from uuid import uuid4


class Usuario(Base):
    __tablename__ = 'usuarios'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    username = Column(String(50), unique=True)
    email = Column(String(255), unique=True)
    password = Column(String(128))
