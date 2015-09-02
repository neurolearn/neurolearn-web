export const SHOW_SELECT_IMAGES_MODAL = 'SHOW_SELECT_IMAGES_MODAL';
export const HIDE_SELECT_IMAGES_MODAL = 'HIDE_SELECT_IMAGES_MODAL';

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

const initialState = { display: false, collectionId: null };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_SELECT_IMAGES_MODAL:
      return { display: true, collectionId: action.collectionId };

    case HIDE_SELECT_IMAGES_MODAL:
      return initialState;

    default:
      return state;
  }
}
