# -*- coding: utf-8 -*-

import os

from nlweb.app import celery
from nlweb import analysis

# NTOTAL = 20
# for i in range(NTOTAL):
#     time.sleep(random.random())
#     celery.current_task.update_state(state='PROGRESS',
#                                      meta={'current': i, 'total': NTOTAL})
# return 999


@celery.task(bind=True)
def train_model(self, data, collection_id, algorithm):

    output_dir = os.path.join(celery.conf.MEDIA_ROOT, self.request.id)
    analysis.run_ml_analysis(data, collection_id, algorithm, output_dir)

    return 999


@celery.task(bind=True)
def apply_mask(self, collection_id, weightmap_filename):

    output_dir = os.path.join(celery.conf.MEDIA_ROOT, self.request.id)
    analysis.apply_mask(collection_id, weightmap_filename, output_dir)

    return 999
