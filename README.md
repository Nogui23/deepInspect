# DeepInspect - Trabajo de Fin de Grado / Final Degree Project

---

## Español

### Descripción

**DeepInspect** es una herramienta web de ciberseguridad desarrollada como Trabajo de Fin de Grado que permite investigar, escanear y analizar dominios e infraestructuras digitales. La aplicación ofrece análisis precisos mediante técnicas de WHOIS, mapeo de redes y detección de vulnerabilidades.

### Características Principales

- **Búsqueda de Activos (WHOIS)**: Consulta información detallada sobre dominios incluyendo registrante, fechas de registro, servidor DNS, entre otros.
- **Escaneo de Puertos**: Utiliza Nmap para escanear puertos abiertos en direcciones IP, identificando servicios y versiones.
- **Análisis de Vulnerabilidades**: Detecta CVEs (Common Vulnerabilities and Exposures) asociados a los servicios encontrados mediante la integración con Nmap y VulnHub.
- **Exportación de Datos**: Permite exportar los resultados a formato CSV para su análisis posterior.
- **Gestión de Usuarios**: Sistema de autenticación con registro, login y logout.

### Tecnologías

#### Frontend
- **Next.js 15** - Framework React para producción
- **React 19** - Biblioteca de interfaces de usuario
- **Tailwind CSS 3.4** - Framework de estilosCSS
- **Radix UI** - Componentes UI accesibles
- **Recharts** - Librería para gráficos
- **Lucide React** - Iconos
- **Motion** - Animaciones
- **date-fns** - Utilidades de fechas
- **Sonner** - Notificaciones toast
- **TanStack Table** - Tablas interactivas

#### Backend
- **Flask** - Framework web Python
- **Flask-CORS** - Manejo de CORS
- **Flask-Session** - Gestión de sesiones
- **SQLAlchemy** - ORM para base de datos
- **Python Whois** - Consultas WHOIS
- **python-nmap** - Wrapper Python para Nmap
- **Cachelib** - Sistema de caché

#### Base de Datos
- **SQLite** - Base de datos relacional (desarrollo)

### Estructura del Proyecto

```
TFGR25/
├── frontend/                 # Aplicación Next.js
│   ├── app/                  # Páginas y rutas
│   │   ├── login/           # Página de login
│   │   ├── register/        # Página de registro
│   │   ├── busqueda-de-activos/  # Búsqueda WHOIS
│   │   └── escaneo-de-vulnerabilidades/  # Escaneo Nmap
│   ├── components/           # Componentes React
│   │   └── ui/              # Componentes UI (Radix)
│   ├── public/              # Archivos estáticos
│   └── package.json        # Dependencias frontend
│
├── backend/                  # Aplicación Flask
│   ├── app.py              # Aplicación principal
│   ├── config.py           # Configuración
│   ├── routes/             # Rutas API
│   ├── controllers/       # Lógica de negocio
│   ├── models/             # Modelos SQLAlchemy
│   ├── middleware/         # Middleware de autenticación
│   ├── utils/              # Utilidades
│   ├── database/           # Configuración de BD
│   └── test/               # Pruebas HTTP
│
└── README.md
```

### Requisitos Previos

- **Node.js** 18.x o superior
- **Python** 3.8 o superior
- **Nmap** instalado en el sistema (para escaneos de puertos)
- **pip** (gestor de paquetes Python)

### Instalación

#### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd TFGR25
```

#### 2. Configurar el Backend

```bash
cd backend

# Crear entorno virtual (opcional pero recomendado)
python -m venv venv
# En Windows:
venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

#### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `backend/` con las siguientes variables:

```env
# Clave secreta para sesiones (genera una cadena aleatoria segura)
SECRET_KEY=tu_clave_secreta_aqui

# URL de la base de datos (opcional, usa SQLite por defecto)
DEV_DATABASE_URL=sqlite:///dev.db

# Configuración de producción (opcional)
DATABASE_URL=postgresql://user:password@localhost/deepinspect
```

