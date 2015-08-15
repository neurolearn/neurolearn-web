import { SHOW_MODAL } from '../actions/actionTypes';

const initialState = {
  selectImagesModal: {
    display: false
  }
};

export default function rootReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SHOW_MODAL:
      return {
        selectImagesModal: {
          display: action.display
        }
      };
    default:
      return state;
  }
}
