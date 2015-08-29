def test_unauth_access(testapp):
    response = testapp.post_json('/mlmodels', expect_errors=True)
    assert response.status_code == 401
