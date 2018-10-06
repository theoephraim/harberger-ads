const nconf = require('nconf');
const semver = require('semver');

const CURRENT_VERSION = nconf.get('API_VERSION:current');
const MIN_VERSION = nconf.get('API_VERSION:min');

const versionUrlRegex = /^\/v([0-9.]+)\//;

module.exports.middleware = (ctx, next) => {
  // check the URL for a version
  const urlMatch = ctx.url.match(versionUrlRegex);
  let requestedVersion = urlMatch ? urlMatch[1] : undefined;


  // default to current version
  if (!requestedVersion) {
    ctx.$.version = CURRENT_VERSION;
    return next();
  }

  // rewrite URL to get rid of version chunk
  ctx.url = ctx.url.substr(requestedVersion.length + 2);
  // support "3" instead of requiring "3.0.0"
  requestedVersion = semver.coerce(requestedVersion);
  ctx.$.version = requestedVersion.version;


  if (!semver.valid(requestedVersion)) {
    ctx.throw('BadRequest', 'InvalidVersionRequested', `Requested API version "${requestedVersion}" is invalid`);
  }

  if (semver.gt(requestedVersion, CURRENT_VERSION)) {
    ctx.throw('BadRequest', 'InvalidVersionRequested', `Requested API version "${requestedVersion}" is greater than current version "${CURRENT_VERSION}"`);
  }
  if (semver.lt(requestedVersion, MIN_VERSION)) {
    ctx.throw('Obsolete', 'InvalidVersionRequested', 'This version of the API is no longer supported.');
  }

  return next();
};

//
// module.exports.routeSupportsVersion = function (semverRange) {
//   if (!semver.validRange(semverRange)) {
//     throw new Error('Invalid semver range #{semverRange}');
//   }
//
//   return function (req, res, next) {
//     if (semver.satisfies(req.version, semverRange)) {
//       // continues with the next middleware
//       return next();
//     }
//     // returns control back to the route to match a new route
//     return next('route');
//   };
// };
