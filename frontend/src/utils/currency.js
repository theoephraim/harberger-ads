/* eslint-disable no-param-reassign */

import accounting from 'accounting';

// inspired by https://github.com/mazipan/vue-currency-filter/blob/master/VueCurrencyFilter.js

// future projects:
// - more options - simpler symbol in front/back
// - different currency configuration

const defaultFormattingOptions = {
  format: '%s%v',
  symbol: '$',
  precision: 2,
  thousand: ',',
  decimal: '.',
};

export function formatMoney(value, specificFormattingOverrides) {
  // specificFormattingOverrides takes options that are passed through to accounting
  // alternatively you can pass true or false to force showing / hiding cents
  // if you pass nothing, it will show cents if they are present and not otherwise

  // one special option for just hiding cents
  if (specificFormattingOverrides === false) {
    specificFormattingOverrides = { precision: 0 };
  }
  let amount = parseFloat(value);
  if (isNaN(amount)) amount = 0.0;
  let formattedAmount = accounting.formatMoney(amount, {
    ...defaultFormattingOptions,
    ...specificFormattingOverrides,
  });
  if (specificFormattingOverrides === undefined) {
    formattedAmount = formattedAmount.replace(/\.00$/, '');
  }
  return formattedAmount;
}
