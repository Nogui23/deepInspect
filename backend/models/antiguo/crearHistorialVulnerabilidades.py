import sqlite3
import json
from datetime import datetime


class PortDatabase:
    def __init__(self, nombre_db):
        """Inicializa la base de datos y crea las tablas si no existen."""
        self.conn = self._conectar_db(nombre_db)
        self._crear_historial()

    def _conectar_db(self, nombre_db):
        """Conecta con la base de datos y habilita claves foráneas."""
        conn = sqlite3.connect(nombre_db)
        conn.execute("PRAGMA foreign_keys = ON;")
        return conn

    def desconectar(self):
        """Cierra la conexión a la base de datos."""
        if self.conn:
            self.conn.close()

    def _crear_historial(self):
        """Verifica si las tablas existen y las crea si es necesario."""
        cursor = self.conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='port_records';")
        if cursor.fetchone() is None:
            self._crear_tablas()

    def _crear_tablas(self):

        """Crea las tablas principales de la base de datos."""
        cursor = self.conn.cursor()

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS port_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ip TEXT NOT NULL,
                fecha TEXT NOT NULL
            );
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS ports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                port_record_id INTEGER NOT NULL,
                puerto TEXT NOT NULL,
                conf TEXT,
                cpe TEXT,
                extrainfo TEXT,
                name TEXT,
                product TEXT,
                reason TEXT,
                script TEXT,
                state TEXT,
                version TEXT,
                FOREIGN KEY (port_record_id) REFERENCES port_records(id) ON DELETE CASCADE
            );
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS cve_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                puerto_id INTEGER NOT NULL,
                cve_id TEXT NOT NULL,
                title TEXT,
                description TEXT,
                reference_link TEXT,
                published TEXT,
                cvss_score TEXT,
                cvss3_score TEXT,
                last_seen TEXT,
                modified TEXT,
                FOREIGN KEY (puerto_id) REFERENCES ports(id) ON DELETE CASCADE
            );
        ''')

        self.conn.commit()

    def insertar_port_record(self, ip):
        """Inserta un registro de escaneo de puertos."""
        fecha_actual = datetime.now().isoformat()
        cursor = self.conn.cursor()
        cursor.execute("INSERT INTO port_records (ip, fecha) VALUES (?, ?)", (ip, fecha_actual))
        self.conn.commit()

        return cursor.lastrowid

    def insertar_puerto(self, port_record_id, puerto_data):
        """Inserta información sobre un puerto."""
        cursor = self.conn.cursor()
        script_json = json.dumps(puerto_data.get('script', {}))

        cursor.execute('''
            INSERT INTO ports (
                port_record_id, puerto, conf, cpe, extrainfo, name, product, reason,
                script, state, version
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        ''', (
            port_record_id,
            puerto_data.get('puerto', ''),
            puerto_data.get('conf', ''),
            puerto_data.get('cpe', ''),
            puerto_data.get('extrainfo', ''),
            puerto_data.get('name', ''),
            puerto_data.get('product', ''),
            puerto_data.get('reason', ''),
            script_json,
            puerto_data.get('state', ''),
            puerto_data.get('version', '')
        ))
        self.conn.commit()
        return cursor.lastrowid

    def insertar_cve(self, puerto_id, cve_data):
        """Inserta un CVE relacionado con un puerto."""
        cursor = self.conn.cursor()
        cursor.execute('''
            INSERT INTO cve_data (
                puerto_id, cve_id, title, description, reference_link, published,
                cvss_score, cvss3_score, last_seen, modified
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        ''', (
            puerto_id,
            cve_data.get('CVE_ID', ''),
            cve_data.get('Title', ''),
            cve_data.get('Description', ''),
            cve_data.get('References', ''),
            cve_data.get('Published', ''),
            json.dumps(cve_data.get('CVSS_Score', {})),
            json.dumps(cve_data.get('CVSS3_Score', {})),
            cve_data.get('Last_Seen', ''),
            cve_data.get('Modified', '')
        ))
        self.conn.commit()

    def buscar_por_ip(self, ip):
        """Busca registros por IP."""
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM port_records WHERE ip LIKE ?", (ip,))
        return cursor.fetchone()

    def obtener_todos_los_registros(self):
        """Devuelve todos los registros de escaneo."""
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM port_records")
        return cursor.fetchall()

    def obtener_detalles_por_id(self, record_id) -> str:
        """Devuelve los detalles de un escaneo, incluyendo puertos y CVEs."""
        cursor = self.conn.cursor()
        query = '''
        SELECT
            pr.id AS port_record_id,
            pr.ip AS ip_address,
            pr.fecha AS fecha,
            p.id AS port_id,
            p.puerto AS puerto,
            p.conf AS conf,
            p.cpe AS cpe,
            p.extrainfo AS extrainfo,
            p.name AS name,
            p.product AS product,
            p.reason AS reason,
            p.script AS script,
            p.state AS state,
            p.version AS version,
            cve.id AS cve_entry_id,
            cve.cve_id AS cve_identifier,
            cve.title AS cve_title,
            cve.description AS cve_description,
            cve.reference_link AS reference_link,
            cve.published AS published_date,
            cve.cvss_score AS cvss_score,
            cve.cvss3_score AS cvss3_score,
            cve.last_seen AS last_seen,
            cve.modified AS modified
        FROM
            port_records pr
        LEFT JOIN
            ports p ON pr.id = p.port_record_id
        LEFT JOIN
            cve_data cve ON p.id = cve.puerto_id
        WHERE
            pr.id = ?;
        '''
        cursor.execute(query, (record_id,))
        rows = cursor.fetchall()

        if not rows:
            return ""

        columns = [col[0] for col in cursor.description]
        ip_data = None
        puerto_dict = {}

        for row in rows:
            row_data = dict(zip(columns, row))

            if ip_data is None:
                ip_data = {
                    "ip": row_data["ip_address"],
                    "fecha": row_data["fecha"],
                    "puertos": []
                }

            port_id = row_data["port_id"]
            if port_id not in puerto_dict:
                puerto_dict[port_id] = {
                    "puerto": row_data["puerto"],
                    "conf": row_data["conf"],
                    "cpe": row_data["cpe"],
                    "extrainfo": row_data["extrainfo"],
                    "name": row_data["name"],
                    "product": row_data["product"],
                    "reason": row_data["reason"],
                    "script": row_data["script"],
                    "state": row_data["state"],
                    "version": row_data["version"],
                    "cves": []
                }
                ip_data["puertos"].append(puerto_dict[port_id])

            if row_data["cve_identifier"]:
                puerto_dict[port_id]["cves"].append({
                    "cve_id": row_data["cve_identifier"],
                    "title": row_data["cve_title"],
                    "description": row_data["cve_description"],
                    "reference_link": row_data["reference_link"],
                    "published_date": row_data["published_date"],
                    "cvss_score": row_data["cvss_score"],
                    "cvss3_score": row_data["cvss3_score"],
                    "last_seen": row_data["last_seen"],
                    "modified": row_data["modified"]
                })

        return json.dumps(ip_data, indent=4)
