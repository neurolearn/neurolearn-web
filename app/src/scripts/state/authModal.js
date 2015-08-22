const SHOW_AUTH_MODAL = 'SHOW_AUTH_MODAL';
const HIDE_AUTH_MODAL = 'HIDE_AUTH_MODAL';

export function showAuthModal() {
  return {
    type: SHOW_AUTH_MODAL
  };
}

export function hideAuthModal() {
  return {
    type: HIDE_AUTH_MODAL
  };
}

export default function reducer(state = { display: false }, action) {
  switch (action.type) {
    case SHOW_AUTH_MODAL:
      return { display: true };
    case HIDE_AUTH_MODAL:
      return { display: false };
    default:
      return state;
  }
}
