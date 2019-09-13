import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引用element ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 注册为全局组件
Vue.use(ElementUI);
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'

import axios from 'axios'
import { log } from 'util';
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// 请求拦截器
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token');
    // return 请求对象
    // console.log(config);
    return config;
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')