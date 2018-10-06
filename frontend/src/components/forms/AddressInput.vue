<template lang='pug'>
//- TODO: v-if='value' is stopping some errors when the address being passed in is undefined
//- need to fix this and how we bind here...

//- TODO make required and requiredWarning work with a single error
//- message for the whole block

form-group(:label='label' v-if='value')
  form-row
    form-input(
      type='text' v-model='value.line1'
       label='Line 1' placeholder='line 1'
      :required='required' :required-warning='requiredWarning' :required-message='requiredMessage'
    )
    form-input(type='text' label='Line 2' placeholder='line 2' v-model='value.line2')
  form-row
    form-input(
      type='dropdown' v-model='value.country'
      label='Country' placeholder='- select country -'
      auto-select
      :required='required' :required-warning='requiredWarning' :required-message='requiredMessage'
    )
      form-input-option(value='US') United States
      form-input-option(value='CA') Canada
    form-input(
      type='dropdown' v-model='value.state'
      :label='stateLabel(value.country)'
      :placeholder='`- select ${stateLabel(value.country)} -`'
      :options='stateOptionsForCountry(value.country)'
      :required='required' :required-warning='requiredWarning' :required-message='requiredMessage'
    )
    form-input(
      type='text' v-model='value.city'
      label='City'
      :required='required' :required-warning='requiredWarning' :required-message='requiredMessage'
    )
    form-input(
      type='text' v-model='value.postalCode'
      :label='postalCodeLabel(value.country)'
      :required='required' :required-warning='requiredWarning' :required-message='requiredMessage'
    )
  slot
</template>


<script>
import FormGroup from '@/components/forms/FormGroup';
import FormRow from '@/components/forms/FormRow';
import FormInput from '@/components/forms/FormInput';
import FormInputOption from '@/components/forms/FormInputOption';

import {
  stateOptionsForCountry, postalCodeLabel, stateLabel,
} from '@/utils/local';

// TODO: fix v-model handling
// https://github.com/vuejs/vue/issues/4373
// technically we shouldnt be changing the passed in object directly
// but keeping a local copy and calling `$emit('input')` on changes

export default {
  name: 'AddressInput',
  props: {
    label: {
      type: String,
      default: 'Address',
    },
    value: {
      type: Object, // passed in via v-model
      default: () => {},
    },
    required: Boolean,
    requiredWarning: Boolean,
    requiredMessage: String,
  },
  methods: {
    stateOptionsForCountry, postalCodeLabel, stateLabel,
  },
  components: {
    FormGroup,
    FormRow,
    FormInput,
    FormInputOption,
  },
};
</script>

<style lang='less'>


</style>
