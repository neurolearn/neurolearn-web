import type { Action } from '.';
import { createAction } from 'redux-actions';

import api from '../api';

const REQUEST_COLLECTION_IMAGES = 'REQUEST_COLLECTION_IMAGES';
const RECEIVE_COLLECTION_IMAGES = 'RECEIVE_COLLECTION_IMAGES';

export const requestCollectionImages = createAction(REQUEST_COLLECTION_IMAGES);
export const receiveCollectionImages = createAction(RECEIVE_COLLECTION_IMAGES);

export function loadCollectionImages(collectionId: number) {
  return (dispatch: Function) => {
    dispatch(requestCollectionImages(collectionId));

    api.get(`/nvproxy/api/collections/${collectionId}/images/`)
      .then(
        result => {
          console.log(collectionId, result);
          dispatch(receiveCollectionImages({
            id: collectionId, items: result.results
          }));
        },
        error => console.log(collectionId, error)
    );
  };
}

export default function reducer(state
: {
  isFetching: boolean,
  collectionsById: {}
} = {
  isFetching: false
}, action: Action) {
  switch (action.type) {
    case REQUEST_COLLECTION_IMAGES:
      return {...state, isFetching: true};

    case RECEIVE_COLLECTION_IMAGES: {
      const { id, items } = action.payload;

      return {
        ...state,
        [id]: items,
        isFetching: false
      };
    }

    default:
      return state;
  }
}
