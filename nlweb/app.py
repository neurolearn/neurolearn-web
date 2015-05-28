# -*- coding: utf-8 -*-

import os

from flask import Flask, render_template

from nlweb.extensions import (db, migrate, celery)


def load_celery_config(celery_obj):
    import imp

    environment = os.environ.get('ENV', 'development')

    # if os.path.exists('./config/local.cfg'):
    # celeryconfig = imp.load_source('celeryconfig',
    #                                    './config/local.cfg')
    # else:

    celeryconfig = imp.load_source('celeryconfig',
                                   './config/%s.cfg' % environment)

    celery_obj.config_from_object(celeryconfig)


def configure_app(app):
    app.config.from_object('config.Configuration')

    environment = os.environ.get('ENV', 'development')

    if environment not in ('production', 'development', 'test'):
        raise Exception("Unsupported environment '%s'" % environment)

    app.config.from_pyfile('../config/%s.cfg' % environment)

    if environment != 'production':
        try:
            app.config.from_pyfile('../config/local.cfg')
        except IOError:
            pass


def create_app():
    app = Flask(__name__)

    configure_app(app)

    init_extensions(app)
    register_blueprints(app)
    register_errorhandlers(app)
    return app


def init_extensions(app):
    db.init_app(app)
    migrate.init_app(app, db)

    load_celery_config(celery)


def register_blueprints(app):
    from nlweb.views import frontend
    app.register_blueprint(frontend)


def register_errorhandlers(app):
    def render_error(error):
        # If a HTTPException, pull the `code` attribute; default to 500
        error_code = getattr(error, 'code', 500)
        return render_template("{0}.html".format(error_code)), error_code

    for errcode in [401, 404, 500]:
        app.errorhandler(errcode)(render_error)
