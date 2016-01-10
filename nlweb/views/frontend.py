import requests

from flask import Blueprint, render_template, current_app
from flask import Response, send_from_directory

blueprint = Blueprint('frontend', __name__)


@blueprint.route('/')
def home():
    return render_template('index.html')


@blueprint.route('/about')
def about():
    return render_template('about.html')


@blueprint.route('/nvproxy/<path:path>')
def neurovault_proxy(path):
    proxy_url = "http://neurovault.org/%s" % path

    req = requests.get(proxy_url)

    return Response(req.text,
                    content_type=req.headers['content-type'])


@blueprint.route('/media/<path:path>')
def static_file(path):
    return send_from_directory(current_app.config['MEDIA_ROOT'], path)
