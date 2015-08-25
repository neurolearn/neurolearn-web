#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import inspect

from flask_script import Manager, Shell, Server
from flask_migrate import MigrateCommand
from flask.ext.failsafe import failsafe

from sqlalchemy.schema import CreateTable

HERE = os.path.abspath(os.path.dirname(__file__))
TEST_PATH = os.path.join(HERE, 'tests')


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
    """Run the tests."""
    import pytest
    exit_code = pytest.main([TEST_PATH, '--verbose'])
    return exit_code


if __name__ == '__main__':
    manager.run()
