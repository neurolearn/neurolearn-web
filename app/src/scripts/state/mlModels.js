import request from 'superagent';
import logout from './auth';
import { JWT_KEY_NAME } from '../constants/auth';

export const REQUEST_MLMODELS = 'REQUEST_MLMODELS';
export const RECEIVE_MLMODELS = 'RECEIVE_MLMODELS';

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

function fetchMLModels(token) {
  return request.get('/mlmodels')
    .type('json')
    .accept('json')
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

export default function reducer(state = {}, action) {
  switch (action.type) {
    case RECEIVE_MLMODELS:
      return action.objects.entities.MLModel;
    default:
      return state;
  }
}
