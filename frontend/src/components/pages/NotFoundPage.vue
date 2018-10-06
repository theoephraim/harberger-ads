<template lang='pug'>
main-layout
  h2 Nothing to see here folks!
</template>

<script>
const components = {
  MainLayout: require('../layout/MainLayout').default,
};

export default {
  name: 'NotFoundPage',
  components,
  metaInfo: {
    title: 'Are you lost?',
  },
};
</script>

<style lang='less'>


</style>
