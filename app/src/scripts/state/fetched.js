/* @flow */

import { createAction } from 'redux-actions';
import type { Action } from '../types';

import api from '../api';
import { apiError, API_ERROR } from './alertMessages';

export const REQUEST_DATA = 'REQUEST_DATA';
export const RECEIVE_DATA = 'RECEIVE_DATA';
export const DELETE_LOCAL_ITEMS = 'DELETE_LOCAL_ITEMS';

const requestData = createAction(REQUEST_DATA);
const deleteLocalItems = createAction(DELETE_LOCAL_ITEMS);

function receiveData(payload, key) {
  return {
    type: RECEIVE_DATA,
    payload,
    meta: { key }
  };
}

export function fetchJSON(path: string, key: string) {
  return (dispatch: Function) => {
    dispatch(requestData({ path, key }));
    return api.get(path)
      .then(
        result => dispatch(receiveData(result, key)),
        error => dispatch(apiError(error))
      );
  };
}

export function deleteItem(path: string, success?: Function) {
  return (dispatch: Function) => {
    return api.delete(path)
      .then(success, error => dispatch(apiError(error)));
  };
}

export function deleteItemList(path: string, key: string, itemKeys: Array<string>, success?: Function) {
  return (dispatch: Function) => {
    dispatch(deleteLocalItems({key, itemKeys}));
    return api.post(path, itemKeys)
      .then(success, error => dispatch(apiError(error)));
  };
}

export function patchItem(path: string, key: string, payload: Object, success?: Function) {
  return (dispatch: Function) => {
    return api.patch(path, payload)
      .then(
        result => dispatch(receiveData(result, key)),
        error => dispatch(apiError(error))
      );
  }
}

const initialState = {
  isFetching: false
};

type FetchedState = {
  isFetching: boolean,
  [key: string]: Object
};

export default function reducer(state: FetchedState = initialState, action: Action) {
  switch (action.type) {
    case REQUEST_DATA:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_DATA:
      return action.meta !== undefined
        ? Object.assign({}, state, {
          isFetching: false,
          [action.meta.key]: action.payload.data
        })
        : state;
    case DELETE_LOCAL_ITEMS:
      const { key, itemKeys } = action.payload;
      const mappedKeys = itemKeys.reduce((accum, x) => {accum[x] = true; return accum}, {})

      return Object.assign({}, state, {
        [key]: state[key].filter(x => !mappedKeys[x.id])
      });
    case API_ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        isNotFound: action.payload.response && action.payload.response.status === 404
      });
    default:
      return state;
  }
}
