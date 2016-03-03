import 'whatwg-fetch';

const HOST = window.location.origin;
const DEFAULT_HEADERS = {'Accept': 'application/json',
                         'Content-Type': 'application/json'};

function callAPI(path, params, options) {
  const headers = options.token
    ? {'Authorization': 'Bearer ' + options.token, ...DEFAULT_HEADERS}
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
  get: (path, token) => {
    return fetchJSON(path, undefined, {
      token
    });
  },

  delete: (path, token) => {
    return callAPI(path, undefined, {
      method: 'DELETE',
      token
    });
  },

  post: (path, payload, token) => {
    return fetchJSON(path, payload, {
      method: 'POST',
      token
    });
  }
};

export default api;
