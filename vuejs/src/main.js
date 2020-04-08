import Vue from 'vue'
import vuetify from './plugins/vuetify';
import store from './store';
import router from './router';
import App from './App.vue';
import JsonExcel from 'vue-json-excel'

Vue.config.productionTip = false;

Vue.component('downloadExcel', JsonExcel)

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
