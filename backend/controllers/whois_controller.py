from sqlalchemy.orm import Session
from database.core import init_db
from models.crud import whois_record
from models.activos import WhoisRecord
from dotenv import load_dotenv
from os import getenv
from utils.whois_services import obtenerWhoIs, obtenerReverse, obtenerSubdominios
from flask import Response


def crearBusquedaDeActivos(url: str):
    db = init_db()
    try:
        with Session(db) as session:  # type: ignore
            # Extracción del nombre y validación
            if url.endswith((".com", ".eus")):
                name = url[:-4]
            elif url.endswith(".es"):
                name = url[:-3]
            else:
                return {"error": "Dominio no soportado"}

            # Verificar existencia
            existente = session.query(WhoisRecord).filter(
                WhoisRecord.name == name
            ).first()

            if existente:
                return {
                    "id": existente.id,
                    "name": existente.name,
                    "url": existente.url,
                    "fecha": existente.fecha.isoformat()
                }

            # Crear registro principal
            nuevo_record = whois_record.create(session, {
                "name": name,
                "url": url
            })

            # Obtener API Key
            load_dotenv()
            whoisAPIKEY = getenv('WHOISAPIKEY') or ""

            # Obtener y guardar datos relacionados
            xml_data = obtenerWhoIs(url, session, whoisAPIKEY)
            reverse_data = obtenerReverse(name, session, whoisAPIKEY)
            subdomain_data = obtenerSubdominios(name, session, whoisAPIKEY)

            # Insertar datos relacionados usando CRUD
            if 'whoisRecord' in xml_data:
                whois_record.create_xml_record(session, nuevo_record.id, xml_data)

            if 'domainsList' in reverse_data:
                whois_record.create_reverse_records(session, nuevo_record.id, reverse_data)

            if 'domainsList' in subdomain_data:
                whois_record.create_subdomain_records(session, nuevo_record.id, subdomain_data)

            return {
                "id": nuevo_record.id,
                "name": nuevo_record.name,
                "url": nuevo_record.url,
                "fecha": nuevo_record.fecha.isoformat()
            }
    except Exception as e:
        session.rollback()  # type: ignore
        return {"error": str(e)}
    finally:
        pass


def obtenerDatosPrincipales():
    db = init_db()
    try:
        with Session(db) as session:  # type: ignore
            registros = whois_record.get_all(session)
            return [{
                "id": r.id,
                "name": r.name,
                "url": r.url,
                "estado": r.estado,
                "fecha": r.fecha.isoformat()
            } for r in registros]
    finally:
        pass


def obtenerDatosDetallados(id: int):
    db = init_db()
    try:
        with Session(db) as session:  # type: ignore
            detalle = whois_record.get_detailed(session, id)
            if not detalle:
                return {"error": "Registro no encontrado"}

            return {
                "whois_record": {
                    "id": detalle["whois_record"].id,
                    "name": detalle["whois_record"].name,
                    "url": detalle["whois_record"].url,
                    "fecha": detalle["whois_record"].fecha.isoformat()
                },
                "xml_records": [{
                    "fecha_creacion": x.fecha_creacion.isoformat() if x.fecha_creacion else None,
                    "registrante": x.registrante,
                    "organizacion": x.organizacion
                } for x in detalle["xml_records"]],
                "reverse_domains": detalle["reverse_records"],
                "subdomains": detalle["subdomains"]
            }
    finally:
        pass


def download_whois_csv(id: int):
    db = init_db()
    try:
        with Session(db) as session:  # type: ignore
            csv_content = whois_record.export_whois_to_csv(session, id)
            if not csv_content:
                return {"mensaje": "Registro de vulnerabilidades no encontrado"}, 404

            response = Response(response=csv_content)
            response.headers["Content-Disposition"] = f"attachment; filename=vulnerabilities_{id}.csv"
            response.headers["Content-Type"] = "text/csv"
            return response
    finally:
        pass
