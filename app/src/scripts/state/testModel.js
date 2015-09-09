import { map, pick, keys, mapValues } from 'lodash';
import request from 'superagent';

export const SET_TEST_MODEL = 'SET_TEST_MODEL';
export const RESET_TEST_MODEL = 'RESET_TEST_MODEL';

import { resetSearch } from './search';
import { resetSelectedImages } from './selectedImages';
import { hideSelectImagesModal } from './selectImagesModal';


export function setTestModel(model) {
  return {
    type: SET_TEST_MODEL,
    model
  };
}

function extractId(url) {
  return parseInt(url.match(/images\/(\d+)/)[1]);
}

function listImageIds(selectedImages) {
  return mapValues(selectedImages, function(urlsMap) {
    return map(keys(pick(urlsMap, Boolean)), extractId);
  });
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

function resetModelTestData(dispatch) {
  [resetSearch,
   resetSelectedImages,
   hideSelectImagesModal].map(action => dispatch(action()));
}

export function testModel(modelId, selectedImages, router) {
  return (dispatch, getState) => {
    return startModelTesting(modelId, listImageIds(selectedImages), getState().auth.token)
      .end((err) => {
        if (!err) {
          router.transitionTo('/tests');
          resetModelTestData(dispatch);
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
