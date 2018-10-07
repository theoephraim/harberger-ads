/* eslint-disable import/first */

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Meta from 'vue-meta';
// supposed to import after vue but before app code
// import '@/utils/init-error-tracking';

// polyfill storage - falls back to cookies, memory, etc
import storage from 'local-storage-fallback'; // safer to use `storage` directly

import Web3 from 'web3';
import { PortisProvider } from 'portis';
import BN from 'bignumber.js';

// initializes filters
import '@/utils/init-filters';

Vue.config.productionTip = false;

Vue.use(Meta);

import './components/register-global-components';

// waiting for html-webpack-plugin to provide this by default
// https://github.com/jantimon/html-webpack-plugin/issues/76

// we only need to insert the div on pre-render
if (!document.getElementById('app')) {
  const appDiv = document.createElement('div');
  appDiv.setAttribute('id', 'app');
  document.body.prepend(appDiv);
}

Object.defineProperty(Vue.prototype, '$BN', { value: BN });

// use require so it can be done in this callback
const App = require('./components/App').default;
const store = require('./store').default;
const router = require('./router').default;
const api = require('@/utils/api').default;

const networks = {
  4: 'rinkeby',
  5777: 'ganache',
  1: 'mainnet',
};
if (typeof web3 !== 'undefined') {
  // Use Mist/MetaMask's provider
  // eslint-disable-next-line
  global.web3 = new Web3(web3.currentProvider);
} else {
  global.web3 = new Web3(
    new PortisProvider({
      apiKey: process.env.VUE_APP_PORTIS_KEY || 'f5d4ae50e50d268dadea7cfa5f546cb2',
      network: networks[store.state.correctNetwork],
    }),
  );
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
});
