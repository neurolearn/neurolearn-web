from marshmallow import Schema, fields


class UserSchema(Schema):
    class Meta:
        fields = ('id', 'name')


class BaseItemSchema(Schema):
    user = fields.Nested(UserSchema)

    class Meta:
        additional = ('id', 'name',
                      'input_data', 'output_data',
                      'created', 'updated')


class MLModelSchema(BaseItemSchema):
    state = fields.String(attribute='training_state')
    visibility = fields.String(attribute='status')
    algorithm = fields.Function(lambda obj: obj.input_data['algorithm'])
    cv = fields.Function(lambda obj: obj.input_data['cv'])
    training_duration = fields.Function(
        lambda obj: obj.output_data.get('duration'))


class ModelTestSchema(BaseItemSchema):
    state = fields.String()
    test_duration = fields.Function(
        lambda obj: obj.output_data.get('duration'))
