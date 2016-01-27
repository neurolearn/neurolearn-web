# -*- coding: utf-8 -*-
import os
from datetime import timedelta


class Configuration(object):
    DEBUG = False

    import logging
    LOGGING_LEVEL = logging.WARNING

    SQLALCHEMY_ECHO = True

    # Flask-Security config
    SECURITY_PASSWORD_HASH = "pbkdf2_sha512"
    SECURITY_PASSWORD_SALT = "ATEL$hirGOJKiu@ghaeubaG--EGj"

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
