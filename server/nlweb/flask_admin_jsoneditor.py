import json
from wtforms import fields, widgets
from wtforms.widgets import HTMLString
from cgi import escape


class JSONEditorWidget(widgets.TextArea):

    def __call__(self, field, **kwargs):
        value = escape(unicode(json.dumps(field.data)))
        return HTMLString(
            u'<div class="jsoneditor-wrapper">'
            '<textarea style="display:none;" name="{name}" '
            'id="{textarea_id}">{value}</textarea>'
            '<div class="jsoneditor" id="{div_id}"></div></div>'
            .format(name=field.name,
                    textarea_id="%s_ta" % field.id,
                    div_id=field.id,
                    value=value)
        )


class JSONEditorField(fields.TextAreaField):
    widget = JSONEditorWidget()

    def process_formdata(self, valuelist):
        if valuelist:
            self.data = json.loads(valuelist[0])
