# -*- coding: utf-8 -*-

import os
import time

from nlweb.app import celery
from nlweb import analysis

from nlweb.httpclient import HTTPClient, FileCache
from nlweb.image_utils import (download_images, resample_images,
                               fetch_collection,
                               fetch_collection_images)

from nlweb.models import MLModel, ModelTest, db
from nlweb.utils import pick


ALLOWED_COLLECTION_PROPS = ('id', 'name')


def model_dir(model_id):
    return os.path.join(celery.conf.MEDIA_ROOT, str(model_id))


@celery.task(bind=True)
def train_model(self, mlmodel_id):
    mlmodel = MLModel.query.get(mlmodel_id)
    mlmodel.training_state = MLModel.TRAINING_PROGRESS
    db.session.commit()

    output_dir = model_dir(mlmodel.id)

    cache = FileCache(celery.conf.FILE_CACHE_ROOT)
    client = HTTPClient(cache)

    target_data = mlmodel.input_data['data']

    image_list = download_images(client, target_data, output_dir)
    image_list = resample_images(cache, image_list, output_dir)

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

    if 'error' not in result:
        create_glassbrain_image(mlmodel_id)


def filter_selected_images(image_ids, image_list):
    return [i for i in image_list if i['id'] in image_ids]


def add_filename(image_list):
    return [dict(
        filename=os.path.basename(image['file']),
        **image
    ) for image in image_list]


def fetch_collections(ids):
    return {cid: pick(fetch_collection(cid), *ALLOWED_COLLECTION_PROPS)
            for cid in ids}


@celery.task(bind=True)
def test_model(self, model_test_id):
    model_test = ModelTest.query.get(model_test_id)
    model_test.state = ModelTest.STATE_PROGRESS
    db.session.commit()

    output_dir = os.path.join(celery.conf.MEDIA_ROOT, str(model_test.id))

    cache = FileCache(celery.conf.FILE_CACHE_ROOT)
    client = HTTPClient(cache)

    mlmodel_id = int(model_test.input_data['modelId'])
    mlmodel = MLModel.query.get(mlmodel_id)

    if not mlmodel:
        raise Exception("Model #%s does not exist.", mlmodel_id)

    images_by_collections = model_test.input_data['selectedImages']

    collections = fetch_collections(images_by_collections.keys())

    image_list = []
    for collection_id, image_ids in images_by_collections.items():
        images = fetch_collection_images(collection_id)
        images = add_filename(images['results'])
        image_list.extend(filter_selected_images(
            set(image_ids),
            images))

    image_list = download_images(client, image_list, output_dir)
    image_list = resample_images(cache, image_list, output_dir)

    model_test.state = ModelTest.STATE_SUCCESS

    tic = time.time()

    mlmodel_dir = os.path.join(celery.conf.MEDIA_ROOT, str(mlmodel.id))
    weight_map_filename = os.path.join(mlmodel_dir,
                                       mlmodel.output_data['weightmap'])

    try:
        result = analysis.apply_mask(image_list,
                                     weight_map_filename)
    except Exception as e:
        result = {'error': unicode(e)}
        model_test.state = ModelTest.STATE_FAILURE

    result['duration'] = time.time() - tic
    result['collections'] = collections

    model_test.output_data = result

    db.session.commit()


@celery.task(bind=True)
def create_glassbrain_image(self, mlmodel_id):
    from nilearn.plotting import plot_glass_brain
    import pylab as plt

    model = MLModel.query.get(mlmodel_id)
    if not model:
        return

    my_dpi = 50
    fig = plt.figure(figsize=(330.0/my_dpi, 130.0/my_dpi), dpi=my_dpi)

    output_dir = model_dir(mlmodel_id)
    stat_map_img = os.path.join(output_dir, model.output_data['weightmap'])

    glass_brain = plot_glass_brain(stat_map_img, figure=fig)

    glass_brain_filename = 'glassbrain.png'
    glass_brain_path = os.path.join(output_dir, glass_brain_filename)
    glass_brain.savefig(glass_brain_path, dpi=my_dpi)

    model.output_data = dict(glassbrain=glass_brain_filename,
                             **model.output_data)
    db.session.commit()
