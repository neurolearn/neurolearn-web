from __future__ import absolute_import

from celery import Celery

from nlweb.app import create_app, load_celery_config


def make_celery(app):
    celery_obj = Celery(app.import_name)
    load_celery_config(celery_obj)

    TaskBase = celery_obj.Task

    class ContextTask(TaskBase):
        abstract = True

        def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)

    celery_obj.Task = ContextTask

    return celery_obj


flask_app = create_app()
celery = make_celery(flask_app)
