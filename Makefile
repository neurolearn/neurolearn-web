
start-web:
	cd webapp && npm start

clean-pyc:
	find . -name '*.pyc' -delete

test-server:
	createdb -O postgres nlweb_test
	ENV=test py.test -s --verbose tests/test_api.py
	dropdb nlweb_test

test:	test-server


