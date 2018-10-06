const _ = require('lodash');
const { Models } = require('../models');

const { adminsOnly, superadminsOnly } = require('../lib/auth-helpers');

const { validate } = require('../lib/validation-helpers');

module.exports = function initRoutes(router) {
  router.get('/ads', async (ctx, next) => {
    const ads = await Models.Ad.findAll();
    ctx.body = ads;
  });
};
