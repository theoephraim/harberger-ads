const nconf = require('nconf');
const CSON = require('cson-parser');
const fs = require('fs');

function loadCsonConfig(path) {
  if (fs.existsSync(path)) {
    // throw the error if config is bad!
    // nconf doesnt throw it so we do this first
    const fileConfig = CSON.parse(fs.readFileSync(path));
    if (fileConfig instanceof Error) throw fileConfig;

    nconf.add(path, { type: 'literal', store: fileConfig });
  }
}

// use nconf's in-memory store
nconf.use('memory');
nconf.env({
  separator: '__',
  parseValues: true, // converts booleans,numbers,etc to proper types
});

if (process.env.NODE_ENV === 'test') {
  // override with test defaults and test "local" overrides
  loadCsonConfig(`${__dirname}/test-local.cson`); // for local testing
  loadCsonConfig(`${__dirname}/test.cson`); // for tests
} else {
  // Load dev overrides and sensitive config values
  loadCsonConfig(`${__dirname}/local.cson`); // for dev
  // loadCsonConfig( CONFIG_FILE ); // for deployments
}

// load defaults
loadCsonConfig(`${__dirname}/defaults.cson`);

// force load this to make sure that the DATABASE_URL gets set
require('../config/database');

// Some config inferred from existing properties

const webhookUrlConfigName = nconf.get('APP_ENV') === 'local' ? 'API_NGROK_URL' : 'API_URL';
nconf.set('WEBHOOK_URL', nconf.get(webhookUrlConfigName));

// Set some props back to process.env
// for use by 3rd party modules
process.env.DEBUG = nconf.get('DEBUG');
