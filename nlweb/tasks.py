# -*- coding: utf-8 -*-

import os
import re
import time

from nlweb.app import celery
from nlweb import analysis

from nlweb.httpclient import HTTPClient, FileCache
from nlweb.image_utils import (download_images, resample_images,
                               fetch_collection_images)

from nlweb.models import MLModel, ModelTest, db

_collection_id_re = re.compile(r'collections\/([^/]+)?\/?$')


@celery.task(bind=True)
def train_model(self, mlmodel_id):
    mlmodel = MLModel.query.get(mlmodel_id)
    mlmodel.training_state = MLModel.TRAINING_PROGRESS
    db.session.commit()

    output_dir = os.path.join(celery.conf.MEDIA_ROOT, str(mlmodel.id))

    client = HTTPClient(cache=FileCache('cache'))

    target_data = mlmodel.input_data['data']

    image_list = download_images(client, target_data, output_dir)
    image_list = resample_images(image_list, output_dir)

    mlmodel.training_state = MLModel.TRAINING_SUCCESS

    tic = time.time()

    try:
        result = analysis.train_model(image_list,
                                      mlmodel.input_data['algorithm'],
                                      mlmodel.input_data['cv'],
                                      output_dir)
    except Exception as e:
        result = {'error': unicode(e)}
        mlmodel.training_state = MLModel.TRAINING_FAILURE

    result['duration'] = time.time() - tic

    mlmodel.output_data = result

    db.session.commit()


def filter_selected_images(image_ids, image_list):
    return [i for i in image_list if i['id'] in image_ids]


def add_collection_id_and_filename(image_list):
    return [dict(
        collection_id=_collection_id_re.search(image['collection']).group(1),
        filename=os.path.basename(image['file']),
        **image
    ) for image in image_list]


@celery.task(bind=True)
def test_model(self, model_test_id):
    model_test = ModelTest.query.get(model_test_id)
    model_test.state = ModelTest.STATE_PROGRESS
    db.session.commit()

    output_dir = os.path.join(celery.conf.MEDIA_ROOT, str(model_test.id))

    client = HTTPClient(cache=FileCache('cache'))

    mlmodel_id = int(model_test.input_data['modelId'])
    mlmodel = MLModel.query.get(mlmodel_id)

    if not mlmodel:
        raise Exception("Model #%s does not exist.", mlmodel_id)

    images_by_collections = model_test.input_data['selectedImages']

    image_list = []
    for collection_id, image_ids in images_by_collections.items():
        images = fetch_collection_images(collection_id)
        images = add_collection_id_and_filename(images['results'])
        image_list.extend(filter_selected_images(
            set(image_ids),
            images))

    image_list = download_images(client, image_list, output_dir)
    image_list = resample_images(image_list, output_dir)

    model_test.state = ModelTest.STATE_SUCCESS

    tic = time.time()

    mlmodel_dir = os.path.join(celery.conf.MEDIA_ROOT, str(mlmodel.id))
    weight_map_filename = os.path.join(mlmodel_dir,
                                       mlmodel.output_data['weightmap'])

    try:
        result = analysis.apply_mask(image_list,
                                     weight_map_filename,
                                     output_dir)
    except Exception as e:
        result = {'error': unicode(e)}
        model_test.state = ModelTest.STATE_FAILURE

    result['duration'] = time.time() - tic

    model_test.output_data = result

    db.session.commit()
