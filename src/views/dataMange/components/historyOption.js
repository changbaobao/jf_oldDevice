/*
 * @Author: your name
 * @Date: 2020-01-07 13:52:54
 * @LastEditTime: 2020-02-19 13:19:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MicroUI-use\src\views\dataMange\components\historyOption.js
 */
import {
  parseTime
} from '@/utils/index'

export function getBeforeDate(n) {
  var d = new Date()
  var year = d.getFullYear()
  var mon = d.getMonth() + 1
  var day = d.getDate()
  if (day <= n) {
    if (mon > 1) {
      mon = mon - 1
    } else {
      year = year - 1
      mon = 12
    }
  }
  d.setDate(d.getDate() - n)
  year = d.getFullYear()
  mon = d.getMonth() + 1
  day = d.getDate()
  const hh = (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + ':'
  const mm = (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) + ':'
  const ss = (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds())
  const s = year + '-' + (mon < 10 ? ('0' + mon) : mon) + '-' + (day < 10 ? ('0' + day) : day)
  return s + ' ' + hh + mm + ss
}

export function chartOption(data, tags, chartData, min, max) {
  const min1 = Math.floor(min)
  const max1 = Math.ceil(max)
  const options = {
    legend: [{
      top: 10,
      data: tags.map(item => {
        return item.dataName
      })
    }],
    grid: {
      top: '15%',
      left: '3%',
      right: '4%',
      bottom: '12%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis'
    },
    dataZoom: [{
      type: 'inside',
      start: 0
    }, {
      start: 0,
      handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      handleSize: '80%',
      handleStyle: {
        color: '#fff',
        shadowBlur: 3,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffsetX: 2,
        shadowOffsetY: 2
      }
    }],
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(item => {
        item.dt = parseTime(item.dt, '{y}-{m}-{d} {h}:{i}')
        return item.dt
      })
    },
    yAxis: {
      type: 'value',
      min: min1,
      max: max1,
      splitNumber: 8,
      axisLabel: {
        formatter: function (value, index) {
          return value.toFixed(2)
        }
      }
    },
    series: chartData
  }
  return options
}

// y轴最大值和最小值
// export function getMaxMin(chartData) {
//   const maxarry = []
//   const minarry = []
//   for (let index = 0; index < chartData.length; index++) {
//     const element = chartData[index].data
//     for (var i = 0; i < element.length; i++) {
//       if (element[i] === '' || element[i] === null || typeof (element[i]) === 'undefined') {
//         element.splice(i, 1)
//         i = i - 1
//       }
//     }
//     const max = Math.max(...element)
//     const min = Math.min(...element)
//     maxarry.push(max)
//     minarry.push(min)
//   }
//   const max1 = Math.max(...maxarry)
//   const min1 = Math.min(...minarry)
//   return {
//     max: max1,
//     min: min1
//   }
// }
