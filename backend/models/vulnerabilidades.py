from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from database.base import Base
from datetime import datetime
from uuid import uuid4


class Escaneo(Base):
    __tablename__ = 'escaneos'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    ip = Column(String(45))
    puertos = Column(Text)
    os = Column(String(255))


class PortRecord(Base):
    __tablename__ = 'port_records'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    ip = Column(String(45), nullable=False)
    fecha = Column(DateTime, default=datetime.utcnow)
    estado = Column(Integer, default=0)

    ports = relationship("Port", back_populates="port_record", cascade="all, delete-orphan")


class Port(Base):
    __tablename__ = 'ports'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    port_record_id = Column(Integer, ForeignKey('port_records.id', ondelete="CASCADE"))
    puerto = Column(String(10))
    conf = Column(String(50))
    cpe = Column(String(255))
    extrainfo = Column(Text)
    name = Column(String(255))
    product = Column(String(255))
    reason = Column(String(255))
    script = Column(JSON)
    state = Column(String(50))
    version = Column(String(255))

    port_record = relationship("PortRecord", back_populates="ports")
    cves = relationship("CVEData", back_populates="port", cascade="all, delete-orphan")


class CVEData(Base):
    __tablename__ = 'cve_data'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    puerto_id = Column(Integer, ForeignKey('ports.id', ondelete="CASCADE"))
    cve_id = Column(String(20))
    title = Column(Text)
    description = Column(Text)
    reference_link = Column(String(512))
    published = Column(DateTime)
    cvss_score = Column(JSON)
    cvss3_score = Column(JSON)
    last_seen = Column(DateTime)
    modified = Column(DateTime)

    port = relationship("Port", back_populates="cves")
