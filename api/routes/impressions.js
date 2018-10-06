const _ = require('lodash');
const { Models } = require('../models');

const { validate } = require('../lib/validation-helpers');

module.exports = function initRoutes(router) {
  router.get('/i', async (ctx, next) => {
    const adId = ctx.request.query.a;
    const ad = await Models.Ad.findById(adId);
    const impression = await Models.Impression.create({ adId: ad.id });

    ctx.body = {
      ..._.pick(ad, 'mediaUrl'),
      impressionId: impression.id,
    };
  });

  router.get('/c', async (ctx, next) => {
    const impressionId = ctx.request.query.i;
    const impression = await Models.Impression.findById(impressionId);
    const ad = await impression.populateRef('ad');

    await impression.update({ clickedAt: new Date() });

    ctx.redirect(ad.linkUrl);
  });
};
