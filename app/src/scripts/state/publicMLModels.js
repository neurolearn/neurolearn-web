import api from '../api';

export const REQUEST_PUBLIC_MLMODELS = 'REQUEST_PUBLIC_MLMODELS';
export const RECEIVE_PUBLIC_MLMODELS = 'RECEIVE_PUBLIC_MLMODELS';

function requestPublicMLModels() {
  return {
    type: REQUEST_PUBLIC_MLMODELS
  };
}

function receiveAuthUserMLModels(objects) {
  return {
    type: RECEIVE_PUBLIC_MLMODELS,
    objects
  };
}

export function loadPublicMLModels() {
  return (dispatch) => {
    dispatch(requestPublicMLModels());
    return api.fetchMLModels(
      (err, res) => {
        dispatch(receiveAuthUserMLModels(res.body));
      });
  };
}

const initialState = {
  isFetching: false,
  entities: {},
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
        entities: action.objects.entities,
        items: action.objects.result
      });
    default:
      return state;
  }
}
