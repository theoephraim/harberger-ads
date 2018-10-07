<template lang='pug'>
.overlay
  .overlay-screen
  .overlay-content
    .overlay-header
      router-link.overlay-exit(:to="{name: 'home'}") Back
      h2 List Your Site
    .overlay-form
      .half
        form-row
          form-input(
            type='text' v-model='listing.name'
            label='Name'
          )
        form-row
          form-input(
            type='text' v-model='listing.price'
            label='Starting Price'
          )
          form-input(
            type='int' :min='100' :max='1200' v-model='listing.pixelWidth'
            label='Width (px)'
          )
          form-input(
            type='int' :min='100' :max='1200' v-model='listing.pixelHeight'
            label='Height (px)'
          )
        form-row
          form-input(
            type='url' v-model='listing.url'
            label='URL'
          )
      .half
        form-row
          form-input(
            type='dropdown' v-model='listing.type'
            label='Type'
          )
            form-input-option(:value='banner') Web Banner Ad
            form-input-option(:value='sidebar') Web Sidebar Ad
            form-input-option(:value='tv') Phyical Digital Display
        form-row
          form-input(type='textarea' v-model='description' label='Description')
    .buttons
      v-button(@click='save') cancel
      v-button(@click='save') Save

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
    title: 'List your ad space',
  },
  data() {
    return {
      listing: {},
    };
  },
  computed: {
    ...mapGetters(['billboards']),
    ...mapRequestStatuses({
      fetchBillboardsRequest: 'FETCH_BILLBOARDS',
    }),
  },
  mounted() {
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
  top: 10vh;
  left: 20px;
  right: 20px;
}

.new-listing {

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

</style>
