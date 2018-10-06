const _ = require('lodash');
const { Models } = require('../models');

const { loggedInOnly } = require('../lib/auth-helpers');

const { validate } = require('../lib/validation-helpers');

module.exports = function initRoutes(router) {
  router.get('/ads', async (ctx, next) => {
    const ads = await Models.Ad.findAll();
    ctx.body = ads;
  });

  router.param('adId', async (adId, ctx, next) => {
    ctx.$.ad = await Models.Ad.findById(adId, {
      include: [{
        association: Models.Ad.association('advertiserUserId'),
        required: true,
      }],
    });
    if (!ctx.$.ad) ctx.throw('NotFound', 'Ad does not exist');

    if (!ctx.$.superadmin && ctx.$.ad.advertiserUserId !== ctx.$.authUser.id) {
      ctx.throw('Forbidden', 'This ad is not yours');
    }

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
