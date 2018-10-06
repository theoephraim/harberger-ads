import Vue from 'vue';
import Vuex from 'vuex';

import * as actions from './actions';
import * as getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);

const initialState = {
  // initialize an object to track request state for each api related action
  requests: {}, // keyed by request type (and sometimes more)
                // each object having
                // {status, error, requestedAt, receivedAt

  authToken: null,
  user: {},
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
