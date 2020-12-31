/**
 * Created by PanJiaChen on 16/11/18.
 */
/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result

    const later = function() {
        // 据上一次触发时间间隔
        const last = +new Date() - timestamp

        // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last)
        } else {
            timeout = null
                // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args)
                if (!timeout) context = args = null
            }
        }
    }

    return function(...args) {
        context = this
        timestamp = +new Date()
        const callNow = immediate && !timeout
            // 如果延时不存在，重新设定延时
        if (!timeout) timeout = setTimeout(later, wait)
        if (callNow) {
            result = func.apply(context, args)
            context = args = null
        }

        return result
    }
}
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
            time = parseInt(time)
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key]
            // Note: getDay() returns 0 on Sunday
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
        return value.toString().padStart(2, '0')
    })
    return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
    if (('' + time).length === 10) {
        time = parseInt(time) * 1000
    } else {
        time = +time
    }
    const d = new Date(time)
    const now = Date.now()

    const diff = (now - d) / 1000

    if (diff < 30) {
        return '刚刚'
    } else if (diff < 3600) {
        // less 1 hour
        return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
        return '1天前'
    }
    if (option) {
        return parseTime(time, option)
    } else {
        return (
            d.getMonth() +
            1 +
            '月' +
            d.getDate() +
            '日' +
            d.getHours() +
            '时' +
            d.getMinutes() +
            '分'
        )
    }
}

/**
 *
 * @param {计算今天 明天后天 昨天前天} AddDayCount
 * getDateStr(-2); // 前天： 2018-09-11
 * getDateStr(-1); // 昨天： 2018-09-12
 * getDateStr(0);  // 今天： 2018-09-13
 * getDateStr(1);  // 明天： 2018-09-14
 * getDateStr(2);  // 后天： 2018-09-15
 */
export function  getDateStr(AddDayCount) {
    var dd = new Date()
    dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
    var y = dd.getFullYear()
    var m = dd.getMonth() + 1 // 获取当前月份的日期
    var d = dd.getDate()
    return y + '-' + (m < 10 ? '0' + m : m) + '-' + d
}

// 去除重复的children
export function IterationDelateMenuChildren(arr) {
    if (arr.length) {
        for (const i in arr) {
            if (arr[i].children.length) {
                IterationDelateMenuChildren(arr[i].children)
            } else {
                delete arr[i].children
            }
        }
    }
    return arr
}
/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
    const search = url.split('?')[1]
    if (!search) {
        return {}
    }
    return JSON.parse(
        '{"' +
        decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
        '"}'
    )
}

/**
 * 次联选择器（根据给定的值获取级联关系数组）
 */

export function getTreeDeepArr(key, treeData) {
    const arr = [] // 在递归时操作的数组
    let returnArr = [] // 存放结果的数组
    let depth = 0 // 定义全局层级
        // 定义递归函数
    function childrenEach(childrenData, depthN) {
        for (var j = 0; j < childrenData.length; j++) {
            depth = depthN // 将执行的层级赋值 到 全局层级
            arr[depthN] = (childrenData[j].id)
            if (childrenData[j].id == key) {
                // returnArr = arr; // 原写法不行, 因 此赋值存在指针关系
                returnArr = arr.slice(0, depthN + 1) // 将目前匹配的数组，截断并保存到结果数组，
                break
            } else {
                if (childrenData[j].children) {
                    depth++
                    childrenEach(childrenData[j].children, depth)
                }
            }
        }
        return returnArr
    }
    return childrenEach(treeData, depth)
}
// 保留几位小数

export function isDot(num, len) {
    if (num == undefined || num == null || num == NaN) {
        return num
    }
    var result = (num.toString()).indexOf('.')
    if (result != -1) {
        //  判断小数点位数
        const wShu = num.toString().split('.')[1].length
        if (wShu > len) {
            return num.toFixed(len)
        } else {
            return num
        }
    } else {
        return num
    }
}

