import os


class Config:
    """Configuración base común a todos los entornos"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'clave_secreta_predeterminada'
    DEBUG = False
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Evita advertencias innecesarias en SQLAlchemy


class DevelopmentConfig(Config):
    """Configuración para el entorno de desarrollo"""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_DATABASE_URL') or 'sqlite:///dev.db'


class TestingConfig(Config):
    """Configuración para el entorno de pruebas"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URL') or 'sqlite:///test.db'


class ProductionConfig(Config):
    """Configuración para el entorno de producción"""
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///prod.db'
    DEBUG = False
