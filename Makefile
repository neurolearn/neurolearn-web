
start-client:
	cd client && yarn start

clean-pyc:
	find . -name '*.pyc' -delete

test-server:
	createuser -d nlweb_test
	createdb -O nlweb_test nlweb_test
	ENV=test py.test -s --verbose tests/test_api.py
	dropdb nlweb_test

test:	test-server


