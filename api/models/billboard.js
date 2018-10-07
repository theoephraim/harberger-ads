/*
  A "Billboard" is a specific advertising space
  Basically an advertising widget on a website (banner, sidebar)
  or a physical digital display in a physical location
*/

module.exports = {
  modelName: 'Billboard',
  tableName: 'billboards',
  props: {
    id: 'id',
    userId: { ref: 'User' },
    currentAdId: { ref: 'Ad' },
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
  },
  instanceMethods: {

  },
  classMethods: {
  },
  dummyDefaults: {
  },
};
