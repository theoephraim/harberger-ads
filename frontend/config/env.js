const _ = require('lodash');

// LOAD ENV VARS
const ENV = {};

// defaults
ENV.API_TIMEOUT = 30000;

// env-specific
if (process.env.LOAD_ENV === 'development' || !process.env.LOAD_ENV) {
  ENV.NODE_ENV = 'development';
  ENV.APP_ENV = 'development';

} else if (process.env.LOAD_ENV === 'test') {
  ENV.NODE_ENV = 'test';
  ENV.APP_ENV = 'test';

} else if (process.env.LOAD_ENV === 'staging') {
  ENV.NODE_ENV = 'production';
  ENV.APP_ENV = 'staging';

} else if (process.env.LOAD_ENV === 'production') {
  // WARNING - do not include any sensitive keys here
  // best practice is to keep this all out of git, but since these are all
  // published in the prod app anyway, we're not at any risk here
  ENV.NODE_ENV = 'production';
  ENV.APP_ENV = 'production';
}


// allow some config overrides while working on local dev
if (ENV.NODE_ENV === 'development') {
  try {
    _.merge(ENV, require('./local.js'));
  } catch (err) {
    // do nothing...
  }
}

console.log('CURRENT CONFIG ======');
console.log(ENV);
console.log('=====================');
_.assign(process.env, ENV);

function stringifyValues (obj) {
  const result = {}
  Object.keys(obj).forEach((key) => {
    result[key] = JSON.stringify(obj[key])
  });
  return result;
}

module.exports = {
  env: ENV,
  publicEnv: stringifyValues(ENV),
};
