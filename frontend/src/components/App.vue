<template lang='pug'>
#app
  router-view
  messages
</template>

<script>
// TODO: different favicon?
import faviconUrl from '@/assets/images/favicon.png';
import Messages from '@/components/Messages';

const components = {
  Messages,
};


export default {
  name: 'App',
  components,
  metaInfo: {
    title: 'admin', // default title
    titleTemplate: '%s | ClearAdmin', // all titles use this template
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'robots', content: 'noindex' },
    ],
    link: [
      { rel: 'shortcut icon', type: 'image/ico', href: faviconUrl },
    ],
  },
  mounted() {
    document.dispatchEvent(new Event('prerender-ready'));
  },
};
</script>

<style lang='less'>
@import '~assets/style/core.less';

#app {
  height: 100%;
}
</style>
