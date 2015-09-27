import request from 'superagent';
import logout from './auth';
import { JWT_KEY_NAME } from '../constants/auth';

export const REQUEST_MODEL_TESTS = 'REQUEST_MODEL_TESTS';
export const RECEIVE_MODEL_TESTS = 'RECEIVE_MODEL_TESTS';
export const REQUEST_DELETE_MLMODEL = 'REQUEST_DELETE_MLMODEL';
export const ERROR_WHILE_SAVING_GROUPS = 'ERROR_WHILE_SAVING_GROUPS';

function requestModelTests() {
  return {
    type: REQUEST_MODEL_TESTS
  };
}

function receiveModelTests(objects) {
  return {
    type: RECEIVE_MODEL_TESTS,
    objects
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

function fetchModelTests(token) {
  return request.get('/tests')
    .type('json')
    .accept('json')
    .set('Authorization', 'Bearer ' + token);
}

function _deleteModelTest(modelId, token) {
  return request.del(`/tests/${modelId}`)
    .set('Authorization', 'Bearer ' + token);
}

function _saveCorrelationGroups(modelId, groups, token) {
  return request.post(`/tests/${modelId}/groups`)
    .set('Authorization', 'Bearer ' + token)
    .send(groups)
    .type('json');
}

export function loadModelTests() {
  return (dispatch, getState) => {
    dispatch(requestModelTests());

    return fetchModelTests(getState().auth.token)
      .end((err, res) => {
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

    return _deleteModelTest(modelId, getState().auth.token)
      .end((err, res) => {
        router.transitionTo('/tests');
      });
  };
}

export function saveCorrelationGroups(modelId, groups) {
  return (dispatch, getState) => {
    return _saveCorrelationGroups(modelId, groups, getState().auth.token)
      .end((err) => {
        if (err) {
          dispatch(errorWhileSavingGroups());
        }
      });
  };
}

export default function reducer(state = {}, action) {
  switch (action.type) {
    case RECEIVE_MODEL_TESTS:
      return action.objects.entities
        ? action.objects.entities.ModelTest
        : {};
    default:
      return state;
  }
}
