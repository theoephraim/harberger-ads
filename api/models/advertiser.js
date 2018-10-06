/*
  An "Advertiser" is an advertiser who wants to put ads on a billboard
*/

module.exports = {
  modelName: 'Advertiser',
  tableName: 'advertisers',
  props: {
    id: 'id',
    name: 'string',
    description: 'string',
    email: 'email',
    xaddress: 'string',
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
