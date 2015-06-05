===============================
Neurolearn
===============================

A web platform for analyzing neuroimaging data using machine-learning tools.


Quickstart
----------

Then run the following commands to bootstrap your environment.


.. code-block:: bash

    git clone https://github.com/burnash/nlweb
    cd nlweb
    pip install -r requirements/dev.txt
    python manage.py server -h 3001


And in different terminal session:

.. code-block:: bash

    cd nlweb/app
    gulp


Deployment
----------

.. code-block:: bash

    fab deploy


Shell
-----

To open the interactive shell, run ::

    python manage.py shell


Running Tests
-------------

To run all tests, run ::

    python manage.py test


Migrations
----------

Whenever a database migration needs to be made. Run the following commmands:
::

    python manage.py db migrate

This will generate a new migration script. Then run:
::

    python manage.py db upgrade

To apply the migration.

For a full migration command reference, run ``python manage.py db --help``.