/* eslint-disable object-property-newline */
import Vue from 'vue';
import Router from 'vue-router';
import _ from 'lodash';

import HomePage from './components/pages/HomePage';
import NotFoundPage from './components/pages/NotFoundPage';
import NewListingOverlay from './components/pages/NewListingOverlay';
import ListingDetailsOverlay from './components/pages/ListingDetailsOverlay';

import store from './store';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 };
  },
  routes: [
    {
      path: '/', name: 'home', component: HomePage,
      children: [
        { path: 'listings/:billboardId', name: 'listing-details', component: ListingDetailsOverlay, props: true },
        { path: 'list-your-space', name: 'new-listing', component: NewListingOverlay },
      ],
    },
    { path: '*', name: 'not-found', component: NotFoundPage },
  ],
});

// Check auth on every page transition
router.beforeEach((to, from, next) => {
  // automatically cast any integer params into proper integers
  // so that components can set params to expect a Number
  // NOTE - this is so that when we user router link or programatically navigate
  // that we can set the param as an int
  if (to.params) {
    const castNumericParams = _.mapValues(to.params, (val) => {
      if (parseInt(val).toString() === val) return parseInt(val);
      return val;
    });
    if (_.isEqual(castNumericParams, to.params)) return next();
    return next({
      ...to,
      params: castNumericParams,
    });
  }

  // // automatically cast all url params that are integers to numbers
  // // so the components can declare the prop they are expecting to be a Number
  // to.params =
  // console.log(to.params);
  // // (route) => ({ userId: Number(route.params.userId) }),


  return next();
});

export default router;
