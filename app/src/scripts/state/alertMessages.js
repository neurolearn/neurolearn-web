import { createAction } from 'redux-actions';
import filter from 'lodash/collection/filter';

const API_ERROR = 'API_ERROR';
const DISMISS_ALERT = 'DISMISS_ALERT';

export const apiError = createAction(API_ERROR);
export const dismissAlert = createAction(DISMISS_ALERT);


function createMessage(payload) {
  if (payload.response && payload.response.status ) {
      return payload.response.statusText;
  }

  return payload.message;
}

export default function reducer(state = [], action) {
  const { type, payload, error } = action;

  if (type === DISMISS_ALERT) {
    return filter(state, item => item !== action.payload);
  } else if (error) {
    return [...state, {
      'level': 'error',
      'message': createMessage(payload)
    }];
  }

  return state;
}
