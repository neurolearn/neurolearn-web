import { createAction } from 'redux-actions';

const API_ERROR = 'API_ERROR';
const RESET_ERROR = 'RESET_ERROR';

export const apiError = createAction(API_ERROR);

function createMessage(payload) {
  if (payload.response && payload.response.status === 500) {
    return payload.response.statusText;
  }

  return payload.message;
}

export default function reducer(state = [], action) {
  const { type, payload, error } = action;

  if (type === RESET_ERROR) {
    return null;
  } else if (error) {
    return [...state, {
      'level': 'error',
      'message': createMessage(payload)
    }];
  }

  return state;
}
