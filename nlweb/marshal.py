def get_class_name(obj):
    return obj.__class__.__name__


def as_integer(value):
    return int(value)


def as_string(value):
    return unicode(value)


def as_iso_date(dt):
    return dt.isoformat() + 'Z'


def marshal_obj(obj, fields):
    di = {}

    for field_name, func in fields.items():
        di[field_name] = func(getattr(obj, field_name))

    return di


def marshal_list(object_list, fields):
    if not object_list:
        return {}

    result = []
    entities = {}
    entity_type = get_class_name(object_list[0])

    for obj in object_list:
        result.append(obj.id)
        entities[obj.id] = marshal_obj(obj, fields)

    return {
        'result': result,
        'entities': {
            entity_type: entities
        }
    }
