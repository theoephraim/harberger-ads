import Vue from 'vue';
import Vuex from 'vuex';

import actions from './actions';
import * as getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);

const initialState = {
  // initialize an object to track request state for each api related action
  requests: {}, // keyed by request type (and sometimes more)
                // each object having
                // {status, error, requestedAt, receivedAt

  // ETH address, if metamaskin'
  account: null,
  signatures: {},
  // bloomID: null,
  unlocked: false,

  networkId: null,
  waitToPing: true,
  contractsDeployed: false,

  messages: [{
    id: 0,
    title: 'Welcome',
    msg: 'This is Harberger Ads',
  }, {
    id: 1,
    title: 'Look around you',
    msg: 'and profit',
    type: 'progress',
  }],

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
