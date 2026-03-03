import sqlite3


class Usuario:
    def __init__(self, usuario, email, password):
        self.usuario = usuario
        self.email = email
        self.password = password


class UsuarioDB:
    def __init__(self, nombre_db):
        """Inicializa la base de datos de usuarios en memoria."""
        self.conn = self._conectar_db(nombre_db)
        self._comprobar_tablas()

    def _conectar_db(self, nombre_db):
        """Conecta con la base de datos y habilita claves foráneas."""
        conn = sqlite3.connect(nombre_db)
        return conn

    def _desconectar(self):
        """Cierra la conexión a la base de datos."""
        self.conn.close()

    def _comprobar_tablas(self):
        """Comprueba si las tablas existen."""
        cursor = self.conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='usuarios';")
        if cursor.fetchone() is None:
            self._crear_tablas()

    def _crear_tablas(self):
        """Crea las tablas de la base de datos."""
        cursor = self.conn.cursor()

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                email TEXT NOT NULL,
                contraseña TEXT NOT NULL
            );
        ''')

        self.conn.commit()

    def obtener_todos(self):
        """Retorna todos los usuarios."""
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM usuarios")
        usuarios = cursor.fetchall()
        return [Usuario(*u) for u in usuarios]

    def obtener_por_id(self, id: int):
        """Busca un usuario por ID."""
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM usuarios WHERE id = ?", (id,))
        usuario = cursor.fetchone()
        return Usuario(*usuario)

    def agregar(self, usuario: Usuario):
        """Agrega un nuevo usuario a la base de datos."""
        cursor = self.conn.cursor()

        cursor.execute("INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)",
                       (usuario.usuario, usuario.email, usuario.password))

        self.conn.commit()

    def eliminar(self, id: int):
        """Elimina un usuario por su ID."""
        cursor = self.conn.cursor()
        cursor.execute("DELETE FROM usuarios WHERE id = ?", (str(id)))
        self.conn.commit()
