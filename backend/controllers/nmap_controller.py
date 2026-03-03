import nmap
import vulners
from os import getenv
from sqlalchemy.orm import Session
from database.core import init_db
from models.crud import port_record
from models.vulnerabilidades import PortRecord
from utils.extraerInfo import extraerInfoVulners
from flask import Response
import json


def buscar_puertos(ip: str):
    db = init_db()
    try:
        with Session(db) as session:  # type: ignore
            # Verificar existencia previa
            existente = session.query(PortRecord).filter(
                PortRecord.ip == ip
            ).first()

            if existente:
                return port_record.get_full_scan(session, existente.id)  # type: ignore

            # Nuevo escaneo
            nm = nmap.PortScanner()

            try:
                # Escaneo inicial
                nm.scan(hosts=ip, arguments='-p- --open -sS --min-rate 5000')

                if ip not in nm.all_hosts():
                    return {"error": f"El host {ip} no está accesible"}

                # Obtener puertos abiertos
                puertos_abiertos = ",".join(
                    str(p) for p in nm[ip]['tcp'].keys()
                )

                # Escaneo detallado
                nm.scan(hosts=ip, arguments=f'-p {puertos_abiertos} -sV')

                # Procesar resultados
                puertos_data = []
                cves_data = {}

                for proto in nm[ip].all_protocols():
                    for port in nm[ip][proto]:
                        port_info = nm[ip][proto][port]
                        puertos_data.append({
                            'puerto': port,
                            'product': port_info.get('product', ''),
                            'version': port_info.get('version', ''),
                            'cpe': port_info.get('cpe', '')
                        })

                        # Buscar CVEs
                        if port_info.get('cpe'):
                            vulners_api = vulners.VulnersApi(api_key=getenv('VULNERSAPIKEY'))
                            cves = vulners_api.get_cpe_vulnerabilities(port_info['cpe'])
                            cves_data[str(port)] = extraerInfoVulners(cves)

                # Crear registro con relaciones
                nuevo_record = port_record.create_with_ports(
                    session,
                    ip=ip,
                    ports_data=puertos_data,
                    cves_data=cves_data
                )

                return port_record.get_full_scan(session, nuevo_record.id)  # type: ignore

            except nmap.PortScannerError as e:
                return {"error": str(e)}
    finally:
        pass


def getTodosLosPuertos():
    db = init_db()
    try:
        with Session(db) as session:  # type: ignore
            registros = port_record.get_all(session)
            return [{
                "id": r.id,
                "name": r.ip,
                "fecha": r.fecha.isoformat(),
                "estado": r.estado,
            } for r in registros]
    finally:
        pass


def getPuerto(id: int):
    db = init_db()
    try:
        with Session(db) as session:  # type: ignore
            resultado = port_record.get_full_scan(session, id)
            if not resultado:
                return {"error": "Registro no encontrado"}
            print(json.dumps(resultado, indent=4, default=str))
            cves_por_puerto = {}
            for cve in resultado["cve_data"]:
                puerto_id = cve["puerto_id"]
                if puerto_id not in cves_por_puerto:
                    cves_por_puerto[puerto_id] = []
                cves_por_puerto[puerto_id].append(cve)

            return {
                "ip": resultado["port_record"]["ip"],
                "fecha": resultado["port_record"]["fecha"],
                "puertos": [{
                    "numero": p["puerto"],
                    "producto": p["product"],
                    "cpe": p["cpe"],
                    "version": p["version"],
                    "conf": p["conf"],
                    "state": p["state"],
                    "cves": [{
                        "id": c["cve_id"],
                        "titulo": c["title"],
                        "descripcion": c["description"],
                        "cvss_score": c["cvss_score"],
                        "published": c["published"],
                        "modified": c["modified"]
                    } for c in cves_por_puerto.get(p["id"], [])]
                } for p in resultado["ports"]]
            }
    finally:
        pass


def download_vulnerabilities_csv(record_id: int):
    db = init_db()
    try:
        with Session(db) as session:  # type: ignore
            csv_content = port_record.export_to_csv(session, record_id)
            if not csv_content:
                return {"mensaje": "Registro de vulnerabilidades no encontrado"}, 404

            response = Response(response=csv_content)
            response.headers["Content-Disposition"] = f"attachment; filename=vulnerabilities_{record_id}.csv"
            response.headers["Content-Type"] = "text/csv"
            return response
    finally:
        pass
