import sqlite3
from datetime import datetime


class WhoisDatabase:
    def __init__(self, nombre_db):
        self.conn = self._conectar(nombre_db)
        self._comprobar_tablas()

    def _conectar(self, nombre_db):
        """Conecta con la base de datos y crea tablas si no existen."""
        conn = sqlite3.connect(nombre_db)
        conn.execute("PRAGMA foreign_keys = ON;")
        return self.conn

    def desconectar(self):
        """Cierra la conexión con la base de datos."""
        if self.conn:
            self.conn.close()

    def _comprobar_tablas(self):
        cursor = self.conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='whois_records';")
        if cursor.fetchone() is None:
            self.crear_historial()

    def crear_historial(self):
        """Crea las tablas necesarias si no existen."""
        cursor = self.conn.cursor()
        if cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='whois_records';").fetchone() is None:
            self.crear_tabla_principal()
            self.crear_tabla_whois_xml()
            self.crear_tabla_reverse_whois()
            self.crear_tabla_domains_subdomains()

    def crear_tabla_principal(self):
        """Crea la tabla 'whois_records'."""
        cursor = self.conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS whois_records (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            name TEXT NOT NULL,
                            url TEXT NOT NULL,
                            fecha TEXT NOT NULL);''')
        self.conn.commit()

    def crear_tabla_whois_xml(self):
        """Crea la tabla 'whois_xml_records'."""
        cursor = self.conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS whois_xml_records (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            whois_record_id INTEGER NOT NULL,
                            fecha_creacion TEXT,
                            fecha_actualizacion TEXT,
                            fecha_expiracion TEXT,
                            registrante TEXT,
                            organizacion TEXT,
                            municipio TEXT,
                            pais TEXT,
                            codigo_de_pais TEXT,
                            contacto_admin_nombre TEXT,
                            contacto_admin_organizacion TEXT,
                            contacto_admin_municipio TEXT,
                            contacto_admin_pais TEXT,
                            FOREIGN KEY (whois_record_id) REFERENCES whois_records(id) ON DELETE CASCADE);''')
        self.conn.commit()

    def crear_tabla_reverse_whois(self):
        """Crea la tabla 'reverse_whois_records'."""
        cursor = self.conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS reverse_whois_records (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            whois_record_id INTEGER NOT NULL,
                            domains_count INTEGER,
                            domain TEXT,
                            FOREIGN KEY (whois_record_id) REFERENCES whois_records(id) ON DELETE CASCADE);''')
        self.conn.commit()

    def crear_tabla_domains_subdomains(self):
        """Crea la tabla 'domains_subdomains_records'."""
        cursor = self.conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS domains_subdomains_records (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            whois_record_id INTEGER NOT NULL,
                            domains_count INTEGER,
                            domain TEXT,
                            FOREIGN KEY (whois_record_id) REFERENCES whois_records(id) ON DELETE CASCADE);''')
        self.conn.commit()

    def insertar_datos_principal(self, name, url):
        """Inserta datos en la tabla 'whois_records'."""
        fecha_actual = datetime.now().isoformat()
        cursor = self.conn.cursor()
        cursor.execute('''INSERT INTO whois_records (name, url, fecha) VALUES (?, ?, ?)''', (name, url, fecha_actual))
        self.conn.commit()
        return cursor.lastrowid

    def insertar_datos_whois_xml(self, datos, whois_record_id):
        """Inserta datos en la tabla 'whois_xml_records'."""
        cursor = self.conn.cursor()

        def obtener_valor(key, default=""):
            return datos['whoisRecord'].get(key, default) if 'whoisRecord' in datos else default

        fecha_creacion = obtener_valor('fechaCreacion')
        fecha_actualizacion = obtener_valor('fechaActualizacion')
        fecha_expiracion = obtener_valor('fechaExpiracion')
        registrante = obtener_valor('registrante')
        organizacion = obtener_valor('organizacion')
        municipio = obtener_valor('municipio')
        pais = obtener_valor('pais')
        codigo_de_pais = obtener_valor('codigoDePais')

        contacto_admin_nombre = datos['contactoAdministrativo'].get('registrante', "") if 'contactoAdministrativo' in datos else ""
        contacto_admin_organizacion = datos['contactoAdministrativo'].get('organizacion', "") if 'contactoAdministrativo' in datos else ""
        contacto_admin_municipio = datos['contactoAdministrativo'].get('municipio', "") if 'contactoAdministrativo' in datos else ""
        contacto_admin_pais = datos['contactoAdministrativo'].get('pais', "") if 'contactoAdministrativo' in datos else ""

        cursor.execute('''INSERT INTO whois_xml_records (
                            whois_record_id, fecha_creacion, fecha_actualizacion, fecha_expiracion,
                            registrante, organizacion, municipio, pais, codigo_de_pais,
                            contacto_admin_nombre, contacto_admin_organizacion, contacto_admin_municipio,
                            contacto_admin_pais)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''', (whois_record_id, fecha_creacion, fecha_actualizacion, fecha_expiracion,
                                                                                registrante, organizacion, municipio, pais, codigo_de_pais,
                                                                                contacto_admin_nombre, contacto_admin_organizacion,
                                                                                contacto_admin_municipio, contacto_admin_pais))
        self.conn.commit()

    def insertar_datos_reverse_whois(self, datos, whois_record_id):
        """Inserta datos en la tabla 'reverse_whois_records'."""
        cursor = self.conn.cursor()
        for dominio in datos['domainsList']:
            cursor.execute('''INSERT INTO reverse_whois_records (whois_record_id, domains_count, domain) VALUES (?, ?, ?)''',
                           (whois_record_id, datos['domainsCount'], dominio))
        self.conn.commit()

    def insertar_datos_domains_subdomains(self, datos, whois_record_id):
        """Inserta datos en la tabla 'domains_subdomains_records'."""
        cursor = self.conn.cursor()
        for dominio in datos['domainsList']:
            cursor.execute('''INSERT INTO domains_subdomains_records (whois_record_id, domains_count, domain) VALUES (?, ?, ?)''',
                           (whois_record_id, datos['domainsCount'], dominio))
        self.conn.commit()

    def buscar_datos_principal(self, name):
        """Busca datos en la tabla 'whois_records'."""
        cursor = self.conn.cursor()
        cursor.execute('''SELECT * FROM whois_records WHERE name LIKE ?''', (name,))
        return cursor.fetchone()

    def get_datos_principales(self):
        """Obtiene todos los datos de la tabla 'whois_records'."""
        cursor = self.conn.cursor()
        cursor.execute('''SELECT * FROM whois_records''')
        return cursor.fetchall()

    def get_datos_detallados(self, id):
        """Obtiene los datos detallados de varias tablas relacionadas."""
        cursor = self.conn.cursor()
        cursor.execute('''SELECT
                            wr.id AS whois_record_id, wr.name AS whois_name, wr.url AS whois_url,
                            wr.fecha AS whois_fecha, wxr.fecha_creacion AS xml_fecha_creacion,
                            wxr.fecha_actualizacion AS xml_fecha_actualizacion, wxr.fecha_expiracion AS xml_fecha_expiracion,
                            wxr.registrante AS xml_registrante, wxr.organizacion AS xml_organizacion,
                            wxr.municipio AS xml_municipio, wxr.pais AS xml_pais, wxr.codigo_de_pais AS xml_codigo_de_pais,
                            wxr.contacto_admin_nombre AS xml_contacto_admin_nombre,
                            wxr.contacto_admin_organizacion AS xml_contacto_admin_organizacion,
                            wxr.contacto_admin_municipio AS xml_contacto_admin_municipio,
                            wxr.contacto_admin_pais AS xml_contacto_admin_pais,
                            GROUP_CONCAT(DISTINCT rwr.domain) AS reverse_domains,
                            GROUP_CONCAT(DISTINCT dsr.domain) AS subdomains
                        FROM
                            whois_records wr
                        LEFT JOIN whois_xml_records wxr ON wr.id = wxr.whois_record_id
                        LEFT JOIN reverse_whois_records rwr ON wr.id = rwr.whois_record_id
                        LEFT JOIN domains_subdomains_records dsr ON wr.id = dsr.whois_record_id
                        WHERE wr.id = ?
                        GROUP BY wr.id, wxr.id;''', (id,))

        rows = cursor.fetchall()
        columns = [column[0] for column in cursor.description]
        results = []
        for row in rows:
            row_dict = dict(zip(columns, row))
            row_dict['reverse_domains'] = row_dict['reverse_domains'].split(', ') if row_dict['reverse_domains'] else []
            row_dict['subdomains'] = row_dict['subdomains'].split(', ') if row_dict['subdomains'] else []
            results.append(row_dict)

        return results
