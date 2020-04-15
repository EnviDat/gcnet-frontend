import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import store from './store';
import globalMethods from './globalMethods';

Vue.config.productionTip = false;

Vue.mixin(globalMethods);

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
