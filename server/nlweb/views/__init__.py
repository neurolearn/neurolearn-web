from flask import jsonify


def error(status, title):
    errors = [{
        'status': str(status),
        'title': title
    }]
    return jsonify(dict(errors=errors)), status


def not_found():
    return error(404, 'Not Found')
