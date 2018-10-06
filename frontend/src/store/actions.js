/* eslint-disable max-len */

// TODO: maybe look into something like this -- https://medium.com/@lachlanmiller_52885/a-pattern-to-handle-ajax-requests-in-vuex-2d69bc2f8984

// ctx = "context" - includes state, dispatch, getters, etc

import _ from 'lodash';

import { makeAsyncAction } from '@/utils/vuex-api-utils';
import api from '@/utils/api';
import router from '../router';
import * as types from './mutation-types';
