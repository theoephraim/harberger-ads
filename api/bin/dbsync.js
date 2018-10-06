/* eslint-disable no-console,no-unused-vars */

/*
  Syncs db using sequelize
*/

require('../lib/run-init');
const nconf = require('nconf');
const { execSync } = require('child_process');

const { sequelize, dbReady } = require('../models');


(async function main() {
  await dbReady;

  console.log('> Syncing database'.yellow);

  await sequelize.sync({ force: true });


  console.log('\n\n DONE! \n\n\n'.green);
  process.exit();
}());
