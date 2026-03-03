import nmap
import vulners
from dotenv import load_dotenv
from os import getenv
from utils.extraerInfo import extraerInfoVulners
from models.crearHistorialVulnerabilidades import PortDatabase


def buscar_puertos(ip: str):
    db = PortDatabase('./databases/historialVulnerabilidades.db')

    datos = db.buscar_por_ip(ip)

    if datos:
        db.desconectar()
        return datos

    id = db.insertar_port_record(ip)

    nm = nmap.PortScanner()

    try:
        nm.scan(hosts=ip, arguments='-p- --open -sS --min-rate 5000')
    except nmap.PortScannerError:
        db.desconectar()
        return f"No se pudo encontrar la IP: {ip}"

    if ip not in nm.all_hosts():
        db.desconectar()
        return f"El host {ip} no está accesible o no se encontró"

    puertos = {}
    cpes = []

    for protocolo in nm[ip].all_protocols():
        puertos[protocolo] = []
        for puerto in nm[ip][protocolo].keys():
            puertos[protocolo].append(puerto)

    puertos_abiertos = ",".join(str(puerto) for puerto in puertos["tcp"])

    try:
        nm.scan(hosts=ip, arguments=f'-p {puertos_abiertos} -sV')
    except nmap.PortScannerError:
        db.desconectar()
        return f"No se pudo escanear los puertos de la IP: {ip}"

    for protocolo in nm[ip].all_protocols():
        for puerto in nm[ip][protocolo].keys():
            puerto_info = nm[ip][protocolo][puerto]
            cpes.append(puerto_info.get('cpe', ''))
            db.insertar_puerto(id, puerto_info)

    db.desconectar()

    return datos


def buscar_cve(listCpe: list, id):
    db = PortDatabase('./databases/historialVulnerabilidades.db')
    load_dotenv()
    vulnersAPIKEY = getenv('VULNERSAPIKEY')

    vulners_api = vulners.VulnersApi(api_key=vulnersAPIKEY)
    cve = []

    for cpe in listCpe:
        cve_info = vulners_api.get_cpe_vulnerabilities(cpe)
        cve_info_extracted = extraerInfoVulners(cve_info)
        cve.append(cve_info_extracted)
        for cve_data in cve_info_extracted:
            db.insertar_cve(id, cve_data)


def getTodosLosPuertos() -> list:
    db = PortDatabase('./databases/historialVulnerabilidades.db')

    datos = db.obtener_todos_los_registros()

    db.desconectar()
    estructuras = []

    for dato in datos:
        estructura = {
            "id": dato[0],
            "ip": dato[1],
            "fecha": dato[2],
            "estado": "Completado"
        }
        estructuras.append(estructura)

    return estructuras


def getPuerto(id: str) -> str:
    db = PortDatabase('./databases/historialVulnerabilidades.db')

    datos = db.obtener_detalles_por_id(id)
    db.desconectar()

    if not datos:
        return f"No se encontró la información del puerto con el id: {id}"

    return datos
