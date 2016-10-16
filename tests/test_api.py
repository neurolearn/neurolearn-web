import os
import uuid
import shutil
from nlweb.models import MLModel, ModelTest
import nv_test_data
from flask_jwt import generate_token


def gen_auth_header(jwt):
    auth = 'Bearer %s' % jwt
    return {'Authorization': str(auth)}


def test_unauth_access(testapp):
    response = testapp.post_json('/api/models', expect_errors=True)
    assert response.status_code == 401


def test_create_mlmodel(testapp, user):
    name = 'Test %s' % uuid.uuid4()

    headers = gen_auth_header(generate_token(user))

    payload = {
        'algorithm': nv_test_data.ALGORITHM,
        'data': nv_test_data.TARGET_DATA_IMG_IDS,
        'collections': {
            504: {
                'name': 'Single Subject Thermal Pain'
            }
        },
        'cv': {
            'type': 'kfolds',
            'value': '10'
        },
        'label': {
            'name': 'PainLevel',
            'index': 13
        },
        'name': name
    }

    response = testapp.post_json('/api/models',
                                 payload,
                                 headers=headers)
    assert response.status_code == 201
    model = MLModel.query.filter_by(name=name).first()
    assert model.training_state == MLModel.STATE_SUCCESS


def create_test_mlmodel(user, output_data):
    return MLModel(training_state=MLModel.STATE_QUEUED,
                   output_data=output_data,
                   name='Test %s' % uuid.uuid4(),
                   user=user)


def put_weighmap_file(model_id, name):
    src_filename = os.path.join(os.path.dirname(__file__),
                                name)
    dest_filename = os.path.join(os.getcwd(),
                                 'media',
                                 str(model_id),
                                 name)
    shutil.copyfile(src_filename, dest_filename)


def test_create_model_test(testapp, db, user):
    headers = gen_auth_header(generate_token(user))

    model = create_test_mlmodel(user, {
        'duration': 549,
        'scatterplot': 'ridge_scatterplot.png ',
        'weightmap': 'ridge_weightmap.nii.gz'
    })

    db.session.add(model)
    db.session.commit()

    put_weighmap_file(model.id, 'ridge_weightmap.nii.gz')

    payload = {
        'modelId': model.id,
        'name': 'Model Test',
        'selectedImages': {
            504: [7513, 7516, 7573]
        }
    }

    response = testapp.post_json('/api/tests',
                                 payload,
                                 headers=headers)
    assert response.status_code == 201
    modeltest = ModelTest.query.get(1)
    assert modeltest.state == ModelTest.STATE_SUCCESS
    assert modeltest.output_data['collections'] == {
        '504': {'id': 504, 'name': 'Single Subject Thermal Pain'}}
