/*
  An attempt at a very flexible form input component.

  For select, multi-checkbox, and radio types, this is meant to be used in
  conjunction with the FormInputOption component.
  Although it is not required, as you can pass in options via props.
*/

// NOTE -- vue sometimes reuses these inputs which means hooks do not get called
// we work around this by watching the v-model "expression" (ie `user.email`)
// and can treat this as equivalent to "this input is being reused"
// ideally we could bind to :key from the component, but this does not work

<template lang='pug'>
.form-input(:class='classObject' :key='formInputId')
  label.form-input-label(v-if='!noLabel' :for='formInputId') {{label || '&nbsp;'}}
  .form-input-wrapper
    template(v-if='type === "container"')
      slot
    template(v-else-if='type === "radio" || type === "multi-checkbox"')
      form-input-option(
        v-for='(o, i) in optionsFromProps'
        :disabled='computedDisabled'
        :value='o.value'
        :key='optionKey(o, i)'
        ref='input'
      ) {{o.label}}
      slot
    template(v-else-if='type === "checkbox"')
      label.form-input-inline-wrapper
        input.form-input-inline(
          type='checkbox'
          :disabled='computedDisabled'
          @focus='onFocus'
          @blur='onBlur'
          @change='onCheckboxChange'
          :checked='value'
        )
        slot
    template(v-else-if='type === "dropdown"')
      select.form-input-input(
        :id='formInputId'
        :disabled='computedDisabled'
        @focus='onFocus'
        @blur='onBlur'
        @change='onSelectChange'
        :value='valueForSelectField'
        ref='input'
      )
        form-input-option(
          v-if='placeholder' :value='null'
          :hidden='!placeholderSelectable'
          :disabled='!placeholderSelectable'
        ) {{placeholder}}
        //- NOTE - slot items will be before :options items
        //- changing this messes up onSelectChange so be careful
        slot
        form-input-option(
          v-for='(o, i) in optionsFromProps'
          :value='o.value'
          :key='optionKey(o, i)'
        ) {{o.label}}

    template(v-else-if='type === "textarea"')
      //- we were handling input + textarea together but it was causing problems
      textarea.form-input-input(
        :id='formInputId'
        :placeholder='placeholder'
        :disabled='computedDisabled'
        @focus='onFocus'
        @blur='onBlur'
        @input='onChange'
        :value.prop='value'
        ref='input'
      )
    //- "regular" <input> types (text, password, etc)
    template(v-else)
      input.form-input-input(
        :type='nativeInputType'
        :id='formInputId'
        :placeholder='placeholder'
        :disabled='computedDisabled'
        @keydown='keyHandler'
        @focus='onFocus'
        @blur='onBlur'
        @input='onChange'
        :value.prop='value'
        :step.prop='numberInputStepValue'
        ref='input'
      )
      a.pass-show-hide-toggle(
        v-if='type === "password" && allowShowPassword'
        @click='isPasswordMasked = !isPasswordMasked'
      ) {{isPasswordMasked ? 'show' : 'hide'}}
  .form-input-instructions(v-if='instructions', :style='{whiteSpace: "pre"}') {{instructions}}
  .form-input-error(v-if='hasError') {{errorMessage}}
</template>

<script>
import _ from 'lodash';
import { validationMixin } from 'vuelidate';
import * as validators from 'vuelidate/lib/validators';
import { vuelidateGroupItemMixin } from './vuelidate-group';

const components = {
  FormInputOption: require('./FormInputOption').default,
};

// shared counter to generate unique IDs used for label + input tag binding
let inputIndex = 0;

const TYPES_WITH_OPTIONS = ['radio', 'dropdown', 'multi-checkbox'];
const NUMERIC_TYPES = ['number', 'integer', 'decimal', 'money', 'percent'];

