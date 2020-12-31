<template>
    <div :id="id">
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
    chartData: {
      type: Array,
      default: () => []
    },
    columnColor: {
      type: String,
      default: '#4ad2ff'
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
    console.log(this.columnColor,'color---1-2-1-2-1-2-1----121')
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
        this.chart.clear()
        this.chart.setOption({
          grid: {
            left: '3%',
            bottom: '2%',
            top: '3%',
            right: '5%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
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
              show: false
            },
            data: this.chartData.map(item=>{item.name})
          },
          yAxis: {
            type: 'value',
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
          },
          series: [{
            data: this.chartData.map(item=>{item.value}),
            type: 'bar',
            itemStyle: {
              normal: {
                color: this.columnColor
              }
            }
          }]
        })
        // window.addEventListener('resize', () => {
        //   this.chart.resize()
        // })
      })
    }
  }
}
</script>
<style>

</style>
