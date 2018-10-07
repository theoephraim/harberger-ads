import _ from 'lodash';
import {
  personalTaxIdLabel, federalTaxIdLabel, stateLabel,
} from '@/utils/local';
import utils from 'web3-utils';

import { asyncActionStatusGetter } from '@/utils/vuex-api-utils';

export const requestStatus = asyncActionStatusGetter;

export const userIsLoggedIn = (state, getters) => !!getters.authHeader;
export const user = (state) => state.user;
export const userAccountAddress = (state) => state.account;
export const searchFilter = (state) => state.searchFilter;

export const authHeader = ({ account, signatures }) => {
  if (!account || !signatures || !signatures[account]) return null;
  return `Basic ${btoa(`${account}:${signatures[account]}`)}`;
};

export const billboards = (state) => _.values(state.billboards).map((v) => {
  const g = state.graphProperties[v.contractId];
  if (!g) return v;
  return { ...v, owner: g.owner, price: utils.fromWei(g.price) };
});
export const selectedBillboard = (state) => state.selectedBillboard;


export const filteredBillboards = (state, getters) => {
  if (!state.searchFilter) return getters.billboards;
  console.log(getters.userAccountAddress);
  return _.filter(getters.billboards, (b) => {
    if (state.searchFilter === 'myads') {
      return b.currentAd.advertiserUserId === getters.userAccountAddress;
    } else if (state.searchFilter === 'mysite') {
      return b.siteOwnerUserId === getters.userAccountAddress;
    }
  });
};
