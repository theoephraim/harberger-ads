/* eslint-disable global-require */

/*
  Any shared initialization needed for app.js, workers, or independent scripts goes here
*/

const nconf = require('nconf');

// Set timezone to UTC to avoid JavaScript's weird date conversion stuff
process.env.TZ = 'UTC';

// initialize config -- all stored in nconf
require('../config/init-config');

if (nconf.get('LONG_STACKTRACE')) {
  require('trace');
  require('clarify');
  Error.stackTraceLimit = Infinity;
}

// add deep lodash methods
const _ = require('lodash');
_.mixin(require('lodash-deep'));

const { logger } = require('./logger');

process.setMaxListeners(20); // was getting warnings, likely from queue connections

// catch uncaught exceptions
if (nconf.get('NODE_ENV') !== 'test') {
  process.on('uncaughtException', (err) => {
    logger.log({ message: 'FATAL UNCAUGHT EXCEPTION', error: err });
    process.exit(1);
  });
}

// explicitly exit on signal
['SIGTERM', 'SIGINT'].forEach((signal) => {
  process.on(signal, () => process.exit(0));
});

// initiate DB connection and load models
require('../models');

const requireDirectory = require('require-directory');
