<template>
    <div>
         <div id="weatherEchart" style="width:100%;height:100px;"></div>
    </div>
</template>
<script>
import echarts from 'echarts'
export default {
  props: {
    chartData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      barChart: null
    }
  },
  created () {

  },
  watch: {
    chartData: function () {
      this.$nextTick(() => {
        if (this.chartData) {
          this.initChart()
        }
      })
    }
  },
  beforeDestroy () {
    if (this.barChart) {
      this.barChart.clear()
    }
  },
  mounted () {
    this.initChart()
  },
  methods: {
    initChart () {
      this.$nextTick(() => {
        const data = this.chartData
        // 基于准备好的dom，初始化echarts实例
        this.barChart = echarts.init(document.getElementById('weatherEchart'))
        this.barChart.setOption({
          grid: {
            left: '0',
            right: '0',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            show: false
          },
          yAxis: {
            type: 'value',
            show: false
          },
          series: [{
            data: data,
            type: 'line',
            symbol: 'circle', // 折线点设置为实心点
            symbolSize: 8, // 折线点的大小
            itemStyle: {
              normal: {
                label: {show: true, formatter: '{c}°C', color: '#fff' },
                color: 'rgb(246, 130, 39)', // 折线点的颜色
                lineStyle: {
                  color: 'rgb(246, 130, 39)'// 折线的颜色
                }
              }
            }
          }]
        })

        window.addEventListener('resize', () => {
          this.barChart.resize()
        })
      })
    }
  }
}
</script>
<style>

</style>
