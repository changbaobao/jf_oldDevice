<template>
    <div :id="id" :style="{height:height,width:width}">
    </div>
</template>
<script>
import echarts from 'echarts'
import resize from '../Charts/mixins/resize'
export default {
  mixins: [resize],
  props: {
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '200px'
    },
    chartData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      chart: null
    }
  },
  watch: {
    chartData () {
      this.$nextTick(() => {
        if (this.chartData) {
          this.initChart()
        }
      })
    }
  },
  mounted () {
    this.initChart()
  },
  beforeDestroy () {
    if (this.chart) {
      this.chart.clear()
    }
  },
  methods: {
    initChart () {
      this.$nextTick(() => {
        // 基于准备好的dom，初始化echarts实例
        this.chart = echarts.init(document.getElementById(this.id))
        let avgData = this.getSeriesAvg()
        let SeriesData = this.getSeriesData()
        let avgMax = Math.max.apply(null, avgData)
        let avgMin = Math.min.apply(null, avgData)
        let dataMax = Math.max.apply(null, SeriesData)
        let dataMin = Math.min.apply(null, SeriesData)
        this.chart.setOption({
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            orient: 'horizontal',
            top: '2%',
            right: '2%',
            itemWidth: 10,
            itemHeight: 10,
            icon: 'rect',
            textStyle: {color: '#B3B2BA ', fontSize: 12}
          },
          grid: {
            left: '3%',
            right: '3%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#61688B'
              }
            },
            type: 'category',
            boundaryGap: false,
            data: this.getXdata()
          },
          yAxis: [{
            type: 'value',
            name: '达标率(%)',
            nameTextStyle: {
              color: '#fff',
              fontSize: 12
            },
            min: 0,
            max: 240,
            interval: 240 / 5,
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#61688B'
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#61688B'
              }
            }
          }, {
            type: 'value',
            min: avgMin - 10,
            max: avgMax + 10,
            interval: ((avgMax + 10) - (avgMin - 10)) / 5,
            axisLabel: {
              formatter: function (value, index) {
                return Math.ceil(value) + ' °C'
              },
              textStyle: {
                color: '#fff'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#61688B'
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#61688B'
              }
            }
          }],
          series: [
            {
              name: '达标率',
              type: 'line',
              itemStyle: {
                normal: {
                  color: '#F74C07', // 折线点的颜色
                  lineStyle: {
                    color: '#F74C07'// 折线的颜色
                  }
                }
              },
              data: this.getSeriesData()
            }, {
              name: '平均气温',
              type: 'line',
              yAxisIndex: 1,
              itemStyle: {
                normal: {
                  color: '#ECCF39', // 折线点的颜色
                  lineStyle: {
                    color: '#ECCF39'// 折线的颜色
                  }
                }
              },
              data: this.getSeriesAvg()
            }
          ]
        })
      
      })
    },
    getXdata () {
      let resultArr = []
      this.chartData.forEach(item => {
        resultArr.push(item.date)
      })
      return resultArr
    },
    getSeriesData () {
      let dataArr = []
      this.chartData.forEach(item => {
        dataArr.push(item.ComplianceRate)
      })
      return dataArr
    },
    getSeriesAvg () {
      let dataArr = []
      this.chartData.forEach(item => {
        dataArr.push(item.avgTemperature)
      })
      return dataArr
    }
  }
}
</script>
<style>

</style>
