from __future__ import absolute_import

from flask import Blueprint
from flask import request
from flask import jsonify, abort

from flask_jwt import jwt_required, current_user

from nlweb import tasks
from ..app import jwt_optional

from ..models import db, MLModel, ModelTest

from ..schemas import UserSchema, MLModelSchema, ModelTestSchema
from ..utils import merge_two_dicts

from . import not_found

blueprint = Blueprint('api', __name__)

user_schema = UserSchema()

mlmodel_schema = MLModelSchema()

public_models_schema = MLModelSchema(
    many=True, exclude=('input_data', 'output_data'))

own_models_schema = MLModelSchema(
    many=True, exclude=('input_data', 'output_data'))

test_schema = ModelTestSchema()

public_tests_schema = ModelTestSchema(
    many=True, exclude=('input_data', 'output_data'))

own_tests_schema = ModelTestSchema(
    many=True, exclude=('input_data', 'output_data'))


@blueprint.route('/stats', methods=['GET'])
def get_stats():
    models_count = MLModel.get_public().count()
    tests_count = ModelTest.get_public().count()
    return jsonify(data={'models_count': models_count,
                         'tests_count': tests_count})


@blueprint.route('/user', methods=['GET'])
@jwt_required()
def get_current_user():
    return jsonify(data=user_schema.dump(current_user).data)


@blueprint.route('/user/models', methods=['GET'])
@jwt_required()
def list_own_models():
    item_list = MLModel.get_existing().filter(
        MLModel.user == current_user).order_by('created desc').all()

    result = own_models_schema.dump(item_list)
    return jsonify(data=result.data)


@blueprint.route('/models', methods=['GET'])
def list_public_models():
    item_list = MLModel.get_public().order_by('created desc').all()

    result = public_models_schema.dump(item_list)
    return jsonify(data=result.data)


def parse_cv_param(args):
    cv = args.get('cv')

    if not cv:
        return None
    if cv['type'] == 'kfolds':
        cv['n_folds'] = int(cv.pop('value'))

    return cv


@blueprint.route('/models', methods=['POST'])
@jwt_required()
def create_mlmodel():
    args = request.json
    cv = parse_cv_param(args)

    mlmodel = MLModel(training_state=MLModel.STATE_QUEUED,
                      input_data={'data': args['data'],
                                  'collections': args['collections'],
                                  'label': args['label'],
                                  'algorithm': args['algorithm'],
                                  'cv': cv},
                      name=args['name'],
                      description=args.get('description'),
                      private=args.get('private'),
                      user=current_user)
    db.session.add(mlmodel)
    db.session.commit()

    tasks.train_model.delay(mlmodel.id)

    return 'Created', 201


@blueprint.route('/models/<int:pk>', methods=['GET'])
@jwt_optional()
def get_mlmodel(pk):
    item = MLModel.get_existing_item(pk)
    if not item or (item.private and item.user != current_user):
        return not_found()

    result = mlmodel_schema.dump(item)
    return jsonify(data=result.data)


@blueprint.route('/models/<int:pk>', methods=['DELETE'])
@jwt_required()
def delete_mlmodel(pk):
    item = MLModel.get_existing_item(pk)
    if not item:
        return not_found()

    if item.user != current_user:
        return not_found()

    item.soft_delete()
    db.session.commit()

    return 'No Content', 204


@blueprint.route('/models/<int:pk>', methods=['PUT', 'PATCH'])
@jwt_required()
def update_mlmodel(pk):
    item = MLModel.get_existing_item(pk)
    if not item:
        return not_found()

    if item.user != current_user:
        return not_found()

    args = request.json

    item.name = args.get('name', item.name)
    item.description = args.get('description', item.description)
    item.private = args.get('private', item.private)
    db.session.commit()

    result = mlmodel_schema.dump(item)
    return jsonify(data=result.data)


@blueprint.route('/models/<int:pk>/retrain', methods=['POST'])
@jwt_required()
def retrain_mlmodel(pk):
    item = MLModel.get_existing_item(pk)
    if not item:
        return not_found()

    if item.user != current_user:
        return not_found()

    args = request.json

    item.training_state = MLModel.STATE_QUEUED

    item.input_data = merge_two_dicts(item.input_data, args)
    db.session.commit()

    tasks.train_model.delay(item.id)

    return 'No Content', 204


@blueprint.route('/tests', methods=['GET'])
def list_public_tests():
    item_list = ModelTest.get_public().order_by('created desc').all()

    result = public_tests_schema.dump(item_list)
    return jsonify(data=result.data)


@blueprint.route('/tests/<int:pk>', methods=['GET'])
def get_test(pk):
    item = ModelTest.query.get(pk)
    if not item:
        return not_found()

    result = test_schema.dump(item)
    return jsonify(data=result.data)


@blueprint.route('/tests', methods=['POST'])
@jwt_required()
def create_test():
    data = request.json
    MLModel.query.get_or_404(int(data['modelId']))

    model_test = ModelTest(state=ModelTest.STATE_QUEUED,
                           input_data=request.json,
                           name=data['name'],
                           user=current_user)
    db.session.add(model_test)
    db.session.commit()

    tasks.test_model.delay(model_test.id)

    return 'Created', 201


@blueprint.route('/user/tests', methods=['GET'])
@jwt_required()
def list_own_model_tests():
    item_list = ModelTest.get_existing().filter(
        ModelTest.user == current_user).order_by('created desc').all()

    result = own_tests_schema.dump(item_list)
    return jsonify(data=result.data)


@blueprint.route('/tests/<int:pk>', methods=['DELETE'])
@jwt_required()
def delete_test(pk):
    item = ModelTest.query.get(pk)
    if not item:
        return not_found()

    if item.user != current_user:
        return not_found()

    item.soft_delete()
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


@blueprint.route('/deletes/<object_type>', methods=['POST'])
@jwt_required()
def delete_item_list(object_type):
    data = request.json

    class_ = {'models': MLModel, 'tests': ModelTest}.get(object_type)

    if not class_:
        return not_found()

    item_list = [class_.query.get(item_id) for item_id in data]

    for item in item_list:
        if item.user != current_user:
            return not_found()
        item.soft_delete()

    db.session.commit()
    return 'No Content', 204
