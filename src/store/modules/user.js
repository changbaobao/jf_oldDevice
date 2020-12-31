import { login, getRouteData } from "@/api/user";
import {
    getToken,
    setToken,
    removeToken,
    sessionSet,
    sessionGet
} from "@/utils/auth";
import { resetRouter } from "@/router";
import { toHump } from "@/utils/index";
import { creatMenu, filterMenu } from "@/utils/sideMenu";
import Router from "@/router";
const getDefaultState = () => {
    return {
        token: getToken(),
        name: sessionGet("name"),
        roleId: sessionGet("roleId"),
        companyTitle: sessionGet("companyTitle"),
        userId: "",
        avatar: "",
        menus: [],
        tagMenu: [{ chineseName: "主页", routerPath: "/main" }],
        keepAlive: []
    };
};

const state = getDefaultState();

const mutations = {
    RESET_STATE: state => {
        Object.assign(state, getDefaultState());
    },
    SET_TOKEN: (state, token) => {
        state.token = token;
    },
    SET_NAME: (state, name) => {
        state.name = name;
    },
    SET_ROLEID: (state, roleId) => {
        state.roleId = roleId;
    },
    SET_USERID: (state, userId) => {
        state.userId = userId;
    },
    SET_COMPANYTITLE: (state, companyTitle) => {
        state.companyTitle = companyTitle;
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar;
    },
    SET_ROUTE: (state, menus) => {
        state.menus = menus;
        Router.addRoutes(menus);
    },
    SET_TAGMENU: (state, tagMenu) => {
        state.tagMenu = tagMenu;
        sessionSet("tagMenu", JSON.stringify(tagMenu));
    },
    SET_KEEPALIVE: (state, keepAlive) => {
        const aliveArr = [];
        keepAlive.map(item => {
            const str = item.routerPath.replace(/[/]/g, "");
            const fullStr = str.charAt(0).toUpperCase() + str.slice(1);
            aliveArr.push(toHump(fullStr));
        });
        state.keepAlive = aliveArr;
    }
};

const actions = {
    /** 登录 */
    login({ commit }, userInfo) {
        const { phoneEmail, password } = userInfo;
        return new Promise((resolve, reject) => {
            login({ phoneEmail: phoneEmail, password: password })
                .then(response => {
                    const { data } = response.data;
                    commit("SET_TOKEN", data.token);
                    commit("SET_NAME", data.name);
                    commit("SET_ROLEID", data.roleId);
                    commit("SET_USERID", data.userId);
                    commit("SET_COMPANYTITLE", data.companyTitle);
                    const baseMenu = [{ chineseName: "主页", routerPath: "/main" }];
                    sessionSet("tagMenu", JSON.stringify(baseMenu));
                    commit("SET_TAGMENU", baseMenu);
                    localStorage.setItem("loginTime", new Date().getTime());
                    sessionSet("name", data.name);
                    sessionSet("roleId", data.roleId);
                    sessionSet("userId", data.userId);
                    sessionSet("companyTitle", data.companyTitle);
                    setToken(data.token);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    // 退出登录
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            removeToken(); // must remove  token  first

            commit("SET_TOKEN", "");
            commit("SET_NAME", "");
            commit("SET_USERID", "");
            commit("SET_COMPANYTITLE", "");
            commit("SET_ROLEID", "");
            const baseMenu = [{ chineseName: "主页", routerPath: "/main" }];
            commit("SET_TAGMENU", baseMenu);
            commit("SET_KEEPALIVE", []);
            sessionStorage.clear();
            resetRouter();
            commit("RESET_STATE");
            resolve();
        });
    },
    /**
     *
     * @param {获取侧边栏} param0
     */
    GenerateRoutes({ commit }) {
        return new Promise((resolve, reject) => {
            getRouteData()
                .then(response => {
                    const menus = creatMenu({ module: response.data.data });
                    const routeData = filterMenu(menus);
                    const route = [...Router.options.routes, ...routeData];
                    commit("SET_ROUTE", route);
                    resolve(routeData);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
};
export default {
    namespaced: true,
    state,
    mutations,
    actions
};