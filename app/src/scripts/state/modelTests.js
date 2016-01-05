import logout from './auth';
import { JWT_KEY_NAME } from '../constants/auth';
import api from '../api';

export const REQUEST_MODEL_TESTS = 'REQUEST_MODEL_TESTS';
export const RECEIVE_MODEL_TESTS = 'RECEIVE_MODEL_TESTS';
export const REQUEST_DELETE_MLMODEL = 'REQUEST_DELETE_MLMODEL';
export const ERROR_WHILE_SAVING_GROUPS = 'ERROR_WHILE_SAVING_GROUPS';

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

export function deleteModelTest(modelId, router) {
  return (dispatch, getState) => {
    dispatch(requestDeleteModelTest(modelId));

    return api.deleteModelTest(
      modelId,
      getState().auth.token,
      (err, res) => {
        router.transitionTo('/tests');
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
  items: []
}, action) {
  switch (action.type) {
    case RECEIVE_MODEL_TESTS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.response.result
      });
    default:
      return state;
  }
}
