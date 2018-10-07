const _ = require('lodash');
const { Models, sequelize } = require('../models');

const { loggedInOnly } = require('../lib/auth-helpers');

const { validate } = require('../lib/validation-helpers');
const prasync = require('../lib/prasync');

module.exports = function initRoutes(router) {
  router.get('/billboards', async (ctx, next) => {
    const billboards = await Models.Billboard.findAll();
    const stats = await sequelize.query(`
      SELECT
        b.id,
        count(i.id) AS views,
        count(a.id) AS trades,
        SUM(CASE WHEN clicked_at IS NOT NULL THEN 1 ELSE 0 END) AS clicks
      FROM
        billboards b
        LEFT JOIN ads a ON a.billboard_id = b.id
      LEFT JOIN impressions i ON i.ad_id = a.id
      GROUP BY 1
    `, { type: sequelize.QueryTypes.SELECT });
    const statsByBillboardId = _.keyBy(stats, 'id');
    _.each(billboards, (b) => {
      b.calcs.stats = statsByBillboardId[b.id] || {};
    });

    await prasync.each(billboards, async (b) => b.populateRef('currentAd'));

    ctx.body = billboards;
  });

  // create a new billboard
  router.post('/billboards', async (ctx, next) => {
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

    // TODO: validate contract ID is valid on the blockchain

    ctx.body = await Models.Billboard.create({
      ...ctx.request.body,
      siteOwnerUserId: ctx.$.authUser.id,
    });
  });


  // general param handler to deal with a single billboard
  router.param('billboardId', async (adId, ctx, next) => {
    ctx.$.billboard = await Models.Billboard.findById(adId);
    if (!ctx.$.billboard) ctx.throw('NotFound', 'Ad does not exist');

    ctx.$.currentAd = await ctx.$.billboard.populateRef('currentAd');
    await ctx.$.billboard.loadStats();
    return next();
  });

  router.get('/billboards/:billboardId', async (ctx, next) => {
    ctx.body = ctx.$.billboard;
  });

  router.post('/billboards/:billboardId/set-ad', loggedInOnly, async (ctx, next) => {
    // TODO: validate using the graph that the current auth user is the current
    // owner of this billboad

    validate(ctx.request.body, {
      mediaUrl: { isURL: true, required: true },
      linkUrl: { isURL: true, required: true },
      price: { toFloat: true, min: 0 },
    }, { discardExtraProps: true });

    await ctx.$.billboard.update({ price: ctx.request.body.price });

    const newAd = await Models.Ad.create({
      ...ctx.request.body,
      advertiserUserId: ctx.$.authUser.id,
      billboardId: ctx.$.billboard.id,
    });
    console.log(newAd.dataValues);

    ctx.$.billboard.refs.currentAd = newAd;

    // console.log(ctx.$.billboard.dataValues);
    ctx.body = ctx.$.billboard;
  });
};
