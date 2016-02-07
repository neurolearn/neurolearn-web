import { logout } from './auth';
import { JWT_KEY_NAME } from '../constants/auth';

import { createAction } from 'redux-actions';

import api from '../api';
import { apiError } from './alertMessages';

export const REQUEST_ITEM_LIST = 'REQUEST_ITEM_LIST';
export const RECEIVE_ITEM_LIST = 'RECEIVE_ITEM_LIST';

const requestItemList = createAction(REQUEST_ITEM_LIST);

function receiveItemList(payload, key) {
  return {
    type: RECEIVE_ITEM_LIST,
    payload,
    meta: { key }
  };
}

export function loadItemList(path, key) {
  return (dispatch, getState) => {
    const { token } = getState().auth;
    dispatch(requestItemList());
    return api.get(path, token)
      .then(
        result => dispatch(receiveItemList(result, key)),
        error => {
          if (error && (error.response.status === 400
                     || error.response.status === 401)) {
            localStorage.removeItem(JWT_KEY_NAME);
            dispatch(logout());
          } else {
            dispatch(apiError(error));
          }
        }
      );
  };
}

const initialState = {
  isFetching: false,
  items: {}
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_ITEM_LIST:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_ITEM_LIST:
      return Object.assign({}, state, {
        isFetching: false,
        items: {
          ...state.items,
          [action.meta.key]: action.payload.data
        }
      });
    default:
      return state;
  }
}
