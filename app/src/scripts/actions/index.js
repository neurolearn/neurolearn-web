import { SHOW_MODAL } from './actionTypes';

export function showModal(display) {
  return {
    type: SHOW_MODAL,
    display
  };
}
