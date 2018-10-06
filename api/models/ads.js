/*
  An "Advertiser" is an advertiser who wants to put ads on a billboard
*/

const { Models } = require('../models');


module.exports = {
  modelName: 'Ad',
  tableName: 'ads',
  props: {
    id: 'id',
    advertiserUserId: { ref: 'User' },
    name: 'string',
    description: 'string',
    type: { type: 'string', enum: ['text', 'image', 'video'], default: 'text' },
    textContent: 'string',
    linkUrl: 'url',
    mediaUrl: 'url',
  },
  virtualProps: {
    user() { return this.refs.user; },
    billboard() { return this.refs.billboard; },
  },
  complexRefs: {
    async billboard() { return Models.Billboard.find({ where: { currentAdId: this.id } }); },
  },
  instanceMethods: {
  },
  classMethods: {
  },
  dummyDefaults: {
  },
};
