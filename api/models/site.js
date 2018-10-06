/*
  A "Site" is the owner of the larger properties that the billboard is a part of.
  Basically a website or a physical space.
*/

module.exports = {
  modelName: 'Site',
  tableName: 'sites',
  props: {
    id: 'id',
    xaddress: 'string',
    name: 'string',
    description: 'string',
    url: 'url',
    address: 'string',
    type: { type: 'string', enum: ['physical', 'website'], deafult: 'website' },
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
