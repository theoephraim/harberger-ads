/*
  An "Advertiser" is an advertiser who wants to put ads on a billboard
*/

module.exports = {
  modelName: 'Impression',
  tableName: 'impressions',
  props: {
    id: 'id',
    adId: { ref: 'Ad' },
    clickedAt: 'timestamp',
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
