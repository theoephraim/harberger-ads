/*
  This component is just a wrapper to add some extra functionality to the existing
  table-component component that is part of the `vue-table-component` package

  NOTE -- it is registered globally along with its counterparts
*/

<template lang='pug'>
table-column(
  :label='label'
  ref='originalTableColumn'
  :data-type='dataType'
  :sort-by='sortBy'
)
  template(slot-scope='row')
    span(v-if='cellValue(row) === null || cellValue(row) === undefined && !!emptyText') {{ emptyText }}
    template(v-else-if='type === "boolean"')
      template(v-if='!!cellValue(row)')
        //- TODO: add tooltip with _get(row, show)
        icon(name='check-circle' scale='1.5')
      span(v-else) -
    .small.nowrap(v-else-if='type === "datetime"') {{ cellValue(row) | datetime }}
    .small.nowrap(v-else-if='type === "date"') {{ cellValue(row) | date }}
    span(v-else-if='type === "timeago"') {{ cellValue(row) | timeago }}
    span(v-else-if='type === "percent"') {{ cellValue(row) | percent }}
    span(v-else-if='type === "money"') {{ cellValue(row) | currency }}
    span(v-else-if='type === "filesize"') {{ cellValue(row) | filesize }}
    span(v-else-if='type === "numabbr"') {{ cellValue(row) | numabbr }}
    span(v-else) {{ cellValue(row) }}
</template>

<script>
import _ from 'lodash';

const components = {
  Icon: require('@/components/general/Icon').default,
};

export default {
  name: 'TableColumn2',
  components,
  props: {
    type: { type: String, default: 'text' },
    show: String,
    label: String,
    emptyText: String,
    valueFn: Function,
  },
  computed: {
    dataType() {
      // for sorting - what type of data is this
      return {
        date: 'string',     // as long as our values are ISO format (YYYY-MM-DD)
        datetime: 'string', // then we can sort as a string and skip using moment.js
        timeago: 'string',
        percent: 'numeric',
        money: 'numeric',
        filesize: 'numeric',
      }[this.type] || 'string';
    },
    sortBy() {
      // this property of row is used for sorting
      return this.show;
    },
  },
  methods: {
    _get: _.get,
    formatter(v) { return v; },
    cellValue(row) {
      if (this.show) return _.get(row, this.show);
      else if (this.valueFn) return this.valueFn(row);
      return null;
    },
    // sortable: { default: true, type: Boolean },
    // sortBy: { default: null },
    // filterable: { default: true, type: Boolean },
    // filterOn: { default: null },
    // hidden: { default: false, type: Boolean },
  },
};
</script>

<style lang='less'>

</style>
