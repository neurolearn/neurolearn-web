import pytest

from webtest import TestApp

from nlweb.app import create_app


@pytest.fixture(scope='session')
def app(request):
    """Session-wide test `Flask` application."""
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
