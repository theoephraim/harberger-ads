/*
  An "Advertiser" is an advertiser who wants to put ads on a billboard
*/

module.exports = {
  modelName: 'Ad',
  tableName: 'ads',
  props: {
    id: 'id',
    name: 'string',
    description: 'string',
    type: { type: 'string', enum: ['text', 'image', 'video'], default: 'text' },
    textContent: 'string',
    linkUrl: 'url',
    mediaUrl: 'url',
    userId: { ref: 'User' },
  },
  virtualProps: {
  },
  instanceMethods: {
  },
  classMethods: {
  },
  dummyDefaults: {
  },
};
