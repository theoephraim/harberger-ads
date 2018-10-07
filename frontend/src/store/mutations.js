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

  [types.CONTRACTS_DEPLOYED]: (state, value) => {
    state.contractsDeployed = value;
  },
  [types.UPDATE_WAIT_TO_PING]: (state, value) => {
    state.waitToPing = value;
  },

  [types.SET_UNLOCKED]: (state, unlocked) => {
    state.unlocked = unlocked;
  },
  [types.SET_ACCOUNT]: (state, account) => {
    if (typeof account === 'string') {
      account = account.toLowerCase();
    }
    state.account = account;
  },
  [types.SET_NETWORK]: (state, networkId) => {
    state.networkId = networkId;
  },

  [types.SIGN_IN]: (state, { account, signature }) => {
    state.signatures = { ...state.signatures, [account]: signature };
    storage.setItem('ha-signatures', JSON.stringify(state.signatures));
  },
  [types.SIGN_OUT]: (state) => {
    if (!state.account) return;
    state.signatures = null;
    state.account = null;
    storage.removeItem('ha-signatures');
  },

  [types.ADD_MSG]: (state, msg) => {
    state.messages.push(msg);
  },
  [types.REMOVE_MSG]: (state, msgId) => {
    const msgKey = state.messages.findIndex((m) => m.id === msgId);
    if (msgKey < 0) return;
    state.messages.splice(msgKey, 1);
  },


  // API ACTIONS ///////////////////////////////////////////////////////////////
  ...makeAsyncMutations(types.FETCH_THE_GRAPH, (state, { response }) => {
    state.graphProperties = _.keyBy(response.data.properties, 'propertyId');
    state.graphUsers = _.keyBy(response.data.users, 'address');
  }),
  ...makeAsyncMutations(types.FETCH_BILLBOARDS, (state, { response }) => {
    state.billboards = _.keyBy(response, 'id');
  }),
  ...makeAsyncMutations(types.FETCH_BILLBOARD_DETAILS, (state, { response }) => {
    state.selectedBillboard = response;
  }),
  ...makeAsyncMutations(types.CREATE_BILLBOARD, (state, { response }) => {
    Vue.set(state.billboards, response.id, response);
  }),
  ...makeAsyncMutations(types.UPDATE_BILLBOARD_AD, (state, { response }) => {
    state.billboards[response.id] = response;
    state.selectedBillboard = response;
  }),


};
