import { SHOW_SELECT_IMAGES_MODAL,
         HIDE_SELECT_IMAGES_MODAL,
         TOGGLE_IMAGE,
         TOGGLE_ALL_IMAGES
          } from './actionTypes';

export function showSelectImagesModal(collectionId) {
  return {
    type: SHOW_SELECT_IMAGES_MODAL,
    collectionId
  };
}

export function hideSelectImagesModal() {
  return {
    type: HIDE_SELECT_IMAGES_MODAL
  };
}

export function toggleImage(collectionId, imageId) {
  return {
    type: TOGGLE_IMAGE,
    collectionId,
    imageId
  };
}

export function toggleAllImages(collectionId, imageList, checked) {
  return {
    type: TOGGLE_ALL_IMAGES,
    collectionId,
    imageList,
    checked
  };
}
