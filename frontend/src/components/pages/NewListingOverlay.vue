<template lang='pug'>
.overlay
  .overlay-screen
  .overlay-content(v-if="!processing")
    router-link.overlay-exit(:to="{name: 'home'}") &lt; Back
    h2.overlay-header List New Ad Space
    .overlay-form
      .half
        form-row
          form-input(
            type='text' v-model='listing.name'
            label='Name' placeholder='Ex: example.com homepage banner'
            required
          )
        form-row
          form-input(
            type='money' v-model='listing.price'
            label='Starting Price'
            :min='0'
            required
          )
          form-input(
            type='integer' :min='100' :max='2000' v-model='listing.pixelWidth'
            label='Width (px)'
            required
          )
          form-input(
            type='integer' :min='100' :max='2000' v-model='listing.pixelHeight'
            label='Height (px)'
            required
          )
        form-row
          form-input(
            type='url' v-model='listing.url'
            label='URL' placeholder='https://example.com'
            required
          )
      .half
        form-row
          form-input(
            type='dropdown' v-model='listing.type'
            label='Type'
            auto-select
          )
            form-input-option(value='banner') Web Banner Ad
            form-input-option(value='sidebar') Web Sidebar Ad
            form-input-option(value='tv') Physical Digital Display
        form-row
          form-input(
            type='textarea' v-model='listing.description'
            label='Description' placeholder='something about your site and audience?'
          )
    v-button.overlay-cta(
      @click='saveButtonHandler'
      :loading='createBillboardRequest.isPending' loading-text='Creating your new cash cow...'
      :disabled='$vv.$error || !userIsLoggedIn'
    ) Save
    .login-notice(v-if='!userIsLoggedIn')
      p.small Please <a href='#' @click.prevent='$store.dispatch("signIn")'>finish authentication</a> via metamask


  .overlay-content(v-else)
    .align-center
      p.h1 Processing...
      div
        p.sending.h1 ✨
        p Your transaction is being processed. Please confirm with MetaMask!
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { mapRequestStatuses } from '@/utils/vuex-api-utils';
import { vuelidateGroupMixin } from '@/components/forms/vuelidate-group';

const components = {
  Popup: require('@/components/general/Popup').default,
};

export default {
  components,
  mixins: [vuelidateGroupMixin],
  metaInfo: {
    title: 'List your ad space',
  },
  data() {
    return {
      listing: {
        price: 1,
      },
      processing: false,
    };
  },
  computed: {
    ...mapGetters(['userIsLoggedIn', 'billboards']),
    ...mapRequestStatuses({
      fetchBillboardsRequest: 'FETCH_BILLBOARDS',
      createBillboardRequest: 'CREATE_BILLBOARD',
    }),
  },
  mounted() {
    console.log(this.userIsLoggedIn);
    if (!this.userIsLoggedIn) this.$store.dispatch('signIn');
  },
  methods: {
    saveButtonHandler() {
      if (this.$hasError()) return;
      this.processing = true;
      this.addProperty(this.listing.price).then((data) => {
        this.listing.contractId = data.events.Change.returnValues.id;
        return this.createBillboard(this.listing);
      }).then(() => {
        this.processing = false;
        this.cancel();
      }).catch((err) => {
        this.processing = false;
        console.log('MM error.....');
        console.log(err);
      });
    },
    cancel() {
      this.$router.replace('/');
    },

    ...mapActions([
      'addProperty',
      'createBillboard',
    ]),
  },
  watch: {
    'listing.type': function (newVal) {
      if (this.listing.type === 'banner') {
        this.listing.pixelWidth = 1280;
        this.listing.pixelHeight = 140;
      } else if (this.listing.type === 'sidebar') {
        this.listing.pixelWidth = 140;
        this.listing.pixelHeight = 640;
      } else {
        this.listing.pixelWidth = 1920;
        this.listing.pixelHeight = 1080;
      }
    },
  },
};
</script>

<style lang='less'>
.overlay {

}
.overlay-screen {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(31,31,31,0.95);
}


.overlay-content {
  position: absolute;
  z-index: 200;
  top: 20px;
  padding-top: 10vh;
  left: 20px;
  right: 20px;
}

.overlay-exit {
  position: absolute;
  top: 0px;
  left: 0px;
  font-size: 20px;
}



.overlay-header {
  text-align: center;
}

.buttons {
  padding: 40px;
  text-align: right;
}

.overlay-form {
  display: flex;
  width: 100%;
  border-bottom: 1px solid @bordercolor;
  .half {
    flex: 50% 0 0;
    &:first-child {
      border-right: 1px solid @bordercolor;
    }
  }
  &.full-border {
    border: 1px solid @bordercolor;
    .form-row:first-child {
      border-top: none;
    }
  }
}
.overlay-cta {
  width: 100%;
  border-top: 0;
  width: 90%;
  display: block;
  margin: 0 auto;
  padding: 20px 0;
  font-weight: bold;
}

.login-notice {
  text-align: center;
}

</style>
