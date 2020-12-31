/*
 * @Author: your name
 * @Date: 2020-02-07 14:32:51
 * @LastEditTime: 2020-02-28 14:25:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \microUI-use-x\vue-admin-template-master\src\store\getters.js
 */
const getters = {
    keepAlive: state => state.user.keepAlive,
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    roleId: state => state.user.roleId,
    userId: state => state.user.userId,
    companyTitle: state => state.user.companyTitle,
    menus: state => state.user.menus,
    tagMenu: state => state.user.tagMenu
}
export default getters