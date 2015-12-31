import { logout } from './auth';
import { JWT_KEY_NAME } from '../constants/auth';
import api from '../api';

export const REQUEST_AUTH_USER_MLMODELS = 'REQUEST_AUTH_USER_MLMODELS';
export const RECEIVE_AUTH_USER_MLMODELS = 'RECEIVE_AUTH_USER_MLMODELS';
export const REQUEST_DELETE_MLMODEL = 'REQUEST_DELETE_MLMODEL';

function requestAuthUserMLModels() {
  return {
    type: REQUEST_AUTH_USER_MLMODELS
  };
}

function receiveAuthUserMLModels(objects) {
  return {
    type: RECEIVE_AUTH_USER_MLMODELS,
    objects
  };
}

function requestDeleteMLModel(modelId) {
  return {
    type: REQUEST_DELETE_MLMODEL,
    modelId
  };
}

export function loadAuthUserMLModels() {
  return (dispatch, getState) => {
    dispatch(requestAuthUserMLModels());
    return api.fetchAuthUserMLModels(
      getState().auth.token,
      (err, res) => {
        if (err && err.status === 401) {
          localStorage.removeItem(JWT_KEY_NAME);
          dispatch(logout());
        } else {
          dispatch(receiveAuthUserMLModels(res.body));
        }
      });
  };
}

export function loadPublicModels() {
  return (dispatch) => {
    dispatch(requestAuthUserMLModels());
    return api.fetchMLModels(
      (err, res) => {
        dispatch(receiveAuthUserMLModels(res.body));
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

const initialState = {
  isFetching: false,
  entities: {},
  items: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_AUTH_USER_MLMODELS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_AUTH_USER_MLMODELS:
      return Object.assign({}, state, {
        isFetching: false,
        entities: action.objects.entities.MLModel,
        items: action.objects.result
      });
    default:
      return state;
  }
}
