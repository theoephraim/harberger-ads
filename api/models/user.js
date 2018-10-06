/*
  An "Advertiser" is an advertiser who wants to put ads on a billboard
*/

module.exports = {
  modelName: 'User',
  tableName: 'users',
  props: {
    id: 'id',
    name: 'string',
    email: 'email',
    xaddress: { type: 'string', public: false },
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
