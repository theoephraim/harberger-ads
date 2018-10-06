import Vue from 'vue';


import TableComponent from 'vue-table-component/src';
import '@/assets/style/components/table-component.less';
import TableColumn2 from '@/components/general/TableColumn2';


Vue.component('main-layout', require('./layout/MainLayout.vue').default);

Vue.component('error-message', require('./general/ErrorMessage.vue').default);
Vue.component('icon', require('./general/Icon.vue').default);
Vue.component('popup', require('./general/Popup.vue').default);
Vue.component('save-bar', require('./general/SaveBar.vue').default);
Vue.component('v-button', require('./general/VButton.vue').default);

Vue.component('form-group', require('./forms/FormGroup.vue').default);
Vue.component('form-input', require('./forms/FormInput.vue').default);
Vue.component('form-input-option', require('./forms/FormInputOption.vue').default);
Vue.component('form-row', require('./forms/FormRow.vue').default);


// register the table components globally
// and we can also pass in settings
Vue.use(TableComponent, {
  // tableClass: '',
  // theadClass: '',
  // tbodyClass: '',
  // filterPlaceholder: 'Filter table…',
  // filterNoResults: 'There are no matching rows',
});
Vue.component('table-column2', TableColumn2);
