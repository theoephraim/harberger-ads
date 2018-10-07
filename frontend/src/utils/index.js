import BigNumber from 'bignumber.js';
import utils from 'web3-utils';

export function pad0x(string = '') {
  if (typeof string !== 'string') return null;
  if (string.startsWith('0x')) return string;
  return `0x${string}`;
}

export function pluralize(word, count) {
  return `${word}${count !== 1 ? 's' : ''}`;
}

export function prettyBigNumber(bigNumber = 0, decimalPlaces = 2) {
  // eslint-disable-next-line
  bigNumber = utils.fromWei(bigNumber.toString(10));
  // eslint-disable-next-line
  if (typeof bigNumber !== 'object') bigNumber = new BigNumber(bigNumber);
  return bigNumber.toFormat(decimalPlaces);
}

export function toWei(n = 0) {
  if (typeof n === 'object') return n;
  // eslint-disable-next-line
  n = new BigNumber(n);
  return utils.toWei(n.toString(10));
}

export function bnMinus(one = 0, two = 0) {
  return new BigNumber(one).minus(new BigNumber(two));
}

export function padRight(val, number) {
  const diff = parseInt(number) - val.length;
  if (diff === 0) return val;
  return val.toString() + '0'.repeat(diff);
}

export function makeBn(v = 0) {
  if (typeof v === 'object') return v;
  return new BigNumber(v);
}
