/* eslint-disable max-len */

// TODO: maybe look into something like this -- https://medium.com/@lachlanmiller_52885/a-pattern-to-handle-ajax-requests-in-vuex-2d69bc2f8984

// ctx = "context" - includes state, dispatch, getters, etc

import _ from 'lodash';

// import * as contracts from 'ha-contracts';
import HarbergerAdsContract from '@/contracts/HarbergerAds.json';
import { makeAsyncAction } from '@/utils/vuex-api-utils';
import BigNumber from 'bignumber.js';
import utils from 'web3-utils';
import axios from 'axios';

import api from '@/utils/api';
import router from '../router';
import * as types from './mutation-types';
// import { pad0x, makeBn, padRight } from '@/utils'

const signingParams = [
  {
    type: 'string',
    name: 'Message',
    value: 'Sign in with HA',
  },
];
const networks = {
  4: 'rinkeby',
  5777: 'ganache',
  1: 'mainnet',
};

export default {
  // web3 stuff
  async poll({ dispatch, commit }) {
    if (!global.web3.currentProvider.isPortis) {
      await dispatch('checkWeb3');
      setTimeout(() => {
        dispatch('poll');
      }, 5000);
    }
  },
  async checkWeb3({ commit, dispatch }) {
    try {
      await dispatch('getAccount');
      return true;
    } catch (error) {
      await dispatch('handleWeb3Error', error);
      return false;
    }
  },
  async handleWeb3Error({ state, dispatch }, error) {
    console.error(error);
    let title;
    let body;
    switch (error.message) {
      case 'User denied transaction signature.':
        title = 'Error Connecting To The Network';
        body = `Looks like you aren't connected to the Ethereum Network.
          The popup you just dismissed is a free wallet service called
          <a target='_blank' href='https://portis.io/'>Portis</a> that
          will pop up unless you have a wallet like <u><a target='_blank' href='https://metamask.io/'>
          Metamask</a></u>, <u><a target="_blank" href="https://status.im/">Status</a></u>, <u><a href="https://wallet.coinbase.com/" target="_blank">Coinbase Wallet</a></u> or  <u><a target='_blank' href='https://www.uport.me/'>
          uPort</a></u> already installed.`;
        break;
      case 'account-locked':
        title = 'Wallet is Locked';
        body = `Looks like your wallet is locked. Please unlock it if you'd like to
             interact with the contracts. If you'd like more information about
             this error, please see out help page.`;
        break;
      case 'wrong-network':
        title = 'Wrong Network';
        body = `Looks like you're connected to the wrong network. Please switch to
        Network ${networks[state.correctNetwork]} to interact with the blockchain.`;
        break;
      default:
        title = 'Error Connecting To The Network';
        body = error.message;
    }
    dispatch('addMessage', {
      type: 'info',
      title,
      msg: body,
    });
  },
  async getNetwork({ commit, state, dispatch }) {
    const networkId = await global.web3.eth.net.getId();
    if (state.networkId !== networkId) {
      commit(types.SET_NETWORK, networkId);
      await dispatch('getContracts');
    }
  },
  async getAccount({ commit, dispatch, state }) {
    await dispatch('getNetwork');
    const accounts = await global.web3.eth.getAccounts();
    if (accounts.length && state.account !== accounts[0].toLowerCase()) {
      commit(types.SET_UNLOCKED, true);
      commit(types.SET_ACCOUNT, accounts[0]);
    } else if (!accounts.length && (state.account || state.unlocked)) {
      commit(types.SET_UNLOCKED, false);
      commit(types.SET_ACCOUNT, null);
      throw new Error('account-locked');
    }
    commit(types.UPDATE_WAIT_TO_PING, true);
  },
  async contractsDeployed({ state }) {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (state.contractsDeployed) {
          clearInterval(interval);
          resolve();
        }
      }, 500);
    });
  },
  async getContracts({ dispatch, state, commit }) {
    commit(types.CONTRACTS_DEPLOYED, false);
    if (HarbergerAdsContract.networks[state.networkId]) {
      HarbergerAdsContract.instance = new global.web3.eth.Contract(
        HarbergerAdsContract.abi,
        HarbergerAdsContract.networks[state.networkId].address,
      );
      console.log('instantiated HarbergerAdsContract');
    } else {
      console.log(`${name} not deployed on this network`);
      throw new Error('wrong-network');
    }

    commit(types.CONTRACTS_DEPLOYED, true);
  },

  async signIn({ state, commit, dispatch }) {
    if (!(await dispatch('checkWeb3'))) throw new Error('Transaction Failed');
    const { account } = state;
    if (!account) {
      dispatch('selfDestructMsg', {
        type: 'error',
        msg: 'No ETH account to sign in with',
      });
      return;
    }
    global.web3.currentProvider.sendAsync(
      {
        method: 'eth_signTypedData',
        params: [signingParams, account],
        from: account,
      },
      (err, { result }) => {
        if (!result) {
          dispatch('selfDestructMsg', {
            title: 'Error',
            type: 'error',
            msg: 'Could not sign in',
          });
          return;
        }
        commit(types.SIGN_IN, { account, signature: result });
      },
    );
  },

  // logs
  selfDestructMsg({ commit }, msg) {
    const msgId = commit(types.ADD_MSG, msg);
    setTimeout(() => {
      commit(types.REMOVE_MSG, msgId);
    }, 7000);
  },
  addMessage({ commit }, msg) {
    const msgId = Date.now();
    // eslint-disable-next-line
    msg.id = msgId;
    commit(types.ADD_MSG, msg);
    return msgId;
  },


  // API ACTIONS ///////////////////////////////////////////////////////////////

  fetchTheGraph: makeAsyncAction(types.FETCH_THE_GRAPH, (ctx, payload) => ({
    method: 'post',
    url: '$graph',
    params: {
      query: `{
        properties {
          id
          price
          propertyId
          previousOwners
        }
        users {
          id
          address
          allowance
          balance
        }
      }`,
    },
  })),

  fetchBillboards: makeAsyncAction(types.FETCH_BILLBOARDS, (ctx, payload) => ({
    method: 'get',
    url: '/billboards',
  })),
  fetchBillboardDetails: makeAsyncAction(types.FETCH_BILLBOARD_DETAILS, (ctx, payload) => ({
    method: 'get',
    url: `/billboards/${payload.billboardId}`,
  })),

  createBillboard: makeAsyncAction(types.CREATE_BILLBOARD, (ctx, payload) => ({
    method: 'post',
    url: '/billboards',
  })),

};
