<template lang='pug'>
font-awesome-icon.icon(
  :name='name'
  :spin='name === "spinner"'
  :scale='scale'
)
</template>

<script>
// see https://fontawesome.com/v4.7.0/icons/ for available icons
import 'vue-awesome/icons/times';
import 'vue-awesome/icons/times-circle';
import 'vue-awesome/icons/check';
import 'vue-awesome/icons/check-circle';
import 'vue-awesome/icons/circle-thin';
import 'vue-awesome/icons/question-circle';
import 'vue-awesome/icons/arrow-right';
import 'vue-awesome/icons/arrow-left';
import 'vue-awesome/icons/arrow-circle-right';
import 'vue-awesome/icons/arrow-circle-left';
import 'vue-awesome/icons/exclamation-circle';
import 'vue-awesome/icons/phone';
import 'vue-awesome/icons/info-circle';
import 'vue-awesome/icons/external-link';
import 'vue-awesome/icons/address-card-o';
import 'vue-awesome/icons/star';
import 'vue-awesome/icons/star-o';
import 'vue-awesome/icons/plus';
import 'vue-awesome/icons/plus-circle';
import 'vue-awesome/icons/spinner';
import 'vue-awesome/icons/search';
import 'vue-awesome/icons/trash';
import 'vue-awesome/icons/bars';
import 'vue-awesome/icons/user';
import 'vue-awesome/icons/briefcase';
import 'vue-awesome/icons/dollar';
import 'vue-awesome/icons/tasks';
import 'vue-awesome/icons/refresh';
import 'vue-awesome/icons/plus-square-o';
import 'vue-awesome/icons/minus-square-o';
import 'vue-awesome/icons/wrench';
import 'vue-awesome/icons/thumbs-o-up';
import 'vue-awesome/icons/legal';
import 'vue-awesome/icons/hand-paper-o';
import 'vue-awesome/icons/download';
import 'vue-awesome/icons/pencil';
import 'vue-awesome/icons/gift';
import 'vue-awesome/icons/retweet';
import 'vue-awesome/icons/sign-in';
import 'vue-awesome/icons/sign-out';
import 'vue-awesome/icons/eye';
import 'vue-awesome/icons/eye-slash';
import 'vue-awesome/icons/facebook-f';
import 'vue-awesome/icons/twitter';
import 'vue-awesome/icons/medium';
import 'vue-awesome/icons/linkedin';
import 'vue-awesome/icons/lock';

import 'vue-awesome/icons/users';
import 'vue-awesome/icons/bullhorn';
import 'vue-awesome/icons/rocket';
import 'vue-awesome/icons/line-chart';
import 'vue-awesome/icons/university';

const components = {
  FontAwesomeIcon: require('vue-awesome/components/Icon').default,
};

export default {
  name: 'Icon',
  components,
  props: {
    name: { type: String },
    scale: { type: String },
    title: String,
  },
};
</script>

<style lang='less'>
.icon {
  display: inline-block;
  vertical-align: middle;
}

.link-with-icon {
  .icon {
    display: inline-block;
    vertical-align: middle;
    margin-right: 6px;
    margin-top: -2px;
    width: 20px;
    height: 20px;
  }
}
</style>
