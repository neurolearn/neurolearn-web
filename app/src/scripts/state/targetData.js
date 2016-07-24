/* @flow */

import { createAction, handleActions } from 'redux-actions';

export const SET_TARGET_DATA = 'SET_TARGET_DATA';
export const RESET_TARGET_DATA = 'RESET_TARGET_DATA';

export const setTargetData = createAction(SET_TARGET_DATA);
export const resetTargetData = createAction(RESET_TARGET_DATA);

const initialState = {
  field: {
    index: null
  }
};

export default handleActions({
  SET_TARGET_DATA: (state, action) => action.payload,
  RESET_TARGET_DATA: (state, action) => initialState
}, initialState);
