<template lang='pug'>
span.status-indicator
  icon(:name='iconName')
  span {{ label }}
  span
    slot
</template>

<script>
import _ from 'lodash';

const components = {
  Icon: require('@/components/general/Icon').default,
};

export default {
  components,
  props: {
    status: { type: Boolean, default: null },
    statusGood: Boolean,
    statusBad: Boolean,
    label: String,
    value: String,
  },
  computed: {
    combinedStatus() {
      if (this.status === true || this.status === false) return this.status;
      if (this.statusGood) return true;
      if (this.statusBad) return false;
      return null;
    },
    iconName() {
      if (this.combinedStatus === true) return 'check-circle';
      if (this.combinedStatus === false) return 'times-circle';
      return 'question-circle';
    },
  },
};
</script>

<style lang='less'>

.status-indicator {
  .icon {
    margin-right: 5px;
    vertical-align: middle;
  }
}
</style>