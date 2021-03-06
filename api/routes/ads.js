const _ = require('lodash');
const { Models } = require('../models');

const { validate } = require('../lib/validation-helpers');

module.exports = function initRoutes(router) {
  router.get('/ads', async (ctx, next) => {
    const ads = await Models.Ad.findAll({
      where: { },
    });
    ctx.body = ads;
  });

  router.param('adId', async (adId, ctx, next) => {
    ctx.$.ad = await Models.Ad.findById(adId);
    if (!ctx.$.ad) ctx.throw('NotFound', 'Ad does not exist');
    if (!ctx.$.superadmin && ctx.$.ad.advertiserUserId !== ctx.$.authUser.id) {
      ctx.throw('Forbidden', 'This ad is not yours');
    }
    _.assign(ctx.$, await ctx.$.ad.populateRefs('billboard advertiserUser'));
    next();
  });

  router.get('/ads/:adId', async (ctx, next) => {
    ctx.body = ctx.$.ad;
  });

  router.patch('/ads/:adId', async (ctx, next) => {
    validate(ctx.request.body, {
      url: { isUrl: true },
    });

    await ctx.$.ad.update(ctx.request.body);
    ctx.body = ctx.$.ad;
  });
};
