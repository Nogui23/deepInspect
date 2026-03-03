import json
import csv
import io
from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from typing import List, Optional, Dict, Any
from models.activos import (
    WhoisRecord,
    WhoisXmlRecord,
    ReverseWhoisRecord,
    DomainSubdomainRecord
)
from models.vulnerabilidades import Escaneo, PortRecord, Port, CVEData
from models.usuarios import Usuario


class CRUDBase:
    def __init__(self, model):
        self.model = model

    def get(self, db: Session, id: int) -> Optional[Any]:
        return db.query(self.model).filter(self.model.id == id).first()

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[Any]:
        return db.query(self.model).offset(skip).limit(limit).all()

    def create(self, db: Session, obj_in: Dict) -> Any:
        db_obj = self.model(**obj_in)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, db_obj: Any, obj_in: Dict) -> Any:
        for key, value in obj_in.items():
            setattr(db_obj, key, value)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, id: int) -> Any:
        db_obj = db.query(self.model).get(id)
        if db_obj:
            db.delete(db_obj)
            db.commit()
        return db_obj


class CRUDUsuario(CRUDBase):
    def __init__(self):
        super().__init__(Usuario)

    def createUser(self, db: Session, username: str, email: str, password: str) -> Usuario:
        db_obj = Usuario(username=username, email=email, password=password)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_by_username(self, db: Session, username: str) -> Optional[Usuario]:
        return db.query(Usuario).filter(Usuario.username == username).first()

    def get_by_email(self, db: Session, email: str) -> Optional[Usuario]:
        return db.query(Usuario).filter(Usuario.email == email).first()

    def authenticate(self, db: Session, email: str, password: str) -> Optional[Usuario]:
        return db.query(Usuario).filter(
            Usuario.email == email,
            Usuario.password == password
        ).first()


class CRUDEscaneo(CRUDBase):
    def __init__(self):
        super().__init__(Escaneo)

    def get_by_ip(self, db: Session, ip: str) -> Optional[Escaneo]:
        return db.query(Escaneo).filter(Escaneo.ip == ip).first()


