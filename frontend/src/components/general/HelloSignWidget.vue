<template>
  <div></div>
</template>

<script>
// TODO: figure out the best way to expose this

import loadExternalScriptsMixin from '@/mixins/load-external-scripts';

export default {
  name: 'HelloSignWidget',
  components: {},
  mixins: [loadExternalScriptsMixin],
  externalScripts: [
    'https://s3.amazonaws.com/cdn.hellosign.com/public/js/hellosign-embedded.LATEST.min.js',
  ],
  props: {
    // See https://app.hellosign.com/api/embeddedSigningWalkthrough
    // for prop documentation
    helloSignClientId: {
      // your app client id from the API dashboard
      required: true,
      type: String,
    },
    uxVersion: {
      // required by HelloSign API
      type: Number,
      default: 2,
    },
    userCulture: {
      type: String,
    },
    allowCancel: {
      type: Boolean,
      default: true,
    },
    debug: {
      // output some debug info to the console
      type: Boolean,
      default: false,
    },
    skipDomainVerification: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    triggerEmbeddedSigningFlow(embeddedSignatureUrl) {
      if (!this.HelloSign) {
        if (!window.HelloSign) {
          setTimeout(() => this.triggerEmbeddedSigningFlow(embeddedSignatureUrl), 1000);
          return;
        }
        window.HelloSign.init(this.helloSignClientId);
        this.HelloSign = window.HelloSign;
      }
      this.HelloSign.open({
        url: embeddedSignatureUrl,
        uxVersion: this.uxVersion,
        allowCancel: this.allowCancel,
        debug: this.debug,
        skipDomainVerification: this.skipDomainVerification,
        messageListener: this.helloSignMessageListener,
      });
    },
    helloSignMessageListener(eventData) {
      if (eventData.event === window.HelloSign.EVENT_SIGNED) {
        this.$emit('success');
      }
    },
  },
};
</script>
