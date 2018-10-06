/* eslint-disable no-param-reassign */

import Axios from 'axios';

import camelizeKeysDeep from 'camelcase-keys-deep';
import decamelizeKeysDeep from 'decamelize-keys-deep';

const api = Axios.create({
  timeout: process.env.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});
window.api = api; // useful for dev

api.interceptors.request.use((config) => {
  // `state.adminAuthToken` only exists in admin "app" for now
  // but we should add it to the main app once we switch over all api calls
  // to the new API
  if (window.store.state.adminAuthToken) {
    config.headers['x-auth'] = `${window.store.state.adminAuthToken}`;
  } else if (window.store.state.authToken) {
    config.headers['x-auth'] = `${window.store.state.authToken}`;
  }
  return config;
});
api.interceptors.request.use((config) => {
  if (config.url.match(/.*\/v[12]\/.*/)) {
    // v1 and v2 use old api, which is expecting snake_case params
    config.url = `${process.env.USE_API_PROXY ? '/api' : process.env.API_URL}${config.url}`;
    config.data = decamelizeKeysDeep(config.data, '_');
  } else {
    // v3 uses new api
    config.url = `${process.env.USE_API_PROXY ? '/napi' : process.env.NODE_API_URL}${config.url}`;
  }
  return config;
});
api.interceptors.response.use((response) => {
  if (response.config.url.match(/.*\/v[12]\/.*/) &&
    response.headers['content-type'].indexOf('application/json') === 0
  ) {
    response.data = camelizeKeysDeep(response.data);
  }
  return response;
});

export default api;
