
start-web:
	cd webapp && npm start

clean-pyc:
	find . -name '*.pyc' -delete

test:
	ENV=test py.test -s --verbose tests
