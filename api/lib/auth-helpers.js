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

  if (ENABLE_AUTH_BYPASS && ctx.headers['bypass-auth']) {
    const authBypass = ctx.headers['bypass-auth'];
    // see setup-test-env -- we create 2 admins before running any tests
    if (authBypass === 'admin') {
      ctx.$.authUser = { id: 2, type: 'admin' };
    } else if (authBypass === 'superadmin') {
      ctx.$.authUser = { id: 1, type: 'admin' };
      ctx.$.superadmin = true;
    } else if (authBypass) {
      ctx.$.authUser = await Models.User.findById(authBypass) || {};
      ctx.$.authBusiness = await Models.Business.findOne({
        where: { userId: ctx.$.authUser.id },
      }) || {};

      if (ctx.$.authUser.refs && ctx.$.authBusiness.refs) {
        ctx.$.authUser.refs.business = ctx.$.authBusiness;
        ctx.$.authBusiness.refs.user = ctx.$.authUser;
      }
    }
    ctx.$.authBusiness = ctx.$.authBusiness || {};
    return next();
  }

  // check for cron
  if (ctx.headers['x-cron-auth'] === nconf.get('CRON_AUTH_TOKEN')) {
    ctx.$.authUser = { id: 'cron', type: 'cron' };
    return next();
  }

  if (!ctx.headers['x-auth']) {
    // for local dev so you can hit GET routes in the browser
    if (ALWAYS_SUPERADMIN) {
      ctx.$.authUser = { id: 1, type: 'admin' };
      ctx.$.superadmin = true;
    }

    return next();
  }

  // TODO: add a user-specific key so we can invalidate all JWTs for a user
  let decodedToken;
  try {
    decodedToken = jwt.verify(ctx.headers['x-auth'], JWT_SIGN_KEY);
  } catch (err) {
    ctx.throw('Forbidden', 'CorruptAuthToken', 'Auth token is corrupt. Please log out and back in.');
  }

  // auth coming from rails API
  if (decodedToken.user_id) decodedToken.userId = decodedToken.user_id;

  if (decodedToken.adminId) {
    ctx.$.authUser = await Models.Admin.findById(decodedToken.adminId);
    if (!ctx.$.authUser) ctx.throw('Forbidden', 'Admin does not exist');
    if (ctx.$.authUser.deletedAt) ctx.throw('Forbidden', 'AuthAdminDeleted', 'Admin is deleted');
    if (ctx.$.authUser.role === 'superadmin') ctx.$.superadmin = true;
  } else if (decodedToken.partnerId) {
    // TODO: check valid partners?
    ctx.$.authUser = {
      type: 'partner',
      id: decodedToken.partnerId,
    };
  } else if (decodedToken.userId) {
    ctx.$.authUser = await Models.User.findById(decodedToken.userId);
    if (!ctx.$.authUser) ctx.throw('Forbidden', 'User does not exist');
    if (ctx.$.authUser.cancelled) {
      ctx.throw('Forbidden', 'AuthUserCancelled', 'User account is deactivated. Please contact support');
    }
    ctx.$.authBusiness = await Models.Business.findOne({
      where: { userId: ctx.$.authUser.id },
    });
    // TODO: check cancelled accounts?
    ctx.$.authUser.refs.business = ctx.$.authBusiness;
  }

  // TODO - add field to user/admin to allow invalidation of all tokens
  // before a timestamp using decodedToken.iat

  return next();
}

async function adminsOnly(ctx, next) {
  if (ctx.$.authUser.type !== 'admin') ctx.throw('Forbidden', 'Admin only');
  return next();
}
async function superadminsOnly(ctx, next) {
  if (!ctx.$.superadmin) ctx.throw('Forbidden', 'Superadmin only');
  return next();
}

async function revealPasswordProtectedDataMiddleware(ctx, next) {
  if (!ctx.$.authUser) return next();
  const passwordToCheck = _.get(ctx, 'request.body.validatePassword');
  if (!passwordToCheck) return next();

  // admins cannot access user data like this
  if (ctx.$.authUser.type !== 'user') {
    ctx.throw('Forbidden', 'Only a user can access password-protected data');
  }


  // dont let them reset to existing pass
  if (await checkPasswordAgainstHash(passwordToCheck, ctx.$.authUser.passwordHash)) {
    ctx.$.passwordValidated = true;
  } else {
    ctx.throw('Forbidden', 'Incorrect password');
  }
  return next();
}

module.exports = {
  middleware,
  adminsOnly,
  superadminsOnly,
  revealPasswordProtectedDataMiddleware,
};
