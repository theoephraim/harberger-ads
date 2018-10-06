/*
  This just loads up the configuration and passes it along to node-pg-migrate
*/

require('../lib/run-init');
const nconf = require('nconf');
const { execSync } = require('child_process');

const [node, script, ...args] = process.argv;// eslint-disable-line no-unused-vars

execSync([
  `DATABASE_URL=${nconf.get('DATABASE_URL')}`,
  'node-pg-migrate',
  ...args,
].join(' '), {
  stdio: 'inherit',
});
process.exit();
