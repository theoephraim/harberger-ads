<template lang='pug'>
.popup(v-if='this.isActive')
  .popup-mask
  .popup-wrapper
    h2.popup-title {{ title }}
    .popup-close-x(@click='close' v-if='!noExit')
      icon(name='times')
    .popup-content
      slot
</template>

<script>
const components = {
  Icon: require('@/components/general/Icon').default,
};

export default {
  components,
  metaInfo() {
    if (!this.isActive) return {};
    // CAUTION - only a single body class can be set this way at a time
    // generally we should be avoiding body classes though, so it's ok for now?
    return { bodyAttrs: { class: 'popup-active' } };
  },
  props: {
    title: { type: String },
    noExit: { type: Boolean },
  },
  data() {
    return {
      isActive: false,
    };
  },
  computed: {},
  methods: {
    open() {
      this.isActive = true;
    },
    close() {
      this.isActive = false;
      this.$emit('close');
    },
  },
};
</script>

<style lang='less'>
body.popup-active {
  overflow: hidden;
  .popup-mask { display: block; }
}

.popup-mask {
  background: fade(#dee8f9, 95);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2000;
  display: none;
}
.header-bar .popup-mask {
  position: absolute;
}

.popup-wrapper {
  z-index: 2001;
  position: fixed;

  @media @mq-medium {
    margin: 0 auto;
    width: 600px;
    left: 50%;
    margin-left: -300px;
    top: 100px;
    bottom: 5vh;
  }
  @media @mq-small-only {
    left: 10px;
    right: 10px;
    top: 0px;
    margin-top: 40px;
    bottom: 10px;
  }
}
.popup-content {
  background: white;
  min-height: 200px;
  box-shadow: 0 10px 20px 6px rgba(0, 0, 0, 0.05);
  border-top: 4px solid @navy;

  border-radius: 3px;
  z-index: 2002;
  position: relative;
  overflow: auto;
  max-height: 100%;

  .popup.padded & {
    padding: 20px;
  }
  .popup.centered & {
    text-align: center;
  }

}
.popup-close-x {
  position: absolute;
  top: -42px;
  right: -12px;
  color: @navy;
  width: 44px;
  height: 44px;
  padding: 8px;
  cursor: pointer;
  z-index: 2002;
  svg {
    scale: 1;
    transition: all 0.3s;
    display: block;
    width: 100%;
    height: 100%;
    &:hover {
      transform: scale(1.2);
    }
  }
}
.popup-title {
  font-size: 24px;
  font-weight: bold;
  color: @navy;
  margin: 0;
  height: 44px;
  border-radius: 3px 3px 0 0;
  position: absolute;
  left: 2px;
  top: -36px;
}
</style>
