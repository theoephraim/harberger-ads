<template lang='pug'>
main-layout
  router-view

  div(v-if='!fetchBillboardsRequest.wasRequested || fetchBillboardsRequest.isPending')
    h2 Loading...
  div(v-else)
    //- h3 Loaded!
    table-component(
      :data='billboards'
      :show-filter='false' :show-caption='false'
      filter-no-results='No ads match your search'
    )
      table-column2(label='Property Name' show='name')

      table-column(label='Type' sort-by='type')
        template(slot-scope='row')
          div
            | {{ row.type }}
            br
            span.tiny.italic {{ row.pixelWidth }} x {{ row.pixelHeight }}

      table-column2(show='viewCount' label='Views' type='numabbr')
      table-column2(show='clickCount' label='Clicks' type='numabbr')

      table-column2(show='price' label='Purchase Price' type='money')
      table-column2(show='taxRate' label='Taxes' type='percent')
      table-column2(show='tradeCount' label='Trades' type='numabbr')
      table-column(:sortable='false')
        template(slot-scope='row')

          v-button.shadow(
            :to='{name: "listing-details", params: { billboardId: row.id } }'
          )
            span(v-if='row.siteOwnerUserId === userAccountAddress') Details
            span(v-else-if='row.currentAd.advertiserUserId === userAccountAddress') Manage Content
            span(v-else) Purchase
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';

import { vuelidateGroupMixin } from '@/components/forms/vuelidate-group';
import { mapRequestStatuses } from '@/utils/vuex-api-utils';

const components = {};

export default {
  components,
  metaInfo: {
    title: 'Harberger Ads',
  },
  data() {
    return {
      thing: {},
    };
  },
  computed: {
    ...mapGetters(['billboards', 'userAccountAddress']),
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

.logotype {
  display: inline-block;
  transform: rotateZ(-25deg);
  transform-origin: 50%;
}

</style>
