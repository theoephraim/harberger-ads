/* eslint-disable no-param-reassign */

import _ from 'lodash';
import Vue from 'vue';
import storage from 'local-storage-fallback';
import jwtDecode from 'jwt-decode';

import { makeAsyncMutations } from '@/utils/vuex-api-utils';

import * as types from './mutation-types';

export default {
  // AUTH
  ...makeAsyncMutations(types.LOGIN, (state, { response }) => {
    state.authToken = response.authToken;
    state.user = response.user;
    storage.setItem('ha-auth', state.authToken);
  }),
  [types.AUTH_FROM_STORAGE]: (state, token) => {
    const decodedToken = jwtDecode(token);
    state.adminAuthToken = token;
    state.loggedInAdmin = { id: decodedToken.adminId, role: decodedToken.role };
  },
  [types.LOGOUT]: (state) => {
    state.adminAuthToken = null;
    state.loggedInAdmin = null;
    storage.removeItem('cb-admin-auth');
  },
};
