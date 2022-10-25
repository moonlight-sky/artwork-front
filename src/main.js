import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import store from './store'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import './assets/font/iconfont.css'
import './assets/font_col/iconfont.css'
import axios from 'axios';

//挂载axios
Vue.prototype.$http = axios
//设置访问根路径
axios.defaults.baseURL = "http://localhost:9000"

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')