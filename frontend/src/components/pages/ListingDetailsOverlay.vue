<template lang='pug'>
.overlay
  .overlay-screen
  .overlay-content
    router-link.overlay-exit(:to="{name: 'home'}") &lt; Back
    h2.overlay-header Ad Property Details
    template(v-if='!fetchBillboardRequest.wasRequested || fetchBillboardRequest.isPending')
      p Loading...
    template(v-else)
      .overlay-form.full-border
        .col-8
          .current-ad.bg-circles
            img(:src='selectedBillboard.currentAd.mediaUrl')
            .link-url
              | Current Ad Content - Link:
              = ' '
              a.small(:href='selectedBillboard.currentAd.linkUrl' _target='_blank') {{ selectedBillboard.currentAd.linkUrl }}


            .form-screen(v-if='showForm')

            .current-ad-form(v-if='showForm')
              form-row
                form-input(
                  type='money' v-model='purchasePayload.price'
                  :min='selectedBillboard.price + 1'
                  label='Your New Price'
                  :required='!userOwnsCurrentAd'
                )
              form-row
                form-input(
                  type='url' v-model='purchasePayload.mediaUrl'
                  label='New Ad Image URL'
                  :required='!userOwnsCurrentAd'
                )
              form-row
                form-input(
                  type='url' v-model='purchasePayload.linkUrl'
                  label='New Link URL'
                  :required='!userOwnsCurrentAd'
                )

        .col-4.border-left
          form-row
            form-input.align-left(
              type='container' no-label
            )
              span.bold {{ selectedBillboard.name || 'No Name' }}
              br
              a.small(:href='selectedBillboard.url' target='_blank') view this property
          form-row
            form-input.align-left.big.border-none(
              type='container' label='Current Price'
            ) {{ selectedBillboard.price | currency }}

            form-input.align-left.big.border-none(
              type='container' label='Total Views'
            ) {{ selectedBillboard.viewCount | numabbr }}
            form-input.align-left.big.border-none(
              type='container' label='Total Clicks'
            ) {{ selectedBillboard.clickCount | numabbr }}
          form-row
            form-input.align-left(
              type='container' no-label
            )
              .tiny {{ selectedBillboard.description || 'No description...' }}
      v-button.overlay-cta(
        @click='buttonHandler'
        :disabled='$vv.$error'
      ) {{ ctaButtonText }}
      //- :loading='createBillboardRequest.isPending' loading-text='Creating your new cash cow...'
      .overlay-under-cta(v-if='showForm')
        p.small <a href='#' @click.prevent='showForm = false'>or cancel</a>

            //- v-button(@click="buy") Buy

</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { vuelidateGroupMixin } from '@/components/forms/vuelidate-group';
import { mapRequestStatuses } from '@/utils/vuex-api-utils';
import { toWei } from '@/utils';

const components = {
  Popup: require('@/components/general/Popup').default,
};

export default {
  components,
  mixins: [vuelidateGroupMixin],
  metaInfo: {
    title: 'Listing details',
  },
  props: {
    billboardId: Number,
  },
  data() {
    return {
      purchasePayload: {},
      showPurchaseForm: false,
      showForm: false,
    };
  },
  computed: {
    ...mapGetters(['userIsLoggedIn', 'selectedBillboard']),
    ...mapRequestStatuses({
      fetchBillboardRequest: 'FETCH_BILLBOARD_DETAILS',
    }),
    userOwnsCurrentAd() {
      return false;
    },
    ctaButtonText() {
      if (this.userOwnsCurrentAd) {
        return this.showForm ? 'Confim Changes' : 'Update Ad Content';
      }
      return this.showForm ? 'Confirm Purchase' : 'Purchase this ad property';
    },
  },
  mounted() {
    this.$store.dispatch('fetchBillboardDetails', { billboardId: this.billboardId }).then(() => {
      this.price = this.selectedBillboard && this.selectedBillboard.price;
    });
  },
  methods: {
    purchaseButtonHandler() {
      if (!this.userIsLoggedIn) this.$store.dispatch('signIn');
      if (!this.showPurchaseForm) {
        this.showPurchaseForm = true;
        return;
      }

      if (this.$hasError()) return;
    },
    buttonHandler() {
      if (!this.userIsLoggedIn) this.$store.dispatch('signIn');
      if (!this.showForm) {
        this.showForm = true;
        return;
      }

      if (this.$hasError()) return;
    },
    buy() {
      this.buyBillboard({ id: this.billboardId, price: toWei(this.price) });
    },
    ...mapActions([
      'buyBillboard',
    ]),
  },
};
</script>

<style lang='less'>

.current-ad {
  display: block;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  position: relative;
  > img {
    display: block;
    margin: 0 auto;
    max-height: 100%;
    max-width: 100%;
  }
  .link-url {
    background: rgba(0,0,0,.5);
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 5px 10px;
  }
}
.current-ad-form {
  background: @bgblack;
  border: 1px solid @bordercolor;
  position: absolute;
  top: 25px;
  left: 25px;
  right: 25px;
}
.form-screen {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0,0,0,.7);
}

</style>
