/* @flow */

import 'whatwg-fetch';

import { getAuthToken } from './utils';

function locationOrigin(loc) {
  return loc.origin || `${loc.protocol}//${loc.hostname}${loc.port ? `:${loc.port}` : ''}`;;
}

const HOST = locationOrigin(window.location);
const DEFAULT_HEADERS = {'Accept': 'application/json',
                         'Content-Type': 'application/json'};

function callAPI(path, params, options) {
  const token = getAuthToken();

  const headers = token
    ? {'Authorization': 'Bearer ' + token, ...DEFAULT_HEADERS}
    : DEFAULT_HEADERS;

  const body = params && JSON.stringify(params);

  return fetch(HOST + path, {
    method: options.method || 'get',
    credentials: 'same-origin',
    headers,
    body
  })
  .then(response => {
    if (response.ok) {
      return response;
    } else {
      return response.text().then(text => {
        // XXX: Find better type for this
        let error: any = new Error(text);
        error.response = response;
        throw error;
      });
    }
  });
}

function fetchJSON(path: string, params: Object, options: Object = {}) {
  return callAPI(path, params, options).then(response => {
    if (response.status === 200) {
      return response.json();
    }
    return response.text();
  });
}

const api = {
  get: fetchJSON,

  delete: (path: string) => {
    return callAPI(path, undefined, {method: 'DELETE'});
  },

  post: (path: string, payload: Object) => {
    return fetchJSON(path, payload, {method: 'POST'});
  },

  patch: (path: string, payload: Object) => {
    return fetchJSON(path, payload, {method: 'PATCH'});
  }
};

export default api;
