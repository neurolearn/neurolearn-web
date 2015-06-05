# -*- coding: utf-8 -*-
import os


class Configuration(object):
    DEBUG = False

    import logging
    LOGGING_LEVEL = logging.WARNING

    UPLOADED_MEDIA_DEST = os.path.join(os.getcwd(), 'media', 'uploads')
    UPLOADED_MEDIA_URL = '/media/uploads'
    UPLOADED_MEDIA_ALLOW = ('nii.gz', 'nii', 'gz')
    UPLOADED_MEDIA_ALLOW += tuple(s.upper() for s in UPLOADED_MEDIA_ALLOW)
