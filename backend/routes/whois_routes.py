from flask import Blueprint, request, jsonify
from controllers.whois_controller import crearBusquedaDeActivos, obtenerDatosPrincipales, obtenerDatosDetallados, download_whois_csv
from middleware.authMiddleware import auth_required
import concurrent.futures

whois_bp = Blueprint('whois', __name__)


@whois_bp.route('/whois/createActiveSearch', methods=['POST'])
@auth_required
def createActiveSearch():
    data = request.json

    if not data:
        return {"error": "No se proporcionaron datos"}, 400

    with concurrent.futures.ThreadPoolExecutor() as executor:
        future = executor.submit(crearBusquedaDeActivos, data['url'])
        resultado = future.result()

        return resultado, 200


@whois_bp.route('/whois/getAll', methods=['GET'])
@auth_required
def obtenerDatos():
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future = executor.submit(obtenerDatosPrincipales)
        print(future)
        resultado = future.result()

    return resultado, 200


@whois_bp.route('/whois/get/<int:id>', methods=['GET'])
@auth_required
def obtenerDatosPorId(id):
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future = executor.submit(obtenerDatosDetallados, id)
        resultado = future.result()

    return resultado, 200


@whois_bp.route("/whois/export-csv/<id>", methods=["GET"])
def download__csv(id):
    response = download_whois_csv(id)

    if isinstance(response, dict) and "error" in response:
        return jsonify(response), 404
    return response
