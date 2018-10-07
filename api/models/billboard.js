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
    userId: { type: 'int', ref: 'User' },
    currentAdId: { type: 'int', ref: 'Ad', noRefConstraint: true },
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
    currentAd() { return this.refs.currentAd; },
    clickCount() { return _.get(this.calcs, 'stats.clicks', 0); },
    viewCount() { return _.get(this.calcs, 'stats.views', 0); },
  },
  instanceMethods: {
    async loadStats() {
      [this.calcs.stats] = await sequelize.query(`
        SELECT
          count(*) AS views,
          SUM(CASE WHEN clicked_at IS NOT NULL THEN 1 ELSE 0 END) AS clicks
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
