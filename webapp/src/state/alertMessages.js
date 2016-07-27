/* @flow */

import { createAction } from 'redux-actions';
import filter from 'lodash/collection/filter';
import type { Action } from '../types';

export const API_ERROR = 'API_ERROR';
const DISMISS_ALERT = 'DISMISS_ALERT';

export const apiError = createAction(API_ERROR);
export const dismissAlert = createAction(DISMISS_ALERT);

const skipError = (response) => (
  response && response.status && response.status === 404);

function createMessage(payload) {
  if (payload.response && payload.response.status ) {
      return payload.response.statusText;
  }

  return payload.message;
}

type AlertMessage = {
  level: string,
  message: string
};

export default function reducer(state: Array<AlertMessage> = [], action: Action) {
  const { type, payload, error } = action;

  if (type === DISMISS_ALERT) {
    return filter(state, item => item !== action.payload);
  } else if (error && !skipError(payload.response)) {
    return [...state, {
      level: 'error',
      message: createMessage(payload)
    }];
  }

  return state;
}
