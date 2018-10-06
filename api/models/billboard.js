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
    name: 'string',
    description: 'string',
    type: { type: 'string', enum: ['sidebar', 'banner', 'text', 'tv'], default: 'banner' },
    siteId: { ref: 'Site' },
    pixelWidth: 'int',
    pixelHeight: 'int',
    price: 'money',
    taxRate: { type: 'percent', default: 0.05 },
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
