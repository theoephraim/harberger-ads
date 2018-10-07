<template lang='pug'>
.form-row(:class='classes')
  .form-row-instructions
    p(v-if='instructions') {{instructions}}
    slot(name='instructions')
  .form-row-inner
    slot
  error-message(v-if='error') {{error}}
</template>

<script>
import _ from 'lodash';

const components = {
  ErrorMessage: require('@/components/general/ErrorMessage').default,
};

export default {
  components,
  props: {
    instructions: String,
    error: String,
    // TODO: figure out if we can set this automatically
    inputsWideOnSmall: Boolean,
    noInputs: Boolean,
  },
  computed: {
    classes() {
      return {
        'full-width-children-on-small': this.inputsWideOnSmall,
        'form-row--no-inputs': this.noInputs,
      };
    },
  },
};
</script>

<style lang='less'>
@row-pad: 12px;
@border-color: rgba(0,0,0,.06);

.form-row {
  border-top: 1px solid @bordercolor;
  width: 100%;
  position: relative;

  .form-row-inner {
    display: flex;
    width: 100%;
    flex-wrap: wrap;

    @media @mq-small-only {
      // flex-wrap: wrap;
      // padding: 0; // padding on individual inputs
    }
    @media @mq-medium {
      padding: 0 0;
    }

    .form-input {
      flex: 1 0 0;
      padding: 10px 15px;

      @media @mq-medium {

        border-left: 1px solid @bordercolor;
        &:first-child {
          border-left: none;
        }
      }

      @media @mq-small-only {
        padding: @row-pad;
        flex: 1 0 50%;
        border-bottom: 1px solid @bordercolor;
        // border-left: 1px solid rgba(0,0,0,.05);

        &:first-child {
          border-left: none;
        }
      }
    }
    > .button {
      flex: 1 0 0;
      margin: 0 @row-pad;
      @media @mq-small-only {
        margin: @row-pad;
      }
    }
    > h3 {
      width: 100%;
    }

    .error-message:first-child {
      margin-top: 0;
    }

    &:empty {
      display: none;
    }
  }
  &.form-row--no-inputs > .form-row-inner {
    padding: 0px @row-pad;
    margin: 0;
    width: 100%;
    display: block;
    @media @mq-small-only {
      // padding: @row-pad;
    }
    .error-message {
      display: block;
      width: auto;
      margin-left: 0;
      margin-right: 0;
    }
    // > p:first-child {
    //   margin-top: 0;
    // }
  }

  // Forces child inputs to take full width on small
  @media @mq-small-only {
    &.full-width-children-on-small {
      .form-input, .button {
        flex: 1 1 100%;
      }
    }
  }

  .form-row-instructions {
    padding: @row-pad @row-pad 0;
    &:empty { display: none; }
    > p { margin: 0; }
  }
  .error-message {
    width: 100%;
    margin: @row-pad;
  }
}

</style>
