<template>
    <div :id="id" style="{height:height,width:width}">
    </div>
</template>
<script>
import echarts from 'echarts'
import 'echarts-liquidfill/src/liquidFill.js'
export default {
  props: {
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
    borderColor: {
      type: String,
      default: '#BEA315'
    },
    title: {
      type: String,
      default: '水'
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      QuillChart: null
    }
  },
  watch: {
    value: function () {
      this.$nextTick(() => {
        if (this.value) {
          this.initChart()
        }
      })
    }
  },
  mounted () {
    this.initChart()
  },
  beforeDestroy () {
    if (this.QuillChart) {
      this.QuillChart.clear()
    }
  },
  methods: {
    initChart () {
      this.$nextTick(() => {
        this.QuillChart = echarts.init(document.getElementById(this.id))
        var option = {
          title: {
            text: this.title,
            top: 0,
            left: 0,
            textStyle: { // 设置主标题风格
              color: this.borderColor, // 设置主标题字体颜色
              fontSize: '16' // 主标题文字风格
            }
          },
          series: [{
            type: 'liquidFill',
            radius: '80%',
            data: this.value,
            center: ['50%', '50%'],
            itemStyle: {
              color: this.borderColor
            },
            backgroundStyle: {
              borderColor: '#156ACF',
              borderWidth: 0,
              shadowColor: 'rgba(0, 0, 0, 0.4)',
              shadowBlur: 20
            },
            outline: {
              borderDistance: 2,
              itemStyle: {
                borderWidth: 5,
                borderColor: this.borderColor
              }
            },
            label: {
              normal: {
                textStyle: {
                  fontSize: 16,
                  color: '#000'
                }
              }
            }
          }]
        }
        this.QuillChart.setOption(option)
        window.addEventListener('resize', () => {
          this.QuillChart.resize()
        })
      })
    }
  }
}
</script>
<style scoped>

</style>
