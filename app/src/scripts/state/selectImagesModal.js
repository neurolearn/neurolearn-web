/* @flow */

import { createAction } from 'redux-actions';
import type { Action } from '.';

export const SHOW_SELECT_IMAGES_MODAL = 'SHOW_SELECT_IMAGES_MODAL';
export const HIDE_SELECT_IMAGES_MODAL = 'HIDE_SELECT_IMAGES_MODAL';

export const showSelectImagesModal = createAction(SHOW_SELECT_IMAGES_MODAL);
export const hideSelectImagesModal = createAction(HIDE_SELECT_IMAGES_MODAL);

type SelectImagesModalType = {
  display: boolean,
  collectionId: string
};

const initialState: SelectImagesModalType = { display: false, collectionId: '' };

export default function reducer(state: SelectImagesModalType = initialState, action: Action) {
  switch (action.type) {
    case SHOW_SELECT_IMAGES_MODAL:
      return { display: true, collectionId: action.payload };

    case HIDE_SELECT_IMAGES_MODAL:
      return initialState;

    default:
      return state;
  }
}
