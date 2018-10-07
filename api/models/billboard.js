/*
  A "Billboard" is a specific advertising space
  Basically an advertising widget on a website (banner, sidebar)
  or a physical digital display in a physical location
*/
const _ = require('lodash');
const { Models, sequelize } = require('../models');

module.exports = {
  modelName: 'Billboard',
  tableName: 'billboards',
  props: {
    id: 'id',
    siteOwnerUserId: { type: 'string', ref: 'User' },
    name: 'string',
    description: 'string',
    type: { type: 'string', enum: ['sidebar', 'banner', 'text', 'tv'], default: 'banner' },
    physicalAddress: 'string',
    url: 'url',
    pixelWidth: 'int',
    pixelHeight: 'int',
    price: 'money',
    taxRate: { type: 'percent', default: 0.05 },
    contractId: 'string',
  },
  virtualProps: {
    currentAd() { return this.refs.currentAd || {}; },
    clickCount() { return _.get(this.calcs, 'stats.clicks', 0); },
    viewCount() { return _.get(this.calcs, 'stats.views', 0); },
    tradeCount() { return _.get(this.calcs, 'stats.trades', 0); },
  },
  complexRefs: {
    async currentAd() {
      const a = await Models.Ad.find({
        where: { billboardId: this.id },
        order: [['createdAt', 'DESC']],
      });
      console.log(a);
      return a;
    },
  },
  instanceMethods: {
    async loadStats() {
      [this.calcs.stats] = await sequelize.query(`
        SELECT
          count(*) AS views,
          SUM(CASE WHEN clicked_at IS NOT NULL THEN 1 ELSE 0 END) AS clicks,
          count(distinct(a.id)) AS trades
        FROM
          impressions i
          LEFT JOIN ads a ON i.ad_id = a.id
          LEFT JOIN billboards b ON a.billboard_id = b.id
      `, { type: sequelize.QueryTypes.SELECT });
      console.log(this.calcs.stats);
    },
  },
  classMethods: {
  },
  dummyDefaults: {
  },
};
