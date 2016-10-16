
start-web:
	cd webapp && npm start

clean-pyc:
	find . -name '*.pyc' -delete

test-server:
	ENV=test py.test -s --verbose tests

test:	test-server


