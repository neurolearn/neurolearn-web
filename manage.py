#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import inspect

from flask_script import Manager, Shell, Server
from flask_migrate import MigrateCommand
from flask.ext.failsafe import failsafe

from sqlalchemy.schema import CreateTable
from dotenv import Dotenv

HERE = os.path.abspath(os.path.dirname(__file__))
TEST_PATH = os.path.join(HERE, 'tests')
ENV_FILE_NAME = '.env'


def update_environment(env_file_path):
    dotenv = Dotenv(env_file_path)
    os.environ.update(dotenv)


def _make_context():
    from nlweb import models, db

    context = {}
    for name in dir(models):
        attr = getattr(models, name)
        if inspect.isclass(attr) and issubclass(attr, db.Model):
            context[name] = attr

    return context


@failsafe
def _create_app():
    from nlweb.app import create_app
    return create_app()

update_environment(os.path.join(HERE, ENV_FILE_NAME))

manager = Manager(_create_app)  # pylint: disable=invalid-name

manager.add_command('server', Server())
manager.add_command('shell', Shell(make_context=_make_context))
manager.add_command('db', MigrateCommand)


@manager.command
def start_celery():
    import subprocess

    subprocess.call(['celery', 'worker', '-B', '--app', 'nlweb'])


@manager.command
def sql(model_name):
    from nlweb import models, db

    print CreateTable(getattr(models, model_name).__table__).compile(db.engine)


@manager.command
def db_create_all():
    from nlweb import db
    db.create_all()


@manager.command
def test():
    """Run the tests.

    Alternative:
    ENV=test py.test -s --verbose tests
    """
    import pytest
    exit_code = pytest.main([TEST_PATH, '--verbose'])
    return exit_code


@manager.command
def retrain_model(pk):
    from nlweb.models import MLModel
    from nlweb import tasks

    item = MLModel.query.get(pk)

    if not item:
        print "Model #%s not found." % pk
        return

    tasks.train_model(item.id)


@manager.command
def redo_model_test(pk):
    from nlweb.models import ModelTest
    from nlweb import tasks

    item = ModelTest.query.get(pk)

    if not item:
        print "Model #%s not found." % pk
        return

    tasks.test_model(item.id)


if __name__ == '__main__':
    manager.run()
