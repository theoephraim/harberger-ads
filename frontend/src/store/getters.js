import _ from 'lodash';
import {
  personalTaxIdLabel, federalTaxIdLabel, stateLabel,
} from '@/utils/local';

import { asyncActionStatusGetter } from '@/utils/vuex-api-utils';

export const requestStatus = asyncActionStatusGetter;

export const userIsLoggedIn = (state, getters) => !!getters.authHeader;
export const user = (state) => state.user;

export const authHeader = ({ account, signatures }) => {
  if (!account || !signatures || !signatures[account]) return null;
  return `Basic ${btoa(`${account}:${signatures[account]}`)}`;
};

export const billboards = (state) => _.values(state.billboards);
export const selectedBillboard = (state) => state.selectedBillboard;