class CRUDWhoisRecord(CRUDBase):
    def __init__(self):
        super().__init__(WhoisRecord)

    def create_with_relations(
        self,
        db: Session,
        name: str,
        url: str,
        xml_data: Dict,
        reverse_data: Dict,
        subdomain_data: Dict
    ) -> WhoisRecord:
        try:
            # Crear registro principal
            whois_record = WhoisRecord(
                name=name,
                url=url,
                fecha=datetime.utcnow()
            )
            db.add(whois_record)
            db.commit()
            db.refresh(whois_record)

            # Insertar datos XML
            if xml_data:
                self.create_xml_record(db, whois_record.id, xml_data)

            # Insertar reverse whois
            if reverse_data and 'domainsList' in reverse_data:
                self.create_reverse_records(db, whois_record.id, reverse_data)

            # Insertar subdominios
            if subdomain_data and 'domainsList' in subdomain_data:
                self.create_subdomain_records(db, whois_record.id, subdomain_data)

            return whois_record
        except Exception as e:
            db.rollback()
            raise e

    def create_xml_record(self, db: Session, whois_id: int, data: Dict) -> WhoisXmlRecord:
        def get_value(keys: List[str], default=None):
            current = data
            for key in keys:
                current = current.get(key, {})
            return current or default

        xml_record = WhoisXmlRecord(
            whois_record_id=whois_id,
            fecha_creacion=get_value(['whoisRecord', 'fechaCreacion']),
            fecha_actualizacion=get_value(['whoisRecord', 'fechaActualizacion']),
            fecha_expiracion=get_value(['whoisRecord', 'fechaExpiracion']),
            registrante=get_value(['whoisRecord', 'registrante']),
            organizacion=get_value(['whoisRecord', 'organizacion']),
            municipio=get_value(['whoisRecord', 'municipio']),
            pais=get_value(['whoisRecord', 'pais']),
            codigo_de_pais=get_value(['whoisRecord', 'codigoDePais']),
            contacto_admin_nombre=get_value(['contactoAdministrativo', 'registrante']),
            contacto_admin_organizacion=get_value(['contactoAdministrativo', 'organizacion']),
            contacto_admin_municipio=get_value(['contactoAdministrativo', 'municipio']),
            contacto_admin_pais=get_value(['contactoAdministrativo', 'pais'])
        )
        db.add(xml_record)
        db.commit()
        db.refresh(xml_record)
        return xml_record

    def create_reverse_records(self, db: Session, whois_id: int, data: Dict) -> List[ReverseWhoisRecord]:
        domains = data.get('domainsList', [])
        records = [
            ReverseWhoisRecord(
                whois_record_id=whois_id,
                domains_count=data.get('domainsCount', 0),
                domain=domain
            ) for domain in domains
        ]
        db.bulk_save_objects(records)
        db.commit()
        return records

    def create_subdomain_records(self, db: Session, whois_id: int, data: Dict) -> List[DomainSubdomainRecord]:
        domains = data.get('domainsList', [])
        records = [
            DomainSubdomainRecord(
                whois_record_id=whois_id,
                domains_count=data.get('domainsCount', 0),
                domain=domain
            ) for domain in domains
        ]
        db.bulk_save_objects(records)
        db.commit()
        return records

    def get_detailed(self, db: Session, record_id: int) -> Dict:
        record = db.query(WhoisRecord).options(
            joinedload(WhoisRecord.xml_records),
            joinedload(WhoisRecord.reverse_records),
            joinedload(WhoisRecord.subdomain_records)
        ).filter(WhoisRecord.id == record_id).first()

        if not record:
            return None

        return {
            "whois_record": record,
            "xml_records": record.xml_records,
            "reverse_records": [r.domain for r in record.reverse_records],
            "subdomains": [s.domain for s in record.subdomain_records]
        }

    def export_whois_to_csv(self, db: Session, record_id: int) -> str:
        # Obtener datos detallados del WhoisRecord
        data = self.get_detailed(db, record_id)
        if not data:
            return None

        output = io.StringIO()
        writer = csv.writer(output)

        # Datos básicos del dominio
        writer.writerow(["Información básica del dominio"])
        writer.writerow(["ID", data["whois_record"].id])
        writer.writerow(["Nombre", data["whois_record"].name])
        writer.writerow(["URL", data["whois_record"].url])
        writer.writerow(["Fecha de consulta", data["whois_record"].fecha])
        writer.writerow([])

        # Información WHOIS XML
        if data["xml_records"]:
            xml = data["xml_records"][0]  # Asumiendo que hay solo un registro XML por WhoisRecord
            writer.writerow(["Información WHOIS detallada"])
            writer.writerow(["Fecha de creación", xml.fecha_creacion])
            writer.writerow(["Fecha de actualización", xml.fecha_actualizacion])
            writer.writerow(["Fecha de expiración", xml.fecha_expiracion])
            writer.writerow(["Registrante", xml.registrante])
            writer.writerow(["Organización", xml.organizacion])
            writer.writerow(["Municipio", xml.municipio])
            writer.writerow(["País", xml.pais])
            writer.writerow(["Código de país", xml.codigo_de_pais])
            writer.writerow([])

            writer.writerow(["Información de contacto administrativo"])
            writer.writerow(["Nombre", xml.contacto_admin_nombre])
            writer.writerow(["Organización", xml.contacto_admin_organizacion])
            writer.writerow(["Municipio", xml.contacto_admin_municipio])
            writer.writerow(["País", xml.contacto_admin_pais])
            writer.writerow([])

        # Subdominios
        if data["subdomains"]:
            writer.writerow(["Subdominios encontrados"])
            for subdomain in data["subdomains"]:
                writer.writerow([subdomain])
            writer.writerow([])

        # Dominios relacionados (reverse whois)
        if data["reverse_records"]:
            writer.writerow(["Dominios relacionados"])
            for domain in data["reverse_records"]:
                writer.writerow([domain])

        return output.getvalue()


