/* eslint-disable global-require,import/no-dynamic-require */

const fs = require('fs');
const _ = require('lodash');
const Sequelize = require('sequelize');
const nconf = require('nconf');
require('colors');

require('pg').defaults.parseInt8 = true;

const { logger } = require('../lib/logger');
const { defineModel, initializeAssociations } = require('../lib/orm-wrap/define-model');
const { connectionUrl, DB } = require('../config/database');

Sequelize.Promise.config({ longStackTraces: true });

const Models = {};

function defer() {
  const deferred = {
    promise: null,
    resolve: null,
    reject: null,
  };

  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  return deferred;
}
const databaseInit = defer();
const dbReady = databaseInit.promise;

let disableLogging = false;

function logSql(...args) {
  /* eslint-disable no-console */
  // temporary disable logging, used while resetting test DB
  if (disableLogging) return;
  console.log(args[0]); // log just the query
}


// decimal types are being returned as strings?
// https://github.com/sequelize/sequelize/issues/8019
Sequelize.postgres.DECIMAL.parse = (value) => parseFloat(value);

let dbUrl = connectionUrl;
if (nconf.get('DB:tunnel')) {
  dbUrl = connectionUrl.replace(`${DB.host}:${DB.port}`, 'localhost:27777');
}

const sequelize = new Sequelize(dbUrl, {
  // dialect: 'postgres',
  logging: nconf.get('DB:debug') ? logSql : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false,
});

function initConnection() {
  sequelize
    .authenticate()
    .then(() => {
      fs.readdirSync(__dirname).forEach((filename) => {
        if (filename === 'index.js') return;

        const modelDefinition = require(`./${filename}`);
        Models[modelDefinition.modelName] = defineModel(sequelize, modelDefinition);
      });
      _.each(Models, (m) => initializeAssociations(Models, m));
      databaseInit.resolve();
    })
    .catch((err) => {
      databaseInit.reject();
      logger.log({
        message: 'DB CONNECTION FAILED',
        error: err,
        connection: _.omit(DB, 'password'),
      });
    });
}


async function resetTestDb() {
  disableLogging = true;
  await sequelize.truncate({ cascade: true });
  disableLogging = false;
}


if (nconf.get('DB:tunnel')) {
  console.log(`\


-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
WARNING - CONNECTING TO PRODUCTION DATABASE!
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
\
`.bgMagenta.white);


  const tunnelExec = require('tunnel-exec');
  tunnelExec({
    remoteHost: nconf.get('BASTION:host'),
    remotePort: 22,
    user: nconf.get('BASTION:user'),
    identityFile: nconf.get('BASTION:keyfile') || '~/.ssh/id_rsa',
    targetHost: nconf.get('DB:host'),
    targetPort: nconf.get('DB:port'),
    localPort: 27777,
  }, (err, tunnel) => {
    if (err) {
      console.log('Error creating BASTION_HOST tunnel');
    }
    console.log('> BASTION_HOST tunnel created <'.green);
    initConnection();
  });
} else {
  initConnection();
}


module.exports = {
  Models,
  sequelize,
  dbReady,
  resetTestDb,
  Op: Sequelize.Op,
};
