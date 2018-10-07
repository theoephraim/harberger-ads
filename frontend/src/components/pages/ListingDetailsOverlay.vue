<template lang='pug'>
.overlay
  .overlay-screen
  .overlay-content
    router-link.overlay-exit(:to="{name: 'home'}") &lt; Back
    h2.overlay-header Listing Details
    .overlay-form.full-border
      template(v-if='!fetchBillboardRequest.wasRequested || fetchBillboardRequest.isPending')
        p Loading...
      template(v-else)
        .col-8
          form-row
            form-input.bg-circles.placeholder(
              type='container' noLabel=true
            )
        .col-4.border-left
          form-row
            form-input.align-left(
              type='container' noLabel=true
            )  {{ selectedBillboard.name || 'No Name' }}
          form-row
            form-input.align-left.big.border-none(
              type='container' label='Price'
            ) {{ selectedBillboard.price | currency }}

            form-input.align-left.big.border-none(
              type='container' label='Views/Day'
            ) {{ selectedBillboard.views || numabbr }}

            form-input.align-left.big.border-none(
              type='container' label='Clicks/Day'
            ) {{ selectedBillboard.clicks || numabbr }}
          form-row
            form-input.align-left(
              type='container' noLabel=true
            ) {{ selectedBillboard.description || 'Billboard Description...' }}

</template>

<script>
import { mapGetters } from 'vuex';

import { vuelidateGroupMixin } from '@/components/forms/vuelidate-group';
import { mapRequestStatuses } from '@/utils/vuex-api-utils';

const components = {
  Popup: require('@/components/general/Popup').default,
};

export default {
  components,
  metaInfo: {
    title: 'Listing details',
  },
  props: {
    billboardId: Number,
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters(['selectedBillboard']),
    ...mapRequestStatuses({
      fetchBillboardRequest: 'FETCH_BILLBOARD_DETAILS',
    }),
  },
  mounted() {
    this.$store.dispatch('fetchBillboardDetails', { billboardId: this.billboardId });
  },
};
</script>

<style lang='less'>
  .placeholder {
    min-height: 50vh;
  }
</style>
