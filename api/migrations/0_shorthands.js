const nconf = require('nconf');

exports.shorthands = {
  money: { type: 'decimal(12,2)' },
  json: { type: 'jsonb' },
  currencyCode: { type: 'character(3)', default: 'USD' },
};

exports.up = (pgm) => {
  // Sets the "system time" of the databse to UTC
  if (nconf.get('NODE_ENV') === 'development') {
    pgm.sql("ALTER DATABASE postgres SET timezone TO 'UTC'");
    pgm.sql('SELECT pg_reload_conf()');
  }
};
