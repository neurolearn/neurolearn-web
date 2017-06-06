test_user = nlweb_test
test_db = nlweb_test

start-client:
	cd client && yarn start

clean-pyc:
	find . -name '*.pyc' -delete

test-server:
	psql postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='$(test_user)'" | grep -q 1 || createuser -d $(test_user)
	createdb -O $(test_user) $(test_db) 
	cd server && ENV=test py.test -s --verbose tests/test_api.py
	dropdb $(test_db) 

test:	test-server


