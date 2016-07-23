/* @flow */

export type Action = {
  type: string,
  payload: Object,
  error?: Object,
  meta?: Object
};
