<!--
 * @Author: your name
 * @Date: 2020-01-13 11:04:16
 * @LastEditTime: 2020-02-19 14:28:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MicroUI-use\src\views\householdRegulation\component\historyChartDialog.vue
 -->
<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="60%"
    @close="closeDialog"
  >
    <el-form
      ref="historyForm"
      :inline="true"
      :model="historyForm"
      class="demo-form-inline"
    >
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="historyForm.saveStartDate"
          type="datetime"
          style="width:200px;"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="historyForm.saveEndData"
          type="datetime"
          style="width:200px;"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="historySearch">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="charts">
      <div id="main" ref="houseCharts" style="width:100%;height:360px;" />
    </div>
  </el-dialog>
</template>
<script>
import echarts from "echarts";
import { parseTime } from "@/utils/index";
import Qs from "qs";
export default {
  props: {
    isShow: Boolean,
    dialogRow: Object
  },
  data() {
    return {
      dialogVisible: this.isShow,
      dialogTitle: "",
      historyForm: {
        saveStartDate: "",
        saveEndData: parseTime(new Date(), "{y}-{m}-{d} {h}:{i}:{s}"),
        NewTenantsId: this.dialogRow.id
      },
      historyData: {}
    };
  },
  mounted() {
    const curDate = new Date();
    const Date2 = new Date(curDate.getTime() - 24 * 60 * 60 * 1000);
    this.historyForm.saveStartDate = parseTime(
      Date2,
      "{y}-{m}-{d} {h}:{i}:{s}"
    );
    this.$nextTick(() => {
      const row = this.dialogRow;
      this.dialogTitle = `历史查询（${row.houseId} ${row.communityName} ${
        row.addressOne
      }）`;
    });
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    /**
     * 历史查询
     */
    historySearch() {
      this.$nextTick(() => {
        const barChart = this.$refs.houseCharts;
        if (barChart) {
          var myChart = echarts.init(document.getElementById("main"));
        }
        myChart.showLoading({
          text: "正在加载数据"
        });
        this.$http
          .post("/S-House/listHistory", Qs.stringify(this.historyForm))
          .then(res => {
            if (res.data.success) {
              this.historyData = res.data.data;
              for (const i in this.historyData) {
                this.historyData[i].sort(function(a, b) {
                  return a.saveDate - b.saveDate;
                });
              }
              myChart.hideLoading();
              var option = {
                title: {
                  text: "历史数据"
                },
                tooltip: {
                  trigger: "axis"
                },
                toolbox: {
                  show: true
                },
                xAxis: {
                  type: "category",
                  boundaryGap: false,
                  data: this.getXData()
                },
                yAxis: {
                  type: "value",
                  max: function(value) {
                    return value.max + 3;
                  },
                  min: function(value) {
                    return value.min - 3;
                  },
                  splitNumber: 8,
                  axisLabel: {
                    formatter: function(value, index) {
                      return value.toFixed(2);
                    }
                  },
                  splitLine: {
                    show: false
                  }
                },
                series: this.getSeriesData()
              };
              myChart.setOption(option, true);
            } else {
              myChart.hideLoading();
            }
          });
        window.onresize = myChart.resize;
      });
    },
    getName() {
      const arr = this.historyData.map(item => {
        return item.paramName;
      });
      return arr;
    },
    getXData() {
      for (const i in this.historyData) {
        const item = this.historyData[i];
        const arr = item.map(item => {
          return parseTime(item.saveDate, "{y}-{m}-{d} {h}:{i}");
        });

        return arr;
      }
    },
    getSeriesData() {
      const arr = [];
      for (const i in this.historyData) {
        const data = this.historyData[i].map(item => {
          return item.value;
        });
        arr.push({
          name: i,
          type: "line",
          data: data,
          markPoint: {
            data: [
              { type: "max", name: "最大值" },
              { type: "min", name: "最小值" }
            ]
          }
        });
      }
      console.log(arr, "123131");
      return arr;
    }
  }
};
</script>
<style scoped></style>
