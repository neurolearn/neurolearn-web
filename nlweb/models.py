
from datetime import datetime

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB

from flask.ext.security import UserMixin, RoleMixin

from .extensions import db


roles_users = db.Table('roles_users',
                       Column('user_id', db.Integer(),
                              db.ForeignKey('users.id')),
                       Column('role_id', db.Integer(),
                              db.ForeignKey('roles.id')))


class Role(db.Model, RoleMixin):
    __tablename__ = 'roles'

    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

    def __unicode__(self):
        return self.name


class SoftDelete(object):
    deleted = Column(db.DateTime)

    def soft_delete(self, session=None):
        self.deleted = datetime.utcnow()

    @classmethod
    def get_existing(cls):
        return cls.query.filter_by(deleted=None)

    @classmethod
    def get_existing_item(cls, pk):
        return cls.get_existing().filter_by(id=pk).first()


class TimestampMixin(object):
    created = Column(db.DateTime, default=datetime.utcnow)
    updated = Column(db.DateTime, onupdate=datetime.utcnow)


class PrivateMixin(object):
    private = db.Column(db.Boolean(), default=False, nullable=False)


class Connection(db.Model, TimestampMixin):
    __tablename__ = 'connections'

    NEUROVAULT = 'neurovault'
    GOOGLE = 'google'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User',
                           foreign_keys=[user_id],
                           backref=db.backref('connections', lazy='dynamic'))

    provider_type = db.Column(db.Enum(NEUROVAULT,
                                      GOOGLE,
                                      name='provider_types'))
    provider_user_id = db.Column(db.String(255))
    access_token = db.Column(db.String(255))
    display_name = db.Column(db.String(255))
    profile_url = db.Column(db.String)


class User(db.Model, UserMixin, TimestampMixin):
    __tablename__ = 'users'

    id = Column(db.Integer, primary_key=True)
    name = Column(db.String(255))
    email = Column(db.String(255), unique=True, nullable=False)
    password = Column(db.String(255))
    active = db.Column(db.Boolean(), default=True)

    last_login_at = Column(db.DateTime())
    current_login_at = Column(db.DateTime())
    last_login_ip = Column(db.String(100))
    current_login_ip = Column(db.String(100))
    login_count = Column(db.Integer)

    roles = db.relationship('Role', secondary=roles_users,
                            backref=db.backref('users', lazy='dynamic'))

    def __repr__(self):
        return '<User %r>' % self.email

    def __unicode__(self):
        return self.email

    @property
    def neurovault_account(self):
        return self.connections.filter_by(
            provider_type=Connection.NEUROVAULT
        ).first()


class MLModel(db.Model, TimestampMixin, SoftDelete, PrivateMixin):
    __tablename__ = 'mlmodels'

    STATE_QUEUED = 'queued'
    STATE_PROGRESS = 'progress'
    STATE_SUCCESS = 'success'
    STATE_FAILURE = 'failure'

    id = Column(db.Integer, primary_key=True)
    name = Column(db.String, nullable=False)
    description = Column(db.Text)

    user_id = Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User',
                           foreign_keys=[user_id],
                           backref=db.backref('mlmodels', lazy='dynamic'))

    training_state = Column(db.Enum(STATE_QUEUED,
                                    STATE_PROGRESS,
                                    STATE_SUCCESS,
                                    STATE_FAILURE,
                            name='training_state_types'),
                            nullable=False)

    input_data = db.Column(JSONB)
    output_data = db.Column(JSONB)

    @classmethod
    def get_public(cls):
        return cls.query.filter(cls.deleted == None,
                                cls.private == False,
                                cls.training_state == cls.STATE_SUCCESS)

    def tests(self):
        return ModelTest.query.filter(
            ModelTest.input_data.contains({'modelId': self.id}),
            ModelTest.state == ModelTest.STATE_SUCCESS,
            ModelTest.deleted == None
        ).order_by('created desc').all()

    def __unicode__(self):
        return self.name


class ModelTest(db.Model, TimestampMixin, SoftDelete, PrivateMixin):
    __tablename__ = 'modeltests'

    STATE_QUEUED = 'queued'
    STATE_PROGRESS = 'progress'
    STATE_SUCCESS = 'success'
    STATE_FAILURE = 'failure'

    id = Column(db.Integer, primary_key=True)
    name = Column(db.String, nullable=False)
    description = Column(db.Text)

    user_id = Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User',
                           foreign_keys=[user_id],
                           backref=db.backref('model_tests', lazy='dynamic'))

    state = Column(db.Enum(STATE_QUEUED,
                           STATE_PROGRESS,
                           STATE_SUCCESS,
                           STATE_FAILURE,
                           name='training_state_types'),
                   nullable=False)

    input_data = db.Column(JSONB)
    output_data = db.Column(JSONB)

    @classmethod
    def get_public(cls):
        return cls.query.filter(cls.deleted == None,
                                cls.private == False,
                                cls.state == cls.STATE_SUCCESS)

    def model(self):
        return MLModel.query.filter_by(id=self.input_data['modelId']).one()

    def __unicode__(self):
        return self.name
