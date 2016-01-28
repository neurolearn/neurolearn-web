# -*- coding: utf-8 -*-
import os
from datetime import timedelta


class Configuration(object):
    DEBUG = False

    import logging
    LOGGING_LEVEL = logging.WARNING

    SECRET_KEY = os.getenv('FLASK_SECRET_KEY')

    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_ECHO = True

    # Flask-Security config
    SECURITY_PASSWORD_HASH = os.getenv('FLASK_SECURITY_PASSWORD_HASH')
    SECURITY_PASSWORD_SALT = os.getenv('FLASK_SECURITY_PASSWORD_SALT')

    # Flask-Security URLs, overridden because they don't put a / at the end
    SECURITY_LOGIN_URL = "/login/"
    SECURITY_LOGOUT_URL = "/logout/"
    SECURITY_REGISTER_URL = "/register/"

    SECURITY_POST_LOGIN_VIEW = "/admin/"
    SECURITY_POST_LOGOUT_VIEW = "/admin/"
    SECURITY_POST_REGISTER_VIEW = "/admin/"

    # Flask-Security features
    SECURITY_REGISTERABLE = True
    SECURITY_SEND_REGISTER_EMAIL = False

    JWT_AUTH_USERNAME_KEY = 'email'
    JWT_AUTH_HEADER_PREFIX = 'Bearer'
    JWT_EXPIRATION_DELTA = timedelta(hours=24)

    OAUTH_REMOTE_APPS = {
        'neurovault': {
            'consumer_key': os.getenv('NEUROVAULT_OAUTH_CONSUMER_KEY'),
            'consumer_secret': os.getenv('NEUROVAULT_OAUTH_CONSUMER_SECRET'),
            'base_url': 'http://neurovault.org/',
            'request_token_url': None,
            'access_token_method': 'POST',
            'access_token_url': 'http://neurovault.org/o/token/',
            'authorize_url': 'http://neurovault.org/o/authorize/'
        }
    }
