<template lang='pug'>
  fieldset.form-group(:class='classes')
    legend.form-group-label(v-if='label' @click='toggleCollapsed')
      .collapse-toggle(v-if='collapsible' )
        icon(:name='`${collapsed ? "plus" : "minus"}-square-o`')
      .label-text {{ label }}
    .form-group-content(@click='toggleCollapsedIfCollapsed')
      slot(v-if='!collapsible || (collapsible && !collapsed)')
      slot(v-if='collapsible && collapsed' name='summary')
</template>

<script>
import _ from 'lodash';

const components = {
  Icon: require('@/components/general/Icon').default,
};


export default {
  name: 'FormGroup',
  components,
  props: {
    label: String,
    collapsible: Boolean,
    startCollapsed: Boolean,
    disabled: Boolean,
  },
  data() {
    return {
      collapsed: this.startCollapsed,
    };
  },
  computed: {
    computedDisabled() {
      if (this.disabled) return true;
      return _.isFunction(this.formParentDisabled) && this.formParentDisabled();
    },
    classes() {
      return {
        collapsible: this.collapsible,
        collapsed: this.collapsible && this.collapsed,
      };
    },
  },
  provide() {
    return {
      formParentDisabled: () => this.computedDisabled,
    };
  },
  inject: { formParentDisabled: { default: false } },
  methods: {
    toggleCollapsed() {
      if (this.collapsible) this.collapsed = !this.collapsed;
    },
    toggleCollapsedIfCollapsed() {
      if (this.collapsible && this.collapsed) this.collapsed = !this.collapsed;
    },
  },
};
</script>

<style lang='less'>


.form-group {
  // TO FIX TEXT OVERFLOW ELLIPSIS ISSUE
  // https://stackoverflow.com/questions/7434756/overflow-and-text-overflow-within-fieldsets
  min-width: 0;

  display: block;
  position: relative;

  margin: 15px 0;
  padding: 0;
  // background: #F0F0F0;
  border: 1px solid rgba(0,0,0,.3);
  border-radius: 3px;
  // border: 3px solid #d8f8ff;
  // padding: 20px 10px;

  > .form-group-content {
    > .form-row:first-of-type {
      border-top: none;
      margin-top: -2px;
    }
    + .form-row {
      border-top: none;
    }

    // Nested form groups look more like a section within the containing group
    > .form-group {
      margin: 0px 0px;
      border-radius: 0;
      border-width: 1px;
      // border-color: rgba(0,0,0,.2);
      border-left: none;
      border-right: none;
      border-bottom: none;

      .form-group-label {
        color: #777;
        cursor: default !important;
      }
      + .form-row {
        border-top-color: rgba(0,0,0,.3);
      }
    }
  }

  &.collapsed {
    > .form-group-content {
      cursor: pointer;
    }
  }
}
.form-group-label {
  font-weight: bold;
  text-transform: uppercase;
  font-size: 11px;
  line-height: 1em;
  margin-left: 7px;
  padding: 0 5px;

  .collapse-toggle {
    display: inline-block;
    cursor: pointer;
    margin-right: 10px;
    height: 16px;
    // margin-top: 4px;
    // margin-bottom: -4px;
    vertical-align: middle;
  }

  .label-text {
    display: inline-block;
    white-space: nowrap;
    vertical-align: middle;
  }

  .form-group.collapsible & {
    cursor: pointer;
    &:hover {
      .collapse-toggle {
        transform: scale(1.1);
      }
    }
  }

}

</style>
