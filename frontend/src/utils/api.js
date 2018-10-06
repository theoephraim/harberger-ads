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
  config.url = `/api${config.url}`;
  return config;
});

export default api;
