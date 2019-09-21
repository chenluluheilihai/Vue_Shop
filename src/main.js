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

// 导入vue-table-with-tree-grid
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

// 导入日期格式
import moment from 'moment'
Vue.filter('dateFormat', function(msg) {
    return moment().format('YYYY-MM-DD hh:mm:ss');
})

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 导入富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor, /* { default global options } */ )

// 导入时间线组件
// import Timeline from './plugins/timeline/index.js'
// import Timelineitem from './plugins/timeline-item/index.js'


// Vue.use(Timeline)
// Vue.use(Timelineitem)

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')