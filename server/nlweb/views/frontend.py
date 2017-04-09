import requests

from flask import Blueprint, render_template, current_app, request
from flask import Response, send_from_directory, redirect

blueprint = Blueprint('frontend', __name__)


def browser_supported(request):
    browser = request.user_agent.browser
    try:
        version = (request.user_agent.version
                   and int(request.user_agent.version.split('.')[0]))
        if browser == 'msie' and version < 11:
            return False
    except ValueError:
        return False
    return True


@blueprint.route('/')
@blueprint.route('/faq')
@blueprint.route('/dashboard/<path:path>')
@blueprint.route('/explore/<path:path>')
@blueprint.route('/models/<path:path>')
@blueprint.route('/tests/<path:path>')
def home(path=None):
    if not browser_supported(request):
        return redirect('/notsupported.html')

    return render_template('index.html')


@blueprint.route('/notsupported.html')
def notsupported():
    return render_template('notsupported.html')


@blueprint.route('/nvproxy/<path:path>')
def neurovault_proxy(path):
    proxy_url = "http://neurovault.org/%s" % path
    req = requests.get(proxy_url, params=request.args.to_dict())

    return Response(req.text,
                    content_type=req.headers['content-type'])


@blueprint.route('/media/<path:path>')
def static_file(path):
    return send_from_directory(current_app.config['MEDIA_ROOT'], path)
