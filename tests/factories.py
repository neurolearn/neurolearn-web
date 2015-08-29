import factory
from factory.alchemy import SQLAlchemyModelFactory

from faker import Factory as FakerFactory

from nlweb import models
from nlweb.extensions import db


faker = FakerFactory.create()


class BaseFactory(SQLAlchemyModelFactory):

    class Meta:
        abstract = True
        sqlalchemy_session = db.session


class UserFactory(BaseFactory):
    email = factory.Sequence(lambda x: 'test{}@example.com'.format(x))
    active = True

    class Meta:
        model = models.User
