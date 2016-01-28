import { map, pick, keys, mapValues } from 'lodash';
import { createAction } from 'redux-actions';

import api from '../api';

import { resetSearch } from './search';
import { resetSelectedImages } from './selectedImages';
import { hideSelectImagesModal } from './selectImagesModal';

export const SET_TEST_MODEL = 'SET_TEST_MODEL';
export const REQUEST_TEST_MODEL = 'REQUEST_TEST_MODEL';
export const RESET_TEST_MODEL = 'RESET_TEST_MODEL';

export const setTestModel = createAction(SET_TEST_MODEL);
export const requestTestModel = createAction(REQUEST_TEST_MODEL);

function extractId(url) {
  return parseInt(url.match(/images\/(\d+)/)[1]);
}

function listImageIds(selectedImages) {
  return mapValues(selectedImages, function(urlsMap) {
    return map(keys(pick(urlsMap, Boolean)), extractId);
  });
}

function resetModelTestData(dispatch) {
  [resetSearch,
   resetSelectedImages,
   hideSelectImagesModal].map(action => dispatch(action()));
}

export function testModel(modelId, selectedImages, router) {
  return (dispatch, getState) => {
    dispatch(requestTestModel());
    return api.testModel(
      modelId,
      listImageIds(selectedImages),
      getState().auth.token,
      err => {
        if (!err) {
          router.transitionTo('/dashboard/tests');
          resetModelTestData(dispatch);
        }
      });
  };
}

const initialState = {
  isFetching: false,
  model: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_TEST_MODEL:
      return Object.assign({}, state, {
        model: action.payload
      });
    case REQUEST_TEST_MODEL:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RESET_TEST_MODEL:
      return initialState;
    default:
      return state;
  }
}
