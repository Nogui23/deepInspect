from flask import Flask
from flask_cors import CORS
from flask_session import Session  # type: ignore
from routes.usuario_routes import usuario_bp
from routes.nmap_routes import nmap_bp
from routes.whois_routes import whois_bp
import os
from cachelib.file import FileSystemCache  # type: ignore


def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
    app.secret_key = os.getenv("SECRET_KEY")

    app.register_blueprint(usuario_bp)
    app.register_blueprint(nmap_bp)
    app.register_blueprint(whois_bp)

    app.config["SESSION_PERMANENT"] = False
    app.config["SESSION_TYPE"] = "filesystem"
    app.config["SESSION_FILE_DIR"] = os.path.join(os.getcwd(), "flask_session")
    app.config["SESSION_FILE_THRESHOLD"] = 500
    app.config["SESSION_USE_SIGNER"] = True
    app.config['SESSION_FILE_MODE'] = 0o600

    app.config["SESSION_FILESYSTEM"] = FileSystemCache(
        app.config["SESSION_FILE_DIR"],
        threshold=app.config["SESSION_FILE_THRESHOLD"],
        mode=app.config["SESSION_FILE_MODE"]
    )

    Session(app)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', debug=True)
