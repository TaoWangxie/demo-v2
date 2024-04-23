import Vue from 'vue'
import App from './App.vue'
import { init } from "@js-wtao/browser";
import { vuePlugin } from "@js-wtao/vue";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import dragSelect from '@/directives/dragSelect';
import dragSelect2 from '@/directives/dragSelectBorder';

Vue.directive('drag-select', dragSelect);
Vue.directive('drag-select2', dragSelect2);

window.WTJS = init({
  // set debug true to convenient debugger in dev,set false in prod
  debug: true,
  silentConsole: true,
  vue: Vue,
  dsn: 'https://test.com/yourInterface',
  maxBreadcrumbs: 100
}, [vuePlugin])

Vue.use(ElementUI);

new Vue({
  render: h => h(App),
}).$mount('#app')
