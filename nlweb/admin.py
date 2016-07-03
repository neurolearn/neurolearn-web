# -*- coding: utf-8 -*-

import hashlib

import flask

from flask import current_app, url_for, redirect, request, abort

from flask.ext import admin
from flask.ext.admin.contrib import sqla
from flask.ext import login

from flask_security import current_user

from jinja2 import filters, Markup

from nlweb import db
from nlweb.models import User, Role, MLModel, ModelTest, Connection

from nlweb.utils import friendly_time

from flask_admin_jsoneditor import JSONEditorField


def hexdigest(*args):
    h = hashlib.sha256()
    h.update(''.join(args))
    return h.hexdigest()


def secret_hash(string):
    return hexdigest(current_app.config['SECRET_KEY'], string)


def _date_formatter(view, context, model, name):
    date = getattr(model, name)

    if not date:
        return ''

    date = date.replace(microsecond=0)

    return Markup(
        "%s<div style='color: lightgray;'>%s</div>" % (friendly_time(date),
                                                       date)
    )


def _size_formatter(view, context, model, name):
    size = getattr(model, name)

    return Markup(
        "%s<div style='color: lightgray;'>%s</div>" % (
            filters.do_filesizeformat(size).replace(' ', '&nbsp;'), size)
    ) if size is not None else ""


def _user_id_formatter(view, context, model, name):
    id_val = getattr(model, name)
    id_val = u"<form class='form-inline' target='_blank' " \
        "method='POST' action='su'>%s " \
        "<input type='hidden' name='id' value='%s' />" \
        "<input type='hidden' name='secret' value='%s' />" \
        "<button type='submit' " \
        "class='btn btn-default " \
        "btn-small'>su</button></form>" % (id_val, id_val,
                                           secret_hash(str(id_val)))

    return Markup(id_val)


def _task_state_formatter(view, context, model, name):
    state = getattr(model, name)
    pk = model.id
    state_html = u"<form class='form-inline' " \
        "method='POST' action='restart'>%s " \
        "<input type='hidden' name='id' value='%s' />" \
        "<input type='hidden' name='secret' value='%s' />" \
        "<input type='hidden' name='next' value='%s' />" \
        "<button type='submit' " \
        "class='btn btn-default " \
        "btn-xs'>restart</button></form>" % (state, pk,
                                             secret_hash(str(pk)),
                                             flask.request.path)
    return Markup(state_html)


class ModelView(sqla.ModelView):
    column_default_sort = ('created', True)

    def is_accessible(self):
        if not current_user.is_active() or not current_user.is_authenticated():
            return False

        if current_user.has_role('superuser'):
            return True

        return False

    def _handle_view(self, name, **kwargs):
        """
        Override builtin _handle_view in order to redirect users when a view is not accessible.
        """
        if not self.is_accessible():
            if current_user.is_authenticated():
                # permission denied
                abort(403)
            else:
                # login
                return redirect(url_for('security.login', next=request.url))


class UserAdmin(ModelView):
    column_list = ('id', 'name', 'email', 'created', 'active')

    column_formatters = {
        'id': _user_id_formatter,
        'created': _date_formatter
    }

    @admin.expose('/su', methods=('POST',))
    def substitute_user(self):
        user_id = int(flask.request.form['id'])
        secret = flask.request.form['secret']

        if secret_hash(str(user_id)) == secret:
            user = User.query.get_or_404(user_id)
            login.login_user(user)
        else:
            flask.abort(404)

        return flask.redirect('/')


class MLModelAdmin(ModelView):
    column_list = ('id', 'name', 'user', 'training_state', 'status',
                   'created', 'deleted')

    column_formatters = {
        'training_state': _task_state_formatter,
        'created': _date_formatter,
        'deleted': _date_formatter
    }

    form_overrides = {
        'input_data': JSONEditorField,
        'output_data': JSONEditorField
    }

    create_template = 'admin/jsoneditor_edit.html'
    edit_template = 'admin/jsoneditor_edit.html'

    @admin.expose('/restart', methods=('POST',))
    def restart_task(self):
        from nlweb import tasks

        pk = int(flask.request.form['id'])
        secret = flask.request.form['secret']
        nexturl = flask.request.form.get('next', '/admin/')

        if secret_hash(str(pk)) == secret:
            model = MLModel.query.get_or_404(pk)
            tasks.train_model.delay(model.id)

            return flask.redirect(nexturl)
        else:
            flask.abort(404)

        return flask.redirect('/admin')


class ModelTestAdmin(MLModelAdmin):
    column_list = ('id', 'name', 'user', 'state', 'visibility',
                   'created', 'deleted')
    column_formatters = {
        'created': _date_formatter,
        'deleted': _date_formatter
    }


class RoleAdmin(ModelView):
    column_default_sort = []


admin = admin.Admin(name='Neurolearn',
                    base_template='admin/admin_base.html',
                    template_mode='bootstrap3')

admin.add_view(MLModelAdmin(MLModel, db.session, name="MLModel"))
admin.add_view(ModelTestAdmin(ModelTest, db.session, name="Model Test"))
admin.add_view(UserAdmin(User, db.session))
admin.add_view(ModelView(Connection, db.session))
admin.add_view(RoleAdmin(Role, db.session))
