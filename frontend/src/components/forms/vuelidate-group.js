/*
  This mixin creats a "validation" state similar to vuelidate
  that includes all form-input children

  - uses Vue's provide/inject to let each form-input register itself with group
  - children must have `vuelidate/validationMixin`
  - adds a $touchAll and $resetAll which calls on child

  // TODO: let group contain sub-groups
*/

import _ from 'lodash';

function extractValidationRules(obj) {
  // we are trying to extract the validations and their results from a group
  // of vuelidate objects. To do this, we traverse the tree picking only the
  // "leaf nodes" and ignoring all keys that start with "$"
  const rules = [];
  if (_.isArray(obj)) {
    rules.push(..._.flatMap(obj, extractValidationRules));
  } else if (_.isObject(obj)) {
    const dirty = obj.$dirty;
    _.each(obj, (val, key) => {
      // ignore keys starting with "$" - vuelidate props -- $error, $dirty, etc
      if (key.substr(0, 1) === '$') return;
      // if an object, we recurse over each key
      if (_.isObject(val)) rules.push(...extractValidationRules(val));
      // we have reached an actual "rule"
      // the key is the name, val is validation status (ex: {numeric: true})
      // and we track dirty to know know if the field has been touched
      else rules.push({ name: key, status: val, dirty });
    });
  }
  return rules;
}

// To be mixed into the form group - ex: parent form
export const vuelidateGroupMixin = {
  data() {
    return {
      validatedChildren: [],
    };
  },
  computed: {
    // vuelidateMixin uses $v, so we use $vv
    $vv() {
      // we are recreating the logic of vuelidate "rolling up" the errors into
      // a single boolean in order to be able to distinguish between errors that
      // are "warnings" vs true errors.
      // Ex: invalid email = error, leaving something blank = warning
      const vuelidateObjects = _.map(this.validatedChildren, (c) => c.$v);
      const rules = extractValidationRules(vuelidateObjects);
      const rulesBySeverity = _.groupBy(rules, (rule) => {
        if (rule.name.indexOf('Warning') > 0) return 'warning';
        return 'error';
      });

      const vv = {
        children: this.validatedChildren,
        $allDirty: this.validatedChildren.every((c) => c.$v.$dirty),
        $invalid: this.validatedChildren.some((c) => c.$v.$invalid),
        $error: (rulesBySeverity.error || []).some((r) => r.dirty && !r.status),
        $warning: (rulesBySeverity.warning || []).some((r) => r.dirty && !r.status),
      };
      return vv;
    },
  },
  methods: {
    registerValidatedChildComponent(component) {
      this.validatedChildren.push(component);
      this.$forceUpdate();
    },
    unregisterValidatedChildComponent(component) {
      for (let i = 0; i < this.validatedChildren.length; i++) {
        if (this.validatedChildren[i] === component) {
          this.validatedChildren.splice(i, 1);
          this.$forceUpdate();
          return;
        }
      }
    },
    $touchAll() {
      this.validatedChildren.forEach((c) => c.$v.$touch());
    },
    $resetAll() {
      this.validatedChildren.forEach((c) => c.$v.$reset());
    },
    $hasError() {
      // just touches all fields so we know if there is an error
      // even if the user has not focused on all fields
      this.$touchAll();
      return this.$vv.$error;
    },
    $hasWarning() {
      // just touches all fields so we know if there is an error
      // even if the user has not focused on all fields
      this.$touchAll();
      return this.$vv.$warning;
    },
  },
  provide() {
    return {
      vuelidateGroup: {
        register: this.registerValidatedChildComponent,
        unregister: this.unregisterValidatedChildComponent,
      },
    };
  },
};

// To be mixed into group children - ex: form inputs, sections of form
// so that children "register" themselves with the parent group
// TODO: combine with above and make things work with nested groups?
export const vuelidateGroupItemMixin = {
  inject: {
    vuelidateGroup: { default: null },
  },
  mounted() {
    if (this.vuelidateGroup) this.vuelidateGroup.register(this);
  },
  beforeDestroy() {
    if (this.vuelidateGroup) this.vuelidateGroup.unregister(this);
  },
};
