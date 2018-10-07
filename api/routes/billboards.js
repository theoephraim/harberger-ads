const _ = require('lodash');
const { Models } = require('../models');

const { middleware, loggedInOnly } = require('../lib/auth-helpers');

const { validate } = require('../lib/validation-helpers');

module.exports = function initRoutes(router) {
  router.get('/billboards', async (ctx, next) => {
    const billboards = await Models.Billboard.findAll();
    const ads = await Models.Ad.findAll({
      where: { id: _.map(billboards, 'activeAdId') },
    });
    const adsByid = _.keyBy(ads, 'id');
    _.each(billboards, (b) => { b.refs.activeAd = adsByid[b.activeAdId]; });
    ctx.body = billboards;
  });

  router.param('billboardId', async (adId, ctx, next) => {
    ctx.$.billboard = await Models.Billboard.findById(adId);
    if (!ctx.$.billboard) ctx.throw('NotFound', 'Ad does not exist');

    if (!ctx.$.superadmin && ctx.$.billboard.advertiserUserId !== ctx.$.authUser.id) {
      ctx.throw('Forbidden', 'This ad is not yours');
    }

    ctx.$.currentAd = await ctx.$.billboard.populateRef('currentAd');
    await ctx.$.billboard.loadStats();

    ctx.$.ad = ctx.$.billboard.refs.activeAd;
    next();
  });

  router.get('/billboards/:billboardId', async (ctx, next) => {
    ctx.body = ctx.$.billboard;
  });

  router.post('/billboards', middleware, async (ctx, next) => {
    validate(ctx.request.body, {
      url: { isURL: true, required: true },
      pixelWidth: { min: 100, required: true },
      pixelHeight: { min: 100, required: true },
      name: { required: true },
      description: {},
      type: { isEnum: Models.Billboard.enumOptions('type') },
      price: { toFloat: true, min: 0 },
      contractId: {},
    }, { discardExtraProps: true });
    ctx.body = await Models.Billboard.create({
      ...ctx.request.body,
      userId: ctx.$.authUser.id,
    });
  });
};
