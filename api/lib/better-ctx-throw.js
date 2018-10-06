/* eslint-disable no-param-reassign */

/*
  Error handling setup

  We override ctx.throw to add some functionality:
  - ctx.throw now accepts named errors rather than just codes
    (who can remember what a 432 is!?)
  - optionally provide a specific error "type" code to the client

  Examples of how to use ctx.throw:
  - ctx.throw('NotFound')
  - ctx.throw('NotFound', 'This user does not exist')
  - ctx.throw('NotFound', 'UserNotFound', 'This user does not exist')

  Also handle logging and making error formatting consistent
*/

const _ = require('lodash');
const nconf = require('nconf');

const RUNNING_TESTS = nconf.get('NODE_ENV') === 'test';

// https://github.com/jshttp/http-errors
const ERROR_NAMES = {
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  URITooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  UnorderedCollection: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HTTPVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  BandwidthLimitExceeded: 509,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};

class ApiError extends Error {
  constructor(generalErrorType, specificErrorType, errorMessage, errorDetails) {
    const statusCode = ERROR_NAMES[generalErrorType] || 500;

    if (!errorMessage) {
      errorMessage = specificErrorType;
      specificErrorType = null;
    }

    super(errorMessage);
    this.name = specificErrorType || generalErrorType;
    this.type = specificErrorType || generalErrorType;
    this.generalType = generalErrorType;
    this.statusCode = statusCode;
    this.message = errorMessage;
    this.details = errorDetails;
    this.expectedError = statusCode < 500;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(errorMessage)).stack;
    }
  }
}

async function middleware(ctx, next) {
  // Override ctx.throw to add some better functionality
  // const _originalThrow = ctx.throw; // eslint-disable-line no-underscore-dangle
  ctx.throw = (...args) => {
    throw new ApiError(...args);
  };

  try {
    await next();
  } catch (err) {
    ctx.$.capturedError = err;
    // TODO: deal with errors that did NOT come from ctx.throw

    // Here we can create switches on formatting for versions
    // if (semver.satisfies(ctx.$.version, '2.x')) ...

    // we have to set the status code manually for some reason...
    // see -- https://github.com/koajs/koa/issues/803
    if (err.expectedError && err.statusCode) {
      ctx.status = err.statusCode;
      ctx.body = _.pick(err, 'type', 'message', 'details');
    } else {
      // we do not want to show users any details about unexpected errors
      ctx.status = 500;
      ctx.body = {
        type: 'InternalServerError',
        message: 'An unexpected error occurred. Please try again or contact customer service',
      };
      if (RUNNING_TESTS) {
        /* eslint-disable no-console */
        if (err.message.indexOf('Nock: No match for request') === 0) {
          console.log(err);
          throw new Error('Missing nock-back mock definition');
        }
        throw err;
      }
      // error gets logged by general request logging middleware
    }

    // // Catch badly formed input from bodyparser
    // if (err.status) {
    //   err.httpStatusCode = err.status;
    //   if (err.toString() == 'Error: invalid json') {
    //     err = new Exceptions.BadRequest('Invalid json body');
    //   }
    // }

    // // Catch mongoose errors
    // if (err.name == 'ValidationError') {
    //   const bad_keys = _.keys(err.errors).join(', ');
    //   err = new Exceptions.BadRequest(`Validation error: ${bad_keys}`);
    // }

    //
    // const errorCode = err.httpStatusCode || errorTypes.Unknown.httpStatusCode;
    // ctx.response.status = errorCode;
    //


    // } catch (err) {
    //   logger.logError(err, { req });
    //   res.status(errorTypes.Unknown.code).json({
    //     error: {
    //       type: 'Unknown',
    //       details: 'Error caught in response middleware',
    //     },
    //   });
    // }
  }
}

module.exports = {
  ERROR_NAMES,
  middleware,
  ApiError,
};
