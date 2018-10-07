<template lang='pug'>
.main-wrap(:class='classes')
  .flex-wrap
    .splash
      .big-board(v-html="require('@/assets/images/ha-board.svg')")

    .menu-bar.center
      v-button(to-named-route='new-listing') Sell Your Ad Space
      v-button(@click='scrollDown') Browse Inventory

    nav.nav-bar
      div.row.clearfix
        div.col.col-2
          span.logotype HA
        div.col.col-10.align-right
          ul.caps.inline
            template(v-if='!userIsLoggedIn')
              li
                a(href='#' @click.prevent="signIn") Sign in
            template(v-else)
              li
                a(href='#' @click.prevent='setSearchFilter(null)' :class='{active: !searchFilter}') Everything
              li
                a(href='#' @click.prevent='setSearchFilter("mysite")' :class='{active: searchFilter === "mysite"}') Ads on my sites
              li
                a(href='#' @click.prevent='setSearchFilter("myads")' :class='{active: searchFilter === "myads"}') My Ads
              li
                a(href='#' @click.prevent="signOut") Sign out

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
    ...mapGetters(['userIsLoggedIn', 'searchFilter']),
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
    scrollDown() {
      window.scroll({
        top: window.innerHeight,
        left: 0,
        behavior: 'smooth',
      });
    },
    setSearchFilter(val) {
      this.$store.dispatch('setSearchFilter', val);
    },
  },
};
</script>

<style lang='less'>

// this flex stuff sets up the sticky footer
.main-wrap {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
.flex-wrap {
  flex: 1 0 auto;
}

.logotype {
  display: inline-block;
  transform: rotateZ(-25deg);
  transform-origin: 50%;
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
  height: 75vh;
  padding-bottom: 30px;
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
  height: 25vh;
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

.nav-bar {
  background: @black;
  z-index: 10;
  padding: 1em 35px;
  top: 0;
  position: sticky;
  margin-top: -50px;

}



</style>
