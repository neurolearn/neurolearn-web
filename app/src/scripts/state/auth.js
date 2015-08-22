import request from 'superagent';

const REQUEST_LOGIN = 'REQUEST_LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAIL = 'LOGIN_FAIL';

export function requestLogin() {
  return {
    type: REQUEST_LOGIN
  };
}

function fetchAuthToken(email, password) {
  return request.post('/login/')
    .type('json')
    .accept('json')
    .send({email, password});
}

function loginSuccess(res) {
  return {
    type: LOGIN_SUCCESS
  };
}

function loginFail(loginError) {
  return {
    type: LOGIN_FAIL,
    loginError
  };
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
            dispatch(loginSuccess(res));
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
        user: null,
        loginError: action.loginError
      };
    default:
      return state;
  }
}
