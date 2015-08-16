import { SHOW_SELECT_IMAGES_MODAL, HIDE_SELECT_IMAGES_MODAL } from './actionTypes';

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
