import Vue from 'vue'
import App from './App.vue'
// import { init } from "@js-wtao/browser";
// import { vuePlugin } from "@js-wtao/vue";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import dragSelect from '@/directives/dragSelect';
import dragSelectBorder from '@/directives/dragSelectBorder';
import dragSelectCopy from '@/directives/dragSelectCopy';
import execlPaste from '@/directives/execlPaste';

dragSelectCopy

Vue.directive('drag-select', dragSelect);
Vue.directive('drag-select-border', dragSelectBorder);
Vue.directive('drag-select-copy', dragSelectCopy);
Vue.directive('excel-paste', execlPaste);
// window.WTJS = init({
//   // set debug true to convenient debugger in dev,set false in prod
//   debug: true,
//   silentConsole: true,
//   vue: Vue,
//   dsn: 'https://test.com/yourInterface',
//   maxBreadcrumbs: 100
// }, [vuePlugin])

Vue.use(ElementUI);

new Vue({
  render: h => h(App),
}).$mount('#app')