class CRUDPortRecord(CRUDBase):
    def __init__(self):
        super().__init__(PortRecord)

    def create_with_ports(
        self,
        db: Session,
        ip: str,
        ports_data: List[Dict],
        cves_data: Dict
    ) -> PortRecord:
        try:
            port_record = PortRecord(
                ip=ip,
                fecha=datetime.utcnow()
            )
            db.add(port_record)
            db.commit()
            db.refresh(port_record)

            for port_data in ports_data:
                port = self.create_port(db, port_record.id, port_data)
                if str(port.puerto) in cves_data:
                    self.create_cves(db, port.id, cves_data[str(port.puerto)])

            return port_record
        except Exception as e:
            db.rollback()
            raise e

    def create_port(self, db: Session, record_id: int, data: Dict) -> Port:
        port = Port(
            port_record_id=record_id,
            puerto=data.get('puerto'),
            conf=data.get('conf'),
            cpe=data.get('cpe'),
            extrainfo=data.get('extrainfo'),
            name=data.get('name'),
            product=data.get('product'),
            reason=data.get('reason'),
            script=json.dumps(data.get('script', {})),
            state=data.get('state'),
            version=data.get('version')
        )
        db.add(port)
        db.commit()
        db.refresh(port)
        return port

    def create_cves(self, db: Session, port_id: int, cves: List[Dict]) -> List[CVEData]:
        cve_records = []
        for cve in cves:
            cve_record = CVEData(
                puerto_id=port_id,
                cve_id=cve.get('CVE_ID'),
                title=cve.get('Title'),
                description=cve.get('Description'),
                reference_link=cve.get('References'),
                published=cve.get('Published'),
                cvss_score=json.dumps(cve.get('CVSS_Score', {})),
                cvss3_score=json.dumps(cve.get('CVSS3_Score', {})),
                last_seen=cve.get('Last_Seen'),
                modified=cve.get('Modified')
            )
            cve_records.append(cve_record)

        db.bulk_save_objects(cve_records)
        db.commit()
        return cve_records

    def get_full_scan(self, db: Session, record_id: int) -> Dict:
        port_record = db.query(PortRecord).options(
            joinedload(PortRecord.ports).joinedload(Port.cves)
        ).filter(PortRecord.id == record_id).first()

        if not port_record:
            return None

        # Serializa los objetos CVEData a diccionarios
        cve_data = []
        ports_data = []

        for port in port_record.ports:
            # Serializar puerto
            port_dict = {k: v for k, v in port.__dict__.items() if not k.startswith('_')}
            ports_data.append(port_dict)

            # Serializar CVEs relacionadas con este puerto
            for cve in port.cves:
                cve_dict = {
                    "id": cve.id,
                    "puerto_id": port.id,
                    "cve_id": cve.cve_id,
                    "title": cve.title,
                    "description": cve.description,
                    "reference_link": cve.reference_link,
                    "published": cve.published.isoformat() if hasattr(cve.published, 'isoformat') else str(cve.published),
                    "cvss_score": cve.cvss_score,
                    "cvss3_score": cve.cvss3_score,
                    "last_seen": cve.last_seen.isoformat() if hasattr(cve.last_seen, 'isoformat') else str(cve.last_seen),
                    "modified": cve.modified.isoformat() if hasattr(cve.modified, 'isoformat') else str(cve.modified)
                }
                cve_data.append(cve_dict)

        return {
            "port_record": {
                "id": port_record.id,
                "ip": port_record.ip,
                "fecha": port_record.fecha.isoformat() if hasattr(port_record.fecha, 'isoformat') else str(port_record.fecha)
            },
            "ports": ports_data,
            "cve_data": cve_data
        }

    def export_to_csv(self, db: Session, record_id: int) -> str:
        # Obtener datos detallados del escaneo de puertos y vulnerabilidades
        data = self.get_full_scan(db, record_id)
        if not data:
            return None

        output = io.StringIO()
        writer = csv.writer(output)

        # Información básica del escaneo
        writer.writerow(["Información del escaneo"])
        writer.writerow(["ID", data["port_record"]["id"]])
        writer.writerow(["IP", data["port_record"]["ip"]])
        writer.writerow(["Fecha de escaneo", data["port_record"]["fecha"]])
        writer.writerow([])

        # Información de puertos
        writer.writerow(["Puerto", "Estado", "Servicio", "Versión", "Producto", "Extra info", "CPE"])
        for port in data["ports"]:
            writer.writerow([
                port["puerto"],
                port["state"],
                port["name"],
                port["version"],
                port["product"],
                port["extrainfo"],
                port["cpe"]
            ])
        writer.writerow([])

        # Información de vulnerabilidades (CVEs)
        if data["cve_data"]:
            writer.writerow(["Vulnerabilidades encontradas"])
            writer.writerow(["Puerto", "CVE ID", "Título", "CVSS Score", "CVSS3 Score", "Publicado", "Modificado"])
            for cve in data["cve_data"]:
                # Buscar a qué puerto pertenece este CVE
                port_id = cve["puerto_id"]
                puerto = next((p["puerto"] for p in data["ports"] if p["id"] == port_id), "N/A")

                # Para cvss_score
                cvss_score = (json.loads(cve["cvss_score"])
                              if isinstance(cve["cvss_score"], str) and cve["cvss_score"]
                              else (cve["cvss_score"] if cve["cvss_score"] else {}))

                # Para cvss3_score
                cvss3_score = (json.loads(cve["cvss3_score"])
                               if isinstance(cve["cvss3_score"], str) and cve["cvss3_score"]
                               else (cve["cvss3_score"] if cve["cvss3_score"] else {}))

                base_score = cvss_score.get("baseScore", "N/A")
                base_score3 = cvss3_score.get("baseScore", "N/A")

                writer.writerow([
                    puerto,
                    cve["cve_id"],
                    cve["title"],
                    base_score,
                    base_score3,
                    cve["published"],
                    cve["modified"]
                ])

            # Una sección más detallada con descripciones
            writer.writerow([])
            writer.writerow(["Detalles de vulnerabilidades"])
            writer.writerow(["CVE ID", "Descripción", "Referencias"])
            for cve in data["cve_data"]:
                writer.writerow([
                    cve["cve_id"],
                    cve["description"],
                    cve["reference_link"]
                ])

        return output.getvalue()


# Instancias para usar directamente
usuario = CRUDUsuario()
escaneo = CRUDEscaneo()
whois_record = CRUDWhoisRecord()
port_record = CRUDPortRecord()
