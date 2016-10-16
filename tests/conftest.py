import os
import pytest

from webtest import TestApp

from nlweb.app import create_app
from nlweb.extensions import db as _db

from .factories import UserFactory

os.environ['FLASK_SECURITY_PASSWORD_HASH'] = 'bcrypt'
os.environ['FLASK_SECURITY_PASSWORD_SALT'] = 'randomdummy'

os.environ['NEUROVAULT_OAUTH_CONSUMER_KEY'] = 'dummy-key'
os.environ['NEUROVAULT_OAUTH_CONSUMER_SECRET'] = 'dummy-secret'


def test_env_enabled():
    return os.environ.get('ENV') == 'test'


@pytest.fixture(scope='session')
def app(request):
    """Session-wide test `Flask` application."""

    if not test_env_enabled():
        pytest.exit('ENV is not \'test\' this may lead to the'
                    ' database corruption. Make sure you set '
                    'proper ENV value.')

    app = create_app()

    ctx = app.app_context()
    ctx.push()

    def teardown():
        ctx.pop()

    request.addfinalizer(teardown)

    return app


@pytest.fixture(scope='function')
def testapp(app):
    """A WebTest application"""
    return TestApp(app)


@pytest.fixture(scope='session')
def db(app, request):
    """Session-wide test database."""

    _db.app = app
    _db.drop_all()

    _db.create_all()

    return _db


@pytest.fixture
def user(db):
    user = UserFactory(password='veryrandom')
    db.session.commit()
    return user
