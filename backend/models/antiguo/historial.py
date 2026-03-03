import sqlite3


class EscaneoDB:
    def __init__(self, nombre_db):
        """Inicializa la conexión a la base de datos."""
        self.conn = sqlite3.connect(nombre_db)

    def desconectar(self):
        """Cierra la conexión a la base de datos."""
        self.conn.close()

    def obtener_todos(self):
        """Obtiene todos los registros de escaneos."""
        cursor = self.conn.cursor()
        cursor.execute('SELECT * FROM escaneos')
        escaneos = cursor.fetchall()
        return escaneos

    def obtener_por_id(self, id):
        """Obtiene un escaneo por su ID."""
        cursor = self.conn.cursor()
        cursor.execute('SELECT * FROM escaneos WHERE id = ?', (id,))
        escaneo = cursor.fetchone()
        self.conn.close()
        return escaneo

    def agregar(self, escaneo):
        """Agrega un nuevo escaneo."""
        cursor = self.conn.cursor()
        cursor.execute(
            'INSERT INTO escaneos (id, ip, puertos, os) VALUES (?, ?, ?, ?)',
            (escaneo.id, escaneo.ip, escaneo.puertos, escaneo.os)
        )
        self.conn.commit()

    def eliminar(self, id):
        """Elimina un escaneo por su ID."""
        cursor = self.conn.cursor()
        cursor.execute('DELETE FROM escaneos WHERE id = ?', (id,))
        self.conn.commit()
