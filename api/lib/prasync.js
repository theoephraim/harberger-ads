/*
  This builds a new "async" utility kit  with the same names as the original methods
  but all promisified.

  Note that async can acutally handle promises internall on the individual fn calls,
  but the promisifyAll makes the functions return a promise as well
*/

const _ = require('lodash');
const bluebird = require('bluebird');
const async = require('async');

const fnNames = _.keys(async);

const SUFFIX = 'Async'; // this is the default added to new promisified fns
bluebird.promisifyAll(async);

const prasync = {};
_.each(fnNames, (fnName) => {
  prasync[fnName] = (...args) => async[fnName + SUFFIX](...args);
});

module.exports = prasync;