**Nota**: La variable `SECRET_KEY` es obligatoria para el funcionamiento de las sesiones.

#### 4. Configurar el Frontend

```bash
cd frontend

# Instalar dependencias
npm install
```

### Ejecución

#### Iniciar el Backend

```bash
cd backend
python app.py
```

El backend se ejecutará en `http://localhost:5000`

#### Iniciar el Frontend

```bash
cd frontend
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Uso de la Aplicación

#### 1. Registro e Inicio de Sesión
- Accede a `/register` para crear una cuenta
- Usa `/login` para autenticarte

#### 2. Búsqueda de Activos (WHOIS)
- Navega a `/busqueda-de-activos`
- Ingresa un dominio (ej: example.com)
- Visualiza información WHOIS del dominio

#### 3. Escaneo de Vulnerabilidades
- Navega a `/escaneo-de-vulnerabilidades`
- Ingresa una dirección IP
- Ejecuta el escaneo de puertos
- Consulta los CVEs asociados a cada servicio

#### 4. Exportación de Datos
- En las páginas de resultados, usa el botón de exportación CSV

### API Endpoints

#### Usuarios
- `POST /usuarios/crear` - Registrar usuario
- `POST /usuarios/login` - Iniciar sesión
- `POST /usuarios/logout` - Cerrar sesión
- `GET /usuarios` - Obtener usuario actual
- `DELETE /usuarios/` - Eliminar cuenta

#### WHOIS
- `POST /whois/createActiveSearch` - Crear búsqueda de activos
- `GET /whois/getAll` - Obtener todas las búsquedas
- `GET /whois/get/<id>` - Obtener búsqueda por ID
- `GET /whois/export-csv/<id>` - Exportar a CSV

#### Nmap
- `POST /nmap/searchPorts` - Escanear puertos de una IP
- `GET /nmap/getPorts` - Obtener todos los puertos escaneados
- `GET /nmap/getPort/<id>` - Obtener puerto por ID
- `GET /nmap/export-csv/<id>` - Exportar vulnerabilidades a CSV

### Notas Importantes

1. **Nmap**: Debes tener Nmap instalado en el sistema para los escaneos de puertos.
2. **Seguridad**: En producción, cambia la `SECRET_KEY` y usa una base de datos más robusta.
3. **CORS**: La configuración actual permite conexiones desde `http://localhost:3000`.
4. **Sesiones**: Las sesiones se almacenan en el sistema de archivos en `backend/flask_session/`.

---

## English

### Description

**DeepInspect** is a cybersecurity web tool developed as a Final Degree Project that allows you to investigate, scan, and analyze digital domains and infrastructure. The application offers accurate analysis through WHOIS techniques, network mapping, and vulnerability detection.

### Main Features

- **Asset Search (WHOIS)**: Query detailed information about domains including registrant, registration dates, DNS server, and more.
- **Port Scanning**: Use Nmap to scan open ports on IP addresses, identifying services and versions.
- **Vulnerability Analysis**: Detect CVEs (Common Vulnerabilities and Exposures) associated with found services through integration with Nmap and VulnHub.
- **Data Export**: Export results to CSV format for further analysis.
- **User Management**: Authentication system with registration, login, and logout.

### Technologies

#### Frontend
- **Next.js 15** - React framework for production
- **React 19** - User interface library
- **Tailwind CSS 3.4** - CSS framework
- **Radix UI** - Accessible UI components
- **Recharts** - Charting library
- **Lucide React** - Icons
- **Motion** - Animations
- **date-fns** - Date utilities
- **Sonner** - Toast notifications
- **TanStack Table** - Interactive tables

#### Backend
- **Flask** - Python web framework
- **Flask-CORS** - CORS handling
- **Flask-Session** - Session management
- **SQLAlchemy** - Database ORM
- **Python Whois** - WHOIS queries
- **python-nmap** - Python wrapper for Nmap
- **Cachelib** - Caching system

