from __future__ import absolute_import

import os

from celery.result import AsyncResult

from flask import Blueprint, render_template, current_app
from flask import request, Response, send_from_directory
from flask import jsonify

import requests

from nlweb.tasks import run_analysis, run_test_analysis, celery

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


@frontend.route('/analysis', methods=['POST'])
def analysis():
    args = request.json
    print "Received", args

    job = run_analysis.delay(args['data'],
                             args['collection_id'],
                             args['algorithm'])

    return jsonify({'jobid': job.id})


@frontend.route('/test-analysis', methods=['POST'])
def test_analysis():
    job = run_test_analysis.delay()

    return jsonify({'jobid': job.id})


@frontend.route('/analysis/status')
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
        elif job.state == 'FAILURE':
            return jsonify(dict(
                state=job.state,
                message=str(job.result)
            ))

    return jsonify({'jobid': jobid})


@frontend.route('/media/<path:path>')
def static_file(path):
    return send_from_directory(current_app.config['MEDIA_ROOT'], path)
