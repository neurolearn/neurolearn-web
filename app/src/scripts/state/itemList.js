import { createAction } from 'redux-actions';

import api from '../api';
import { apiError } from './alertMessages';

export const REQUEST_ITEM_LIST = 'REQUEST_ITEM_LIST';
export const RECEIVE_ITEM_LIST = 'RECEIVE_ITEM_LIST';

const requestItemList = createAction(REQUEST_ITEM_LIST);
const receiveItemList = createAction(RECEIVE_ITEM_LIST);


export function loadItemList(path) {
  return (dispatch) => {
    dispatch(requestItemList());
    return api.get(path)
      .then(
        result => dispatch(receiveItemList(result)),
        error => dispatch(apiError(error))
      );
  };
}

const initialState = {
  isFetching: false,
  items: []
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
        items: action.payload.data
      });
    default:
      return state;
  }
}
