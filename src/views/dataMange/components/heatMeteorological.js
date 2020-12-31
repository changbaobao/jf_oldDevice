export function getCurrentYear() {
  var myDate = new Date()
  var tYear = myDate.getFullYear()
  return tYear
}

/**
 *
 * @param {获取供暖概率echart配置} data
 */
export function initHeatOption(data) {
  var titleArr = []
  var seriesArr = []
  const colors = [
    ['#fd6f97', '#fed4e0']
  ]
  data.forEach(function (item, index) {
    titleArr.push({
      left: '50%',
      top: '65%',
      textAlign: 'center',
      textStyle: {
        fontWeight: 'normal',
        fontSize: '18',
        color: colors[index][0],
        textAlign: 'bottom'
      }
    })
    seriesArr.push({
      name: item.name,
      type: 'pie',
      clockWise: false,
      radius: [60, 70],
      itemStyle: {
        normal: {
          color: colors[index][0],
          shadowColor: colors[index][0],
          shadowBlur: 0,
          label: {
            show: false
          },
          labelLine: {
            show: false
          }
        }
      },
      hoverAnimation: false,
      center: ['50%', '50%'],
      data: [{
          value: item.value,
          label: {
            normal: {
              formatter: function (params) {
                const val = params.value
                if (val.indexOf('供暖') != -1) {
                  return val
                } else {
                  return val + '%'
                }
              },
              position: 'center',
              show: true,
              textStyle: {
                fontSize: '20',
                fontWeight: 'bold',
                color: colors[index][0]
              }
            }
          }
        },
        {
          value: 100 - item.value,
          name: 'invisible',
          itemStyle: {
            normal: {
              color: colors[index][1]
            },
            emphasis: {
              color: colors[index][1]
            }
          }
        }
      ]
    })
  })
  const chartOption = {
    backgroundColor: '#fff',
    title: titleArr,
    series: seriesArr
  }
  return chartOption
}

export function initHeatLevel(value) {
  const options = {
    title: {
      text: value,
      x: 'center',
      y: 'center',
      textStyle: {
        fontSize: 24,
        fontWeight: 'normal',
        color: '#203de0'
      }
    },

    series: [{
      type: 'pie',
      radius: ['60%', '70%'],
      // silent: true,
      labelLine: {
        show: false
      },
      data: [{
          hoverOffset: 1,
          value: 90,
          itemStyle: {
            normal: {
              color: '#87cffb'
            }
          },
          label: {
            show: false
          }
        },
        {
          markArea: {
            silent: true
          },
          value: 0,
          itemStyle: {
            normal: {
              color: '#203de0'
            }
          },
          label: {
            show: false
          }
        }
      ]
    }]
  }

  return options
}
