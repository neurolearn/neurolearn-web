import { SHOW_MODAL } from '../actions/actionTypes';

const initialState = {
  display: false
};

export default function modal(state = initialState, action = {}) {
  switch (action.type) {
    case SHOW_MODAL:
      let { display } = state;
      return {
        display
      };
    default:
      return state;
  }
}
