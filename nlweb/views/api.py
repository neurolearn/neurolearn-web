from __future__ import absolute_import

from flask import Blueprint
from flask import request
from flask import jsonify, abort

from flask_jwt import jwt_required, current_user

from nlweb import tasks

from ..models import db, MLModel, ModelTest

from ..marshal import (marshal_list, marshal_obj, entity_ref,
                       as_integer, as_is, as_string, as_iso_date,
                       filter_out_key)

from ..schemas import MLModelBriefSchema, ModelTestBriefSchema

blueprint = Blueprint('api', __name__)

public_mlmodels_schema = MLModelBriefSchema(
    many=True, exclude=('input_data', 'output_data'))

public_tests_schema = ModelTestBriefSchema(
    many=True, exclude=('input_data', 'output_data'))

own_mlmodels_schema = MLModelBriefSchema(
    many=True, exclude=('input_data', 'output_data'))


USER_FIELDS = {
    'id': as_integer,
    'name': as_string
}

MLMODEL_FIELDS = {
    'id': as_integer,
    'name': as_string,
    'created': as_iso_date,
    'training_state': as_string,
    'output_data': as_is,
    'input_data': filter_out_key('data'),
    'user': entity_ref('User', USER_FIELDS)
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


@blueprint.route('/users/<int:user_id>/mlmodels', methods=['GET'])
def list_user_mlmodels(user_id):
    pass


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


@blueprint.route('/mlmodels/<int:model_id>', methods=['GET'])
def get_mlmodel(model_id):
    mlmodel = MLModel.query.get_or_404(model_id)

    (obj, obj_entities) = marshal_obj(mlmodel, MLMODEL_FIELDS)

    entities = {
        'MLModel': {obj['id']: obj}
    }
    entities.update(obj_entities)

    return jsonify(dict(result=obj['id'], entities=entities))


@blueprint.route('/mlmodels/<int:model_id>', methods=['DELETE'])
@jwt_required()
def delete_mlmodel(model_id):
    mlmodel = MLModel.query.get_or_404(model_id)

    if mlmodel.user != current_user:
        abort(404)

    mlmodel.delete()
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
