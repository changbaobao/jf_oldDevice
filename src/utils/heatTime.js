/*
 * @Author: your name
 * @Date: 2020-02-19 15:33:42
 * @LastEditTime: 2020-02-20 20:28:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-admin-template-master\src\utils\heatTime.js
 */
import { parseTime } from '@/utils/index'
var energy = {
    /**
     * 计算本季度供暖时间占比
     *
     */
    DateDiff: function(sDate1, sDate2) { // sDate1和sDate2是2017-9-25格式
        var aDate, oDate1, oDate2, iDays
        aDate = sDate1.split('-')
        oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) // 转换为9-25-2017格式
        aDate = sDate2.split('-')
        oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
        iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) // 把相差的毫秒数转换为天数
        return iDays
    },
    comTime: function() {
        const timeTotal = energy.DateDiff('2018-11-07', '2019-03-15') // 总供暖时间
        const currentTime = parseTime(new Date(), '{y}-{m}-{d}') // 当前时间
        const timeB = energy.DateDiff('2018-11-07', currentTime)
        return parseInt(timeB / timeTotal * 100)
    },
    compare: function(property) {
        return function(a, b) {
            return (a[property] - b[property])
        }
    },
    /**
     * 查询对应id值
     *
     */
    filterId: function(data, id) {
        return data.find(item => {
            return item._id === id
        })
    },
    // 保留几位小数

    isDot: function(num, len) {
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

}

export default energy