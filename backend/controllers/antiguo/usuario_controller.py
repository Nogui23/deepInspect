from models.usuario import Usuario, UsuarioDB


def listar_usuarios():
    usuarios = UsuarioDB("./databases/usuarios.db")
    return usuarios.obtener_todos()


def buscar_usuario(id):
    usuarios = UsuarioDB("./databases/usuarios.db")
    return usuarios.obtener_por_id(id)


def crear_usuario(data):
    db = UsuarioDB("./databases/usuarios.db")
    nuevo_usuario = Usuario(data['username'], data['email'], data['password'])
    db.agregar(nuevo_usuario)
    return nuevo_usuario


def borrar_usuario(id: int):
    db = UsuarioDB("./databases/usuarios.db")
    usuario = db.obtener_por_id(id)
    if usuario:
        db.eliminar(id)
        return usuario
    return None
