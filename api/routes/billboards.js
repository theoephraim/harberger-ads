const _ = require('lodash');
const { Models } = require('../models');

const { loggedInOnly } = require('../lib/auth-helpers');

const { validate } = require('../lib/validation-helpers');

module.exports = function initRoutes(router) {
  router.get('/billboards', async (ctx, next) => {
    const billboards = await Models.Billboard.findAll({
      include: [{
        association: Models.Billboard.association('activeAdId'),
        required: false,
      }],
    });
    ctx.body = billboards;
  });

  router.param('billboardId', async (adId, ctx, next) => {
    ctx.$.billboard = await Models.Billboard.findById(adId, {
      include: [{
        association: Models.Billboard.association('activeAdId'),
        required: false,
      }],
    });
    if (!ctx.$.billboard) ctx.throw('NotFound', 'Ad does not exist');

    if (!ctx.$.superadmin && ctx.$.billboard.advertiserUserId !== ctx.$.authUser.id) {
      ctx.throw('Forbidden', 'This ad is not yours');
    }

    ctx.$.ad = ctx.$.billboard.refs.activeAd;


    console.log(ctx.$.ad.refs.user.dataValues);
    next();
  });
};
