
<template lang='pug'>
.error-message(v-if='isVisible')
  icon(name='exclamation-circle')
  span(v-if='messagesArray.length === 0')
    slot
  span(v-else-if='messagesArray.length === 1') {{ messagesArray[0] }}
  ul(v-else)
    li(v-for='m in messagesArray') {{ m }}
</template>

<script>
import _ from 'lodash';

const components = {
  Icon: require('@/components/general/Icon').default,
  VButton: require('@/components/general/VButton').default,
};

export default {
  components,
  props: {
    message: String,
    messages: Array,
    requestStatus: Object,
  },
  computed: {
    isVisible() {
      return this.messagesArray.length > 0 || _.get(this, '$slots.default.length');
    },
    messagesArray() {
      const allMessages = [];
      if (this.message) allMessages.push(this.message);
      if (this.requestStatus && this.requestStatus.isError) {
        if (this.requestStatus.errorMessages) {
          allMessages.push(...this.requestStatus.errorMessages);
        } else {
          allMessages.push(this.requestStatus.errorMessage);
        }
      }
      if (this.messages) {
        allMessages.push(...this.messages);
      }
      return allMessages;
    },
  },
};
</script>

<style lang='less'>

.error-message {
  color: @error-red-text;
  font-style: italic;
  border: 1px solid @error-red-border;
  padding: 5px;
  border-radius:3px;
  display: flex;
  align-items: center;

  .icon {
    width: 25px;
    height: 25px;
    margin-right: 5px;
    flex: 0 0 1;
  }
  ul {
    display: inline-block;
    padding-left: 20px;
    margin: 0;

  }

}
</style>
