<template lang='pug'>
main-layout.not-found
  h2 Looks like you're lost! Maybe some ads would help?

  iframe(src='https://hads.xyz/api/i?b=1' width='600' height='400')
  iframe(src='https://hads.xyz/api/i?b=2' width='300' height='300')
  iframe(src='https://hads.xyz/api/i?b=3' width='400' height='150')



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
.not-found {
  iframe {
    margin: 10px;
    float: left;
  }
}

</style>
