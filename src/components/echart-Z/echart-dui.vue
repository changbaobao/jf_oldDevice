<template>
  <div
    :id="id"
    :style="{height:height,width:width}"
  >
  </div>
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
    energyCompare: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    energyCompare: function() {
      this.$nextTick(() => {
        if (this.energyCompare) {
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
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById(this.id));
      let Data17 = this.get17Data();
      let max17 = Math.max.apply(null, Data17);
      let min17 = Math.min.apply(null, Data17);
      let Data16 = this.get16Data();
      let max16 = Math.max.apply(null, Data16);
      let min16 = Math.min.apply(null, Data16);
      let Data18 = this.get18Data();
      let max18 = Math.max.apply(null, Data18);
      let min18 = Math.min.apply(null, Data18);
      let maxVal = Math.max(max16, max17, max18);
      let minVal = Math.min(min16, min17, min18);
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          orient: "horizontal",
          icon: "stack",
          top: "2%",
          right: "2%",
          itemWidth: 10,
          itemHeight: 10,
          data: this.getTitleData(),
          textStyle: { color: "#B3B2BA ", fontSize: 12 }
        },
        grid: {
          left: "8%",
          right: "3%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.getXdata(),
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
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "MJ/℃·d·m²",
            nameTextStyle: {
              color: "#fff",
              fontSize: 12
            },
            min: minVal - 0.2,
            max: maxVal + 0.2,
            interval: (maxVal + 0.2 - (minVal - 0.2)) / 5,
            axisLabel: {
              show: true,
              formatter: function(value, index) {
                return value.toFixed(2);
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
            name: this.getTitleData()[0],
            type: "line",
            areaStyle: { normal: {} },
            itemStyle: {
              normal: {
                color: "#F57474",
                lineStyle: {
                  color: "#F57474",
                  width: 1
                }
              }
            },
            data: this.get18Data()
          },
          {
            name: this.getTitleData()[1],
            type: "line",
            areaStyle: { normal: {} },
            // 渐变
            itemStyle: {
              normal: {
                color: "#56D0E3",
                lineStyle: {
                  color: "#56D0E3",
                  width: 1
                }
              }
            },
            data: this.get17Data()
          },
          {
            name: this.getTitleData()[2],
            type: "line",
            areaStyle: { normal: {} },
            itemStyle: {
              normal: {
                color: "#8B78F6",
                lineStyle: {
                  color: "#8B78F6",
                  width: 1
                }
              }
            },
            data: this.get16Data()
          }
        ]
      };
      this.chart.setOption(option);
    },
    getTitleData() {
      if (this.energyCompare.length !== 0) {
        let arr = this.energyCompare.map(item => {
          return item.GongNuanji;
        });
        return arr;
      } else {
        return [];
      }
    },
    getXdata() {
      let arr = [];
      if (this.energyCompare.length !== 0) {
        this.energyCompare[0][0].forEach(item => {
          arr.push(item.DateList);
        });
      }
      return arr;
    },
    get18Data() {
      let arr = [];
      if (this.energyCompare.length !== 0) {
        this.energyCompare[0][0].forEach(item => {
          arr.push(item.WanCheng);
        });
      }
      return arr;
    },
    get17Data() {
      let arr = [];
      if (this.energyCompare.length !== 0) {
        this.energyCompare[1][1].forEach(item => {
          arr.push(item.WanCheng);
        });
      }
      return arr;
    },
    get16Data() {
      let arr = [];
      if (this.energyCompare.length !== 0) {
        this.energyCompare[2][2].forEach(item => {
          arr.push(item.WanCheng);
        });
      }
      return arr;
    }
  }
};
</script>
<style>
</style>
