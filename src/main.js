import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import store from './store/store';
import globalMethods from './globalMethods';
import router from './router'

Vue.config.productionTip = false;

Vue.mixin(globalMethods);

Vue.prototype.$eventHub = new Vue(); // Global event bus

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');
