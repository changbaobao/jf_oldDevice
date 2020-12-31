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
    chartTitle: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '240px'
    },
    chartData: {
      type: Array,
      default: () => []
    },
    colorList: {
      type: Array,
      default: () => [
        '#ff2600',
        '#ffc000',
        '#00ad4e',
        '#0073c2' ]
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
        let that = this
        this.chart = echarts.init(document.getElementById(this.id))
        this.chart.setOption(
          {
            title: {
              text: this.chartTitle
            },
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              data: this.chartData.map(item => { return item._id })
            },
            yAxis: {
              type: 'value',
              minInterval: 1
            },
            series: [{
              data: this.chartData.map(item => { return item.deiveTypenum }),
              type: 'bar',
              itemStyle: {
                normal: {
                  color: function (params) {
                    // build a color map as your need.
                    var colorList = that.colorList
                    return colorList[params.dataIndex]
                  },
                  label: {
                    show: false,
                    position: 'top',
                    formatter: '{c}%'
                  }
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
