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
    name: 'ETHSanFrancisco.com',
    email: 'marketing@ethsf.com',
  });

  const exampleAd = await Models.Ad.create({
    adverstiserUserId: advertiserUser.id,
    name: 'Buy CryptoPuppies Now!',
    mediaUrl: 'https://placekitten.com/200/300',
    linkUrl: 'http://hads.xyz',
  });


  const billboard = await Models.Billboard.create({
    userId: siteOwnerUser.id,
    name: 'ETHSF.com - sidebar',
    currentAdId: exampleAd.id,
    url: 'https://hads.xyz',
    type: 'sidebar',
    pixelWidth: 200,
    pixelHeight: 500,
  });

  const billboard2 = await Models.Billboard.create({
    userId: siteOwnerUser.id,
    name: 'ETHSF.com - banner',
    currentAdId: exampleAd.id,
    url: 'https://hads.xyz',
    type: 'sidebar',
    pixelWidth: 200,
    pixelHeight: 500,
  });

  const billboard3 = await Models.Billboard.create({
    userId: siteOwnerUser.id,
    name: 'Fort Mason Community Garden',
    currentAdId: exampleAd.id,
    url: 'https://hads.xyz',
    type: 'tv',
    pixelWidth: 1200,
    pixelHeight: 800,
  });

  const billboard4 = await Models.Billboard.create({
    userId: siteOwnerUser.id,
    name: 'some Ether site',
    currentAdId: exampleAd.id,
    url: 'https://hads.xyz',
    type: 'sidebar',
    pixelWidth: 200,
    pixelHeight: 500,
  });
  const billboard5 = await Models.Billboard.create({
    userId: siteOwnerUser.id,
    name: 'Another',
    currentAdId: exampleAd.id,
    url: 'https://hads.xyz',
    type: 'banner',
    pixelWidth: 200,
    pixelHeight: 500,
  });


  console.log('\n\n DONE! \n\n\n'.green);
  process.exit();
}());
