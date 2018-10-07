const fs = require('fs');
const path = require('path');
const nconf = require('nconf');
const _ = require('lodash');
const { Models } = require('../models');

const { validate } = require('../lib/validation-helpers');

const iframeSrc = fs.readFileSync(path.resolve(`${__dirname}/../static/iframe.html`), 'utf-8');
const fallbackSrc = fs.readFileSync(path.resolve(`${__dirname}/../static/fallback.html`), 'utf-8');

const API_URL = nconf.get('API_URL');
const WEBSITE_URL = nconf.get('WEBSITE_URL');

module.exports = function initRoutes(router) {
  router.get('/i', async (ctx, next) => {
    const billboardId = ctx.request.query.b;
    const billboard = await Models.Billboard.findById(billboardId);
    if (!billboard) ctx.throw('NotFound');

    const ad = await billboard.populateRef('currentAd');
    if (!ad) {
      console.log('user fallback');
      ctx.response.body = fallbackSrc
        .replace(/{HADS_URL}/g, WEBSITE_URL);
      ctx.set('Content-type', 'text/html');
      return;
    }

    const impression = await Models.Impression.create({ adId: ad.id });

    const impressionSrc = iframeSrc
      .replace('{IMG_URL}', ad.mediaUrl)
      .replace('{AD_URL}', `${API_URL}/c?i=${impression.id}`)
      .replace('{HADS_URL}', WEBSITE_URL)
      .replace('{BILLBOARD_ID}', billboard.id);

    ctx.response.body = impressionSrc;
    ctx.set('Content-type', 'text/html');
  });

  router.get('/c', async (ctx, next) => {
    const impressionId = ctx.request.query.i;
    const impression = await Models.Impression.findById(impressionId);
    const ad = await impression.populateRef('ad');

    await impression.update({ clickedAt: new Date() });

    ctx.redirect(ad.linkUrl);
  });
};
