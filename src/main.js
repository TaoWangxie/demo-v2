import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import './style.css'
// import { init } from "@js-wtao/browser";
// import { vuePlugin } from "@js-wtao/vue";
// window.WTJS = init({
//   // set debug true to convenient debugger in dev,set false in prod
//   debug: true,
//   silentConsole: true,
//   vue: Vue,
//   dsn: 'http://82.156.198.41:11112/ceshi',
//   maxBreadcrumbs: 100
// }, [vuePlugin])
// import BaiduMap from "vue-baidu-map";
// Vue.use(BaiduMap, {
//   ak: "03EV2mS83xtLoifvHnRm5MTx5krHDIg0", // 百度地图秘钥
// });
const instance = window.TRACK.init({
  debug: true,
  apikey: 'sdasda',
  silentConsole: true,
  silentXhr: false,
  maxBreadcrumbs: 20,
  dsn: 'http://82.156.198.41:11112/ceshi',
  throttleDelayTime: 0,
  backTrackerId(){
      return 'userid' //用户uid
  },
  configReportXhr(xhr) {
      xhr.setRequestHeader('mito-header', 'test123')
  }
},[window.TRACK_vue.vuePlugin])
Vue.prototype.$track = instance;

Vue.prototype.formatDate = function (t) {
  t = t || Date.now();
  let time = new Date(t);
  let str =
    time.getMonth() < 9 ? "0" + (time.getMonth() + 1) : time.getMonth() + 1;
  str += "-";
  str += time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
  str += " ";
  str += time.getHours();
  str += ":";
  str += time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
  return str;
};

import dragSelect from "@/directives/dragSelect";
import dragSelectBorder from "@/directives/dragSelectBorder";
import dragSelectCopy from "@/directives/dragSelectCopy";
import execlPaste from "@/directives/execlPaste";
Vue.directive("drag-select", dragSelect);
Vue.directive("drag-select-border", dragSelectBorder);
Vue.directive("drag-select-copy", dragSelectCopy);
Vue.directive("excel-paste", execlPaste);

Vue.use(ElementUI);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
