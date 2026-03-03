from flask import Blueprint, jsonify, request, session, make_response
from controllers.usuario_controller import buscar_usuario, crear_usuario, login_usuario, borrar_usuario
from middleware.authMiddleware import auth_required


usuario_bp = Blueprint('usuario_bp', __name__)


@usuario_bp.route('/usuarios', methods=['GET'])
@auth_required
def obtener_usuario():
    idUsuario = session.get('userId')

    if not idUsuario:
        return jsonify({"mensaje": "No se ha iniciado sesión"}), 401

    usuario = buscar_usuario(idUsuario)

    if usuario:
        return jsonify(usuario)

    return jsonify({"mensaje": "Usuario no encontrado"}), 404


@usuario_bp.route('/usuarios/crear', methods=['POST'])
def agregar_usuario():
    data = request.json
    print(data)

    if not data or 'username' not in data or 'email' not in data or 'password' not in data:
        return jsonify({"mensaje": "Faltan datos"}), 400

    nuevo_usuario = crear_usuario(data)
    return jsonify(nuevo_usuario), 201


@usuario_bp.route('/usuarios/login', methods=['POST'])
def loginUsuario():
    data = request.json

    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"mensaje": "Faltan datos"}), 400

    usuario = login_usuario(data['email'], data['password'])

    if usuario:
        session['userId'] = usuario['id']
        response = jsonify({"mensaje": "Inicio de sesión exitoso"})
        response.status_code = 200
        return response

    return jsonify({"mensaje": "Usuario no encontrado"}), 404


@usuario_bp.route('/usuarios/', methods=['DELETE'])
@auth_required
def eliminar_usuario():
    idUsuario = session.get('userId')

    if not idUsuario:
        return jsonify({"mensaje": "No se ha iniciado sesión"}), 401

    usuario = borrar_usuario(idUsuario)

    if usuario:
        return jsonify({"mensaje": "Usuario eliminado"})

    return jsonify({"mensaje": "Usuario no encontrado"}), 404


@usuario_bp.route('/usuarios/logout', methods=['POST'])
@auth_required
def logoutUsuario():
    session.clear()
    response = make_response(jsonify({"mensaje": "Sesión cerrada exitosamente"}))
    response.set_cookie('session', '', expires=0)
    return response
