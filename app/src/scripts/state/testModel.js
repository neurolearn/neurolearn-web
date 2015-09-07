import request from 'superagent';

export const SET_TEST_MODEL = 'SET_TEST_MODEL';

export function setTestModel(model) {
  return {
    type: SET_TEST_MODEL,
    model
  };
}

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

export default function reducer(state = {}, action) {
  switch (action.type) {
    case SET_TEST_MODEL:
      return action.model;
    default:
      return state;
  }
}
