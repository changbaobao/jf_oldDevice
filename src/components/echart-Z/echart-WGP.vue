<template>
  <div :id="id" style="{height:height,width:width}"></div>
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
    title: {
      type: String,
      default: "水"
    },
    borderColor: {
      type: String,
      default: ""
    },
    value: {
      type: String | Number,
      default: "#6959CD"
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    value: function() {
      this.$nextTick(() => {
        if (this.value) {
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
        this.chart = echarts.init(document.getElementById(this.id));
        var rate = this.value;
        var linear_color = {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: this.borderColor
            },
            {
              offset: 1,
              color: "#ede0ff"
            }
          ]
        };
        var option = {
          title: {
            text: this.title,
            textStyle: {
              color: this.borderColor,
              fontSize: 14
            },
            left: "center",
            bottom: "20%"
          },
          series: [
            {
              type: "pie",
              hoverAnimation: false,
              radius: ["79%", "80%"],
              startAngle: 225,
              labelLine: {
                show: false
              },
              data: [
                {
                  value: rate * 270,
                  label: {
                    normal: {
                      show: true,
                      position: "center",
                      formatter: (rate * 100).toFixed(2) + "%",
                      textStyle: {
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "bold"
                      }
                    }
                  },
                  itemStyle: {
                    normal: {
                      borderColor: linear_color,
                      borderWidth: 10
                    }
                  }
                },
                {
                  value: 270 - rate * 270,
                  itemStyle: {
                    normal: {
                      borderColor: "rgba(250,250,250,1)",
                      borderWidth: 5
                    }
                  }
                },
                {
                  value: 90,
                  itemStyle: {
                    normal: {
                      color: "rgba(0,0,0,0)"
                    }
                  }
                }
              ]
            }
          ]
        };

        this.chart.setOption(option);
      });
    }
  }
};
</script>
<style scoped></style>
