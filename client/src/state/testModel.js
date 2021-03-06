/* @flow */

import { map, pick, keys, mapValues } from 'lodash';
import { createAction } from 'redux-actions';
import type { Action } from '../types';

import api from '../api';

import { resetSearch } from './search';
import { resetSelectedImages } from './selectedImages';
import { hideSelectImagesModal } from './selectImagesModal';

export const SET_TEST_MODEL = 'SET_TEST_MODEL';
export const REQUEST_TEST_MODEL = 'REQUEST_TEST_MODEL';
export const RESET_TEST_MODEL = 'RESET_TEST_MODEL';
export const INPUT_NV_IMAGE_ID = 'INPUT_NV_IMAGE_ID';

export const setTestModel = createAction(SET_TEST_MODEL);
export const resetTestModel = createAction(RESET_TEST_MODEL);
export const requestTestModel = createAction(REQUEST_TEST_MODEL);
export const inputNVImageId = createAction(INPUT_NV_IMAGE_ID);

function extractId(url) {
  return parseInt(url.match(/images\/(\d+)/)[1]);
}

function listImageIds(
  selectedImages: {
    [collectionId: string]: {
      [url: string]: boolean
    }
  }
) {
  return mapValues(
    selectedImages,
    urlsMap => map(keys(pick(urlsMap, Boolean)), extractId)
  );
}

export function resetModelTestData(dispatch) {
  [
    resetSearch,
    resetSelectedImages,
    resetTestModel,
    hideSelectImagesModal
  ].map(action => dispatch(action()));
}

export function testModel(
  params: {
    name: string,
    modelId: number,
    neurovaultImageId: number,
    selectedImages: Object,
  },
  router: Object
) {
  return (dispatch: Function, getState: Function) => {
    dispatch(requestTestModel());

    const payload = Object.assign({}, params, {
      selectedImages: listImageIds(params.selectedImages)
    });

    return api.post('/api/tests', payload, getState().auth.token)
      .then(
        () => {
          router.push('/dashboard/tests');
          resetModelTestData(dispatch);
        }
    );
  };
}

type TestModelState = {
  isFetching: boolean,
  model?: number
};

const initialState: TestModelState = {
  isFetching: false,
  model: undefined
};

export default function reducer(state: TestModelState = initialState, action: Action) {
  switch (action.type) {
    case SET_TEST_MODEL:
      return Object.assign({}, state, {
        isFetching: false,
        model: action.payload
      });
    case REQUEST_TEST_MODEL:
      return Object.assign({}, state, {
        isFetching: true
      });
    case INPUT_NV_IMAGE_ID:
      return Object.assign({}, state, {
        neurovaultImageId: action.payload
      });
    case RESET_TEST_MODEL:
      return initialState;
    default:
      return state;
  }
}
