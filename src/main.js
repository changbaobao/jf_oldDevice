/*
 * @Author: your name
 * @Date: 2020-02-07 14:32:51
 * @LastEditTime: 2020-03-04 10:45:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \microUI-use-x\vue-admin-template-master\src\main.js
 */
import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/zh-CN"; // lang i18n

import "@/styles/index.scss"; // global css

import App from "./App";
import store from "./store";
import router from "./router";
import axios from "./utils/request";
import "@/icons"; // icon
import "@/permission"; // permission control
import Qs from "qs";
// import AMap from 'vue-amap'
import { parseTime } from "./utils/index";

// import htmlToPdf from "./utils/htmlToPdf";
// Vue.use(htmlToPdf);
// Vue.use(AMap)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }
// const size = screen.width == 1920 ? 'medium' : 'small'

// set ElementUI lang to EN
Vue.use(ElementUI, {
    size: "small",
    zIndex: 3000,
    locale
});

Vue.filter("dateformat", function(
    dataStr,
    pattern = "{y}-{m}-{d} {h}:{i}:{s}"
) {
    return parseTime(dataStr, pattern);
});
Vue.prototype.$http = axios;
Vue.prototype.Qs = Qs;
Vue.config.productionTip = false;

new Vue({
    el: "#app",
    router,
    store,
    render: h => h(App)
});