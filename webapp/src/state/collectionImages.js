import range from 'lodash/utility/range';
import type { Action } from '.';
import { createAction } from 'redux-actions';
import { apiError } from './alertMessages';

import api from '../api';

const REQUEST_CHUNK_SIZE = 100;

const REQUEST_COLLECTION_IMAGES = 'REQUEST_COLLECTION_IMAGES';
const RECEIVE_COLLECTION_IMAGES = 'RECEIVE_COLLECTION_IMAGES';

export const requestCollectionImages = createAction(REQUEST_COLLECTION_IMAGES);
export const receiveCollectionImages = createAction(RECEIVE_COLLECTION_IMAGES);

const fetchCollectionImages = (id, limit, offset) => {
  return api.get(`/nvproxy/api/collections/${id}/images/?limit=${limit}&offset=${offset}`);
};

export function loadCollectionImages(collectionId: number, totalImageNumber: number) {
  return (dispatch: Function) => {
    dispatch(requestCollectionImages(collectionId));

    const promises = range(0, totalImageNumber, REQUEST_CHUNK_SIZE).map(offset => {
      return fetchCollectionImages(collectionId, REQUEST_CHUNK_SIZE, offset);
    });

    return Promise.all(promises).then(results => {
      const items = results.reduce((accum, r) => accum.concat(r.results), []);
      dispatch(receiveCollectionImages({
        id: collectionId, items: items
      }));
    })
    .catch(error => dispatch(apiError(error)));
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
