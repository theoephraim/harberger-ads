require('../lib/run-init');

const _ = require('lodash');
const colors = require('colors');
const nconf = require('nconf');
const {
  sequelize, dbReady, Models, Op,
} = require('../models');
const prasync = require('../lib/prasync');

const query = async (q) => sequelize.query(q, { type: sequelize.QueryTypes.SELECT });

(async function main() {
  await dbReady;


  console.log('\n\n DONE! \n\n\n'.green);
  process.exit();
}());

