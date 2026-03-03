from requests import get, post
from json import loads
from utils.reestructurar import WhoisParser
from models.crearHistorialActivos import WhoisDatabase


def obtenerWhoIs(url: str, id: int, whoisAPIKEY: str) -> dict:
    parametros = {
        'apiKey': whoisAPIKEY,
        'domainName': url,
        'outputFormat': 'JSON'
    }

    response = get('https://www.whoisxmlapi.com/whoisserver/WhoisService', params=parametros)
    datos = {}

    if response.status_code == 200:
        db = WhoisDatabase("./databases/historialActivos.db")

        res = loads(response.content)
        dominioDeUrl = url.split('.')[-1]

        if dominioDeUrl == 'com':
            datos = WhoisParser.estructurar_com(res)
            db.insertar_datos_whois_xml(datos, id)
        elif dominioDeUrl == 'es':
            datos = WhoisParser.estructurar_es(res)
            db.insertar_datos_whois_xml(datos, id)
        elif dominioDeUrl == 'eus':
            datos = WhoisParser.estructurar_eus(res)
            db.insertar_datos_whois_xml(datos, id)
        else:
            datos = {
                "error": "No se ha encontrado una estructura para este dominio"
            }

        db.desconectar()
    else:
        datos = {
            "error": "Error al hacer la solicitud"
        }

    return datos


def obtenerReverse(nombre: str, id: int, whoisAPIKEY: str) -> dict:
    data = {
        'apiKey': whoisAPIKEY,
        'searchType': 'current',
        'mode': 'purchase',
        'basicSearchTerms': {
            'include': [
                nombre
            ],
            'exclude': []
        }
    }

    response = post('https://reverse-whois.whoisxmlapi.com/api/v2', json=data)

    if response.status_code == 200:
        db = WhoisDatabase("historialActivos.db")
        db.insertar_datos_reverse_whois(response.json(), id)
        db.desconectar()

        return response.json()
    else:
        return {"error": "Error al hacer la solicitud"}


def obtenerSubdominios(nombre: str, id: int, whoisAPIKEY: str) -> dict:
    data = {
        "apiKey": whoisAPIKEY,
        "domains": {
            "include": [
                f"*{nombre}.*"
            ]
        }
    }

    response = post('https://domains-subdomains-discovery.whoisxmlapi.com/api/v1', json=data)

    if response.status_code == 200:
        db = WhoisDatabase("historialActivos.db")
        db.insertar_datos_domains_subdomains(response.json(), id)
        db.desconectar()

        return response.json()
    else:
        return {"error": "Error al hacer la solicitud"}
