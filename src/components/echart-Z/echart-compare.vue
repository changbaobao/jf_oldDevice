<template>
  <div :id="id" :style="{ height: height, width: width }"></div>
</template>
<script>
import echarts from "echarts";
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
    value: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    value() {
      this.$nextTick(() => {
        if (this.value) {
          this.initChart();
        }
      });
    }
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
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
        let option = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          legend: {
            orient: "horizontal",
            icon: "rect",
            top: "2%",
            right: "2%",
            itemWidth: 10,
            itemHeight: 10,
            textStyle: { color: "#B3B2BA ", fontSize: 12 }
          },
          grid: {
            left: "3%",
            right: "10%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: {
            type: "value",
            boundaryGap: [0, 0.01],
            axisLabel: {
              show: true,
              textStyle: {
                color: "#fff"
              },
              formatter: "{value} m³"
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
          },
          yAxis: {
            type: "category",
            data: this.getYData(),
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
              show: true,
              lineStyle: {
                color: "#61688B"
              }
            }
          },
          series: this.getSeries()
        };
        this.chart.setOption(option);
      });
    },
    getYData() {
      let arr = Object.keys(this.value);
      let arr1 = [];
      let arr2 = [];
      arr.map(item => {
        if (item > "10月") {
          arr1.push(item);
        } else {
          arr2.push(item);
        }
      });
      let arrRes1 = arr1.sort();
      let arrRes2 = arr2.sort();
      return arrRes1.concat(arrRes2);
    },
    getSeriesData() {
      let dataY = this.getYData();
      let Actual = [];
      let indexA = [];
      for (let i in dataY) {
        for (let key in this.value) {
          if (key == dataY[i]) {
            Actual.push(this.value[key].Actual);
            indexA.push(this.value[key].index);
          }
        }
      }
      return { Actual, indexA };
    },
    getSeries() {
      let Actual = this.getSeriesData()["Actual"];
      let arr = this.getSeriesData()["indexA"];

      let resultArr = [];
      resultArr.push(
        {
          name: "实耗值",
          type: "bar",
          itemStyle: {
            normal: {
              color: "#A11111"
            }
          },
          data: Actual
        },
        {
          name: "指标值",
          type: "bar",
          itemStyle: {
            normal: {
              color: "#2090DA"
            }
          },
          data: arr
        }
      );
      return resultArr;
    }
  }
};
</script>
<style></style>
