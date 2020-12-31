/*
 * @Author: your name
 * @Date: 2020-02-07 14:32:52
 * @LastEditTime: 2020-02-08 17:05:29
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \microUI-use-x\vue-admin-template-master\src\utils\auth.js
 */
import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

export function sessionSet(name, data) {
    sessionStorage.removeItem(name)
    sessionStorage.setItem(name, data)
}

export function sessionGet(name) {
    return sessionStorage.getItem(name)
}
export function sessionRemove(name) {
    sessionStorage.removeItem(name)
}