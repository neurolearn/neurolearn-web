/* @flow */

export type PayloadType = any;

export type Action = {
  type: string,
  payload: PayloadType,
  error?: Object,
  meta?: Object
};
