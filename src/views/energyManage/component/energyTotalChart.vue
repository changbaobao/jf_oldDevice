<!--
 * @Author: your name
 * @Date: 2020-02-06 16:24:13
 * @LastEditTime: 2020-03-05 10:00:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MicroUI-use\src\views\energyManage\component\energyTotalChart.vue
 -->
<template>
  <div :id="id" :style="{height:height,width:width}" />
</template>
<script>
import echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'

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
    barColor: {
      type: String,
      default: '#eb2100'
    },
    colorList: {
      type: Array,
      default: () => [
        '#ee4e40',
        '#f2655b',
        '#01e1e3']
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData() {
      this.$nextTick(() => {
        if (this.chartData) {
          this.initChart()
        }
      })
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.$nextTick(() => {
        // 基于准备好的dom，初始化echarts实例
        this.chart = echarts.init(document.getElementById(this.id))
        const myColor = ['#ee4e40', '#f29200', '#01e1e3']
        const seriesData = []
        this.chartData.map((item, index) => {
          seriesData.push({
            name: item.name,
            type: 'bar',
            data: [item.data],
            color: myColor[index]
          })
        })
        this.chart.setOption(
          {
            title: {
              text: this.chartTitle
            },
            tooltip: {
              trigger: 'axis'
            },
            grid: {
              left: '2%',
              right: '2%',
              bottom: '3%',
              containLabel: true
            },
            legend: {
              icon: 'rect',
              itemWidth: 12,
              itemHeight: 12
            },
            xAxis: {
              type: 'category'
            },
            yAxis: {
              name: '热量(GJ)',
              type: 'value'
            },
            series: seriesData
          })
      })
    }
  }
}
</script>
<style>

</style>
