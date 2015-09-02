# -*- coding: utf-8 -*-

import os

from nlweb.app import celery
from nlweb import analysis

from nlweb.httpclient import HTTPClient, FileCache
from nlweb.image_utils import (download_images, resample_images,
                               fetch_collection_images)

from nlweb.models import MLModel, db

# NTOTAL = 20
# for i in range(NTOTAL):
#     time.sleep(random.random())
#     celery.current_task.update_state(state='PROGRESS',
#                                      meta={'current': i, 'total': NTOTAL})
# return 999


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

    try:
        result = analysis.train_model(image_list,
                                      mlmodel.input_data['algorithm'],
                                      output_dir)
    except Exception as e:
        result = {'error': unicode(e)}
        mlmodel.training_state = MLModel.TRAINING_FAILURE

    mlmodel.output_data = result
    db.session.commit()


@celery.task(bind=True)
def apply_mask(self, collection_id, weightmap_filename):

    output_dir = os.path.join(celery.conf.MEDIA_ROOT, self.request.id)
    analysis.apply_mask(collection_id, weightmap_filename, output_dir)

    return 999
