import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueParticles from 'vue-particles'
import Vant from 'vant';
import 'vant/lib/index.css';
import { Picker } from "emoji-mart-vue";
import axios from 'axios';
import './assets/icon/iconfont'
import './assets/icon/iconfont.css'
import * as filters from "./util/format";
import { Dialog } from 'vant';
import { Popover } from 'vant';
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
 });
Vue.use(Popover);
Vue.use(Picker)
Vue.use(Vant);
Vue.use(VueParticles)
Vue.use(Dialog);
axios.defaults.baseURL = "http://localhost:3000/"
axios.withCredentials = true
axios.defaults.withCredentials = true
Vue.prototype.$http = axios;
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
