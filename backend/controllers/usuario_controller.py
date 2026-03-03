from database.core import get_session_factory
from models.crud import usuario


def listar_usuarios():
    SessionLocal = get_session_factory()

    try:
        with SessionLocal() as session:
            usuarios = usuario.get_all(session)
            return [{
                "id": u.id,
                "username": u.username,
                "email": u.email
            } for u in usuarios]
    finally:
        pass


def buscar_usuario(id: int):
    SessionLocal = get_session_factory()

    try:
        with SessionLocal() as session:
            usuario_obj = usuario.get(session, id)
            if usuario_obj:
                return {
                    "id": usuario_obj.id,
                    "username": usuario_obj.username,
                    "email": usuario_obj.email
                }
            return None
    finally:
        pass


def crear_usuario(data: dict):
    SessionLocal = get_session_factory()

    try:
        with SessionLocal() as session:
            nuevo_usuario = usuario.create(session, {
                "username": data['username'],
                "email": data['email'],
                "password": data['password']
            })
            return {
                "id": nuevo_usuario.id,
                "username": nuevo_usuario.username,
                "email": nuevo_usuario.email
            }
    finally:
        pass


def login_usuario(username: str, password: str):
    SessionLocal = get_session_factory()

    try:
        with SessionLocal() as session:
            usuario_obj = usuario.authenticate(session, username, password)
            if usuario_obj:
                return {
                    "id": usuario_obj.id,
                    "username": usuario_obj.username,
                    "email": usuario_obj.email
                }
            return None
    finally:
        pass


def borrar_usuario(id: int):
    SessionLocal = get_session_factory()

    try:
        with SessionLocal() as session:
            usuario_obj = usuario.delete(session, id)
            if usuario_obj:
                return {
                    "id": usuario_obj.id,
                    "username": usuario_obj.username
                }
            return None
    finally:
        pass
