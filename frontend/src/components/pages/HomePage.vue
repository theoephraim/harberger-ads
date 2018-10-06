<template lang='pug'>
main-layout
  h2 Homepage
  form-group
    form-row
      form-input(
        type='text' v-model='thing.name'
        label='Name'
      )
      form-input(
        type='email' v-model='thing.email'
        label='Name'
      )
    form-row
      v-button(

      ) Submit

</template>

<script>
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
};
</script>

<style lang='less'>


</style>
