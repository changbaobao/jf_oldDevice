/*
 * @Author: your name
 * @Date: 2020-02-07 17:01:21
 * @LastEditTime: 2020-02-20 13:41:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \microUI-use-x\vue-admin-template-master\src\layout\components\Sidebar\sideBar.js
 */

import Layout from '@/layout'

export function creatMenu(module) {
    let DG = {}
    DG = module.module
    const tree = []
    for (let i = 0; i < DG.length; i++) {
        if (DG[i].parentId === '0') {
            const obj = DG[i]
            obj.children = []
            tree.push(obj)
            DG.splice(i, 1)
            i--
        }
    }

    function menuList(arr) {
        if (DG.length !== 0) {
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < DG.length; j++) {
                    if (DG[j].parentId.toString() === arr[i].id.toString()) {
                        const obj = DG[j]
                        obj.children = []
                        arr[i].children.push(obj)
                        module.module.splice(j, 1)
                        j--
                    }
                }
                menuList(arr[i].children)
            }
        }
    }
    menuList(tree)
    return tree
}

export function filterMenu(data) {
    const arr = []
    data.map(item => {
        const child = item.children.map(v => {
            return {
                path: v.routerPath,
                name: v.moduleName,
                component: resolve =>
                    require(['@/views/' + v.modulePath], resolve),
                meta: { title: v.chineseName, icon: 'example' }
            }
        })
        const param = {
            path: item.routerPath,
            name: item.moduleName,
            redirect: child[0].path,
            component: Layout,
            meta: { title: item.chineseName, icon: 'example' },
            children: child
        }
        if (child.length == 1) {
            param.alwaysShow = true
        }
        arr.push(param)
    })
    return arr
}