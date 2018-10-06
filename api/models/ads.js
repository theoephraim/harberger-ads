/*
  An "Advertiser" is an advertiser who wants to put ads on a billboard
*/

module.exports = {
  modelName: 'Ad',
  tableName: 'ads',
  props: {
    id: 'id',
    userId: { ref: 'User' },
    name: 'string',
    description: 'string',
    type: { type: 'string', enum: ['text', 'image', 'video'], default: 'text' },
    textContent: 'string',
    linkUrl: 'url',
    mediaUrl: 'url',
  },
  virtualProps: {
    user() { return this.refs.user; },
  },
  instanceMethods: {
  },
  classMethods: {
  },
  dummyDefaults: {
  },
};
