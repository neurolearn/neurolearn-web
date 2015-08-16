import { SHOW_SELECT_IMAGES_MODAL, HIDE_SELECT_IMAGES_MODAL } from '../actions/actionTypes';

const initialState = {
  selectImagesModal: {
    display: false,
    collectionId: null
  }
};

export default function rootReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SHOW_SELECT_IMAGES_MODAL:
      return {
        selectImagesModal: {
          display: true,
          collectionId: action.collectionId
        }
      };
    case HIDE_SELECT_IMAGES_MODAL:
      return {
        selectImagesModal: {
          display: false,
          collectionId: null
        }
      };
    default:
      return state;
  }
}
