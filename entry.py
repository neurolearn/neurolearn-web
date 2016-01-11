import os
from nlweb.app import create_app

# Disable OAuth2 https requirement
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

app = create_app()
