<template>
  <div
    :id="id"
    :style="{height:height,width:width}"
  >
  </div>
</template>
<script>
import echarts from "echarts";
import { parseTime } from "@/utils/index";
import resize from "../Charts/mixins/resize";
export default {
  mixins: [resize],
  props: {
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
    EnergyConsumption: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chart: null,
      maxValue: 0,
      minValue: 0
    };
  },
  watch: {
    EnergyConsumption: function() {
      this.$nextTick(() => {
        if (this.EnergyConsumption) {
          this.initChart();
        }
      });
    }
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.clear();
    }
  },
  methods: {
    initChart() {
      this.$nextTick(() => {
        // 基于准备好的dom，初始化echarts实例
        this.chart = echarts.init(document.getElementById(this.id));
        let avgData = this.getAvgData();
        let avgMax = Math.max.apply(null, avgData);
        let avgMin = Math.min.apply(null, avgData);
        this.chart.setOption({
          tooltip: {
            trigger: "axis"
          },
          grid: {
            left: "3%",
            right: "3%",
            bottom: "3%",
            containLabel: true
          },
          legend: {
            orient: "horizontal",
            top: "2%",
            icon: "rect",
            right: "2%",
            itemWidth: 10,
            itemHeight: 10,
            data: ["平均气温", "预测燃气", "实际能耗"],
            textStyle: { color: "#B3B2BA ", fontSize: 12 }
          },
          xAxis: {
            type: "category",
            boundaryGap: true,
            min: 0,
            axisLabel: {
              show: true,
              textStyle: {
                color: "#fff"
              }
            },
            axisLine: {
              lineStyle: {
                color: "#61688B"
              }
            },
            splitLine: {
              show: false
            },
            data: this.getXData()
          },
          yAxis: [
            {
              type: "value",
              scale: true,
              axisLabel: {
                show: true,
                textStyle: {
                  color: "#fff"
                }
              },
              axisLine: {
                lineStyle: {
                  color: "#61688B"
                }
              }
            },
            {
              type: "value",
              min: avgMin - 10,
              max: avgMax + 10,
              interval: (avgMax + 10 - (avgMin - 10)) / 5,
              axisLabel: {
                formatter: function(value, index) {
                  return Math.ceil(value) + " °C";
                },
                textStyle: {
                  color: "#fff"
                }
              },
              axisLine: {
                lineStyle: {
                  color: "#61688B"
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "#61688B"
                }
              }
            }
          ],
          series: [
            {
              name: "平均气温",
              yAxisIndex: 1,
              type: "line",
              itemStyle: {
                normal: {
                  color: "#02DAFF", // 折线点的颜色
                  lineStyle: {
                    color: "#02DAFF" // 折线的颜色
                  }
                }
              },
              data: this.getAvgData()
            },
            {
              name: "预测燃气",
              type: "bar",
              itemStyle: {
                normal: {
                  color: "#675BFF"
                }
              },
              data: this.getForecastDaily()
            },
            {
              name: "实际能耗",
              type: "bar",
              itemStyle: {
                normal: {
                  color: "#94B9FF"
                }
              },
              data: this.getActual()
            }
          ]
        });
      });
    },
    getXData() {
      let dateArr = [];
      this.EnergyConsumption.forEach(item => {
        dateArr.push(parseTime(item.date, "{y}-{m}-{d}"));
      });
      return dateArr;
    },
    getAvgData() {
      let avgArr = [];
      this.EnergyConsumption.forEach(item => {
        avgArr.push(item.temAvg_YuCe);
      });
      return avgArr;
    },
    /*    * 预测 */
    getForecastDaily() {
      let avgArr = [];
      this.EnergyConsumption.forEach(item => {
        avgArr.push(item.jiYouWCDanFang_YuCe);
      });
      return avgArr;
    },
    /* * 实际能耗 */
    getActual() {
      let avgArr = [];
      this.EnergyConsumption.forEach(item => {
        avgArr.push(item.jiYouWCDanFang_ShiJi);
      });
      return avgArr;
    }
  }
};
</script>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 