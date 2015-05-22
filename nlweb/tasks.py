# -*- coding: utf-8 -*-

import time
import random

from nlweb.app import celery
from analysis import run_analysis

@celery.task
def run_analysis(data):
    NTOTAL = 20
    print celery.current_task, "got task"

    run_analysis(data)

    for i in range(NTOTAL):
        time.sleep(random.random())
        celery.current_task.update_state(state='PROGRESS',
                                         meta={'current': i, 'total': NTOTAL})
    return 999
