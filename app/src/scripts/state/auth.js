import request from 'superagent';

const REQUEST_LOGIN = 'REQUEST_LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAIL = 'LOGIN_FAIL';
const REQUEST_LOGOUT = 'REQUEST_LOGOUT';
const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'LOGOUT_FAIL';

export function requestLogin() {
  return {
    type: REQUEST_LOGIN
  };
}

export function requestLogout() {
  return {
    type: REQUEST_LOGOUT
  };
}

function loginSuccess(user) {
  return {
    type: LOGIN_SUCCESS,
    user
  };
}

function loginFail(loginError) {
  return {
    type: LOGIN_FAIL,
    loginError
  };
}

function logoutSuccess() {
  return {
    type: LOGOUT_SUCCESS
  };
}

function logoutFail(logoutError) {
  return {
    type: LOGOUT_FAIL,
    logoutError
  };
}

function fetchAuthToken(email, password) {
  return request.post('/login/')
    .type('json')
    .accept('json')
    .send({email, password});
}

export function login(email, password) {
  return dispatch => {
    dispatch(requestLogin());
    return fetchAuthToken(email, password)
      .end((err, res) => {
        if (err) {
          dispatch(loginFail({message: err.message}));
        } else {
          if (res.body.response.errors) {
            dispatch(loginFail({fields: res.body.response.errors}));
          } else {
            dispatch(loginSuccess(res.body.response.user));
          }
        }
      });
  };
}

export function logout() {
  return dispatch => {
    dispatch(requestLogout());
    return request.get('/logout/')
      .end((err) => {
        if (err) {
          dispatch(logoutFail({message: err.message}));
        } else {
          dispatch(logoutSuccess());
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
        user: null,
        loginError: action.loginError
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        loginError: null,
        user: action.user
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        logoutError: action.logoutError
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
}