export default {
  name: 'FormInput',
  components,
  mixins: [validationMixin, vuelidateGroupItemMixin],
  props: {
    type: { type: String, default: 'text' },
    label: { type: String },
    noLabel: { type: Boolean },
    instructions: String,
    placeholder: String,
    placeholderSelectable: Boolean,
    required: Boolean,
    requiredWarning: Boolean,
    requiredMessage: { type: String, default: 'This field is required' },
    min: [Date, Number],
    max: [Date, Number],
    disabled: Boolean,
    value: {},
    regex: String,
    regexMessage: { type: String, default: 'This field is invalid' },
    // for radio / select / multi-checkbox
    options: { type: [Object, Array] },
    autoSelect: Boolean,
    // for checkbox
    checkedValue: {},
    // for password fields
    allowShowPassword: Boolean,
  },
  provide() {
    return { formParentDisabled: () => this.computedDisabled };
  },
  inject: { formParentDisabled: { default: false } },
  computed: {
    computedDisabled() {
      if (this.disabled) return true;
      return _.isFunction(this.formParentDisabled) && this.formParentDisabled();
    },
    formInputId() {
      const cleanModel = this.vmodelName.replace(/[^a-z]/ig, '');
      return `form-input-${this.idCounter}-${cleanModel}`;
    },
    classObject() {
      return {
        'is-error': this.$v.value.$error,
        'is-focused': this.hasFocus,
        'is-disabled': this.computedDisabled,
        [this.type]: true,
      };
    },
    nativeInputType() {
      // note relevant for dropdown, radio, etc
      if (this.type === 'textarea') return undefined;
      if (this.type === 'password' && this.isPasswordMasked) return 'password';
      if (NUMERIC_TYPES.includes(this.type)) return 'number';
      return 'text';
    },
    valueForSelectField() {
      if (this.value === undefined) return '_null_';
      if (this.value === null) return '_null_';
      if (typeof (this.value) === 'boolean') return String(this.value);
      return this.value;
    },
    numberInputStepValue() {
      if (this.type === 'decimal' || this.type === 'money' || this.type === 'percent') return 0.01;
      if (this.type === 'integer' || this.type === 'number') return 1;
      return undefined;
    },
    hasError() { return this.$v.value.$error; },
    errorMessage() { // eslint-disable-line consistent-return
      if (this.$v.value.required === false || this.$v.value.requiredWarning === false) {
        return this.requiredMessage;
      } else if (this.$v.value.email === false) {
        return 'Invalid email address';
      } else if (this.$v.value.url === false) {
        return 'Invalid URL';
      } else if (this.$v.value.number === false) {
        return 'Must be a positive number without decimals';
      } else if (this.$v.value.integer === false) {
        return 'Must be an integer (no decimals)';
      } else if (this.$v.value.decimal === false) {
        return 'Must be a number';
      } else if (this.$v.value.money === false) {
        return 'Must be a valid amount of money';
      } else if (this.$v.value.percent === false) {
        return 'Must be a valid percentage';
      } else if (this.$v.value.min === false) {
        return `Must be greater than or equal to ${this.min}`;
      } else if (this.$v.value.max === false) {
        return `Must be less than or equal to ${this.max}`;
      } else if (this.$v.value.regex === false) {
        return this.regexMessage;
      }
    },
    isTypeWithOptions() { return TYPES_WITH_OPTIONS.includes(this.type); },
    optionsFromProps() {
      /* eslint-disable consistent-return */

      // only for types that support form-input-options
      if (!this.isTypeWithOptions) return;
      if (!this.options) return [];
      if (_.isArray(this.options)) {
        // TODO: convert array of strings into proper format
        if (_.isString(this.options[0])) {
          return _.map(this.options, (val) => ({ value: val, label: val }));
        }
        return this.options;
      } else if (_.isObject(this.options)) {
        // map object of options {value: label} to array
        return _.map(this.options, (val, key) => ({ value: key, label: val }));
      }
      return [];
    },
  },
  data() {
    return {
      idCounter: inputIndex++,
      vmodelName: _.get(this, '$vnode.data.model.expression', ''),
      hasFocus: false,
      // TODO: figure out bugs with component reuse -- switch to
      isPasswordMasked: true, // only relevant for password
      // ...this.type === 'password' && { isPasswordMasked: true },
    };
  },
  watch: {
    vmodelName() { this.$v.value.$reset(); },
  },
  methods: {
    focus() {
      this.$refs.input.focus();
    },
    onFocus() {
      this.hasFocus = true;
      this.$emit('focus');
    },
    onBlur() {
      this.hasFocus = false;
      if (!this.isTypeWithOptions) {
        this.$emit('input', this.cleanValue(this.value));
      }
      this.$v.value.$touch();
      this.$emit('blur');
    },
    onSelectChange(event) {
      // rather than using the event value directly, we actually find the
      // Vue child and find its bound value. This is what lets the input itself
      // use strings but the input event fires the raw value (boolean/int/etc)
      const childIndex = event.target.selectedIndex;
      const selectedValue = this.$children[childIndex].value;
      if (selectedValue === undefined) {
        this.$emit('input', event.target.value);
      } else {
        this.$emit('input', selectedValue);
      }
    },
    onCheckboxChange(event) {
      let newVal;
      if (event.target.checked) {
        newVal = this.checkedValue || true;
      } else {
        newVal = null;
      }
      this.$emit('input', newVal);
    },
    onChange(event) {
      this.$emit('input', event.target.value);
    },
    fixOptionSelection() {
      // if the currently selected value is not a valid option, we reset selection to null
      const possibleChildValues = _.map(this.$children, 'value');

      if (this.type === 'multi-checkbox') {
        // TODO: deal with deselecting from multi-select types
      } else {
        if (!possibleChildValues.includes(this.value)) this.$emit('input', null);
        // for "auto-select" mode, we automatically select the first dropdown option if null
        if (this.autoSelect && _.isNil(this.value)) {
          const autoSelectIndex = this.placeholder ? 1 : 0;
          this.$emit('input', this.$children[autoSelectIndex].value);
        }
      }
    },
    keyHandler(event) {
      const keyCode = event.which;
      if (NUMERIC_TYPES.includes(this.type)) {
        // prevent typing e/E/+
        if ([69, 91, 187].includes(keyCode)) {
          event.preventDefault();
        }
        // prevent more than one "."
        // TODO: more work on this - you can still type 123..
        if (keyCode === 190 && this.value && this.value.toString().includes('.')) {
          event.preventDefault();
        }
      }
    },
    optionKey(o, i) {
      return `inputopt-${this.formInputId}-${i}-${o.value}`;
    },
    cleanValue(val) {
      // called on field "blur" to sanitize values
      if (val === '') return null;
      if (!val) return val;
      if (this.type === 'number') {
        return Math.max(0, Math.round(val));
      } else if (this.type === 'integer') {
        return Math.round(val);
      } else if (this.type === 'decimal' || this.type === 'money') {
        return parseFloat(val);
      } else if (this.type === 'integer') {
        return parseInt(val);
      } else if (this.type === 'text') {
        return val.trim();
      } else if (this.type === 'email') {
        return val.trim().toLowerCase();
      } else if (this.type === 'phone') {
        return val.replace(/[^0-9+]/g, '');
      }
      return val;
    },
  },
  validations() {
    const validations = {
      ...this.required && { required: validators.required },
      ...this.requiredWarning && { requiredWarning: validators.required },
      ...this.type === 'email' && { email: validators.email },
      ...this.type === 'number' && { number: validators.numeric },
      ...this.type === 'decimal' && { decimal: validators.decimal },
      ...this.type === 'integer' && { integer: validators.integer },
      ...this.type === 'money' && { money: validators.decimal },
      ...this.type === 'percent' && { percent: validators.decimal },
      ...this.type === 'url' && { url: validators.url },
      ...this.min !== undefined && { min: validators.minValue(this.min) },
      ...this.max !== undefined && { max: validators.maxValue(this.max) },
      ...this.regex && { regex: validators.helpers.regex(this.value, new RegExp(this.regex)) },
    };
    return { value: validations };
  },
  beforeUpdate() {
    // we watch what is the "expression" that vmodel is bound to
    // ex: `user.email`
    // we use this to detect when Vue is reusing the component
    this.vmodelName = _.get(this, '$vnode.data.model.expression', '');
  },
  updated() {
    if (this.isTypeWithOptions) this.fixOptionSelection();
  },
  mounted() {
    if (this.isTypeWithOptions) this.fixOptionSelection();
  },
};
</script>

