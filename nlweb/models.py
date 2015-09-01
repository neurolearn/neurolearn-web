
from datetime import datetime

from sqlalchemy import Column

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


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = Column(db.Integer, primary_key=True)
    email = Column(db.String(255), unique=True, nullable=False)
    password = Column(db.String(255), nullable=False)
    created = Column(db.DateTime, default=datetime.utcnow)
    updated = Column(db.DateTime, onupdate=datetime.utcnow)
    active = db.Column(db.Boolean())

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


class MLModel(db.Model):
    __tablename__ = 'mlmodels'

    STATUS_DRAFT = 'draft'
    STATUS_PUBLIC = 'public'
    STATUS_DELETED = 'deleted'

    TRAINING_QUEUED = 'queued'
    TRAINING_PROGRESS = 'progress'
    TRAINING_SUCCESS = 'success'
    TRAINING_FAILURE = 'failure'

    id = Column(db.Integer, primary_key=True)
    name = Column(db.String, nullable=False)

    created = Column(db.DateTime, default=datetime.utcnow)
    updated = Column(db.DateTime, onupdate=datetime.utcnow)

    user_id = Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User',
                           foreign_keys=[user_id],
                           backref=db.backref('mlmodels', lazy='dynamic'))

    status = Column(db.Enum(STATUS_DRAFT, STATUS_PUBLIC, STATUS_DELETED,
                            name='status_types'),
                    nullable=False)

    training_state = Column(db.Enum(TRAINING_QUEUED,
                                    TRAINING_PROGRESS,
                                    TRAINING_SUCCESS,
                                    TRAINING_FAILURE,
                            name='training_state_types'),
                            nullable=False)

    input_data = db.Column(db.Text)
    output_data = db.Column(db.Text)

    def __unicode__(self):
        return self.name
