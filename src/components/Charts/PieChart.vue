<!--
 * @Author: your name
 * @Date: 2020-02-21 15:31:51
 * @LastEditTime: 2020-03-05 10:43:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-admin-template-master\src\components\Charts\PieChart.vue
 -->
<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    seriesData: {
      type: Array,
      default() {
        return []
      }
    },
    legendColor: {
      type: String,
      default: '#333'
    },
    colorList: {
      type: Array,
      default() {
        return ['#ee4e40', '#f29200', '#01e1e3']
      }
    },
    legendTitle: {
      type: Array,
      default() {
        return ['鹤其', '鹤煤']
      }
    },
    titleText: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    seriesData() {
      this.$nextTick(() => {
        if (this.seriesData) {
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
      this.chart = echarts.init(document.getElementById(this.id))
      const option = {
        title: {
          text: this.titleText
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        color: this.colorList,
        legend: {
          orient: 'vertical',
          bottom: 10,
          icon: 'rect',
          itemWidth: 10,
          itemHeight: 10,
          left: 'center',
          textStyle: { color: this.legendColor },
          data: this.legendTitle
        },
        series: this.seriesData
      }
      this.chart.setOption(option)
    }
  }
}
</script>
