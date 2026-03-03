from flask import session, jsonify
from functools import wraps


def auth_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'userId' not in session:
            return jsonify({"mensaje": "No autorizado"}), 401
        return f(*args, **kwargs)
    return decorated_function
