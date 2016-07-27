/* @flow */

import cloneDeep from 'lodash/lang/cloneDeep';
import update from 'react/lib/update';

import { createAction } from 'redux-actions';
import type { Action } from '../types';

export const TOGGLE_IMAGE = 'TOGGLE_IMAGE';
export const TOGGLE_IMAGE_LIST = 'TOGGLE_IMAGE_LIST';
export const RESET_SELECTED_IMAGES = 'RESET_SELECTED_IMAGES';

export const toggleImage = createAction(TOGGLE_IMAGE);
export const toggleImageList = createAction(TOGGLE_IMAGE_LIST);

export const resetSelectedImages = createAction(RESET_SELECTED_IMAGES);

function imageListToggle(state, collection, images, checked) {
  const imagesUpdate = images.reduce((accum, image) => {
    accum[image.url] = checked;
    return accum;
  }, {});

  return update(state, {
    images: {[collection._id]: {[state.images[collection._id] ? '$merge' : '$set']: imagesUpdate}},
    collectionsById: {$merge: {[collection._id]: cloneDeep(collection)}}
  });
}

function imageToggle(state, collection, imageId) {
  const toggle = function(x) {
    if (x) {
      if (x[imageId]) {
        x[imageId] = false;
      } else {
        x[imageId] = true;
      }
      return x;
    } else {
      return {[imageId]: true};
    }
  };

  return update(state, {
    images: {[collection._id]: {$apply: toggle}},
    collectionsById: {$merge: {[collection._id]: cloneDeep(collection)}}
  });
}

type SelectedImagesState = {
  images: Object,
  collectionsById: Object
};

const initialState: SelectedImagesState = {
  images: {},
  collectionsById: {}
};

export default function reducer(state: SelectedImagesState = initialState, action: Action) {
  switch (action.type) {
    case TOGGLE_IMAGE:
      const { collectionId, imageId } = action.payload;
      return imageToggle(state, collectionId, imageId);

    case TOGGLE_IMAGE_LIST:
      const { collection, images, checked } = action.payload;
      return imageListToggle(state, collection, images, checked);

    case RESET_SELECTED_IMAGES:
      return initialState;
    default:
      return state;
  }
}
