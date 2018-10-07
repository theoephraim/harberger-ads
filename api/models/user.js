/*
  An "Advertiser" is an advertiser who wants to put ads on a billboard
*/

module.exports = {
  modelName: 'User',
  tableName: 'users',
  props: {
    id: { type: 'string', primaryKey: true }, // this is the public address
    name: 'string',
    email: 'email',
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
