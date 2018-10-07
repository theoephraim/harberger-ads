<template>
  <div class="fixed">
    <div
      :class="msgClass(msg)"
      class="flex"
      @click="clickMessage(msg)"
      :key="msg.id"
      v-for="msg in messages">
        <span v-if="msg.title" v-html="escape(msg.title)"/>
        <span>&nbsp; &middot; &nbsp;</span>
        <span v-html="escape(msg.msg)"/>
      <span
        class='sending px1'
        v-if="msg.type === 'progress'">✨</span>
    </div>
  </div>
</template>

<style scoped>
.fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  margin-top: 1rem;
  background: #111;
}

.flex {
  padding: 1rem;
  display: flex;
  align-items: center;
}

.sending {
  padding: 0 .5rem;
}
</style>

<script>
import { mapMutations } from 'vuex';
import xss from 'xss';

export default {
  name: 'Messages',
  computed: {
    messages() {
      return this.$store.state.messages;
    },
  },
  methods: {
    escape(msg) {
      return xss(msg);
    },
    clickMessage(msg) {
      if (msg.link) {
        this.$router.push(msg.link);
      }
      this.removeMessage(msg.id);
    },
    msgClass(msg) {
      switch (msg.type) {
        case 'success':
          return 'bg-green white';
        case 'progress':
          return 'bg-white green border';
        case 'error':
          return 'bg-red white';
        default:
          return 'bg-white green border';
      }
    },
    ...mapMutations({
      removeMessage: 'REMOVE_MSG',
      addMessage: 'ADD_MSG',
    }),
  },
};
</script>
