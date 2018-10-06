<template lang='pug'>
.save-bar
  .spacer
  .bar(:class='classObject')
    .status(v-if='updateRequest.isPending')
      icon(name='spinner')
      | Saving your changes...
    .status(v-else-if='saveSuccessWasRecent')
      icon(name='check')
      | Save success!
    template(v-else)
      .status(v-if='updateRequest.isError')
        icon(name='exclamation-circle')
        | {{this.updateRequest.error.message}}

      .buttons(v-if='hasUnsavedChanges')
        v-button(@click='$emit("reset")' theme='transparent-light') Undo
        v-button(@click='saveButtonHandler' :disabled='saveDisabled' theme='dark') Save Changes
</template>

<script>
import _ from 'lodash';

const components = {
  Icon: require('@/components/general/Icon').default,
  VButton: require('@/components/general/VButton').default,
};

const SHOW_SAVE_DELAY = 2000;

export default {
  name: 'SaveBar',
  components,
  props: {
    draftValue: Object,
    storeValue: Object,
    updateRequest: Object,
    saveDisabled: Boolean,
  },
  data() {
    return {
      now: Date.now(),
    };
  },
  computed: {
    hasUnsavedChanges() {
      return _.keys(this.changesToSave).length > 0;
    },
    changesToSave() {
      const simpleHasChanges = !_.isEqual(this.storeValue, this.draftValue);
      let storeVal;

      if (this.draftValue === undefined || this.storeValue === undefined) return {};

      return _.pickBy(this.draftValue, (draftVal, key) => {
        const dv = JSON.stringify(draftVal);
        const sv = JSON.stringify(this.storeValue[key]);
        // if (dv !== sv) console.log(`${key} -- ${dv} ?? ${sv}`);
        return dv !== sv;
      });
    },
    classObject() {
      return {
        'is-visible': this.hasUnsavedChanges || this.saveSuccessWasRecent,
        'is-error': this.updateRequest.isError,
        'is-success': this.saveSuccessWasRecent,
      };
    },
    statusMessage() {
      if (this.updateRequest.isPending) return 'Saving changes...';
      if (this.updateRequest.isSuccess) return 'Save success!';
      if (this.hasUnsavedChanges) return 'Ready to save?';
      return 'Everything in sync.';
    },
    saveSuccessWasRecent() {
      if (this.updateRequest.isSuccess) {
        const timeSinceSave = this.now - this.updateRequest.receivedAt;
        return (timeSinceSave < SHOW_SAVE_DELAY);
      }
      return false;
    },
  },
  methods: {
    warnAboutUnsavedChanges() {
      if (this.updateRequest.isPending) {
        return false;
      } else if (this.hasUnsavedChanges) {
        const warningMessage = 'Are you sure you want to leave? You will lose your unsaved changes.';
        return window.confirm(warningMessage); // eslint-disable-line no-alert
      }
      return true;
    },
    saveButtonHandler() {
      this.$emit('save', {
        // add back the ID so the
        id: this.draftValue.id,
        ...this.changesToSave,
      });
    },
  },
  created() {
    this.timerInterval = setInterval(() => {
      this.now = Date.now();
    }, 250);
  },
  beforeDestroy() {
    clearInterval(this.timerInterval);
  },
};
</script>

<style lang='less'>
@save-bar-height: 60px;
.save-bar {
  > .spacer {
    height: @save-bar-height;
  }
  > .bar {
    width: 100%;
    height: @save-bar-height;
    position: fixed;
    bottom: 0;
    left: 0;
    background: #4286f4;
    color: white;
    bottom: -@save-bar-height;
    transition: .5s all;

    display: flex;
    justify-content: center;
    align-items: center;

    .status {
      font-weight: bold;
      padding-right: 20px;
    }

    &.is-visible {
      bottom: 0;
    }
    &.is-error {
      background: @error-red-bg;
    }
    &.is-success {
      background: @green;
    }

  }

  .icon {
    width: 24px;
    height: 24px;
    vertical-align: middle;
    margin: 0 10px;
  }

  .button {
    margin: 0 10px;
    padding-left: 50px;
    padding-right: 50px;
  }
}
</style>
