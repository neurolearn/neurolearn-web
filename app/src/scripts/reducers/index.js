import { combineReducers } from 'redux';

import { SHOW_SELECT_IMAGES_MODAL,
         HIDE_SELECT_IMAGES_MODAL,
         TOGGLE_IMAGE,
         TOGGLE_ALL_IMAGES } from '../actions/actionTypes';

import update from 'react/lib/update';

function imageToggle(state, collectionId, imageId) {
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

  return update(state,
    {[collectionId]: {$apply: toggle}}
  );
}

function toggleAllImages(state, collectionId, imageList, checked) {
  const images = imageList.reduce(function(accum, image) {
    accum[image] = checked;
    return accum;
  }, {});

  return update(state,
    {[collectionId]: {$set: images}}
  );
}

function selectImagesModal(state = { display: false, collectionId: null },
                           action) {
  switch (action.type) {
    case SHOW_SELECT_IMAGES_MODAL:
      return { display: true, collectionId: action.collectionId };

    case HIDE_SELECT_IMAGES_MODAL:
      return { display: false, collectionId: null };

    default:
      return state;
  }
}

function selectedImages(state = {}, action) {
  switch (action.type) {
    case TOGGLE_IMAGE:
      return imageToggle(state, action.collectionId, action.imageId);

    case TOGGLE_ALL_IMAGES:
      return toggleAllImages(state, action.collectionId, action.imageList,
                             action.checked);

    default:
      return state;
  }
}

const rootReducer = combineReducers({
  selectImagesModal,
  selectedImages
});

export default rootReducer;
