import { logout } from './auth';
import { JWT_KEY_NAME } from '../constants/auth';
import { apiError } from './alertMessages';
import api from '../api';

export const REQUEST_AUTH_USER_MLMODELS = 'REQUEST_AUTH_USER_MLMODELS';
export const REQUEST_MLMODEL = 'REQUEST_MLMODEL';
export const RECEIVE_MLMODEL = 'RECEIVE_MLMODEL';
export const RECEIVE_AUTH_USER_MLMODELS = 'RECEIVE_AUTH_USER_MLMODELS';
export const REQUEST_DELETE_MLMODEL = 'REQUEST_DELETE_MLMODEL';

function requestAuthUserMLModels() {
  return {
    type: REQUEST_AUTH_USER_MLMODELS
  };
}

function receiveAuthUserMLModels(response) {
  return {
    type: RECEIVE_AUTH_USER_MLMODELS,
    response
  };
}

function receiveMLModel(response) {
  return {
    type: RECEIVE_MLMODEL,
    response
  };
}

function requestDeleteMLModel(modelId) {
  return {
    type: REQUEST_DELETE_MLMODEL,
    modelId
  };
}

function requestMLModel() {
  return {
    type: REQUEST_MLMODEL
  };
}

export function loadAuthUserMLModels() {
  return (dispatch, getState) => {
    dispatch(requestAuthUserMLModels());
    return api.get('/api/user/models', getState().auth.token)
      .then(
        result => dispatch(receiveAuthUserMLModels(result)),
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


export function deleteMLModel(modelId, router) {
  return (dispatch, getState) => {
    dispatch(requestDeleteMLModel(modelId));

    return api.delete(`/api/models/${modelId}`, getState().auth.token)
      .then(
        () => {
          router.transitionTo('/dashboard/models');
        },
        error => {
          dispatch(apiError(error));
        }
    );
  };
}

export function loadMLModel(modelId) {
  return (dispatch, getState) => {
    dispatch(requestMLModel());
    const token = getState().auth ? getState().auth.token : null;

    return api.get(`/api/models/${modelId}`, token)
      .then(
        result => dispatch(receiveMLModel(result)),
        error => dispatch(apiError(error))
      );
  };
}

const initialState = {
  isFetching: false,
  items: [],
  item: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_AUTH_USER_MLMODELS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case REQUEST_MLMODEL:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_AUTH_USER_MLMODELS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.response.data
      });
    case RECEIVE_MLMODEL:
      return Object.assign({}, state, {
        isFetching: false,
        item: action.response.data
      });
    default:
      return state;
  }
}
