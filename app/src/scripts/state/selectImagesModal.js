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

export default function reducer(state = { display: false, collectionId: null },
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
