/* eslint-disable no-param-reassign,consistent-return,no-console */

const nconf = require('nconf');
const _ = require('lodash');
const LogDNA = require('logdna');
const uuidv4 = require('uuid/v4');
// const Raven = require('raven');
const exitHook = require('async-exit-hook');
const { promisify } = require('util');

const { recursivelyGetVersionedJSON } = require('./orm-wrap/versioned-serializer');

const SENTRY_ENABLED = !!nconf.get('SENTRY:dsn');
if (SENTRY_ENABLED) {
  // Raven.config(nconf.get('SENTRY:dsn')).install();
}


const LOG_TO_CONSOLE = true;
// nconf.get('NODE_ENV') !== 'production';

let logdna;

if (nconf.get('LOGDNA:api_key')) {
  logdna = LogDNA.setupDefaultLogger(nconf.get('LOGDNA:api_key'), {
    app: nconf.get('APP_NAME'),
    env: nconf.get('APP_ENV'),
    index_meta: true,
  });
}

function log(meta) {
  // accepts a string or an object
  if (_.isString(meta)) meta = { message: meta };

  const { error } = meta;

  // figure out subtype -- error, middle of request, request finished, etc
  if (meta.type === 'queue' || meta.type === 'request') {
    meta.subtype = meta.timer ? 'complete' : 'detail';
  } else {
    meta.type = meta.type || 'general';
  }

  if (error) {
    meta.message += ` - ${error.name}`;
    // replace the raw error with something better for logging
    meta.error = _.pick(error, [
      'name', 'generalType', 'message', 'details', 'stack',
    ]);

    // check if the error is something that look like an http request and include the response
    // particularly shopify api errors come through from https://github.com/sindresorhus/got
    // and we want to expose the response body
    if (error.response) meta.error.responseBody = error.response.body;
  }

  const { message } = meta;
  delete meta.message;

  if (nconf.get('NODE_ENV') === 'test' && !nconf.get('TEST_LOGS')) return;

  if (LOG_TO_CONSOLE) {
    if (meta.statusCode === 200) console.log(message);
    else console.log(message, meta);
  }

  // This will serialize our models if they were passed in, and will error on any recursive JSON
  // TODO: catch this error and do something about it? or just log [json too deep] or something
  const trimmedMeta = recursivelyGetVersionedJSON(meta);

  if (logdna) {
    logdna.log(message, {
      level: error ? 'error' : 'info',
      meta: trimmedMeta,
    });
  }

  // only "true" errors get passed through to sentry
  if (error && _.isError(error) && !error.expectedError) {
    console.log('------ EXCEPTION ------');
    console.log(error);
    console.log('-----------------------');

    if (SENTRY_ENABLED) {
      // Raven.context(() => {
      //   Raven.setContext({
      //     request: _.pick(trimmedMeta, 'url', 'method'),
      //     user: trimmedMeta.user,
      //     extra: _.omit(trimmedMeta, 'error', 'user', 'url', 'method', 'remoteIp'),
      //   });
      //   // make sure we expose the response body to sentry
      //   if (error.response) error.responseBody = error.response.body;
      //   Raven.captureException(error);
      // });
    }
  }
}

async function flush() {
  await promisify(LogDNA.flushAll);
}

// Koa request middleware to set up ctx.log
// ctx.log adds info about the request to logs along with your message/data
// and it also logs the request after the request has finished (using ctx.log)
async function requestLoggingMiddleware(ctx, next) {
  const { req, res } = ctx;

  // skip logs for favicon
  if (req.url === '/favicon.ico') return next();

  ctx.$.requestStart = +new Date();
  ctx.$.requestId = uuidv4();

  const requestInfoToLog = {
    type: 'request',
    url: req.url,
    method: req.method,
    reqId: ctx.$.requestId,
    userAgent: req.headers['user-agent'],
    remoteIp: ctx.ip,
  };

  ctx.logContext = {};

  ctx.log = (meta, moreMeta) => {
    if (_.isString(meta)) meta = { message: meta, ...moreMeta };
    meta.apiVersion = ctx.$.version;
    if (ctx.$.authUser && ctx.$.authUser.id) {
      meta.user = _.pick(ctx.$.authUser, 'id', 'type', 'email');
    }
    if (req.originalUrl) meta.originalUrl = ctx.req.originalUrl;
    log({
      ...requestInfoToLog,
      context: ctx.logContext,
      ...meta,
    });
  };


  // run the actual request
  await next();

  let logRequest = true;
  if (req.headers['user-agent']) {
    if (req.headers['user-agent'].includes('ELB-HealthChecker')) logRequest = false;
  }
  if (logRequest) {
    const requestTime = +new Date() - ctx.$.requestStart;
    ctx.log({
      // TODO: add some colors to the status code and request time?
      message: `${requestInfoToLog.method} ${requestInfoToLog.url} ${res.statusCode} ${requestTime}ms`,
      timer: requestTime,
      statusCode: res.statusCode,
      error: ctx.$.capturedError,
    });
  }
}

exitHook((exitHookComplete) => {
  // if (logdna) LogDNA.flushAll(exitHookComplete);
  // else if (exitHookComplete) exitHookComplete();
  /*
  Temporarily disabled due to following error on deploy
   TypeError: cb is not a function
     at callback (/app/node_modules/logdna/lib/logger.js:238:39)
     at Logger._flush (/app/node_modules/logdna/lib/logger.js:181:22)
     at Object.flushAll (/app/node_modules/logdna/lib/logger.js:244:24)
     at exitHook (/app/lib/logger.js:137:22)
     at runHook (/app/node_modules/async-exit-hook/index.js:56:10)
     at Array.map (<anonymous>:null:null)
     at exit (/app/node_modules/async-exit-hook/index.js:71:8)
     at process.events.(anonymous function) (/app/node_modules/async-exit-hook/index.js:116:3)
     at process.emit (events.js:182:13)
     at process.EventEmitter.emit (domain.js:442:20)
     at process.exit (internal/process.js:160:15)
     at Object.<anonymous> (/app/bin/migrate.js:19:9)
     at Module._compile (internal/modules/cjs/loader.js:702:30)
     at Object.Module._extensions..js (internal/modules/cjs/loader.js:713:10)
     at Module.load (internal/modules/cjs/loader.js:612:32)
     at tryModuleLoad (internal/modules/cjs/loader.js:551:12)
     at Function.Module._load (internal/modules/cjs/loader.js:543:3)
     at Function.Module.runMain (internal/modules/cjs/loader.js:744:10)
     at startup (internal/bootstrap/node.js:238:19)
     at bootstrapNodeJSCore (internal/bootstrap/node.js:572:3)
  */
});

module.exports = {
  requestLoggingMiddleware,
  logger: { log, flush },
};
