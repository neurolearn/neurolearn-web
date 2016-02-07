from marshmallow import Schema, fields


def count_dict_of_list(di):
    return reduce(lambda acc, li: acc + len(li), di.values(), 0)


class UserSchema(Schema):
    class Meta:
        fields = ('id', 'name')


class BaseItemSchema(Schema):
    user = fields.Nested(UserSchema)

    class Meta:
        additional = ('id', 'name',
                      'input_data', 'output_data',
                      'created', 'updated')


class ModelTestSchema(BaseItemSchema):
    state = fields.String()
    images_count = fields.Function(
        lambda obj: count_dict_of_list(obj.input_data.get('selectedImages')))
    test_duration = fields.Function(
        lambda obj: obj.output_data.get('duration'))


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
                                                            'created'))
