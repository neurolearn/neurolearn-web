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
        let error = new Error(text);
        error.response = response;
        throw error;
      });
    }
  });
}

function fetchJSON(path, params, options = {}) {
  return callAPI(path, params, options).then(response => {
    if (response.status === 200) {
      return response.json();
    }
    return response.text();
  });
}

const api = {
  get: fetchJSON,

  delete: (path) => {
    return callAPI(path, undefined, {method: 'DELETE'});
  },

  post: (path, payload) => {
    return fetchJSON(path, payload, {method: 'POST'});
  }
};

export default api;
