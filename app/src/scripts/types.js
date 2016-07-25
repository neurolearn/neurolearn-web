/* @flow */

export type User = {
  id: number,
  name: string
};

export type Model = {
  user: User,
  images_count: number,
  label_name: string,
  algorithm: string
};

export type ModelTest = {
  id: number,
  name: string,
  images_count: number,
  mean_correlation: number
};

export type WindowLocation = {
  protocol: string,
  host: string
};

export type PayloadType = any;

export type Action = {
  type: string,
  payload: PayloadType,
  error?: Object,
  meta?: Object
};
