from requests import get, post
from json import loads
from typing import Dict
from sqlalchemy.orm import Session
from utils.reestructurar import WhoisParser


def obtenerWhoIs(url: str, session: Session, whoisAPIKEY: str) -> Dict:
    """Obtiene datos WHOIS y los guarda usando SQLAlchemy"""
    params = {
        'apiKey': whoisAPIKEY,
        'domainName': url,
        'outputFormat': 'JSON'
    }

    response = get('https://www.whoisxmlapi.com/whoisserver/WhoisService', params=params)

    if response.status_code == 200:
        data = loads(response.content)
        dominio = url.split('.')[-1]

        # Estructurar datos según el TLD
        datos = {}
        if dominio == 'com':
            datos = WhoisParser.estructurar_com(data)
        elif dominio == 'es':
            datos = WhoisParser.estructurar_es(data)
        elif dominio == 'eus':
            datos = WhoisParser.estructurar_eus(data)

        return datos
    return {"error": "Error en la solicitud WHOIS"}


def obtenerReverse(nombre: str, session: Session, whoisAPIKEY: str) -> Dict:
    """Obtiene reverse WHOIS y guarda resultados"""
    data = {
        'apiKey': whoisAPIKEY,
        'searchType': 'current',
        'mode': 'purchase',
        'basicSearchTerms': {
            'include': [nombre],
            'exclude': []
        }
    }

    response = post('https://reverse-whois.whoisxmlapi.com/api/v2', json=data)

    if response.status_code == 200:
        return response.json()
    return {"error": "Error en reverse WHOIS"}


def obtenerSubdominios(nombre: str, session: Session, whoisAPIKEY: str) -> Dict:
    """Descubre subdominios y guarda resultados"""
    data = {
        "apiKey": whoisAPIKEY,
        "domains": {"include": [f"*{nombre}.*"]}
    }

    response = post('https://domains-subdomains-discovery.whoisxmlapi.com/api/v1', json=data)

    if response.status_code == 200:
        return response.json()
    return {"error": "Error en subdominios"}
