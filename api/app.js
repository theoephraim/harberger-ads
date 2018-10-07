/* eslint-disable no-console */

// if (process.env.APP_ENV === 'production') {
//   // set newrelic config path
//   process.env.NEW_RELIC_HOME = __dirname + '/config';
//   // include new relic tracking
//   require('newrelic');
// }

// run init - set up config files
require('./lib/run-init');

// include modules
const _ = require('lodash');
const nconf = require('nconf');


const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const promiseDelay = require('promise-delay');
const cors = require('@koa/cors');

const { requestLoggingMiddleware, logger } = require('./lib/logger');
const betterCtxThrow = require('./lib/better-ctx-throw').middleware;
const setRequestVersion = require('./lib/version-helpers').middleware;
const serializeResponse = require('./lib/orm-wrap/versioned-serializer').middleware;
const {
  middleware: authMiddleware,
} = require('./lib/auth-helpers');

const { dbReady } = require('./models');


async function boot() {
  await dbReady;

  // eslint-disable-next-line global-require
  const router = require('./routes');

  // create the web app
  const app = new Koa();
  const port = nconf.get('PORT');

  // tells koa to use  X-Forwarded-For - https://github.com/koajs/koa/issues/599
  app.proxy = true;

  // Set up middlewares
  app.use(cors());
  app.use((ctx, next) => { ctx.$ = ctx.state; return next(); });
  app.use(requestLoggingMiddleware);
  app.use(betterCtxThrow);
  app.use(bodyParser());
  if (nconf.get('NODE_ENV') === 'development' && nconf.get('RESPONSE_DELAY')) {
    app.use(async (ctx, next) => {
      await next();
      await promiseDelay(nconf.get('RESPONSE_DELAY'));
    });
  }
  app.use(setRequestVersion);
  app.use(serializeResponse);
  app.use(authMiddleware);

  // load routes
  app.use(router.routes());

  // if no matching routes exist, we reach this middleware
  app.use(async (ctx, next) => {
    ctx.throw('NotFound', 'Invalid URL');
  });

  await app.listen(port);
  logger.log(`App starting API - listening on port ${port}`);
}

// throw the uncaught exception in the next tick so that it is not treated
// as an unhandled promise rejection
boot().catch((err) => { setImmediate(() => { throw err; }); });