<style lang='less'>

.form-input {
  &.is-focused {
    // background: rgba(0,0,0,.03);
  }

  &.is-error {
    .form-input-input {
      border-color: @error-red-border;
      border-color: rgba(0,0,0,0);
      color: @error-red-text;
    }
  }

  &.is-disabled {
    opacity: .9;
    input, select, textarea {
      cursor: not-allowed;
    }
    &.checkbox {
      .form-input-inline-wrapper {
        color: #AAA;
      }
    }
  }
}
.form-input-input {
  background: rgba(0,0,0,0);
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #AAA;
  border-color: rgba(0,0,0,0);
  padding: 9px 0px 7px;
  height: 40px;
  color: #FFF;
  // border-radius: 2px;
  font: inherit;
  font-size: 14px;

  textarea& {
    min-height: 70px;
    display: block;
  }
  select& {
    background: rgba(0,0,0,0);
    font-size: 14px;
    padding-top: 0;
    padding-bottom: 0;
    padding-right: 20px; // so text doesnt go behind arrow
    -webkit-appearance: none;

    // dropdown arrow
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' fill='%23FFF'><polygon points='10,15 30,15 20,25'/></svg>") no-repeat;
    background-size: 25px 25px;
    background-position: right center;
    background-repeat: no-repeat;



    &:-moz-focusring {
      color: transparent;
      text-shadow: 0 0 0 #000;
    }

  }

  input[type='text']&, input[type='number']&, input[type='password']& {
    font-size: 14px;
    line-height: 18px;
  }

  //- TODO: make height 44px for mobile


  &::placeholder {
    color: #BBB;
  }

  &:focus {
    outline: none;
  }

  .form-input.is-focused & {
    // border-color: #FFF;
    border-color: rgba(0,0,0,0);
    // color: @border-blue;
  }
}
.form-input-label {
  font-size: 11px;
  line-height: 16px;
  font-weight: bold;
  display: block;
  padding: 5px 0;
  // &:empty {
  //   height: 28px;
  //   @media @mq-small-only {
  //     display: none;
  //   }
  // }
}

.form-input-instructions, .form-input-error {
  font-size: 10px;
  line-height: 14px;
  margin-top: 5px;
}
.form-input-instructions {
  color: #aaa;
}
.form-input-error {
  color: @error-red-text;
}
.form-input-wrapper > label {
  display: block;
}

.form-input-wrapper {
  position: relative;
  .pass-show-hide-toggle {
    cursor: pointer;
    color: #333;
    user-select: none;
    opacity: .8;
    font-size: 12px;
    line-height: 40px;
    position: absolute;
    right: 0;
    padding: 0 10px;
  }
}

.form-input.radio {
  .form-input-wrapper {
    padding-left: 2px;
  }
}
.form-input.container {
  .button { width: 100%; }
}


</style>
