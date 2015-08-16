import { SHOW_SELECT_IMAGES_MODAL,
         HIDE_SELECT_IMAGES_MODAL,
         TOGGLE_IMAGE,
         TOGGLE_ALL_IMAGES } from '../actions/actionTypes';

import update from 'react/lib/update';

const initialState = {
  selectImagesModal: {
    display: false,
    collectionId: null
  },
  selectedImages: {

  }
};

function imageToggle(selectedImages, collectionId, imageId) {
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

  return update(selectedImages,
    {[collectionId]: {$apply: toggle}}
  );
}

function toggleAllImages(selectedImages, collectionId, imageList, checked) {
  const images = imageList.reduce(function(accum, image) {
    accum[image] = checked;
    return accum;
  }, {});

  return update(selectedImages,
    {[collectionId]: {$set: images}}
  );
}

export default function rootReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SHOW_SELECT_IMAGES_MODAL:
      return Object.assign({}, state, {
        selectImagesModal: {
          display: true,
          collectionId: action.collectionId
        }
      });

    case HIDE_SELECT_IMAGES_MODAL:
      return Object.assign({}, state, {
        selectImagesModal: {
          display: false,
          collectionId: null
        }
      });

    case TOGGLE_IMAGE:
      return Object.assign({}, state, {
        selectedImages: imageToggle(state.selectedImages,
                                    action.collectionId,
                                    action.imageId)
      });

    case TOGGLE_ALL_IMAGES:
      return Object.assign({}, state, {
        selectedImages: toggleAllImages(state.selectedImages,
                                    action.collectionId,
                                    action.imageList,
                                    action.checked)
      });

    default:
      return state;
  }
}
