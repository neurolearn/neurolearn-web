from __future__ import absolute_import

import uuid

from celery.result import AsyncResult

from flask import Blueprint, render_template, current_app
from flask import request, Response, send_from_directory
from flask import jsonify, abort

from flask_jwt import jwt_required, current_user

import requests

from nlweb import tasks
from nlweb.tasks import celery
from nlweb.extensions import uploaded_media

from .models import db, MLModel

from .marshal import (marshal_list, as_integer, as_is,
                      as_string, as_iso_date, filter_out_key)

frontend = Blueprint('frontend', __name__)


@frontend.route('/')
def home():
    return render_template('index.html')


@frontend.route('/about')
def about():
    return render_template('about.html')


@frontend.route('/nvproxy/<path:path>')
def neurovault_proxy(path):
    proxy_url = "http://neurovault.org/%s" % path

    req = requests.get(proxy_url)

    return Response(req.text,
                    content_type=req.headers['content-type'])


@frontend.route('/mlmodels', methods=['GET'])
@jwt_required()
def list_mlmodels():
    mfields = {
        'id': as_integer,
        'name': as_string,
        'created': as_iso_date,
        'training_state': as_string,
        'output_data': as_is,
        'input_data': filter_out_key('data')
    }

    mlmodel_list = MLModel.get_existing().filter(
        MLModel.user == current_user).order_by('created desc').all()

    return jsonify(marshal_list(mlmodel_list, mfields))


@frontend.route('/mlmodels', methods=['POST'])
@jwt_required()
def create_mlmodel():
    args = request.json
    cv = args['cv']
    # XXX: move to Schematics
    cv['value'] = int(cv['value'])

    mlmodel = MLModel(status=MLModel.STATUS_PUBLIC,
                      training_state=MLModel.TRAINING_QUEUED,
                      input_data={'data': args['data'],
                                  'algorithm': args['algorithm'],
                                  'cv': args['cv']},
                      name=args['name'],
                      user=current_user)
    db.session.add(mlmodel)
    db.session.commit()

    tasks.train_model.delay(mlmodel.id)

    return 'Created', 201


@frontend.route('/mlmodels/<int:model_id>', methods=['DELETE'])
@jwt_required()
def delete_mlmodel(model_id):
    mlmodel = MLModel.query.get_or_404(model_id)

    if mlmodel.user != current_user:
        abort(404)

    mlmodel.delete()
    db.session.commit()

    return 'No Content', 204


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
