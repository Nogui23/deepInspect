from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database.base import Base
from uuid import uuid4


class WhoisRecord(Base):
    __tablename__ = 'whois_records'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    name = Column(String(255), nullable=False)
    url = Column(String(512), nullable=False)
    fecha = Column(DateTime, default=datetime.utcnow)
    estado = Column(Integer, default=0)  # 0: En proceso, 1: Completado, 2: Error

    xml_records = relationship("WhoisXmlRecord", back_populates="whois_record", cascade="all, delete-orphan")
    reverse_records = relationship("ReverseWhoisRecord", back_populates="whois_record", cascade="all, delete-orphan")
    subdomain_records = relationship("DomainSubdomainRecord", back_populates="whois_record", cascade="all, delete-orphan")


class WhoisXmlRecord(Base):
    __tablename__ = 'whois_xml_records'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    whois_record_id = Column(Integer, ForeignKey('whois_records.id', ondelete="CASCADE"))

    fecha_creacion = Column(DateTime)
    fecha_actualizacion = Column(DateTime)
    fecha_expiracion = Column(DateTime)
    registrante = Column(String(255))
    organizacion = Column(String(255))
    municipio = Column(String(255))
    pais = Column(String(255))
    codigo_de_pais = Column(String(50))
    contacto_admin_nombre = Column(String(255))
    contacto_admin_organizacion = Column(String(255))
    contacto_admin_municipio = Column(String(255))
    contacto_admin_pais = Column(String(255))

    whois_record = relationship("WhoisRecord", back_populates="xml_records")


class ReverseWhoisRecord(Base):
    __tablename__ = 'reverse_whois_records'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    whois_record_id = Column(Integer, ForeignKey('whois_records.id', ondelete="CASCADE"))
    domains_count = Column(Integer)
    domain = Column(String(255))

    whois_record = relationship("WhoisRecord", back_populates="reverse_records")


class DomainSubdomainRecord(Base):
    __tablename__ = 'domains_subdomains_records'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    whois_record_id = Column(Integer, ForeignKey('whois_records.id', ondelete="CASCADE"))
    domains_count = Column(Integer)
    domain = Column(String(255))

    whois_record = relationship("WhoisRecord", back_populates="subdomain_records")