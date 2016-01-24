from __future__ import absolute_import

from flask import Blueprint
from flask import request
from flask import jsonify, abort

from flask_jwt import jwt_required, current_user

from nlweb import tasks

from ..models import db, MLModel, ModelTest

from ..marshal import (marshal_list, entity_ref,
                       as_integer, as_is, as_string, as_iso_date,
                       filter_out_key)

from ..schemas import MLModelBriefSchema, ModelTestBriefSchema

from . import not_found

blueprint = Blueprint('api', __name__)

public_mlmodels_schema = MLModelBriefSchema(
    many=True, exclude=('input_data', 'output_data'))

own_mlmodels_schema = MLModelBriefSchema(
    many=True, exclude=('input_data', 'output_data'))

mlmodel_schema = MLModelBriefSchema()

public_tests_schema = ModelTestBriefSchema(
    many=True, exclude=('input_data', 'output_data'))


USER_FIELDS = {
    'id': as_integer,
    'name': as_string
}

TEST_FIELDS = {
    'id': as_integer,
    'name': as_string,
    'created': as_iso_date,
    'state': as_string,
    'output_data': as_is,
    'user': entity_ref('User', USER_FIELDS)
}


@blueprint.route('/user/mlmodels', methods=['GET'])
@jwt_required()
def list_own_mlmodels():
    item_list = MLModel.get_existing().filter(
        MLModel.user == current_user).order_by('created desc').all()

    result = public_mlmodels_schema.dump(item_list)
    return jsonify(data=result.data)


@blueprint.route('/mlmodels', methods=['GET'])
def list_public_mlmodels():
    item_list = MLModel.get_public().order_by('created desc').all()

    result = public_mlmodels_schema.dump(item_list)
    return jsonify(data=result.data)


def parse_cv_param(cv):
    if cv['type'] == 'kfolds':
        cv['n_folds'] = int(cv.pop('value'))
    return cv


@blueprint.route('/mlmodels', methods=['POST'])
@jwt_required()
def create_mlmodel():
    args = request.json
    cv = parse_cv_param(args['cv'])

    mlmodel = MLModel(status=MLModel.STATUS_PUBLIC,
                      training_state=MLModel.TRAINING_QUEUED,
                      input_data={'data': args['data'],
                                  'label': args['label'],
                                  'algorithm': args['algorithm'],
                                  'cv': cv},
                      name=args['name'],
                      user=current_user)
    db.session.add(mlmodel)
    db.session.commit()

    tasks.train_model.delay(mlmodel.id)

    return 'Created', 201


@blueprint.route('/mlmodels/<int:pk>', methods=['GET'])
def get_mlmodel(pk):
    item = MLModel.query.get(pk)
    if not item:
        return not_found()

    result = mlmodel_schema.dump(item)
    return jsonify(data=result.data)


@blueprint.route('/mlmodels/<int:pk>', methods=['DELETE'])
@jwt_required()
def delete_mlmodel(pk):
    item = MLModel.query.get(pk)
    if not item:
        return not_found()

    if item.user != current_user:
        abort(404)

    item.delete()
    db.session.commit()

    return 'No Content', 204


@blueprint.route('/tests', methods=['GET'])
def list_public_tests():
    item_list = ModelTest.get_public().order_by('created desc').all()

    result = public_tests_schema.dump(item_list)
    return jsonify(data=result.data)


@blueprint.route('/tests', methods=['POST'])
@jwt_required()
def create_test():
    data = request.json
    mlmodel = MLModel.query.get_or_404(int(data['modelId']))

    model_test = ModelTest(visibility=ModelTest.VISIBILITY_PUBLIC,
                           state=ModelTest.STATE_QUEUED,
                           input_data=request.json,
                           name='Test for %s model' % mlmodel.name,
                           user=current_user)
    db.session.add(model_test)
    db.session.commit()

    tasks.test_model.delay(model_test.id)

    return 'Created', 201


@blueprint.route('/user/tests', methods=['GET'])
@jwt_required()
def list_user_model_tests():
    model_test_list = ModelTest.get_existing().filter(
        ModelTest.user == current_user).order_by('created desc').all()

    return jsonify(marshal_list(model_test_list, 'ModelTest', TEST_FIELDS))


@blueprint.route('/tests/<int:test_id>', methods=['DELETE'])
@jwt_required()
def delete_test(test_id):
    test = ModelTest.query.get_or_404(test_id)

    if test.user != current_user:
        abort(404)

    test.delete()
    db.session.commit()

    return 'No Content', 204


@blueprint.route('/tests/<int:test_id>/groups', methods=['POST'])
@jwt_required()
def save_groups(test_id):
    test = ModelTest.query.get_or_404(test_id)
    data = request.json

    if test.user != current_user:
        abort(404)

    test.output_data = dict(test.output_data, groups=data)
    db.session.commit()

    return 'Created', 201
