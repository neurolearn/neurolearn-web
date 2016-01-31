import api from '../api';

export const REQUEST_PUBLIC_MODEL_TESTS = 'REQUEST_PUBLIC_MODEL_TESTS';
export const RECEIVE_PUBLIC_MODEL_TESTS = 'RECEIVE_PUBLIC_MODEL_TESTS';

function requestPublicModelTests() {
  return {
    type: REQUEST_PUBLIC_MODEL_TESTS
  };
}

function receivePublicModelTests(response) {
  return {
    type: RECEIVE_PUBLIC_MODEL_TESTS,
    response
  };
}

export function loadPublicModelTests() {
  return (dispatch) => {
    dispatch(requestPublicModelTests());
    return api.get('/api/tests').then(
      result => dispatch(receivePublicModelTests(result))
    );
  };
}

const initialState = {
  isFetching: false,
  items: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_PUBLIC_MODEL_TESTS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_PUBLIC_MODEL_TESTS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.response.data
      });
    default:
      return state;
  }
}
