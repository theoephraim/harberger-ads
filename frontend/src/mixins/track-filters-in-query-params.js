const _ = require('lodash');

module.exports = {
  data() { return { filters: this.getFilterValuesFromUrl() }; },
  watch: {
    filters: { deep: true, handler() { this.updateFiltersInUrl(); } },
    // '$route.query': {
    //   deep: true,
    //   handler() { _.set(this.filters, this.getFilterValuesFromUrl()); },
    // },
  },
  methods: {
    updateFiltersInUrl() {
      // keep new filter values in sync in the URL
      this.$router.replace({
        query: _.pickBy(this.filters, (val) => val !== null && val !== undefined),
      });
    },
    getFilterValuesFromUrl() {
      // set initial filter values from query params
      // based on `filterKeys` option
      if (!this.$options.trackFilters) return {};
      const filters = {};
      if (_.isArray(this.$options.trackFilters.keys)) {
        _.each(this.$options.trackFilters.keys, (k) => { filters[k] = this.$route.query[k]; });
      } else {
        _.each(this.$options.trackFilters.keys, (type, k) => {
          let val = this.$route.query[k];
          if (!val) return;
          if (type === Number) {
            val = parseFloat(val);
            if (isNaN(val)) return;
          }
        // TODO: add more here...
          filters[k] = val;
        });
      }
      return filters;
    },
  },
};
