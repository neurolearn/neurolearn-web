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

    output_dir = os.path.join(celery.conf.MEDIA_ROOT, self.request.id)
    run_ml_analysis(data, collection_id, algorithm, output_dir)

    return 999


@celery.task(bind=True)
def run_test_analysis(self):
    import imp
    test_data = imp.load_source('test_data', './tests/nv_test_data.py')

    print self

    output_dir = os.path.join(celery.conf.MEDIA_ROOT,
                              'test_%s' % test_data.ALGORITHM)
    run_ml_analysis(test_data.DATA,
                    test_data.COLLECTION_ID,
                    test_data.ALGORITHM,
                    output_dir)
