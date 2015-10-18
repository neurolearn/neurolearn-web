import { logout } from './auth';
import { JWT_KEY_NAME } from '../constants/auth';
import api from '../api';

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

export function loadMLModels() {
  return (dispatch, getState) => {
    dispatch(requestMLModels());
    return api.fetchMLModels(
      getState().auth.token,
      (err, res) => {
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

    return api.deleteMLModel(
      modelId,
      getState().auth.token,
      (err, res) => {
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
