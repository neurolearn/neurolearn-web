# -*- coding: utf-8 -*-

from __future__ import absolute_import

from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

from flaskext.uploads import UploadSet
uploaded_media = UploadSet('media')

from flask_migrate import Migrate
migrate = Migrate()

from flask_debugtoolbar import DebugToolbarExtension
debug_toolbar = DebugToolbarExtension()

from celery import Celery
celery = Celery()
