from marshmallow import Schema, fields


class UserSchema(Schema):
    class Meta:
        fields = ('id', 'name')


class BaseItemSchema(Schema):
    user = fields.Nested(UserSchema)

    class Meta:
        fields = ('id', 'name', 'user',
                  'input_data', 'output_data',
                  'created', 'updated')


class MLModelSchema(BaseItemSchema):
    pass


class ModelTestSchema(BaseItemSchema):
    pass
