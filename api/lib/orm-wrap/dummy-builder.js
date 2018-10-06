/* eslint-disable no-param-reassign,no-continue,no-await-in-loop */
const _ = require('lodash');
const debug = (require('debug'))('dummybuilder');
const nconf = require('nconf');
const uuidv4 = require('uuid/v4');
const prasync = require('../prasync');

const DUMMIES_ENABLED = nconf.get('NODE_ENV') === 'test';

// we need to pass in the model options from defineModel

const NO_DUMMIES_ERROR = new Error('Dummies are not allowed in this configuration.');

function buildDummyGeneratorFunctions(modelOptions) {
  return {
    async deleteDummies() {
      if (!DUMMIES_ENABLED) throw NO_DUMMIES_ERROR;
      const Model = this;
      return Model.destroy();
    },

    async createDummy(dummyVals = {}) {
      if (!DUMMIES_ENABLED) throw NO_DUMMIES_ERROR;
      const Model = this;
      const { props, modelName } = modelOptions;

      debug(`Creating dummy: ${modelName}`, dummyVals);

      // dummyVals could === true if it was set as true
      // to trigger creation as a related model
      if (dummyVals === true) { dummyVals = {}; }

      const dummy = new Model();
      dummy.refs = {};

      let defaults = modelOptions.dummyDefaults || {};
      // lets you define a dummyFn that takes an argument and
      // returns more defaults. Useful for sets of options that
      // go together
      if (dummyVals.dummyFn) {
        const fnVals = modelOptions.dummyFn(dummyVals.dummyFn);
        // const fnVals = modelOptions.dummyFn.call(null, dummyVals.dummyFn);
        defaults = _.assign({}, defaults, fnVals);
      }

      for (const key of _.keys(props)) {
        const poptions = props[key];
        // use default values if nothing set
        if (dummyVals[key] === undefined) {
          if ([null, undefined].includes(defaults[key])) {
            dummyVals[key] = poptions.default;
          } else {
            dummyVals[key] = defaults[key];
          }
        }

        if (typeof dummyVals[key] === 'function') {
          // call the function
          dummyVals[key] = dummyVals[key].apply(dummy);
        }

        // Handle some special value generators
        if (typeof dummyVals[key] === 'string') {
          if (dummyVals[key] === 'dummyName()') {
            dummyVals[key] = `${modelName}-${_.uniqueId()}-${+new Date()}`;
          } else if (dummyVals[key] === 'uuid()') {
            dummyVals[key] = uuidv4();

            // set a function that takes args as a dummy default
            // and you can pass in "fn(value)" as a default during creation
            // it will be passed into the fn to create the value
          } else {
            const matches = dummyVals[key].match(/fn\((.*)\)/);
            if (dummyVals[key] && matches) {
              if (typeof defaults[key] !== 'function') {
                throw new Error(`The dummyDefaults.${key} must be a function in order to pass a fn() value to it.`);
              }
              const args = matches[1].split(',');
              dummyVals[key] = defaults[key].apply(dummy, args);
            }
          }
        }

        // normal props do not have ref set and are easy to deal with
        if (!poptions.ref) {
          dummy[key] = dummyVals[key];
          continue;
        }

        // fields that hold references get complicated...

        const relatedModelName = poptions.ref;

        // have to pull this in here or else the models are not loaded...
        // TODO: figure out how to deal with this better?
        const { Models } = require('../../models'); // eslint-disable-line global-require


        const RelatedModel = Models[relatedModelName];

        // TODO: add code to handle ref arrays types
        // you can pass in an id directly
        if (_.isString(dummyVals[key]) || _.isInteger(dummyVals[key])) {
          const instance = await RelatedModel.findById(dummyVals[key]);
          dummy[key] = dummyVals[key];
          dummy.refs[poptions.refAs] = instance;
          continue;
        }

        // you can pass in an instance of a model
        // eslint-disable-next-line no-underscore-dangle
        if (dummyVals[key] && dummyVals[key]._modelOptions) {
          // check to make sure it is the right type of model
          // TODO: figure out a better way to check the object is a sequelize instance?
          if (dummyVals[key].getModelName() === relatedModelName) {
            const instance = dummyVals[key];
            dummy[key] = instance.id;
            dummy.refs[poptions.refAs] = instance;
            continue;
          } else {
            throw new Error(`While creating test dummy, for field "${key}" was expecting a ${relatedModelName} but received a ${dummyVals[key].getModelName()}`);
          }
        }

        // related models are created if the value passed in === true
        // or if it is a required property
        if (dummyVals[key] || poptions.required) {
          const instance = await RelatedModel.createDummy(dummyVals[key] || {});
          dummy[key] = instance.id;
          dummy.refs[poptions.refAs] = instance;
          continue;
        }
      }

      await dummy.save();
      return dummy;
    },

    // TODO: add options for static dummy
    // ie. always use the same instance for a model

    async createDummies(propsForNamedDummies) {
      const Model = this;
      const dummies = {};
      for (const dummyName of _.keys(propsForNamedDummies)) {
        const dummyProps = propsForNamedDummies[dummyName];
        dummies[dummyName] = await Model.createDummy(dummyProps);
      }
      return dummies;
    },
    //
    async cloneDummy(dummy, overrides) {
      const Model = this;
      const vals = { ...dummy.dataValues, ...overrides };
      vals[Model.primaryKeyAttribute] = undefined;

      // swap in the instance of ref models instead of just the IDs
      _.each(modelOptions.props, (poptions, key) => {
        if (poptions.ref && (vals[key] === dummy[key])) {
          vals[key] = dummy.refs[poptions.refAs];
        }
      });
      return this.createDummy(vals);
    },

    async createAndCloneDummies(dummyProps, callback) {
      const Model = this;
      // uses the first key as the base to clone from
      let dummyToClone;
      return prasync.mapValuesSeries(dummyProps, async (props, dummyName) => {
        if (!dummyToClone) {
          dummyToClone = await Model.createDummy(props);
          return dummyToClone;
        }
        return Model.cloneDummy(dummyToClone, props);
      });
    },
  };
}

module.exports = {
  DUMMIES_ENABLED,
  buildDummyGeneratorFunctions,
};