#### Database
- **SQLite** - Relational database (development)

### Project Structure

```
TFGR25/
├── frontend/                 # Next.js application
│   ├── app/                  # Pages and routes
│   │   ├── login/           # Login page
│   │   ├── register/        # Registration page
│   │   ├── busqueda-de-activos/  # WHOIS search
│   │   └── escaneo-de-vulnerabilidades/  # Nmap scanning
│   ├── components/           # React components
│   │   └── ui/              # UI components (Radix)
│   ├── public/              # Static files
│   └── package.json        # Frontend dependencies
│
├── backend/                  # Flask application
│   ├── app.py              # Main application
│   ├── config.py           # Configuration
│   ├── routes/             # API routes
│   ├── controllers/       # Business logic
│   ├── models/             # SQLAlchemy models
│   ├── middleware/        # Authentication middleware
│   ├── utils/             # Utilities
│   ├── database/          # Database configuration
│   └── test/              # HTTP tests
│
└── README.md
```

### Prerequisites

- **Node.js** 18.x or higher
- **Python** 3.8 or higher
- **Nmap** installed on the system (for port scanning)
- **pip** (Python package manager)

### Installation

#### 1. Clone the repository

```bash
git clone <repository-url>
cd TFGR25
```

#### 2. Configure the Backend

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### 3. Configure Environment Variables

Create a `.env` file in the `backend/` folder with the following variables:

```env
# Secret key for sessions (generate a secure random string)
SECRET_KEY=your_secret_key_here

# Database URL (optional, uses SQLite by default)
DEV_DATABASE_URL=sqlite:///dev.db

# Production configuration (optional)
DATABASE_URL=postgresql://user:password@localhost/deepinspect
```

**Note**: The `SECRET_KEY` variable is required for session functionality.

#### 4. Configure the Frontend

```bash
cd frontend

# Install dependencies
npm install
```

### Running the Application

#### Start the Backend

```bash
cd backend
python app.py
```

The backend will run on `http://localhost:5000`

#### Start the Frontend

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000`

### Using the Application

#### 1. Registration and Login
- Access `/register` to create an account
- Use `/login` to authenticate

#### 2. Asset Search (WHOIS)
- Navigate to `/busqueda-de-activos`
- Enter a domain (e.g., example.com)
- View WHOIS information for the domain

#### 3. Vulnerability Scanning
- Navigate to `/escaneo-de-vulnerabilidades`
- Enter an IP address
- Run the port scan
- View CVEs associated with each service

#### 4. Data Export
- On the results pages, use the CSV export button

### API Endpoints

#### Users
- `POST /usuarios/crear` - Register user
- `POST /usuarios/login` - Login
- `POST /usuarios/logout` - Logout
- `GET /usuarios` - Get current user
- `DELETE /usuarios/` - Delete account

#### WHOIS
- `POST /whois/createActiveSearch` - Create asset search
- `GET /whois/getAll` - Get all searches
- `GET /whois/get/<id>` - Get search by ID
- `GET /whois/export-csv/<id>` - Export to CSV

#### Nmap
- `POST /nmap/searchPorts` - Scan ports on an IP
- `GET /nmap/getPorts` - Get all scanned ports
- `GET /nmap/getPort/<id>` - Get port by ID
- `GET /nmap/export-csv/<id>` - Export vulnerabilities to CSV

### Important Notes

1. **Nmap**: You must have Nmap installed on the system for port scanning.
2. **Security**: In production, change the `SECRET_KEY` and use a more robust database.
3. **CORS**: The current configuration allows connections from `http://localhost:3000`.
4. **Sessions**: Sessions are stored in the file system at `backend/flask_session/`.

---

## Licencia / License

Este proyecto es para fines educativos - Trabajo de Fin de Grado.

This project is for educational purposes - Final Degree Project.
