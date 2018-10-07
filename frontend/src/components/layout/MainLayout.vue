<template lang='pug'>
.main-wrap(:class='classes')
  .flex-wrap
    .splash
      .big-board(v-html="require('@/assets/images/ha-board.svg')")
    .menu-bar.center
      v-button(to-named-route='new-listing') Sell Ad Space
      template(v-if='!userIsLoggedIn')
        v-button(@click="signIn") Sign in
      template(v-else)
        v-button(@click="signOut") Sign out

    .main-content
      slot
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';

const components = {
};

export default {
  name: 'MainLayout',
  components,
  props: {
    fullWidth: Boolean,
    noFixedHeader: Boolean,
    noFooter: Boolean,
    noNav: Boolean,
  },
  data() {
    return {
      program: {},
    };
  },
  computed: {
    ...mapGetters(['userIsLoggedIn']),
    classes() {
      return {
        'full-width': this.fullWidth,
        'no-fixed-header': this.noFixedHeader,
        'no-footer': this.noFooter,
      };
    },
  },
  methods: {
    ...mapActions([
      'signIn',
    ]),
    ...mapMutations({
      signOut: 'SIGN_OUT',
    }),
  },
};
</script>

<style lang='less'>

@header-bar-height--desktop: 60px;
@header-bar-height--mobile: 50px;

// this flex stuff sets up the sticky footer
.main-wrap {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
.flex-wrap {
  flex: 1 0 auto;
}
.header-button {
  height: 40px;
  border-radius: 2px;
  margin: 0 14px;
}
.flex-bar {
  height: @header-bar-height--desktop;
  padding: 15px 12px;
  > div {
    min-width: 100px;
    height: @header-bar-height--desktop;
    color: black;
    display: inline-block;
    justify-content: center;
    line-height: @header-bar-height--desktop;
    vertical-align: middle;
  }

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  height: @header-bar-height--desktop;
  padding: 15px 12px;
  color: white;
  text-align: left;
  position: fixed;
  z-index: 1000;
  width: 100%;
  a {
    color: white;
  }
  @media @mq-small-only {
    height: @header-bar-height--mobile;
    padding: 0;
    position: relative;
  }
  .main-wrap.no-fixed-header & {
    position: relative;
  }
}

.main-logo {
  display: flex;
  align-items: center;
  height: 28px;
  width: auto;
  display: flex;
  @media @mq-small-only {
    margin-left: 5px;
  }

  > svg {
    display: block;
    fill: black;
    height: 100%;
    max-width: 40vw;
    transition: 0.5s all;
  }
  &:hover {
    > svg {
      fill: @blue-green;
    }
  }
}

.main-content {
  // max-width: 1000px;
  margin: 0 auto;
  padding: 35px;
  padding-top: 60px;
  padding-bottom:0px;

  @media @mq-small-only {
    //padding: 10px;
    padding-top: 0;
  }


  .full-width & {
    max-width: 100%;
    padding-left: 0;
    padding-right: 0;
  }

  .main-wrap.no-fixed-header & {
    padding-top: 0;
  }
}


.splash {
  height: 80vh;
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

.menu-bar {
  &>* {
    min-width: 180px;
  }

  .button {
    margin-right: 0;
    border-right: 0;

    &:first-child {
      border-radius: 6px 0 0 6px;
    }

    &:last-child {
      border-right: 1px solid @bordercolor;
      border-radius: 0 6px 6px 0;
    }
  }
}



</style>
