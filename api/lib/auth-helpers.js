// const _ = require('lodash');
const nconf = require('nconf');
const sigUtil = require('eth-sig-util');
const basicAuth = require('basic-auth');

const { Models } = require('../models');
const { checkPasswordAgainstHash } = require('../lib/password-helpers');

const ENABLE_AUTH_BYPASS = nconf.get('NODE_ENV') === 'test';
// TODO: get rid of this eventually
const ALWAYS_SUPERADMIN = nconf.get('APP_ENV') === 'local' && !nconf.get('NO_AUTO_SUPERADMIN');

const msgParams = [{
  type: 'string',
  name: 'Message',
  value: 'Sign in with HA',
}];

async function middleware(ctx, next) {
  const basic = basicAuth(ctx.req);
  if (!basic) return next();

  const address = basic.name.toLowerCase();
  const sig = basic.pass;

  const recoveredAddress = sigUtil.recoverTypedSignature({ data: msgParams, sig });
  if (address !== recoveredAddress.toLowerCase()) ctx.throw('Forbidden', 'Invalid signature');

  let user = await Models.User.findById(address);
  if (!user) user = await Models.User.create({ id: address });
  ctx.$.authUser = user;

  return next();
}

async function loggedInOnly(ctx, next) {
  if (!ctx.$.authUser) ctx.throw('Forbidden', 'You must be logged in');
  return next();
}

module.exports = {
  middleware,
  loggedInOnly,
};

