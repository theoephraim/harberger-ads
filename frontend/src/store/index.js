import Vue from 'vue';
import Vuex from 'vuex';

import actions from './actions';
import * as getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);

function getSignatures(key = 'ha-signatures') {
  if (!window.localStorage) return {};
  return JSON.parse(window.localStorage.getItem(key));
}

const initialState = {
  // initialize an object to track request state for each api related action
  requests: {}, // keyed by request type (and sometimes more)
                // each object having
                // {status, error, requestedAt, receivedAt

  // ETH address, if metamaskin'
  account: null,
  signatures: getSignatures(),
  // bloomID: null,
  unlocked: false,

  networkId: null,
  waitToPing: true,
  contractsDeployed: false,
  correctNetwork: 4,

  messages: [],

  authToken: null,
  user: {},

  billboards: {},
};


const store = new Vuex.Store({
  state: initialState,
  actions,
  getters,
  mutations,
  strict: process.env.NODE_ENV !== 'production',
});
window.store = store;

export default store;
