# -*- coding: utf-8 -*-

import os

from flask import Flask, render_template, session
from flask_admin import helpers as admin_helpers
from flask.ext.security.utils import verify_and_update_password

from .admin import admin

from .extensions import (db, migrate, celery, jwt,
                         security, mail, oauth)

from .models import User


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

    mail.init_app(app)
    jwt.init_app(app)
    oauth.init_app(app)
    security.init_app(app)
    admin.init_app(app)

    load_celery_config(celery)

    register_jwt_handlers(jwt)
    register_remote_apps(app, oauth)

    security2 = app.extensions['security']

    @security2.context_processor
    def security_context_processor():
        return dict(
            admin_base_template=admin.base_template,
            admin_view=admin.index_view,
            h=admin_helpers,
        )


def register_jwt_handlers(jwt):
    @jwt.authentication_handler
    def authenticate(email, password):
        user = User.query.filter_by(email=email).first()
        if not user:
            return False
        if verify_and_update_password(password, user):
            return user

    @jwt.user_handler
    def load_user(payload):
        return User.query.get(payload['user_id'])

    @jwt.payload_handler
    def make_payload(user):
        return {
            'user_id': user.id,
            'name': user.name
        }


def register_remote_apps(app, oauth):
    neurovault_oauth = oauth.remote_app(
        'neurovault',
        **app.config['OAUTH_REMOTE_APPS']['neurovault']
    )

    @neurovault_oauth.tokengetter
    def get_neurovault_oauth_token():
        return session.get('neurovault_oauth_token')


def register_blueprints(app):
    from nlweb.views import frontend
    from nlweb.views import account
    from nlweb.views import api

    for view in (frontend, account, api):
        app.register_blueprint(view.blueprint)


def register_errorhandlers(app):
    def render_error(error):
        # If a HTTPException, pull the `code` attribute; default to 500
        error_code = getattr(error, 'code', 500)
        return render_template("{0}.html".format(error_code)), error_code

    for errcode in [401, 404, 500]:
        app.errorhandler(errcode)(render_error)
