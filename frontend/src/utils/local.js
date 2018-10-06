/*
  Helpers to deal with showing appropriate labels and options for selected
  country and state.
*/

import statesByCountry from '@/data/states-by-country';

const validCountries = Object.keys(statesByCountry);

export function stateOptionsForCountry(countryCode) {
  if (!countryCode) return [];
  return statesByCountry[countryCode];
}

export function postalCodeLabel(countryCode) {
  return countryCode === 'US' ? 'Zip Code' : 'Postal Code';
}

export function stateLabel(countryCode) {
  return {
    US: 'State',
    CA: 'Province',
  }[countryCode] || 'Province';
}

export function stateLabelAdjective(countryCode) {
  return {
    US: 'State',
    CA: 'Provincial',
  }[countryCode] || 'Provincial';
}

export function personalTaxIdLabel(countryCode) {
  return {
    US: 'Social security number',
    CA: 'Social insurance number',
  }[countryCode] || 'Federal ID number';
}

export function personalTaxIdRegex(countryCode) {
  return '^\\d{9}$';
}

export function federalTaxIdLabel(countryCode) {
  return {
    US: 'EIN',
    CA: 'Business Number',
  }[countryCode];
}
