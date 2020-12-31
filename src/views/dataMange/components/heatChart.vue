<template>
    <div :id="id" :style="{height:height,width:width}">
    </div>
</template>
<script>
import echarts from 'echarts'
export default {
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
      default: '240px'
    },
    color: {
      type: Array,
      default: ['#437FF1', '#ECCF39', '#CC55F5']
    },
    name: {
      type: String,
      default: '123'
    },
    pieData: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    pieData () {
      this.$nextTick(() => {
        if (this.pieData) {
          this.initChart()
        }
      })
    }
  },
  data () {
    return {
      chart: null
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
        this.chart = echarts.init(document.getElementById(this.id))
        this.chart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          color: this.color,
          series: [
            {
              type: 'pie',
              name: this.name,
              radius: '55%',
              center: ['50%', '40%'],
              labelLine: {// 取消线
                normal: {
                  show: false
                }
              },
              label: {// 去掉文字
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '16',
                    fontWeight: 'bold'
                  }
                }
              },
              data: this.pieData,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        })
        window.addEventListener('resize', () => {
          this.chart.resize()
        })
      })
    }
  }
}
</script>
<style>

</style>
