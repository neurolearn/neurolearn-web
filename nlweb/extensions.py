# -*- coding: utf-8 -*-

from __future__ import absolute_import

from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

from flask_mail import Mail
mail = Mail()

from flask.ext.security import (Security, SQLAlchemyUserDatastore)
from .models import User, Role
user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security(datastore=user_datastore)

from flask_jwt import JWT
jwt = JWT()

from flask_oauthlib.client import OAuth
oauth = OAuth()

neurovault_oauth = oauth.remote_app(
    'neurovault',
    consumer_key='q5avszwASkC3WNywlGOgQYgiztNStiLbdy80izw8',
    consumer_secret='su6Qlu1HzkDDiIgY6ab5TAMN9eNCJmr88AX6shDK2WKlck4CrL8kcvDtL5pn03fDXDSX9KyBoVZ4KuEnTrV3lbLEPgbFdogKsu9wD94GvXecUYb9vlmQBBRQ3wPn61M7',
    # request_token_params={'scope': 'user:email'},
    base_url='http://neurovault.org/',
    request_token_url=None,
    access_token_method='POST',
    access_token_url='http://neurovault.org/o/token/',
    authorize_url='http://neurovault.org/o/authorize/'
)

from flaskext.uploads import UploadSet
uploaded_media = UploadSet('media')

from flask_migrate import Migrate
migrate = Migrate()

from celery import Celery
celery = Celery()
