from models.crearHistorialActivos import WhoisDatabase
from models.whois import obtenerWhoIs, obtenerReverse, obtenerSubdominios
from dotenv import load_dotenv
from os import getenv


def crearBusquedaDeActivos(url: str):
    db = WhoisDatabase('./databases/historialActivos.db')
    name = ""

    if url.endswith(".com") or url.endswith(".eus"):
        name = url[:-4]
    elif url.endswith(".es"):
        name = url[:-3]
    else:
        return "URL no válida"

    datos = db.buscar_datos_principal(name)

    if datos:
        db.desconectar()

        estructura = {
            "id": datos[0],
            "name": datos[1],
            "url": datos[2],
            "fecha": datos[3],
        }

        return estructura

    busqueda = db.buscar_datos_principal(name)

    if busqueda:
        db.desconectar()
        return busqueda

    id = db.insertar_datos_principal(name, url)

    load_dotenv()
    whoisAPIKEY: str = getenv('WHOISAPIKEY')  # type: ignore

    obtenerWhoIs(url, id, whoisAPIKEY)
    obtenerReverse(name, id, whoisAPIKEY)
    obtenerSubdominios(name, id, whoisAPIKEY)

    datos = db.buscar_datos_principal(name)
    db.desconectar()

    estructura = {
        "id": datos[0],
        "name": datos[1],
        "url": datos[2],
        "fecha": datos[3],
    }
    return estructura


def obtenerDatosPrincipales():
    db = WhoisDatabase('./databases/historialActivos.db')
    datos = db.get_datos_principales()

    for i in range(len(datos)):
        datos[i] = {
            "id": datos[i][0],
            "name": datos[i][1],
            "url": datos[i][2],
            "fecha": datos[i][3],
        }

    db.desconectar()

    return datos


def obtenerDatosDetallados(id: int):
    db = WhoisDatabase('./databases/historialActivos.db')
    datos = db.get_datos_detallados(id)
    db.desconectar()

    return datos