export function getTreeDeepArr1(key, treeData) {
    const arr = [] // 在递归时操作的数组
    let returnArr = [] // 存放结果的数组
    let depth = 0 // 定义全局层级
        // 定义递归函数
    function childrenEach1(childrenData, depthN) {
        for (var j = 0; j < childrenData.length; j++) {
            depth = depthN // 将执行的层级赋值 到 全局层级
            arr[depthN] = (childrenData[j].label)
            if (childrenData[j].label == key) {
                // returnArr = arr; // 原写法不行, 因 此赋值存在指针关系
                returnArr = arr.slice(0, depthN + 1) // 将目前匹配的数组，截断并保存到结果数组，
                break
            } else {
                if (childrenData[j].children) {
                    depth++
                    childrenEach1(childrenData[j].children, depth)
                }
            }
        }
        return returnArr
    }
    return childrenEach1(treeData, depth)
}

export function deepCloneEs6(obj) {
    var proto = Object.getPrototypeOf(obj)
    return Object.assign({}, Object.create(proto), obj)
}

export function creatTree(module) {
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
}

export function array_diff(a, b) {
    for (var i = 0; i < b.length; i++) {
        for (var j = 0; j < a.length; j++) {
            if (a[j] === b[i]) {
                a.splice(j, 1)
                j = j - 1
            }
        }
    }
    return a
}
/**
 *
 * 求两个日期之间的所有日期
 */
export function getBetweenDateStr(start, end) {
    var result = []
    var beginDay = start.split('-')
    var endDay = end.split('-')
    var diffDay = new Date()
    var dateList = new Array()
    var i = 0
    diffDay.setDate(beginDay[2])
    diffDay.setMonth(beginDay[1] - 1)
    diffDay.setFullYear(beginDay[0])
    result.push(start)
    while (i == 0) {
        var countDay = diffDay.getTime() + 24 * 60 * 60 * 1000
        diffDay.setTime(countDay)
        dateList[2] = diffDay.getDate()
        dateList[1] = diffDay.getMonth() + 1
        dateList[0] = diffDay.getFullYear()
        if (String(dateList[1]).length == 1) { dateList[1] = '0' + dateList[1] }
        if (String(dateList[2]).length == 1) { dateList[2] = '0' + dateList[2] }
        result.push(dateList[0] + '-' + dateList[1] + '-' + dateList[2])
        if (dateList[0] == endDay[0] && dateList[1] == endDay[1] && dateList[2] == endDay[2]) {
            i = 1
        }
    }
    return result
}

/**
 * 计算两个日期相差天数
 */
export function GetDateDiff(startDate, endDate) {
    var startTime = new Date(Date.parse(startDate.replace(/-/g, '/'))).getTime()
    var endTime = new Date(Date.parse(endDate.replace(/-/g, '/'))).getTime()
    var dates = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24)
    return dates
}

/**
 *
 * @param {下划线转为驼峰} name
 */
export function toHump(name) {
    return name.replace(/\_(\w)/g, function(all, letter) {
        return letter.toUpperCase()
    })
}
/**
 * 昨天或前天的前七天
 *
 */
export function preSevenDate() {
    const now = new Date()
    const min = now.getMinutes() // 当前几分
    const hour = now.getHours()
    if (hour > 11 && min > 5) { // 昨天
        return getDateStr(-7) // 昨天
    } else {
        return getDateStr(-8) // 前天
    }
}
/**
 *
 * @param {*默认当前时间} arr
 * 11点05之前前天
 */
export function currentDefaultTime() {
    function  getDateStr(AddDayCount) {
        var dd = new Date()
        dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
        var y = dd.getFullYear()
        var m = dd.getMonth() + 1 // 获取当前月份的日期
        var d = dd.getDate()
        return y + '-' + (m < 10 ? '0' + m : m) + '-' + d
    }
    const now = new Date()
    const min = now.getMinutes() // 当前几分
    const hour = now.getHours()
    if (hour > 11 && min > 5) {
        return getDateStr(-1) // 昨天
    } else {
        return getDateStr(-2) // 前天
    }
}

/**
 *
 * @param {根据对应属性排序} arr
 * @param {*} property
 */
export function sortBy(arr, property) {
    arr.sort(function(a, b) {
        return b[property] - a[property]
    })
    return arr
}

/**
 * 数组中最大值
 */
export function arrMaxNum(arr) {
    return Math.max.apply(null, arr)
}
export function arrMinNum(arr) {
    return Math.min.apply(null, arr)
}
export function arrAverageNum(array) {
    let ave = 0
    for (var i = 0; i < array.length; i++) {
        ave += Number(array[i])
    }

    return ave / array.length
}