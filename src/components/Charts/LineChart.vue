<template>
  <div
    :id="id"
    :class="className"
    :style="{height:height,width:width}"
  />
</template>

<script>
import echarts from "echarts";
import resize from "./mixins/resize";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    id: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "200px"
    },
    height: {
      type: String,
      default: "200px"
    },
    resultData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    resultData() {
      this.$nextTick(() => {
        if (this.resultData) {
          this.initChart();
        }
      });
    }
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));
      var myColor = [
        "#437FF1",
        "#34da62",
        "#34da62",
        "#34da62",
        "#d0a00e",
        "#d0a00e",
        "#FF0000"
      ];
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "5%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            axisLabel: {
              textStyle: {
                fontSize: 14,
                color: "#fff"
              }
            },
            axisLine: {
              lineStyle: {
                color: "#fff"
              }
            },
            data: ["<18", 19, 20, 21, 22, 23, ">24"].map(item => {
              return item + "℃";
            })
          }
        ],
        yAxis: {
          type: "value",
          name: "(户数)",
          nameTextStyle: {
            color: "#fff",
            fontSize: 14
          },
          axisLabel: {
            textStyle: {
              fontSize: 12,
              color: "#FFFFFF"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#fff"
            }
          }
        },
        series: [
          {
            name: "户数",
            type: "bar",
            barWidth: "60%",
            data: this.resultData,
            itemStyle: {
              normal: {
                color: function(params) {
                  // var num = myColor.length
                  return myColor[params.dataIndex];
                }
              }
            }
          }
        ]
      };
      this.chart.setOption(option);
    }
  }
};
</script>
