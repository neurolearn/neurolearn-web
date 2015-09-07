import request from 'superagent';

function startModelTesting(model, selectedImages, token) {
  const payload = {
    model,
    selectedImages
  };

  return request.post('/tests')
    .type('json')
    .accept('json')
    .set('Authorization', 'Bearer ' + token)
    .send(payload);
}

export function testModel(model, selectedImages, router) {
  return (dispatch, getState) => {
    return startModelTesting(model, selectedImages, getState().auth.token)
      .end((err, res) => {
        router.transitionTo('/tests');
        resetModelTestingData(dispatch);
      });
  };
}
