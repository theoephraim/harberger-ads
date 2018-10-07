<template lang='pug'>
main-layout
  h2 How does this work?
  p This is an ad marketplace powered by Harberger taxes ownership model

  ul
    li When you post ad space on your site for sale, you set the initial price
    li While someone owns the space, they must pay taxes to the owner of the site
    li As the current owner of the ad space, you can choose the current price, and you pay taxes based on that price
    li Anyone can force a sale at that price and take over ownership (and start paying the taxes)


</template>

  <script>
  export default {

  };
  </script>

  <style>

  </style>

</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';

import { vuelidateGroupMixin } from '@/components/forms/vuelidate-group';
import { mapRequestStatuses } from '@/utils/vuex-api-utils';

const components = {};

export default {
  components,
  metaInfo: {
    title: 'How It Works',
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['filteredBillboards', 'userAccountAddress']),
    ...mapRequestStatuses({
      fetchBillboardsRequest: 'FETCH_BILLBOARDS',
    }),
  },
  methods: {
  },
  mounted() {
    this.$store.dispatch('fetchBillboards');
    this.$store.dispatch('fetchTheGraph');
  },
};
</script>

<style lang='less'>
.table-wrap {
  padding-bottom: 100px;
}

</style>
