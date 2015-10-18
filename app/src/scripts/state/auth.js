import jwtDecode from 'jwt-decode';
import api from '../api';
import { hideAuthModal } from './authModal';
import { JWT_KEY_NAME } from '../constants/auth';

const REQUEST_LOGIN = 'REQUEST_LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAIL = 'LOGIN_FAIL';
const LOGOUT = 'LOGOUT';

export function requestLogin() {
  return {
    type: REQUEST_LOGIN
  };
}

export function loginSuccess(token) {
  return {
    type: LOGIN_SUCCESS,
    token
  };
}

function loginFail(loginError) {
  return {
    type: LOGIN_FAIL,
    loginError
  };
}

export function logout() {
  return {
    type: LOGOUT
  };
}

export function login(email, password) {
  return dispatch => {
    dispatch(requestLogin());
    return api.fetchAuthToken(email, password,
      (err, res) => {
        if (err) {
          dispatch(loginFail({message: err.message}));
        } else {
          if (res.body.errors) {
            dispatch(loginFail({fields: res.body.errors}));
          } else {
            const jwt = res.body.token;
            dispatch(loginSuccess(jwt));
            dispatch(hideAuthModal());
            localStorage.setItem(JWT_KEY_NAME, jwt);
          }
        }
      });
  };
}

export default function reducer(state = { display: false }, action) {
  switch (action.type) {
    case REQUEST_LOGIN:
      return { loggingIn: true };
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        token: null,
        loginError: action.loginError
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        loginError: null,
        token: action.token,
        user: jwtDecode(action.token)
      };
    case LOGOUT:
      return {
        ...state,
        token: null,
        user: null
      };
    default:
      return state;
  }
}
