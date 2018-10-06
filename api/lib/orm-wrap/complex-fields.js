/* eslint-disable no-param-reassign */
const _ = require('lodash');

function createAddressFields(prefix, useBadCountryFieldName) {
  prefix = `${prefix ? `${prefix}A` : 'a'}ddress`;
  return {
    [`${prefix}Street1`]: { type: 'string', public: false },
    [`${prefix}Street2`]: { type: 'string', public: false },
    [`${prefix}PostalCode`]: { type: 'string', public: false },
    [`${prefix}City`]: { type: 'string', public: false },
    [`${prefix}State`]: { type: 'string(2)', public: false },
    [`${prefix}CountryCode`]: {
      type: 'string(2)',
      public: false,
      ...useBadCountryFieldName && { field: `${prefix}Country` },
    },
  };
}

function createAddressVirtual(prefix) {
  // TODO: remove bad country field override after we rename the field
  // its only because the DB is inconsistent
  prefix = `${prefix ? `${prefix}A` : 'a'}ddress`;
  return {
    [prefix]: {
      get() {
        return {
          line1: this[`${prefix}Street1`],
          line2: this[`${prefix}Street2`],
          postalCode: this[`${prefix}PostalCode`],
          city: this[`${prefix}City`],
          state: this[`${prefix}State`],
          country: this[`${prefix}CountryCode`],
        };
      },
      set(val) {
        this[`${prefix}Street1`] = val ? val.line1 : null;
        this[`${prefix}Street2`] = val ? val.line2 : null;
        this[`${prefix}PostalCode`] = val ? val.postalCode : null;
        this[`${prefix}City`] = val ? val.city : null;
        this[`${prefix}State`] = val ? val.state : null;
        this[`${prefix}CountryCode`] = val ? val.country : null;
      },
    },
    [`${prefix}OneLiner`]: {
      get() {
        return _.compact([
          this[`${prefix}Street1`],
          this[`${prefix}Street2`],
          this[`${prefix}City`],
          this[`${prefix}State`],
          this[`${prefix}PostalCode`],
        ]).join(', ');
      },
      public: false,
    },
  };
}


module.exports = {
  createAddressFields, createAddressVirtual,
};
