/* eslint-disable no-param-reassign */

import Vue from 'vue';

import _ from 'lodash';
import formatDate from 'date-fns/format';
import ago from 's-ago';
import filesize from 'filesize';

import { formatMoney } from '@/utils/currency';

Vue.filter('currency', formatMoney);

// return up to 2 decimals
// the "+" will get rid of unnecessary trailing zeros
Vue.filter('percent', (value) => `${+(value * 100).toFixed(2)}%`);

Vue.filter('friendly-date', (value) => {
  if (!value) return '---';
  return formatDate(value, 'MMMM Do, YYYY');
});

Vue.filter('date', (value) => {
  if (!value) return '---';
  return formatDate(value, 'YYYY-MM-DD');
});
Vue.filter('datetime', (value) => {
  if (!value) return '---';
  return formatDate(value, 'YYYY-MM-DD @ h:mma');
});
Vue.filter('timeago', (value) => {
  if (!value) return '---';
  if (_.isDate(value)) return ago(value);
  return ago(new Date(value));
});

Vue.filter('filesize', (value) => {
  if (!value) return '---';
  return filesize(value, { round: 1 });
});

Vue.filter('capitalize', (value) => {
  if (!value) return '---';
  return value.charAt(0).toUpperCase() + value.slice(1);
});

Vue.filter('numabbr', (value) => {
  if (!value) return 0;
  if (value < 1000) return value;
  if (value < 1000000) return `${(value / 1000).toFixed(1)}K`;
  return `${(value / 1000000).toFixed(2)}M`;
});

