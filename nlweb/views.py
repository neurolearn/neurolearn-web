from flask import Blueprint, render_template
from flask import request, Response
from flask import jsonify

import requests

from nlweb.tasks import run_analysis

frontend = Blueprint('frontend', __name__)


@frontend.route('/')
def home():
    return render_template('index.html')


@frontend.route('/about')
def about():
    return render_template('about.html')


@frontend.route('/nvproxy/<path:path>')
def neurovault_proxy(path):
    print path

    proxy_url = "http://neurovault.org/%s" % path

    req = requests.get(proxy_url)
    # import ipdb; ipdb.set_trace()

    return Response(req.text,
                    content_type=req.headers['content-type'])


@frontend.route('/analysis/<algorithm>', methods=['POST'])
def analysis(algorithm):
    job = run_analysis.delay(1)

    return jsonify({'jobid': job.id})


@frontend.route('/analysis/status')
def analysis_status():
    jobid = request.values.get('jid')

    return jsonify({'jobid': jobid})
