from flask import request, url_for, session, render_template
from flask import Blueprint
from flask import current_app
from flask_jwt import generate_token
from flask_oauthlib.client import OAuthException

from sqlalchemy.orm.exc import NoResultFound

from ..models import User, Connection, db
from ..extensions import oauth

blueprint = Blueprint('account', __name__)


def get_external_user_data(oauth_client):
    return oauth_client.get('api/user').data


def find_connection(provider_type, provider_user_id):
    return (Connection
            .query
            .filter_by(provider_type=provider_type,
                       provider_user_id=provider_user_id)
            .one())


def create_user(user_data):
    return User(email=user_data['email'],
                name=user_data['username'])


def create_connection(provider_type, user, user_data):
    return Connection(provider_type=provider_type,
                      user_id=user.id,
                      provider_user_id=unicode(user_data['id']),
                      display_name=user_data['username'])


@blueprint.route('/signin')
def signin():
    oauth_client = oauth.remote_apps['neurovault']
    return oauth_client.authorize(callback=url_for('.authorized',
                                                   _external=True))


@blueprint.route('/signin/authorized')
def authorized():
    # Patch for proxy
    if current_app.debug:
        session['neurovault_oauthredir'] = 'http://localhost:3000/signin/authorized'
    else:
        session['neurovault_oauthredir'] = url_for('.authorized',
                                                   _external=True)

    oauth_client = oauth.remote_apps['neurovault']
    resp = oauth_client.authorized_response()

    if resp is None:
        return 'Access denied: reason=%s error=%s' % (
            request.args['error'],
            request.args['error_description']
        )
    if isinstance(resp, OAuthException):
        return 'Access denied: reason=%s error=%s' % (
            resp.message,
            resp.data
        )

    session['neurovault_oauth_token'] = (resp['access_token'], '')

    user_data = get_external_user_data(oauth_client)

    try:
        connection = find_connection(Connection.NEUROVAULT,
                                     unicode(user_data['id']))
    except NoResultFound:
        user = create_user(user_data)
        db.session.add(user)
        db.session.commit()
        connection = create_connection(Connection.NEUROVAULT,
                                       user, user_data)

        db.session.add(connection)
        db.session.commit()

    connection.access_token = resp['access_token']
    db.session.commit()

    return render_template('authorized.html',
                           token=generate_token(connection.user))
