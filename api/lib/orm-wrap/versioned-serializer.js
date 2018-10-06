/*
  This file provides functionality for upgrading our ORM's basic toJSON

  using a function `toVersionedJSON` that gets added as an instance method
  and a middleware that recursively tries to call toVersionedJSON on ctx.body

  this is used mostly for keeping responses consistent for versioned requests
  but can be expanded to react to auth roles and more...

  controlling field visibility uses the "public" key in the options for a prop
  (applies to virtualProps as well)

  Fields are public by default but can be toggled using
  - a boolean
  - a semver "range" -- see https://github.com/npm/node-semver#ranges
  - a function that accepts state (gets passed koa's ctx.$)

  Examples:
  ```
  ... in your model definition...
  props: {
    shownByDefault: 'string',
    neverShowThis: { type: 'string', public: false },
    showOnLegacyRequests: { type: 'string', public: '2.x' },
    showUsingCtxState: { type: 'string', public: (state) => state.authUserIsAdmin }
    showUsingCtxAndVersion: { type: 'string', public: {
      version: '>3',
      visibility: (state) => state.authUserIsAdmin
    },
  ...
  ```
}
*/

const _ = require('lodash');
const semver = require('semver');
const camelcaseKeysDeep = require('camelcase-keys-deep');


// This function uses the model options to create toVersionedJSON for each model
function buildToVersionedJSON(modelOptions) {
  return function toVersionedJSON(state = {}) { // eslint-disable-line func-names
    const json = { id: this.id };
    const allProps = _.merge(modelOptions.props, modelOptions.virtualProps);
    _.each(allProps, (options, key) => {
      if (key === 'id') return; // id always visible and added first
      let visibilityFn;
      let visibilityVersion;

      const typeOfPublicSetting = typeof (options.public);
      if (typeOfPublicSetting === 'boolean') {
        visibilityFn = () => options.public;
      } else if (typeOfPublicSetting === 'string') {
        visibilityVersion = options.public;
      } else if (typeOfPublicSetting === 'function') {
        visibilityFn = options.public;
      } else if (typeOfPublicSetting === 'object') {
        visibilityVersion = options.public.version;
        visibilityFn = options.public.visibility;
      }

      let visible = true;
      if (visibilityVersion) {
        visible = semver.satisfies(state.version, visibilityVersion);
      }
      if (visible && visibilityFn) {
        visible = visibilityFn.call(this, state);
      }

      // TODO: add support for specifically requested private props?


      if (visible) {
        if (options === 'json' || options.type === 'json') {
          json[key] = camelcaseKeysDeep(this[key]);
        } else {
          json[key] = this[key];
        }
      }
    });

    if (!modelOptions.hideTimestamps) {
      json.createdAt = this.createdAt;
      json.updatedAt = this.updatedAt;
    }

    _.each(modelOptions.versionTransforms, (transform, semverRange) => {
      if (semver.satisfies(state.version, semverRange)) {
        transform.apply(this, [json, state]);
      }
    });

    return json;
  };
}


// Recurses through an object and tries to call toVersionedJSON on everything
// TODO: make this work w/ async so we can fetch stuff before rendering?
function recursivelyGetVersionedJSON(body, state, maxDepth = 20) {
  if (maxDepth < 0) throw new Error("recursivelyGetVersionedJSON doesn't handle self-reference");
  if (body === null || body === undefined) {
    return body;
  } else if (_.isArray(body)) {
    return _.map(body, (arrayChild) => recursivelyGetVersionedJSON(
      arrayChild,
      state,
      maxDepth - 1,
    ));
  } else if (body.toVersionedJSON != null) {
    return recursivelyGetVersionedJSON(body.toVersionedJSON(state), state, maxDepth - 1);
    // return _.mapValues(body.publicJson(req), (val) => recursivelyGetVersionedJSON(val, req));
  // } else if (body.toObject) {
  //   return body.toObject();
  } else if (body instanceof Date) {
    return body;
  } else if (_.isObject(body)) {
    if (_.isEmpty(body)) return {};
    return _.mapValues(body, (val) => recursivelyGetVersionedJSON(val, state, maxDepth - 1));
  }
  return body;
}

// middleware puts whatever gets passed to ctx.body through our versioning fns
async function middleware(ctx, next) {
  await next();
  ctx.body = await recursivelyGetVersionedJSON(ctx.body, ctx.$);
}

module.exports = {
  middleware,
  buildToVersionedJSON,
  recursivelyGetVersionedJSON,
};
