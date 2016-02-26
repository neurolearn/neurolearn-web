import numpy as np

from marshmallow import Schema, fields


def count_dict_of_list(di):
    return reduce(lambda acc, li: acc + len(li), di.values(), 0)


def mean_correlation(obj):
    if obj.output_data and obj.output_data['correlation']:
        return round(np.mean([x['r']
                              for x in obj.output_data['correlation']]), 2)
    else:
        return None


class UserSchema(Schema):
    class Meta:
        fields = ('id', 'name')


class BaseItemSchema(Schema):
    user = fields.Nested(UserSchema)

    class Meta:
        additional = ('id', 'name', 'description',
                      'input_data', 'output_data',
                      'created', 'updated')


class ModelTestSchema(BaseItemSchema):
    state = fields.String()
    images_count = fields.Function(
        lambda obj: count_dict_of_list(obj.input_data.get('selectedImages')))
    mean_correlation = fields.Function(mean_correlation)
    test_duration = fields.Function(
        lambda obj: obj.output_data.get('duration'))
    model = fields.Nested('MLModelSchema', only=('id', 'name'))


class MLModelSchema(BaseItemSchema):
    state = fields.String(attribute='training_state')
    visibility = fields.String(attribute='status')
    algorithm = fields.Function(lambda obj: obj.input_data['algorithm'])
    cv = fields.Function(lambda obj: obj.input_data['cv'])
    training_duration = fields.Function(
        lambda obj: obj.output_data.get('duration'))
    glassbrain = fields.Function(
        lambda obj: obj.output_data.get('glassbrain'))
    tests = fields.Nested(ModelTestSchema, many=True, only=('id', 'name',
                                                            'images_count',
                                                            'mean_correlation',
                                                            'created'))
