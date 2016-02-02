import { createAction } from 'redux-actions';

import api from '../api';
import { apiError } from './alertMessages';

export const REQUEST_ITEM_DETAIL = 'REQUEST_ITEM_DETAIL';
export const RECEIVE_ITEM_DETAIL = 'RECEIVE_ITEM_DETAIL';
export const REQUEST_DELETE_ITEM = 'REQUEST_DELETE_ITEM';

const requestItemDetail = createAction(REQUEST_ITEM_DETAIL);
const requestDeleteItem = createAction(REQUEST_DELETE_ITEM);

function receiveItemDetail (payload, key) {
  return {
    type: RECEIVE_ITEM_DETAIL,
    payload,
    meta: { key }
  };
}

export function loadItemDetail(path, key) {
  return (dispatch) => {
    dispatch(requestItemDetail());
    return api.get(path)
      .then(
        result => dispatch(receiveItemDetail(result, key)),
        error => dispatch(apiError(error))
      );
  };
}

export function deleteItem(path, success) {
  return (dispatch, getState) => {
    dispatch(requestDeleteItem());

    return api.delete(path, getState().auth.token)
      .then(success, error => dispatch(apiError(error)));
  };
}

const initialState = {
  isFetching: false,
  item: {}
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_ITEM_DETAIL:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_ITEM_DETAIL:
      return Object.assign({}, state, {
        isFetching: false,
        item: {
          ...state.item,
          [action.meta.key]: action.payload.data
        }
      });
    default:
      return state;
  }
}
