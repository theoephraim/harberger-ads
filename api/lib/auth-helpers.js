const _ = require('lodash');
const jwt = require('jsonwebtoken');
const nconf = require('nconf');

const { Models } = require('../models');
const { checkPasswordAgainstHash } = require('../lib/password-helpers');

const JWT_SIGN_KEY = nconf.get('JWT_SIGN_KEY');
const ENABLE_AUTH_BYPASS = nconf.get('NODE_ENV') === 'test';
// TODO: get rid of this eventually
const ALWAYS_SUPERADMIN = nconf.get('APP_ENV') === 'local' && !nconf.get('NO_AUTO_SUPERADMIN');

async function middleware(ctx, next) {
  ctx.$.authUser = {};
  ctx.$.authBusiness = {};

  if (!ctx.headers['x-auth']) {
    // for local dev so you can hit GET routes in the browser
    if (ALWAYS_SUPERADMIN) {
      ctx.$.superadmin = true;
    }

    return next();
  }

  return next();
}

async function loggedInOnly(ctx, next) {
  if (!ctx.$.authUser) ctx.throw('Forbidden', 'Must be logged in');
  return next();
}


module.exports = {
  middleware,
  loggedInOnly,
};
