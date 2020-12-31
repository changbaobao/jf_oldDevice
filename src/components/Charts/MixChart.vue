<!--
 * @Author: your name
 * @Date: 2020-02-19 09:36:51
 * @LastEditTime: 2020-03-02 15:51:33
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \vue-admin-template-master\src\components\Charts\MixChart.vue
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
    chartOption: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartOption() {
      this.$nextTick(() => {
        if (this.chartOption) {
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
      const option = this.chartOption
      this.chart.setOption(
        option
      )
    }
  }
}
</script>
