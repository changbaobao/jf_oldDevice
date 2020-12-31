/*
 * @Author: your name
 * @Date: 2020-02-20 22:18:53
 * @LastEditTime: 2020-02-20 22:19:57
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \vue-admin-template-master\src\utils\creatTree.js
 */
const creatTree = (module) => {
    let DG = {}
    DG = module.slice()
    const tree = []
    for (let i = 0; i < DG.length; i++) {
        if (DG[i].parentId == '0') {
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
                        DG.splice(j, 1)
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
export default { creatTree }