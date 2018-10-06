<template lang='pug'>
component.button(
  :is='tagType'
  :to='routerLinkTo'
  :href='href'
  :class='classes'
  :target='targetBlank ? "_blank" : "_top"'
  :type='buttonType'
  @click='$emit("click")'
)
  template(v-if='loading')
    icon(name='spinner')
    span {{ this.loadingText }}
  template(v-else)
    icon(v-if='icon' :name='icon')
    slot
</template>

<script>
// NOTE: we can't call it "button" due to name collision with the native html button

const components = {
  Icon: require('../general/Icon').default,
};

const BUTTON_SIZES = 'small medium large xlarge'.split(' ');
const BUTTON_THEMES = [
  'dark light white',
  'blue green red',
  'transparent-light transparent-dark transparent-blue',
].join(' ').split(' ');

export default {
  components,
  props: {
    size: {
      type: String,
      validator: (val) => BUTTON_SIZES.includes(val),
    },
    theme: {
      type: String,
      validator: (val) => BUTTON_THEMES.includes(val),
      default: 'blue',
    },
    href: String,           // passes through to <a>
    to: [String, Object],   // passes through to <router-link>
    toNamedRoute: String,
    disabled: Boolean,
    loading: Boolean,
    targetBlank: Boolean,
    loadingText: {
      type: String,
      default: 'Loading...',
    },
    icon: String,
    inline: Boolean,
  },
  computed: {
    tagType() {
      if (this.href) return 'a';
      if (this.to || this.toNamedRoute) return 'router-link';
      return 'button';
    },
    buttonType() {
      // otherwise <button> defaults to type=submit and makes forms submit
      return this.tagType === 'button' ? 'button' : undefined;
    },
    classes() {
      return {
        'is-disabled': this.disabled,
        'is-loading': this.loading,
        ...this.size && { [`button--${this.size}`]: true },
        ...this.theme && { [this.theme]: true },
        ...this.inline && { 'button--inline-important': true },
      };
    },
    routerLinkTo() {
      return this.toNamedRoute ? { name: this.toNamedRoute } : this.to;
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang='less'>

button.button {

}

.button {
  display: inline-block;
  cursor: pointer;
  border-radius: 3px;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(0,0,0,0);
  line-height: 1.15rem;
  text-align: center;

  text-shadow: none;

  transition: .25s all;

  text-transform: uppercase;
  font-weight: bold;
  font-size: 12px;

  user-select: none;
  margin-right: 3px;


  .icon {
    vertical-align: middle;
    margin-right: 10px;
    margin-left: -8px;
    margin-top: -2px;
    width: 20px;
    height: 20px;
  }

  &:focus {
    outline: none;
  }
  &:hover {

  }

  // Size options
  padding: 8px 20px;
  &.button--small {
    padding: 4px 10px;

    .icon {
      margin-right: 5px;
      margin-left: -3px;
      width: 16px;
      height: 16px;
    }

  }
  &.button--large {
    padding: 15px 40px;
    // font-size: 16px;
  }
  &.button--xlarge {
    padding: 10px 60px;
    max-width: 100%;
    font-size: 16px;
  }

  &.full {
    width: 100%;
  }

  // does not work because pointer-events: none
  // &.is-disabled {
  //   cursor: not-allowed;
  // }
  // &.is-loading {
  //   cursor: wait;
  // }
  &.is-disabled, &.is-loading {
    opacity: .3;
    pointer-events: none;
  }
  &.is-loading {
    opacity: .5;
    border-color: @dark-gray;
    color: @dark-gray;
    background: rgba(0,0,0,0);
  }

  // Color Theme options
  .create-theme(@color) {
    background-color: @color;
    color: contrast(@color);

    &:hover when (lightness(@color) > 50%) {
      background: darken(@color, 10%);
    }
    &:hover when (lightness(@color) < 50%) {
      background: lighten(@color, 10%);
    }
  }
  .create-transparent-theme(@color) {
    border-color: @color;
    color: @color;
    background: fade(@color, 0);
    &:hover {
      background: fade(@color, 60);
      color: contrast(@color);
      border-color: @color;

    }
  }

  // &.blue { .create-theme(@cta-blue); }
  &.blue { .create-theme(@cta-blue); }
  &.green { .create-theme(@green); }
  // &.green { .create-theme(#1aca8d); }
  &.red { .create-theme(@error-red-bg); }
  &.dark { .create-theme(@navy); }
  &.light { .create-theme(@gray-blue); }
  &.white { .create-theme(#FFFFFF); }

  &.transparent-dark { .create-transparent-theme(@dark-gray); }
  &.transparent-light { .create-transparent-theme(#FFFFFF); }
  &.transparent-blue { .create-transparent-theme(@cta-blue); }

  &.button--inline-important {
    display: inline !important;
    width: auto !important;
  }

}

</style>
