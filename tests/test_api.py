import uuid
from nlweb.models import MLModel


def test_unauth_access(testapp):
    response = testapp.post_json('/mlmodels', expect_errors=True)
    assert response.status_code == 401


def fetch_jwt(testapp, user):
    response = testapp.post_json('/auth', {'email': user.email,
                                           'password': 'veryrandom'})
    return str(response.json['token'])


def test_create_mlmodel(testapp, user):
    import nv_test_data

    auth = 'Bearer %s' % fetch_jwt(testapp, user)
    name = 'Test %s' % uuid.uuid4()

    payload = {'algorithm': nv_test_data.ALGORITHM,
               'data': nv_test_data.DATA,
               'collection_id': nv_test_data.COLLECTION_ID,
               'name': name}

    response = testapp.post_json('/mlmodels',
                                 payload,
                                 headers={'Authorization': auth})
    assert response.status_code == 201

    model = MLModel.query.filter_by(name=name).first()
    assert model.training_state == MLModel.TRAINING_QUEUED
