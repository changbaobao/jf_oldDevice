/*
 * @Author: your name
 * @Date: 2020-02-07 14:32:51
 * @LastEditTime: 2020-02-28 15:21:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \microUI-use-x\vue-admin-template-master\src\permission.js
 */
import router from './router'
import store from './store'
import {
    Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
    getToken,
    sessionGet
} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Qs from 'qs'
NProgress.configure({
        showSpinner: false
    }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
    NProgress.start()
    document.title = getPageTitle(to.meta.title)
    var userId = sessionGet('userId') // sessionStorage的userId不为空说明用户已经登录
    const secretFree = to.query.secretFree
    const phoneEmail = to.query.phoneEmail
    const password = to.query.password
    if (secretFree) { // 不用登陆直接进入// http://localhost:9528/#/home?secretFree=true&phoneEmail=qibin@qq.com&password=1234
        await store.dispatch('user/login', {
            phoneEmail: phoneEmail,
            password: password
        }).then(res => {
            userId = res.userId
        })
    }

    if (userId !== null) {
        if (to.path === '/login') {
            next({
                path: '/'
            })
            NProgress.done()
        } else {
            if (!store.state.userId) { // vuex的userId为空说明用户刷新了页面
                store.commit('user/SET_USERID', userId)
                store.dispatch('user/GenerateRoutes')
                const tagList = JSON.parse(sessionStorage.getItem('tagMenu'))
                store.commit('user/SET_TAGMENU', tagList)
                store.commit('user/SET_KEEPALIVE', tagList)
            }
            next()
        }
    } else {
        /* has no token*/
        if (whiteList.indexOf(to.path) !== -1) {
            // 判断是否在登录页面
            next()
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})

/**
 * 如果登录超时退出登录页面
 */

// var lastTime = new Date().getTime() // var timeOut = 30 * 60 * 1000 // 设置超时时间： 30分
// var timeOut = 5 * 60 * 60 * 1000 // 五个小时
// window.onload = function () {
//   window.document.onmousedown = function () {
//     localStorage.setItem('lastTime', new Date().getTime())
//   }
// }

// function checkTimeout() {
//   const loginTime = localStorage.getItem('loginTime') // 获取登录时间

//   lastTime = localStorage.getItem('lastTime')
//   console.error(loginTime, lastTime, '12414141412')
//   if (lastTime - loginTime > timeOut) { // 判断是否超时
//     debugger
//     console.error(lastTime - loginTime, 'lalal')
//     var url = window.location.href
//     var newUrl = url.match(/(\S*)#/)[1]
//     window.open(newUrl + '#/login', '_self')
//   }
// }

// window.setInterval(checkTimeout, 2 * 60 * 1000)