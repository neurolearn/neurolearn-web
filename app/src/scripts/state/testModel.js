import request from 'superagent';

export const SET_TEST_MODEL = 'SET_TEST_MODEL';
export const RESET_TEST_MODEL = 'RESET_TEST_MODEL';

export function setTestModel(model) {
  return {
    type: SET_TEST_MODEL,
    model
  };
}

export function resetTestModel(model) {
  return {
    type: RESET_TEST_MODEL
  };
}

function startModelTesting(modelId, selectedImages, token) {
  const payload = {
    modelId,
    selectedImages
  };

  return request.post('/tests')
    .type('json')
    .accept('json')
    .set('Authorization', 'Bearer ' + token)
    .send(payload);
}

export function testModel(modelId, selectedImages, router) {
  return (dispatch, getState) => {
    return startModelTesting(modelId, selectedImages, getState().auth.token)
      .end((err) => {
        if (!err) {
          router.transitionTo('/tests');
          resetTestModel();
        }
      });
  };
}

const initialState = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_TEST_MODEL:
      return action.model;
    case RESET_TEST_MODEL:
      return initialState;
    default:
      return state;
  }
}
