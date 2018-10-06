<template lang='pug'>
component(:is='tagType', :value='optionValue' :selected='optionSelected')
  template(v-if='parentType === "radio"')
    input.form-input-inline(
      type='radio'
      :value='value'
      :name='this.$parent.formInputId'
      @focus='onFocus'
      @blur='onBlur'
      @change='onChange'
      :disabled='computedDisabled'
      :checked='value === parentValue'
    )
    slot {{value}}
  template(v-if='parentType === "multi-checkbox"')
    input.form-input-inline(
      type='checkbox'
      :value='value'
      @focus='onFocus'
      @blur='onBlur'
      @change='onMultiCheckboxChange'
      :disabled='computedDisabled'
      :checked='parentValue && parentValue.indexOf(value) > -1'
    )
    slot {{value}}
  template(v-else-if='parentType === "dropdown"')
    //- note that in this case, the slot content is the text only
    //- as the <option> itself is actually the root "component"
    slot {{value}}
</template>

<script>
import _ from 'lodash';

export default {
  name: 'FormInputOption',
  props: {
    value: {},
    disabled: Boolean,
  },
  inject: { formParentDisabled: { default: false } },
  computed: {
    computedDisabled() {
      if (this.disabled) return true;
      return _.isFunction(this.formParentDisabled) && this.formParentDisabled();
    },
    parentType() { return this.$parent.type; },
    parentValue() { return this.$parent.value; },
    tagType() {
      if (this.parentType === 'radio') return 'label';
      if (this.parentType === 'multi-checkbox') return 'label';
      if (this.parentType === 'dropdown') return 'option';
      const errorMessage = 'Unsupported parent type -- This component must live inside a FormInput with type = radio|multi-checkbox|dropdown';
      throw Error(errorMessage);
    },
    optionValue() {
      if (this.tagType === 'option') {
        if (this.value === undefined) return '_null_';
        if (this.value === null) return '_null_';
        return this.value.toString();
      }
      return undefined;
    },
    optionSelected() {
      if (this.tagType === 'option' && this.value === this.parentValue) return true;
      return undefined;
    },
  },
  methods: {
    onBlur(event) { this.$parent.onBlur(event); },
    onFocus(event) { this.$parent.onFocus(event); },

    // we use this.value instead of event.target.value
    // to handle booleans correctly, otherwise we get "true"
    onChange() {
      this.$parent.$emit('input', this.value);
    },
    onMultiCheckboxChange() {
      const existingValue = this.parentValue || [];
      const valIndex = existingValue.indexOf(this.value);
      // we must emit with a new array so Vue notices the change
      if (valIndex >= 0) {
        const valCopy = [].concat(existingValue);
        valCopy.splice(valIndex, 1);
        this.$parent.$emit('input', valCopy.length > 0 ? valCopy : null);
      } else {
        this.$parent.$emit('input', existingValue.concat(this.value));
      }
    },

  },
};
</script>

<style lang='less'>
.form-input-inline {
  margin-right: 8px;
}
</style>
