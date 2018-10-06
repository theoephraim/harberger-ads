// example:
// export const MUTATION_NAME = 'MUTATION_NAME';

import { makeAsyncMutationTypes } from '@/utils/vuex-api-utils';

// ///////////////// API / async actions

// auth
export const LOGIN = makeAsyncMutationTypes('LOGIN');
export const AUTH_FROM_STORAGE = 'AUTH_FROM_STORAGE';
export const LOGOUT = 'LOGOUT';
export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';

export const SET_NETWORK = 'SET_NETWORK';
export const SET_UNLOCKED = 'SET_UNLOCKED';
export const SET_ACCOUNT = 'SET_ACCOUNT';
export const UPDATE_WAIT_TO_PING = 'UPDATE_WAIT_TO_PING';
export const CONTRACTS_DEPLOYED = 'CONTRACTS_DEPLOYED';

export const ADD_MSG = 'ADD_MSG';
export const REMOVE_MSG = 'REMOVE_MSG';
