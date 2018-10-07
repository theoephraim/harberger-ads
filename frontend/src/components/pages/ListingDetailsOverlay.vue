<template lang='pug'>
.overlay
  .overlay-screen
  .overlay-content
    .overlay-header
      router-link.overlay-exit(:to="{name: 'home'}") Back
      h2 Ad Space Details

      template(v-if='!fetchBillboardRequest.wasRequested || fetchBillboardRequest.isPending')
        p Loading...
      template(v-else)
        p {{ selectedBillboard.name }}

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

</style>
