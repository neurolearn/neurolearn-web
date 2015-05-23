# -*- coding: utf-8 -*-

import time
import random

from nlweb.app import celery
from analysis import run_ml_analysis


@celery.task
def run_analysis(data, collection_id, algorithm):
    NTOTAL = 20
    print celery.current_task, "got task"

    print celery.conf

    run_ml_analysis(data['data'], collection_id, algorithm, output_dir)

    for i in range(NTOTAL):
        time.sleep(random.random())
        celery.current_task.update_state(state='PROGRESS',
                                         meta={'current': i, 'total': NTOTAL})
    return 999
