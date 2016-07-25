/* @flow */

import jwtDecode from 'jwt-decode';
import { createAction } from 'redux-actions';
import api from '../api';
import { removeAuthToken } from '../utils';

import type { User, Action } from '../types';

const REQUEST_AUTHENTICATED_USER = 'REQUEST_AUTHENTICATED_USER';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILED = 'LOGIN_FAILED';
const LOGOUT = 'LOGOUT';

type AuthState = {
  isFetching: boolean,
  user?: User
};

export const requestAuthenticatedUser = createAction(REQUEST_AUTHENTICATED_USER);
export const loginSuccess = createAction(LOGIN_SUCCESS);
const loginFailed = createAction(LOGIN_FAILED);
export const logout = createAction(LOGOUT);

function heapId(user: User) {
  return `${user.id}/${user.name}`;
}

export function fetchAuthenticatedUser(callback: () => void) {
  return (dispatch: Function) => {
    dispatch(requestAuthenticatedUser());
    return api.get('/api/user')
      .then(
        (result: any) => {
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
  user: undefined
};

export default function reducer(state: AuthState = initialState, action: Action) {
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
        user: undefined,
        isFetching: false
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
