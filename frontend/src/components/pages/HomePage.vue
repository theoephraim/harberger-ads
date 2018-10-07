<template lang='pug'>
main-layout
  router-view

  div(v-if='!fetchBillboardsRequest.wasRequested || fetchBillboardsRequest.isPending')
    h2 Loading...
  div(v-else)
    //- h3 Loaded!

    div#menu.sticky
      div.row.clearfix
        div.col.col-2
          span.logotype HA
        div.col.col-10.align-right
          ul.caps.inline
            li
              a.active Everything
            li
              a My Ads
            li
              a My Billboards
            li
              a List New

    table-component(
      :data='billboards'
      :show-filter='false' :show-caption='false'
      filter-no-results='No ads match your search'
    )
      //- table-column(label='Dates')
      //-   template(slot-scope='row')
      //-     .small.nowrap CRE {{ row.createdAt | date }}
      //-     .small.nowrap(v-if='row.approvedAt') APR {{ row.approvedAt | date }}
      //-     .small.nowrap(v-if='row.activatedAt') ACT {{ row.activatedAt | date }}
      //-     .small.nowrap(v-if='row.settledAt') SET {{ row.settledAt | date }}
      //-     .small.nowrap(v-if='row.rejectedAt') REJ {{ row.rejectedAt | date }}

      table-column2(label='Ad Space Name' show='name')

      table-column(label='Type' sort-by='type')
        template(slot-scope='row')
          div
            | {{ row.type }}

            span.tiny.italic  - {{ row.pixelWidth }} x {{ row.pixelHeight }}

      table-column2(show='viewCount' label='Views' type='numabbr')
      table-column2(show='clickCount' label='Clicks' type='numabbr')

      table-column2(show='price' label='Current Price' type='money')
      table-column2(show='taxRate' label='Tax' type='percent')
      table-column2(show='tradeCount' label='Trades' type='numabbr')

      table-column(:sortable='false')
        template(slot-scope='row')
          v-button.shadow(
            :to='{name: "listing-details", params: { billboardId: row.id } }'
          ) Buy This Ad Space

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
    ...mapGetters(['billboards']),
    ...mapRequestStatuses({
      fetchBillboardsRequest: 'FETCH_BILLBOARDS',
    }),
  },
  methods: {
  },
  mounted() {
    this.$store.dispatch('fetchBillboards');
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
