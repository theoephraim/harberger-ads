// example:
// export const MUTATION_NAME = 'MUTATION_NAME';

import { makeAsyncMutationTypes } from '@/utils/vuex-api-utils';

// ///////////////// API / async actions

// auth
export const LOGIN = makeAsyncMutationTypes('LOGIN');
export const AUTH_FROM_STORAGE = 'AUTH_FROM_STORAGE';
export const LOGOUT = 'LOGOUT';
