<template lang='pug'>
.progress-bar(:class='classModifiers')
  .fill(:style='{width: `${percent}%`}')
    .percent-label(v-if='!percent2') {{ percentRounded }}%
  .fill2(v-if='percent2' :style='{width: `${percent2}%`}')
  .fill3(v-if='percent3' :style='{width: `${percent3}%`}')
</template>

<script>
const components = {};

export default {
  name: 'ProgressBar',
  components,
  props: {
    percent: { // 0-100
      type: Number,
      required: true,
    },
    percent2: { // 0-100
      type: Number,
    },
    percent3: { // 0-100
      type: Number,
    },
  },
  computed: {
    percentRounded() { return this.percent.toFixed(1).replace('.0', ''); },
    classModifiers() {
      return {
        'progress-bar--more-than-half': this.percent >= 50,
        'progress-bar--less-than-half': this.percent < 50,
        'progress-bar--empty': this.percent <= 0,
        'progress-bar--full': this.percent >= 100,
      };
    },
  },
};
</script>

<style lang='less'>
@bar-height: 50px;
@bar-radius: @bar-height / 2;
@fill-edge-radius: 0px;
@label-margin: 8px;

.progress-bar {
  width: 100%;
  height: @bar-height;
  position: relative;
  padding: 5px;
  background: #666;
  border-radius: @bar-radius;
  box-shadow: inset 0 0px 4px fade(#000, 30);

  .border {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: @bar-radius;
    border: 3px solid #333;
    z-index: 2;
  }
  .percent-label {
    position: absolute;
    top: 50%;
    margin-top: -13px;
    line-height: 30px;
    font-weight: bold;
    z-index: 2;
  }
  .fill, .fill2, .fill3 {
    position: relative;
    float: left;
    height: 100%;
    border-radius: @bar-radius;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;

    background: #00E676;
    // background: #11a8f9;
    z-index: 1;
  }
  .fill2, .fill3 {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .fill2 {
    background: #f2e235;
  }
  .fill3 {
    background: #ef0410;
  }


  &.progress-bar--more-than-half {
    .percent-label {
      right: @label-margin;
      color: #333;
    }
  }
  &.progress-bar--less-than-half {
    .percent-label {
      left: 100%;
      margin-left: @label-margin;
      color: #FFF;
    }
  }
  &.progress-bar--full {
    .fill {
      border-top-right-radius: @bar-radius;
      border-bottom-right-radius: @bar-radius;
    }
  }
}
</style>
