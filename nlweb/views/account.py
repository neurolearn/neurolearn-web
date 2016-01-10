from flask import request, jsonify, url_for, session
from flask import Blueprint

from sqlalchemy.orm.exc import NoResultFound

from ..models import User, Connection, db
from ..extensions import neurovault_oauth

blueprint = Blueprint('account', __name__)


def get_external_user_data(oauth_client):
    return neurovault_oauth.get('api/user').data


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
    return neurovault_oauth.authorize(callback=url_for('.authorized',
                                                       _external=True))


@blueprint.route('/signin/authorized')
def authorized():
    resp = neurovault_oauth.authorized_response()
    if resp is None:
        return 'Access denied: reason=%s error=%s' % (
            request.args['error'],
            request.args['error_description']
        )
    session['neurovault_oauth_token'] = (resp['access_token'], '')

    user_data = get_external_user_data(neurovault_oauth)

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

    return jsonify({'ok': True, 'result': resp, 'user_data': user_data})


@neurovault_oauth.tokengetter
def get_neurovault_oauth_token():
    return session.get('neurovault_oauth_token')
