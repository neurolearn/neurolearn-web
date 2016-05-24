import { createAction, handleActions } from 'redux-actions';

export const SET_SUBJECT_ID_DATA = 'SET_SUBJECT_ID_DATA';
export const RESET_SUBJECT_ID_DATA = 'RESET_SUBJECT_ID_DATA';

export const setSubjectIdData = createAction(SET_SUBJECT_ID_DATA);
export const resetSubjectIdData = createAction(RESET_SUBJECT_ID_DATA);

const initialState = {
  field: {
    index: null
  }
};

export default handleActions({
  SET_SUBJECT_ID_DATA: (state, action) => action.payload,
  RESET_SUBJECT_ID_DATA: (state, action) => initialState
}, initialState);
