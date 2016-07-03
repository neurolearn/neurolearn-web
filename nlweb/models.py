
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


class TimestampMixin(object):
    created = Column(db.DateTime, default=datetime.utcnow)
    updated = Column(db.DateTime, onupdate=datetime.utcnow)


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


class MLModel(db.Model, TimestampMixin, SoftDelete):
    __tablename__ = 'mlmodels'

    STATUS_PRIVATE = 'private'
    STATUS_PUBLIC = 'public'
    STATUS_DELETED = 'deleted'

    TRAINING_QUEUED = 'queued'
    TRAINING_PROGRESS = 'progress'
    TRAINING_SUCCESS = 'success'
    TRAINING_FAILURE = 'failure'

    id = Column(db.Integer, primary_key=True)
    name = Column(db.String, nullable=False)
    description = Column(db.Text)

    user_id = Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User',
                           foreign_keys=[user_id],
                           backref=db.backref('mlmodels', lazy='dynamic'))

    status = Column(db.Enum(STATUS_PRIVATE, STATUS_PUBLIC, STATUS_DELETED,
                            name='status_types'),
                    nullable=False)

    training_state = Column(db.Enum(TRAINING_QUEUED,
                                    TRAINING_PROGRESS,
                                    TRAINING_SUCCESS,
                                    TRAINING_FAILURE,
                            name='training_state_types'),
                            nullable=False)

    input_data = db.Column(JSONB)
    output_data = db.Column(JSONB)

    @classmethod
    def get_public(cls):
        return cls.query.filter(cls.deleted == None,
                                cls.status == cls.STATUS_PUBLIC,
                                cls.training_state == cls.TRAINING_SUCCESS)

    @classmethod
    def get_existing_item(cls, pk):
        return cls.get_existing().filter_by(id=pk).first()

    def tests(self):
        return ModelTest.query.filter(
            ModelTest.input_data.contains({"modelId": self.id}),
            ModelTest.state == ModelTest.STATE_SUCCESS,
            ModelTest.visibility != ModelTest.VISIBILITY_DELETED
        ).order_by('created desc').all()

    def __unicode__(self):
        return self.name


class ModelTest(db.Model, TimestampMixin, SoftDelete):
    __tablename__ = 'modeltests'

    VISIBILITY_PRIVATE = 'private'
    VISIBILITY_PUBLIC = 'public'
    VISIBILITY_DELETED = 'deleted'

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

    visibility = Column(db.Enum(VISIBILITY_PRIVATE,
                                VISIBILITY_PUBLIC,
                                VISIBILITY_DELETED,
                                name='status_types'),
                        nullable=False)

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
                                cls.visibility == cls.VISIBILITY_PUBLIC,
                                cls.state == cls.STATE_SUCCESS)

    def model(self):
        return MLModel.query.filter_by(id=self.input_data['modelId']).one()

    def __unicode__(self):
        return self.name
