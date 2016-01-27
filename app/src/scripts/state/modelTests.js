import logout from './auth';
import { JWT_KEY_NAME } from '../constants/auth';
import api from '../api';

export const REQUEST_MODEL_TEST = 'REQUEST_MODEL_TEST';
export const RECEIVE_MODEL_TEST = 'RECEIVE_MODEL_TEST';
export const REQUEST_MODEL_TESTS = 'REQUEST_MODEL_TESTS';
export const RECEIVE_MODEL_TESTS = 'RECEIVE_MODEL_TESTS';
export const REQUEST_DELETE_MLMODEL = 'REQUEST_DELETE_MLMODEL';
export const ERROR_WHILE_SAVING_GROUPS = 'ERROR_WHILE_SAVING_GROUPS';

function requestModelTest() {
  return {
    type: REQUEST_MODEL_TEST
  };
}

function receiveModelTest(response) {
  return {
    type: RECEIVE_MODEL_TEST,
    response
  };
}

function requestModelTests() {
  return {
    type: REQUEST_MODEL_TESTS
  };
}

function receiveModelTests(response) {
  return {
    type: RECEIVE_MODEL_TESTS,
    response
  };
}

function requestDeleteModelTest(modelId) {
  return {
    type: REQUEST_DELETE_MLMODEL,
    modelId
  };
}

function errorWhileSavingGroups() {
  return {
    type: ERROR_WHILE_SAVING_GROUPS
  };
}

export function loadModelTests() {
  return (dispatch, getState) => {
    dispatch(requestModelTests());

    return api.fetchAuthUserModelTests(getState().auth.token,
      (err, res) => {
        if (err && err.status === 401) {
          localStorage.removeItem(JWT_KEY_NAME);
          dispatch(logout());
        } else {
          dispatch(receiveModelTests(res.body));
        }
      });
  };
}

export function loadModelTest(pk) {
  return (dispatch, getState) => {
    dispatch(requestModelTest());
    const token = getState().auth ? getState().auth.token : null;

    return api.fetchModelTest(
      pk,
      token,
      (err, res) => {
        dispatch(receiveModelTest(res.body));
      }
    );
  };
}

export function deleteModelTest(modelId, router) {
  return (dispatch, getState) => {
    dispatch(requestDeleteModelTest(modelId));

    return api.deleteModelTest(
      modelId,
      getState().auth.token,
      (err, res) => {
        router.transitionTo('/dashboard/tests');
      });
  };
}

export function saveCorrelationGroups(modelId, groups) {
  return (dispatch, getState) => {
    return api.saveCorrelationGroups(
      modelId,
      groups,
      getState().auth.token,
      (err) => {
        if (err) {
          dispatch(errorWhileSavingGroups());
        }
      });
  };
}

export default function reducer(state = {
  isFetching: false,
  items: [],
  item: null
}, action) {
  switch (action.type) {
    case REQUEST_MODEL_TEST:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_MODEL_TESTS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.response.data
      });
    case RECEIVE_MODEL_TEST:
      return Object.assign({}, state, {
        isFetching: false,
        item: action.response.data
      });
    default:
      return state;
  }
}
