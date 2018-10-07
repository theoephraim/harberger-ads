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
    id: '0x54e1f0cbde4f686a3166485011a534a596fd3444',
    name: 'Advertiser',
    email: 'advertiser@hads.xyz',
  });

  const siteOwnerUser = await Models.User.create({
    id: '0x54e1f0cbde4f686a3166485011a534a596fd3eb3',
    name: 'ETHSanFrancisco.com',
    email: 'marketing@ethsf.com',
  });
  const siteOwnerUser2 = await Models.User.create({
    id: '0x54e1f0cbde4f686a3166485011a534a596fd3445',
    name: 'ETH Berlin',
    email: 'marketing@ethberlin.com',
  });

  const billboard1 = await Models.Billboard.create({
    siteOwnerUserId: siteOwnerUser.id,
    name: 'ETHSF.com - sidebar',
    url: 'https://hads.xyz',
    type: 'sidebar',
    pixelWidth: 200,
    pixelHeight: 500,
    price: 100,
  });

  const billboard2 = await Models.Billboard.create({
    siteOwnerUserId: siteOwnerUser.id,
    name: 'ETHSF.com - banner',
    url: 'https://hads.xyz',
    type: 'sidebar',
    pixelWidth: 200,
    pixelHeight: 500,
    price: 10,
  });

  const billboard3 = await Models.Billboard.create({
    siteOwnerUserId: siteOwnerUser2.id,
    name: 'Fort Mason Community Garden',
    url: 'https://hads.xyz',
    type: 'tv',
    pixelWidth: 1200,
    pixelHeight: 800,
    price: 12.34,
  });

  const billboard4 = await Models.Billboard.create({
    siteOwnerUserId: siteOwnerUser2.id,
    name: 'some Ether site',
    url: 'https://hads.xyz',
    type: 'sidebar',
    pixelWidth: 200,
    pixelHeight: 500,
    price: 20,
  });
  const billboard5 = await Models.Billboard.create({
    siteOwnerUserId: siteOwnerUser2.id,
    name: 'Another',
    url: 'https://hads.xyz',
    type: 'banner',
    pixelWidth: 200,
    pixelHeight: 500,
    price: 0.01,
  });

  for (let i = 0; i <= 20; i++) {
    /* eslint-disable */
    const billboard = await Models.Billboard.create({
      siteOwnerUserId: siteOwnerUser2.id,
      name: `Ad Property #${i}`,
      url: 'https://hads.xyz',
      type: 'banner',
      pixelWidth: 200,
      pixelHeight: 500,
      price: parseFloat((1000 * Math.random()).toFixed(2)),
    });
  }


  const exampleAd = await Models.Ad.create({
    adverstiserUserId: advertiserUser.id,
    billboardId: billboard1.id,
    name: 'Buy CryptoPuppies Now!',
    mediaUrl: 'https://placekitten.com/200/300',
    linkUrl: 'http://hads.xyz',
  });


  console.log('\n\n DONE! \n\n\n'.green);
  process.exit();
}());
