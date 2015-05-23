# -*- coding: utf-8 -*-

import os

from nlweb.app import celery
from analysis import run_ml_analysis

# NTOTAL = 20
# for i in range(NTOTAL):
#     time.sleep(random.random())
#     celery.current_task.update_state(state='PROGRESS',
#                                      meta={'current': i, 'total': NTOTAL})
# return 999


@celery.task(bind=True)
def run_analysis(self, data, collection_id, algorithm):

    output_dir = os.path.join('./nv_tmp', self.request.id)
    run_ml_analysis(data, collection_id, algorithm, output_dir)

    return 999
