<template lang='pug'>
span.pretty-json
  .pretty-json__expand-toggle(v-if='isExpandable(object)' @click='toggleOpen') {{ isOpen ? '-' : '+' }}
  .pretty-json__bracket {{ leftBracket }}

  span.pretty-json__summary(v-if='!isOpen' @click='toggleOpen') {{ summary }}
  template(v-else)
    .pretty-json__empty(v-if='isEmpty') empty
    .pretty-json__child(v-else v-for="(value, key) in object")
      .pretty-json__key {{ isArray ? `item #${key}` : key }}:
      pretty-json(v-if='_isArray(value) || _isObject(value)' :object="value" :level='level + 1')
      template(v-else)
        span.pretty-json__empty(v-if='value === null') null
        span.pretty-json__empty(v-else-if='value === undefined') undefined
        span.pretty-json__value(v-else :class='classForType(value)') {{ value.toString() }}
  .pretty-json__bracket {{ rightBracket }}
</template>

<script>
import _ from 'lodash';

export default {
  name: 'pretty-json',
  components: {
    PrettyJson: this,
  },
  props: {
    object: [Object, Array],
    level: { type: Number, default: 0 },
    startCollapsed: { type: Boolean },
    // number of prop keys to show while collapsed
    numPreviewPros: { type: Number, default: 5 },
  },
  data() {
    return { isOpen: !this.startCollapsed };
  },
  computed: {
    isArray() { return _.isArray(this.object); },
    isObject() { return _.isObject(this.object); },
    isEmpty() {
      if (this.isArray && this.length === 0) return true;
      if (this.isObject && _.keys(this.object).length === 0) return true;
      return false;
    },
    leftBracket() {
      if (this.isArray) return '[';
      if (this.isObject) return '{';
      return '';
    },
    rightBracket() {
      if (this.isArray) return ']';
      if (this.isObject) return '}';
      return '';
    },
    summary() {
      if (this.isArray) {
        const numItems = this.object.length;
        return `${numItems} item${numItems > 1 ? 's' : ''}`;
      } else if (this.isObject) {
        const itemKeys = _.keys(this.object);
        const numKeys = itemKeys.length;
        if (numKeys <= this.numPreviewPros) {
          return itemKeys.slice(0, this.numPreviewPros).join(', ');
        }
        return `${itemKeys.slice(0, this.numPreviewPros).join(', ')}, +${numKeys - 5} more props...`;
      }
      // should not reach here
      return '';
    },
  },
  methods: {
    toggleOpen() { this.isOpen = !this.isOpen; },
    _isArray(val) { return _.isArray(val); },
    _isObject(val) { return _.isObject(val); },
    _keys: _.keys,
    isExpandable(value) {
      if (_.isArray(value)) {
        return value.length > 0;
      } else if (_.isObject(value)) {
        return _.keys(value).length > 0;
      }
      return false;
    },
    classForType(value) {
      if (_.isBoolean(value)) return 'boolean';
      if (_.isString(value)) return 'string';
      if (_.isNumber(value)) return 'number';
      return null;
    },
  },
};
</script>

<style lang='less'>
.pretty-json {
  font-size: 14px;
  line-height: 20px;

  .pretty-json__expand-toggle {
    display: inline-block;
    border: 1px solid #aaa;
    border-radius: 4px;
    background: white;
    font-weight: bold;
    height: 20px;
    width: 20px;
    line-height: 16px;
    text-align: center;
    cursor: pointer;
    margin: 0 3px;
  }
  .pretty-json__key {
    display: inline-block;
    padding-right: 10px;
    color: #2795EE;
  }
  .pretty-json__empty {
    display: inline-block;
    padding: 0 5px;
    font-style: italic;
    color: #AAA;
  }
  .pretty-json__summary {
    font-style: italic;
    color: #666;
    cursor: pointer;
  }

  .pretty-json__bracket {
    display: inline-block;
    padding: 0 3px;
  }

  .pretty-json__child {
    padding-left: 1.5em;
  }
  .pretty-json__value {
    &.number {
      color: #ED5C65;
    }
    &.string {
      color: #249D7F;
    }
    &.boolean {
      color: #a151d2;
    }
  }
}
</style>
