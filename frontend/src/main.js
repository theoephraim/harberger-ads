/* eslint-disable import/first */

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Meta from 'vue-meta';
// supposed to import after vue but before app code
// import '@/utils/init-error-tracking';

// polyfill storage - falls back to cookies, memory, etc
import storage from 'local-storage-fallback'; // safer to use `storage` directly

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


// use require so it can be done in this callback
const App = require('./components/App').default;
const store = require('./store').default;
const router = require('./router').default;
const api = require('@/utils/api').default;

// This needs to run immediately - before the router handles the first route
// const token = storage.getItem('cb-admin-auth');
// if (token) store.dispatch('setAuthFromLocalStorage', token);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
});
