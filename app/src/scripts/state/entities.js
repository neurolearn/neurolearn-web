import merge from 'lodash/object/merge';

const initialState = {
  MLModel: {},
  User: {}
};

export default function entities(state = initialState, action) {
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities);
  }

  return state;
}
