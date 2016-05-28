import { createAction } from 'redux-actions';

import api from '../api';
import { apiError } from './alertMessages';

export const REQUEST_DATA = 'REQUEST_DATA';
export const RECEIVE_DATA = 'RECEIVE_DATA';

const requestData = createAction(REQUEST_DATA);

function receiveData(payload, key) {
  return {
    type: RECEIVE_DATA,
    payload,
    meta: { key }
  };
}

export function fetchJSON(path, key) {
  return (dispatch) => {
    dispatch(requestData({ path, key }));
    return api.get(path)
      .then(
        result => dispatch(receiveData(result, key)),
        error => dispatch(apiError(error))
      );
  };
}

export function deleteItem(path, success) {
  return (dispatch) => {
    return api.delete(path)
      .then(success, error => dispatch(apiError(error)));
  };
}

export function deleteItemList(path, itemKeys, success) {
  return (dispatch) => {
    return api.post(path, itemKeys)
      .then(success, error => dispatch(apiError(error)));
  };
}

const initialState = {
  isFetching: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_DATA:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_DATA:
      return Object.assign({}, state, {
        isFetching: false,
        [action.meta.key]: action.payload.data
      });
    default:
      return state;
  }
}
