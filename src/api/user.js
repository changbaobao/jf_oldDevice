/*
 * @Author: your name
 * @Date: 2020-02-07 14:32:50
 * @LastEditTime: 2020-02-18 14:18:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \microUI-use-x\vue-admin-template-master\src\api\user.js
 */
import request from '@/utils/request'
import Qs from 'qs'
export function login(data) {
    return request({
        url: '/S-Authorization/login',
        method: 'post',
        data: Qs.stringify(data)
    })
}

export function getRouteData() {
    return request({
        url: '/S-Authorization/getModule',
        method: 'post'
    })
}

export function getRoles(data) {
    return request({
        url: '/S-Base/getByUserById',
        method: 'post',
        data: Qs.stringify(data)
    })
}

export function setRoles(data) {
    return request({
        url: '/S-Base/updateUserRoleDefaults',
        method: 'post',
        data: Qs.stringify(data)
    })
}

export function changeRoles(data) {
    return request({
        url: '/S-Authorization/getChangeRole',
        method: 'post',
        data: Qs.stringify(data)
    })
}