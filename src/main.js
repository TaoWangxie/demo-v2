import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import { init } from "@js-wtao/browser";
// import { vuePlugin } from "@js-wtao/vue";
// window.WTJS = init({
//   // set debug true to convenient debugger in dev,set false in prod
//   debug: true,
//   silentConsole: true,
//   vue: Vue,
//   dsn: 'https://test.com/yourInterface',
//   maxBreadcrumbs: 100
// }, [vuePlugin])
import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  ak: '03EV2mS83xtLoifvHnRm5MTx5krHDIg0' // 百度地图秘钥
})


import dragSelect from '@/directives/dragSelect';
import dragSelectBorder from '@/directives/dragSelectBorder';
import dragSelectCopy from '@/directives/dragSelectCopy';
import execlPaste from '@/directives/execlPaste';
Vue.directive('drag-select', dragSelect);
Vue.directive('drag-select-border', dragSelectBorder);
Vue.directive('drag-select-copy', dragSelectCopy);
Vue.directive('excel-paste', execlPaste);


Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
