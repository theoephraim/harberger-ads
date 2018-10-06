/*
TODO: we should really not be doing any of this.
Instead we should be dealing with everything as integers
*/

const _ = require('lodash');
const Money = require('js-money');

module.exports.addDecimals = (amounts, currencyCode = 'USD') => {
  const currency = Money[currencyCode];
  // we assume all amounts are the same currency, so we dont worry
  // about specifiying and can just use USD as the base
  let sum = new Money(0, currency);
  _.each(amounts, (amount) => {
    if (amount) sum = sum.add(Money.fromDecimal(amount, currency, Math.round));
  });
  return parseFloat((sum.amount / 100).toFixed(2));
};

module.exports.multiplyDecimal = (amount, multiplier, currencyCode = 'USD') => {
  const currency = Money[currencyCode];
  // we assume all amounts are the same currency, so we dont worry
  // about specifiying and can just use USD as the base
  const amountM = Money.fromDecimal(amount, currency, Math.round);
  const total = amountM.multiply(multiplier, Math.ceil);
  return parseFloat((total.amount / 100).toFixed(2));
};
