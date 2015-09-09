import request from 'superagent';
import { logout } from './auth';
import { JWT_KEY_NAME } from '../constants/auth';

export const REQUEST_MLMODELS = 'REQUEST_MLMODELS';
export const RECEIVE_MLMODELS = 'RECEIVE_MLMODELS';
export const REQUEST_DELETE_MLMODEL = 'REQUEST_DELETE_MLMODEL';

function requestMLModels() {
  return {
    type: REQUEST_MLMODELS
  };
}

function receiveMLModels(objects) {
  return {
    type: RECEIVE_MLMODELS,
    objects
  };
}

function requestDeleteMLModel(modelId) {
  return {
    type: REQUEST_DELETE_MLMODEL,
    modelId
  };
}

function fetchMLModels(token) {
  return request.get('/mlmodels')
    .type('json')
    .accept('json')
    .set('Authorization', 'Bearer ' + token);
}

function _deleteMLModel(modelId, token) {
  return request.del(`/mlmodels/${modelId}`)
    .set('Authorization', 'Bearer ' + token);
}

export function loadMLModels() {
  return (dispatch, getState) => {
    dispatch(requestMLModels());

    return fetchMLModels(getState().auth.token)
      .end((err, res) => {
        if (err && err.status === 401) {
          localStorage.removeItem(JWT_KEY_NAME);
          dispatch(logout());
        } else {
          dispatch(receiveMLModels(res.body));
        }
      });
  };
}

export function deleteMLModel(modelId, router) {
  return (dispatch, getState) => {
    dispatch(requestDeleteMLModel(modelId));

    return _deleteMLModel(modelId, getState().auth.token)
      .end((err, res) => {
        router.transitionTo('/');
      });
  };
}

export default function reducer(state = {}, action) {
  switch (action.type) {
    case RECEIVE_MLMODELS:
      return action.objects.entities
        ? action.objects.entities.MLModel
        : {};
    default:
      return state;
  }
}
