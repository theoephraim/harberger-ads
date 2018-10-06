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

function auth(wallet, signature) {
  try {
    const recovered = sigUtil.recoverTypedSignature({
      data: msgParams,
      sig: signature,
    });
    return wallet.toLowerCase() === recovered.toLowerCase();
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function middleware(ctx, next) {
  const basic = basicAuth(ctx.req);
  ctx.$.authUser = null;
  if (basic && auth(basic.name, basic.pass)) {
    let user = await Models.User.find({
      where: { xaddress: basic.name.toLowerCase() },
    });
    if (!user) {
      user = await Models.User.create({
        xaddress: basic.name.toLowerCase(),
      });
    }
    ctx.$.authUser = user;
  }
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
  if (!ctx.$.superadmin && ctx.$.ad.advertiserUserId !== ctx.$.authUser.id) {
    ctx.throw('Forbidden', 'This ad is not yours');
  }
  return next();
}

module.exports = {
  middleware,
  loggedInOnly,
};

