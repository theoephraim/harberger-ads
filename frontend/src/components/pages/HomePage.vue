<template lang='pug'>
main-layout
  .splash
    .big-board(v-html="require('@/assets/images/ha-board.svg')")
  .menu-bar
    v-button Sell Ad Space
    v-button Buy Ads
    v-button(@click="signIn") Sign in

  div(v-if='!fetchBillboardsRequest.wasRequested || fetchBillboardsRequest.isPending')
    h2 Loading...
  div(v-else)
    h3 Loaded!

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

      table-column2(label='Site Name' show='name')

      table-column2(show='price' label='Current Price' type='money')

      // table-column(label='Actions')
      //   template(slot-scope='row')
      //     v-button(:to='getAdvanceDetailsLinkTo(row.id)' size='small') Details


</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { vuelidateGroupMixin } from '@/components/forms/vuelidate-group';
import { mapRequestStatuses } from '@/utils/vuex-api-utils';

const components = {
};

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
    ...mapActions([
      'signIn',
    ]),
  },
  mounted() {
    this.$store.dispatch('fetchBillboards');
  },
};
</script>

<style lang='less'>
.splash {
  height: 50vh;
  display: flex;
  align-items: center;
  .big-board {
    width: 80%;
    height: 80%;
    margin: 0 auto;
    svg {
      max-height: 100%;
      max-width: 100%;
    }
  }
}
</style>
