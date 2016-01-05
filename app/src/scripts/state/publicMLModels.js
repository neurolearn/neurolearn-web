import api from '../api';

export const REQUEST_PUBLIC_MLMODELS = 'REQUEST_PUBLIC_MLMODELS';
export const RECEIVE_PUBLIC_MLMODELS = 'RECEIVE_PUBLIC_MLMODELS';

function requestPublicMLModels() {
  return {
    type: REQUEST_PUBLIC_MLMODELS
  };
}

function receivePublicMLModels(response) {
  return {
    type: RECEIVE_PUBLIC_MLMODELS,
    response
  };
}

export function loadPublicMLModels() {
  return (dispatch) => {
    dispatch(requestPublicMLModels());
    return api.fetchMLModels(
      (err, res) => {
        dispatch(receivePublicMLModels(res.body));
      });
  };
}

const initialState = {
  isFetching: false,
  items: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_PUBLIC_MLMODELS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_PUBLIC_MLMODELS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.response.result
      });
    default:
      return state;
  }
}
