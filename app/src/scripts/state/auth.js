import jwtDecode from 'jwt-decode';
import { createAction } from 'redux-actions';
import api from '../api';
import { removeAuthToken } from '../utils';

const REQUEST_AUTHENTICATED_USER = 'REQUEST_AUTHENTICATED_USER';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILED = 'LOGIN_FAILED';
const LOGOUT = 'LOGOUT';

export const requestAuthenticatedUser = createAction(REQUEST_AUTHENTICATED_USER);
export const loginSuccess = createAction(LOGIN_SUCCESS);
const loginFailed = createAction(LOGIN_FAILED);
export const logout = createAction(LOGOUT);

function heapId(user) {
  return `${user.id}/${user.name}`;
}

export function fetchAuthenticatedUser(callback) {
  return dispatch => {
    dispatch(requestAuthenticatedUser());
    return api.get('/api/user')
      .then(
        result => {
          dispatch(loginSuccess(result.data));
          if (window.heap) {
            window.heap.identify(heapId(result.data));
          }
          if (callback) {
            callback();
          }
        },
        error => {
          console.log(error);
          if (error && error.response) {
            const { status } = error.response;
            if (status === 400 || status === 401) {
              removeAuthToken();
              dispatch(loginFailed());
              if (callback) {
                callback();
              }
            }
          }
        }
      );
  }
}

const initialState = {
  isFetching: false,
  user: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_AUTHENTICATED_USER:
      return {
        ...state,
        isFetching: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isFetching: false
      };
    case LOGIN_FAILED:
      return {
        ...state,
        user: null,
        isFetching: false
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
