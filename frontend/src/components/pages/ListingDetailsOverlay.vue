<template lang='pug'>
.overlay
  .overlay-screen
  .overlay-content(v-if="!processing")
    router-link.overlay-exit(:to="{name: 'home'}")
      small.chiclet.caps ← Back
    .overlay-header
      h2 Ad Property Details
      .subtitle.tiny(v-if='userIsSiteOwner')
        | You are the site owner of this property (and you collect the taxes)
      .subtitle.tiny(v-else-if='userIsBillboardOwner')
        | You are the current owner of this property (and you pay taxes on it)

    template(v-if='!fetchBillboardRequest.wasRequested || fetchBillboardRequest.isPending')
      p Loading...
    template(v-else)
      .overlay-form.full-border
        .col-8
          .current-ad.bg-pattern
            template(v-if='selectedBillboard.currentAd')
              img(:src='selectedBillboard.currentAd.mediaUrl')
              .link-url
                | Current Ad Content - Link:
                = ' '
                a.small(:href='selectedBillboard.currentAd.linkUrl' _target='_blank') {{ selectedBillboard.currentAd.linkUrl }}
            .empty-notice(v-else)
              h2 :(<br/>This ad property is currently empty!
              p.tiny.italic but your ad would look great in it


            template(v-if='showForm')
              .form-screen
              .current-ad-form
                form-row
                  form-input(
                    type='money' v-model='formPayload.price'
                    :min='selectedBillboard.price + 1'
                    label='Your New Price'
                    :required='!userIsBillboardOwner'
                  )
                form-row
                  form-input(
                    type='url' v-model='formPayload.mediaUrl'
                    label='New Ad Image URL'
                    :required='!userIsBillboardOwner'
                  )
                form-row
                  form-input(
                    type='url' v-model='formPayload.linkUrl'
                    label='New Link URL'
                    :required='!userIsBillboardOwner'
                  )

        .col-4.border-left
          form-row
            form-input.align-left(
              type='container' no-label
            )
              span.bold {{ selectedBillboard.name || 'No Name' }}
              br
              a.small(:href='selectedBillboard.url' target='_blank' v-text="selectedBillboard.url")
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
        :disabled='$vv.$error || insufficientBalance'
      ) {{ ctaButtonText }}
      //- :loading='createBillboardRequest.isPending' loading-text='Creating your new cash cow...'
      .overlay-under-cta(v-if='showForm')
        p.small <a href='#' @click.prevent='showForm = false'>or cancel</a>


      .embed-code(v-else-if='userIsBillboardOwner')
        h3 Embed code:
        pre #{'<iframe src="{{ origin }}/api/i?b={{ billboardId }}" width="{{ selectedBillboard.pixelWidth }}" height="{{ selectedBillboard.pixelHeight }}"></iframe>'}

  .overlay-content(v-else)
    .align-center
      p.h1 Processing...
      div
        p.sending.h1 ✨
        p Your transaction is being processed. Please confirm with MetaMask!

</template>

<script>
import _ from 'lodash';
import { mapGetters, mapActions, mapState } from 'vuex';

import { vuelidateGroupMixin } from '@/components/forms/vuelidate-group';
import { mapRequestStatuses } from '@/utils/vuex-api-utils';
import { toWei, makeBn } from '@/utils';

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
      formPayload: {
        price: null,
        linkUrl: null,
        mediaUrl: null,
      },
      showForm: false,
      processing: false,
    };
  },
  computed: {
    insufficientBalance() {
      let price = toWei(this.selectedBillboard.price);
      price = makeBn(price);
      const balance = makeBn(this.balance);
      return balance.lt(price);
    },
    balance() {
      if (!this.graphUsers[this.account]) return 0;
      return this.graphUsers[this.account].balance;
    },
    allowance() {
      if (!this.graphUsers[this.account]) return 0;
      return this.graphUsers[this.account].allowance;
    },
    origin() {
      return window.location.origin;
      // - return 'https://hads.xyz/api/i';
    },
    ...mapState(['graphUsers', 'account']),
    ...mapGetters(['userIsLoggedIn', 'selectedBillboard', 'userAccountAddress']),
    ...mapRequestStatuses({
      fetchBillboardRequest: 'FETCH_BILLBOARD_DETAILS',
      updateBillboardRequest: 'UPDATE_BILLBOARD_AD',
    }),
    userIsSiteOwner() {
      return this.selectedBillboard.siteOwnerUserId === this.userAccountAddress;
    },
    userIsBillboardOwner() {
      const currentBillboardOwnerId = _.get(this.selectedBillboard, 'currentAd.advertiserUserId');
      if (!currentBillboardOwnerId && this.userIsSiteOwner) return true;
      return currentBillboardOwnerId === this.userAccountAddress;
    },
    ctaButtonText() {
      if (this.userIsBillboardOwner && this.userIsSiteOwner) {
        return this.showForm ? 'Confim Changes' : 'Update property settings';
      } if (this.userIsBillboardOwner) {
        return this.showForm ? 'Confim Changes' : 'Update Ad Content';
      } else if (this.userIsSiteOwner) {
        return this.showForm ? 'Confirm Purhcase' : 'Repurchase your site\'s ad space';
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
    buy() {
      this.buyBillboard({ id: this.billboardId, price: toWei(this.price) });
    },

    ...mapActions([
      'buyBillboard',
    ]),
    purchaseButtonHandler() {
      if (!this.userIsLoggedIn) this.$store.dispatch('signIn');
      if (!this.showPurchaseForm) {
        this.showPurchaseForm = true;
      }

      // if (this.$hasError()) return;
    },
    async buttonHandler() {
      if (!this.userIsLoggedIn) this.$store.dispatch('signIn');
      if (!this.showForm) {
        this.showForm = true;
      }

      if (this.$hasError()) return;

      try {
        if (!this.userIsBillboardOwner) {
          this.processing = true;

          let currentPrice = toWei(this.selectedBillboard.price);
          currentPrice = makeBn(currentPrice);

          const allowance = makeBn(this.allowance);
          if (allowance.lt(currentPrice)) {
            await this.$store.dispatch('allowERC20');
          }

          let newPrice = toWei(this.formPayload.price);
          newPrice = newPrice.toString();
          currentPrice = currentPrice.toString();

          await this.$store.dispatch('buyBillboard', {
            id: this.selectedBillboard.contractId,
            currentPrice,
            newPrice,
          });
        } else if (this.formPayload.price !== null) {
          this.processing = true;
          await this.$store.dispatch('setBillboardPrice', {
            billboardId: this.billboardId,
            price: toWei(this.formPayload.price),
          });
        }
      } catch (err) {
        console.log(err);
        this.processing = false;
        return;
      }

      await this.$store.dispatch('updateBillboardAd', {
        billboardId: this.billboardId,
        ...this.formPayload,
      });
      this.processing = false;
      if (this.updateBillboardRequest.isSuccess) {
        this.showForm = false;
        this.formPayload = {};
      }
    },
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
.empty-notice {
  background: @bgblack;
  padding: 10px 15px;
  text-align: center;
  h2 { padding: 0; margin: 0; }
  p { margin: 0;}
}
.chiclet {
  border: 1px solid @bordercolor;
  // background: white;
  // color: @black;
  padding: 0.5em 2em;
  border-radius: 5px;
  display: block;
  transition: 0.3s all ease-out;
  &:hover {
    color: @black;
    background: white;
    transform: translate(-3px, -3px);
    box-shadow: 3px 3px 0px 0px #888;
  }
}


</style>
