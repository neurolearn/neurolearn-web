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

from flaskext.uploads import UploadSet
uploaded_media = UploadSet('media')

from flask_migrate import Migrate
migrate = Migrate()

from celery import Celery
celery = Celery()
