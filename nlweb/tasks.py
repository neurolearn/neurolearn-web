# -*- coding: utf-8 -*-

import time
import random

from nlweb.app import celery


@celery.task
def run_analysis(params):
    NTOTAL = 50
    print celery.current_task, "got task"
    for i in range(NTOTAL):
        time.sleep(random.random())
        celery.current_task.update_state(state='PROGRESS',
                                  meta={'current': i, 'total': NTOTAL})
    return 999
