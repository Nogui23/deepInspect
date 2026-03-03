from flask import Blueprint, jsonify, request
from controllers.nmap_controller import buscar_puertos, getTodosLosPuertos, getPuerto, download_vulnerabilities_csv
from middleware.authMiddleware import auth_required
import concurrent.futures

nmap_bp = Blueprint('nmap_bp', __name__)


@nmap_bp.route('/nmap/searchPorts', methods=['POST'])
@auth_required
def obtener_puertos():
    data = request.json

    if not data:
        return {'error': 'No se proporcionaron datos'}, 400

    with concurrent.futures.ThreadPoolExecutor() as executor:
        future = executor.submit(buscar_puertos, data['ip'])
        puertos = future.result()
        return jsonify(puertos), 200


@nmap_bp.route('/nmap/getPorts', methods=['GET'])
@auth_required
def get_allPorts():
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future = executor.submit(getTodosLosPuertos)
        puertos = future.result()
        return jsonify(puertos), 200


@nmap_bp.route('/nmap/getPort/<int:id>', methods=['GET'])
@auth_required
def get_port(id):
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future = executor.submit(getPuerto, id)
        puertos = future.result()
        return jsonify(puertos), 200


@nmap_bp.route("/nmap/export-csv/<id>", methods=["GET"])
def download__csv(id):
    print("Record ID:", id)
    response = download_vulnerabilities_csv(id)

    if isinstance(response, dict) and "error" in response:
        return jsonify(response), 404
    return response
