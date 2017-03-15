/* @flow */

import { createAction } from 'redux-actions';
import type { Action } from '../types';

export const SHOW_SELECT_IMAGES_MODAL = 'SHOW_SELECT_IMAGES_MODAL';
export const SELECT_COLLECTION_SOURCE = 'SELECT_COLLECTION_SOURCE';
export const HIDE_SELECT_IMAGES_MODAL = 'HIDE_SELECT_IMAGES_MODAL';

export const SEARCH = 'SEARCH';
export const MY_COLLECTIONS = 'MY_COLLECTIONS';

export const showSelectImagesModal = createAction(SHOW_SELECT_IMAGES_MODAL);
export const hideSelectImagesModal = createAction(HIDE_SELECT_IMAGES_MODAL);
export const selectCollectionSource = createAction(SELECT_COLLECTION_SOURCE);

type SelectImagesModalState = {
  display: boolean,
  collectionId: string
};

const initialState: SelectImagesModalState = { display: false, collectionId: '', source: SEARCH };

export default function reducer(state: SelectImagesModalState = initialState, action: Action) {
  switch (action.type) {
    case SHOW_SELECT_IMAGES_MODAL:
      const { collectionId, source } = action.payload;
      return { display: true, collectionId, source };

    case HIDE_SELECT_IMAGES_MODAL:
      return Object.assign({}, state, {
        display: false,
        collectionId: ''
      });

    case SELECT_COLLECTION_SOURCE:
      return Object.assign({}, state, {
        source: action.payload
      });

    default:
      return state;
  }
}
