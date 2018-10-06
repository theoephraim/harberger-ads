/* eslint-disable no-underscore-dangle */

import Vue from 'vue';
import _ from 'lodash';
import { mapGetters } from 'vuex';

import api from './api';

// inspiration from a few articles
// - https://medium.com/@lachlanmiller_52885/a-pattern-to-handle-ajax-requests-in-vuex-2d69bc2f8984

// TODO: refactor this - ideally do all 3 at the same time?

const timeout = (ms) => new Promise((res) => setTimeout(res, ms));

export const makeAsyncMutationTypes = (name) => ({
  name,
  PENDING: `${name}-PENDING`,
  SUCCESS: `${name}-SUCCESS`,
  FAILURE: `${name}-FAILURE`,
});


export const makeAsyncMutations = (type, mutation) => ({
  [type.PENDING]: (state, { actionSpec }) => {
    Vue.set(state.requests, actionSpec.requestStatusKey, {
      status: 'PENDING',
      error: null,
      requestedAt: new Date(),
    });
  },
  [type.SUCCESS]: (state, { actionSpec, response }) => {
    Vue.set(state.requests, actionSpec.requestStatusKey, {
      ...state.requests[actionSpec.requestStatusKey],
      status: 'SUCCESS',
      receivedAt: new Date(),
    });
    mutation(state, { actionSpec, response });
  },
  [type.FAILURE]: (state, { actionSpec, err }) => {
    let errorResponse = 'Unknown error';
    if (err.response) errorResponse = err.response.data;
    if (errorResponse.error) errorResponse = errorResponse.error;

    Vue.set(state.requests, actionSpec.requestStatusKey, {
      ...state.requests[actionSpec.requestStatusKey],
      status: 'FAILURE',
      receivedAt: new Date(),
      // TODO: figure out if we can find any other weird errors
      error: errorResponse,
    });
  },
});

// generates an "action" that wraps the whole thing with mutations so we can
// get the status and errors for a request
export const makeAsyncAction = (type, actionSpecFn) => async function (ctx, payload = {}) {
  const actionSpec = actionSpecFn(ctx, payload);
  actionSpec.payload = payload;
  // build a key for where to store the request status
  // some request statuses are segmented per ID or per some other param
  // while others are singular for that request type
  // ex: "user signup" (singular)
  // vs "add external account" (per type)
  // vs "update external account" (per type and ID)
  actionSpec.requestStatusKey = actionSpec.keyRequestStatusBy
    ? [type.name].concat(actionSpec.keyRequestStatusBy).join('/')
    : type.name;
  ctx.commit(type.PENDING, { actionSpec });

  // adds a delay - sometimes helps give the backend time to process things
  // before making next request
  if (payload._delay) {
    await (timeout(payload._delay));
  }

  const { method, url, params, options, afterSuccess, afterFailure } = actionSpec;
  try {
    const requestOptions = {
      method,
      url,
      ...method === 'get' ? { params } : { data: params },
      ...options,
    };
    // console.log(requestOptions);
    const request = await api(requestOptions);
    await ctx.commit(type.SUCCESS, { actionSpec, response: request.data });
    if (typeof afterSuccess === 'function') {
      afterSuccess(request.data);
    }
  } catch (err) {
    if (!err.response) {
      throw err;
    }

    ctx.commit(type.FAILURE, { actionSpec, err });
    // handle both v3 and v2 style errors
    const errorType = _.get(err, 'response.data.type') || _.get(err, 'response.data.error');
    // v3 admin deleted, v3 user is cancelled, v2 user is cancelled
    if (['AuthAdminDeleted', 'AuthUserCancelled', 'ACCOUNT_LOCKED'].includes(errorType)) {
      ctx.dispatch('logout', { redirectToLogin: true });
    }
    if (typeof afterFailure === 'function') {
      afterFailure(err.response.data);
    }
  }
};

export const asyncActionStatusGetter = (state) => (name, param1, param2) => {
  let requestKey = name;
  if (param1) requestKey += `/${param1}`;
  if (param2) requestKey += `/${param2}`;
  const request = state.requests[requestKey] || {};
  const statusProps = {
    wasRequested: !!request.requestedAt,
    isPending: request.status === 'PENDING',
    isError: request.status === 'FAILURE',
    isSuccess: request.status === 'SUCCESS',
    error: request.error,
    receivedAt: request.receivedAt,
  };
  if (request.error) {
    statusProps.errorMessage = request.error.message || 'Something went wrong';
    if (request.error.details && request.error.details.messages) {
      statusProps.errorMessages = request.error.details.messages;
    }
  }
  return statusProps;
};

// function that maps request statuses easily
// be careful to not use arrow functions here as it is important that
// the function returned is called within the context of the component
export const mapRequestStatuses = function (mappings) {
  return _.mapValues(mappings, (requestName) => function () {
    // combines multiple request statuses into a single status
    if (_.isArray(requestName)) {
      const statuses = _.map(requestName, (r) => this.$store.getters.requestStatus(r));
      return {
        isPending: _.some(statuses, 'isPending'),
        isError: _.some(statuses, 'isError'),
        isSuccess: _.every(statuses, 'isSuccess'),
        error: _.find(_.map(statuses, 'error')),
        receivedAt: _.maxBy(statuses, 'receivedAt'),
      };
    }
    return this.$store.getters.requestStatus(requestName);
  });
};
