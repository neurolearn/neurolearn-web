from __future__ import absolute_import

from celery.result import AsyncResult

from flask import Blueprint, render_template
from flask import request, Response
from flask import jsonify

import requests

from nlweb.tasks import run_analysis, celery

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

    return Response(req.text,
                    content_type=req.headers['content-type'])


@frontend.route('/analysis/<algorithm>', methods=['POST'])
def analysis(algorithm):
    data = request.json()
    print "Received", data
    job = run_analysis.delay(data)

    return jsonify({'jobid': job.id})


@frontend.route('/analysis-status')
def analysis_status():
    jobid = request.args.get('jobid')
    if jobid:

        job = AsyncResult(jobid, app=celery)
        print job.state
        print job.result
        if job.state == 'PROGRESS':
            return jsonify(dict(
                state=job.state,
                progress=job.result['current']*1.0/job.result['total'],
            ))
        elif job.state == 'SUCCESS':
            return jsonify(dict(
                state=job.state,
                progress=1.0,
            ))

    return jsonify({'jobid': jobid})
