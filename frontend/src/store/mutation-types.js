// example:
// export const MUTATION_NAME = 'MUTATION_NAME';

import { makeAsyncMutationTypes } from '@/utils/vuex-api-utils';

// ///////////////// API / async actions

export const LOGIN = makeAsyncMutationTypes('LOGIN');

export const FETCH_THE_GRAPH = makeAsyncMutationTypes('FETCH_THE_GRAPH');
export const FETCH_BILLBOARDS = makeAsyncMutationTypes('FETCH_BILLBOARDS');

export const CREATE_BILLBOARD = makeAsyncMutationTypes('CREATE_BILLBOARD');
export const FETCH_BILLBOARD_DETAILS = makeAsyncMutationTypes('FETCH_BILLBOARD_DETAILS');
export const UPDATE_BILLBOARD_AD = makeAsyncMutationTypes('UPDATE_BILLBOARD_AD');

// auth
export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';

export const SET_NETWORK = 'SET_NETWORK';
export const SET_UNLOCKED = 'SET_UNLOCKED';
export const SET_ACCOUNT = 'SET_ACCOUNT';
export const UPDATE_WAIT_TO_PING = 'UPDATE_WAIT_TO_PING';
export const CONTRACTS_DEPLOYED = 'CONTRACTS_DEPLOYED';

export const ADD_MSG = 'ADD_MSG';
export const REMOVE_MSG = 'REMOVE_MSG';

export const SET_SEARCH_FILTER = 'SET_SEARCH_FILTER';
