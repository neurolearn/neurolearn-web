from __future__ import absolute_import

import uuid

from celery.result import AsyncResult

from flask import Blueprint, render_template, current_app
from flask import request, Response, send_from_directory
from flask import jsonify

from flask.ext.security import login_required, current_user

import requests

from nlweb import tasks
from nlweb.tasks import celery
from nlweb.extensions import uploaded_media

frontend = Blueprint('frontend', __name__)


def _render_index_template(**kwargs):
    import copy
    env = copy.copy(current_app.jinja_env)

    env.line_statement_prefix = '//#'
    env.line_comment_prefix = '//**'
    env.variable_start_string = 'JINJA_VALUE(/*'
    env.variable_end_string = '*/)'
    env.comment_start_string = '//{#'
    env.comment_end_string = '//#}'

    template = env.get_template('index.html')
    return template.render(**kwargs)


@frontend.route('/')
@login_required
def home():
    context = {
        'user': {'id': current_user.id}
    }
    return _render_index_template(**context)


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
    job = tasks.train_model.delay(args['data'],
                                  args['collection_id'],
                                  args['algorithm'])

    return jsonify({'jobid': job.id})


@frontend.route('/applymask', methods=['POST'])
def applymask():
    collection_id = request.form['collection_id']
    fs = request.files.values()[0]
    subfolder = str(uuid.uuid4())

    saved_filename = uploaded_media.save(fs, subfolder, name=fs.name)

    job = tasks.apply_mask.delay(
        collection_id, uploaded_media.path(saved_filename))

    return jsonify({'jobid': job.id})


@frontend.route('/status')
def task_status():
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
