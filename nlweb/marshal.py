from collections import namedtuple, defaultdict

EntityRef = namedtuple('EntityRef', ['id', 'type', 'obj'])


def as_integer(value):
    return int(value)


def as_string(value):
    return unicode(value)


def as_iso_date(dt):
    return dt.isoformat() + 'Z'


def as_is(value):
    return value


def filter_out_key(key):
    def func(value):
        copy = value.copy()
        copy.pop(key, None)
        return copy
    return func


def marshal_obj(obj, fields):
    di = {}
    entities = defaultdict(dict)

    for field_name, func in fields.items():
        value = func(getattr(obj, field_name))

        entity_ref_obj = getattr(value, 'obj', None)
        if entity_ref_obj:
            entities[value.type][value.id] = value.obj
            di[field_name] = value.id
        else:
            di[field_name] = value

    return (di, entities)


def entity_ref(entity_type, fields):
    def func(obj):
        return EntityRef(id=obj.id,
                         type=entity_type,
                         obj=marshal_obj(obj, fields)[0])
    return func


def marshal_list(object_list, entity_type, fields):
    if not object_list:
        return {}

    result = []
    list_entities = {}
    related_entities = defaultdict(dict)

    for obj in object_list:
        result.append(obj.id)
        (list_entities[obj.id], obj_entities) = marshal_obj(obj, fields)
        for key, value in obj_entities.items():
            related_entities[key].update(value)

    entities = {
        entity_type: list_entities
    }
    entities.update(related_entities)

    return dict(result=result, entities=entities)
