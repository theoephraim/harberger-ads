/* eslint-disable no-console,no-unused-vars */

/*
  Syncs db using sequelize
*/

require('../lib/run-init');
const nconf = require('nconf');
const { execSync } = require('child_process');

const { Models, sequelize, dbReady } = require('../models');


(async function main() {
  await dbReady;

  console.log('> Syncing database'.yellow);

  await sequelize.sync({ force: true });

  const advertiserUser = await Models.User.create({
    name: 'Advertiser',
    email: 'advertiser@hads.xyz',
  });

  const siteOwnerUser = await Models.User.create({
    name: 'Site Owner',
    email: 'siteowner@hads.xyz',
  });

  const exampleAd = await Models.Ad.create({
    adverstiserUserId: advertiserUser.id,
    name: 'Buy this ad @ hads.xyz!',
    mediaUrl: 'https://placekitten.com/200/300',
    linkUrl: 'http://hads.xyz',
  });

  const billboard = await Models.Billboard.create({
    userId: siteOwnerUser.id,
    name: 'hads.xyz top sidebar',
    currentAdId: exampleAd.id,
    url: 'https://hads.xyz',
    type: 'sidebar',
    pixelWidth: 200,
    pixelHeight: 500,
  });

  console.log('\n\n DONE! \n\n\n'.green);
  process.exit();
}());
