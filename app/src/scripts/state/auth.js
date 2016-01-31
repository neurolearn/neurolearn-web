import jwtDecode from 'jwt-decode';
import { createAction } from 'redux-actions';

const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGOUT = 'LOGOUT';

export const loginSuccess = createAction(LOGIN_SUCCESS);
export const logout = createAction(LOGOUT);

const initialState = {
  token: null,
  user: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload,
        user: jwtDecode(action.payload)
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
