<template>
  <div class="kfScreenFull bg" style="overflow:hidden">
    <div
      class="energyRank pad10"
      style="width:100%;height:100%;box-sizing: border-box;"
    >
      <div class="top-search">
        <el-form
          :inline="true"
          :model="formInline"
          class="demo-form-inline m-t10"
          size="small"
        >
          <el-form-item>
            <el-cascader
              ref="cascader"
              v-model="projectVal"
              :options="options"
              :props="{
                expandTrigger: 'hover',
                checkStrictly: true,
                label: 'name',
                value: 'id',
                children: 'children'
              }"
              @change="handleCascaderChange"
            />
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="formInline.energyType"
              placeholder="选择能耗类型"
              style="width:150px;"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.groupType" placeholder="请选择">
              <el-option
                v-for="item in StationOptions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="formInline.YearTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            />
          </el-form-item>
          <!-- <el-form-item>
                        <el-select v-model="formInline.unilaterallyType" placeholder="请选择" style="width:150px;">
                            <el-option
                                v-for="item in danfangOptions"
                                :key="item"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item> -->
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="onSearch"
            />
          </el-form-item>
          <el-form-item class="fr">
            <span style="color:#fff;">
              <span
                class="tab-item"
                :class="{ active: currentIndex == 0 }"
                @click="toggleClass(0)"
                >图表</span
              >|
              <span
                class="tab-item"
                :class="{ active: currentIndex == 1 }"
                @click="toggleClass(1)"
                >表格</span
              >
            </span>
            <el-switch
              v-if="currentIndex == 0"
              v-model="lineValue"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleSwitchChange"
            />
          </el-form-item>
        </el-form>
      </div>
      <div
        v-if="currentIndex == 0"
        v-loading="loading"
        class="m-chart m-t10"
        element-loading-text="正在加载中，请等待..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <div
          id="chartMain"
          ref="chart"
          style="width:100%;height:calc(100% - 24px );"
        />
        <div v-if="tableData.length > 0">
          <p
            v-for="(item, index) in chartTitle"
            v-if="item.name == formInline.energyType"
            :key="index"
            style="line-height:24px;color:#fff;font-size:16px;"
          >
            <span class="m_r10">{{ item.unit }}</span>
            <span class="m_r10"
              >先进值
              <strong style="color:#00FF00;">{{
                item.advancedValue
              }}</strong></span
            >
            <span class="m_r10"
              >限定值
              <strong style="color:#FFFF00;">{{
                item.limitValue
              }}</strong></span
            >
            <span
              >准入值
              <strong style="color:#FF0000;">{{
                item.accessValue
              }}</strong></span
            >
          </p>
        </div>
      </div>
      <div
        v-if="currentIndex == 1"
        class="table diagnostic-table noBgWhiteTable m-t10"
      >
        <el-table
          :data="tableData"
          size="mini"
          stripe
          :height="tableHeight"
          :header-cell-style="{ 'background-color': '#06346B' }"
          style="width:100%;background:transparent;color:#fff;"
        >
          <el-table-column
            type="index"
            width="50"
            :index="indexMethod"
            label="排行"
          />
          <el-table-column
            v-for="item in tableTitle"
            :key="item.name"
            :prop="item.name"
            :label="item.data"
            :width="item.width"
            :formatter="item.formatter"
            align="center"
          />
          <el-table-column
            v-if="formInline.energyType == '水'"
            label="标准度日数的单位面积耗水量(GJ/㎡)"
            prop="danFangGasNum"
            align="center"
            :formatter="formatterT"
          />
          <el-table-column
            v-if="formInline.energyType == '电'"
            label="标准度日数的单位面积耗电量(GJ/㎡)"
            prop="danFangGasNum"
            align="center"
            :formatter="formatterT"
          />
          <el-table-column
            v-if="formInline.energyType == '热'"
            label="标准度日数的单位面积耗热量(GJ/㎡)"
            prop="danFangGasNum"
            align="center"
            :formatter="formatterT"
          />
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { sortBy, currentDefaultTime, isDot } from "@/utils/index";
import {
  energyRankName,
  energyRankTitle
} from "../../config/tableTitle/energyTitleName";
import echarts from "echarts";
import resize from "../../components/Charts/mixins/resize";
import Qs from "qs";
export default {
  mixins: [resize],
  name: "EnergyRanking",
  components: {},
  data() {
    return {
      currentIndex: 0,
      lineValue: false,
      chart: null,
      options: [],
      projectVal: [],
      formInline: {
        strId: "",
        energyType: "热",
        groupType: "项目",
        // unilaterallyType: '',
        YearTime: ""
      },
      loading: false,
      typeOptions: ["热", "水", "电"],
      StationOptions: ["项目", "分组"],
      danfangOptions: ["累计单方", "折算单方"],
      chartTitle: [],
      tableHeight: "100%",
      tableData: [],
      tableTitle: energyRankTitle,
      sliceData: []
    };
  },
  watch: {
    projectVal: {
      handler(newVal, oldVal) {
        if (this.$refs.cascader) {
          this.$refs.cascader.toggleDropDownVisible();
        }
      }
    }
  },
  created() {
    this.getTree();
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.clear();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.formInline.YearTime = currentDefaultTime();
    });
  },
  methods: {
    toggleClass(val) {
      this.currentIndex = val;
      this.initTableOrChart();
    },
    indexMethod(index) {
      return index + 1;
    },
    formatterT(row) {
      if (
        row.totalDanFang != null &&
        row.totalDanFang != 0 &&
        row.totalDuRiShu != null &&
        row.totalDuRiShu != 0
      ) {
        return isDot((row.totalDanFang / row.totalDuRiShu) * 1000, 4);
      } else {
        return 0;
      }
    },
    getTree() {
      this.$http.post("/S-Base/getTreeByRoleToJson").then(res => {
        if (res.data.success) {
          this.options = res.data.data;
          this.projectVal = new Array(this.options[0].id);
          this.$refs.cascader.toggleDropDownVisible();
          this.onSearch();
        }
      });
    },
    handleCascaderChange(val) {
      this.projectVal = val;
    },
    handleSwitchChange(val) {
      this.lineValue = val;
      this.initChart();
    },
    initChart() {
      this.$nextTick(() => {
        const lChart = this.$refs.chart;
        if (lChart) {
          this.chart = echarts.init(lChart);
          this.chart.clear();
          const option = {
            title: {
              text: "单方能耗排行",
              x: "center",
              textStyle: {
                color: "#fff", // 颜色
                fontStyle: "normal", // 风格
                fontWeight: "600", // 粗细
                fontFamily: "Microsoft yahei", // 字体
                fontSize: 20, // 大小
                align: "center" // 水平对齐
              }
            },
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "shadow"
              }
            },
            grid: {
              top: "20%",
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true
            },
            xAxis: {
              type: "value",
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
              }
            },
            yAxis: {
              type: "category",
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
            series: this.getSeries()
          };
          this.chart.setOption(option, true);
          // window.addEventListener('resize', () => {
          //   this.charts.resize()
          // })
        }
      });
    },
    getSeries() {
      if (this.lineValue == false) {
        const arr = [];
        const obj = {
          name: "单位",
          type: "bar",
          itemStyle: {
            normal: {
              color: "#409EFF"
            }
          }
        };
        obj.data = this.getValue();
        arr.push(obj);
        return arr;
      } else {
        const data = [
          {
            name: "单位",
            type: "bar",
            itemStyle: {
              normal: {
                color: "#409EFF"
              }
            }
          },
          {
            type: "line",
            name: "先进值",
            symbol: "none",
            itemStyle: {
              normal: {
                color: "#00FF00"
              }
            }
          },
          {
            type: "line",
            name: "限定值",
            symbol: "none",
            itemStyle: {
              normal: {
                color: "#FFFF00"
              }
            }
          },
          {
            type: "line",
            name: "准入值",
            symbol: "none",
            itemStyle: {
              normal: {
                color: "#FF0000"
              }
            }
          }
        ];
        data[0].data = this.getValue();
        data[1].data = this.getAdvancedValue("advancedValue");
        data[2].data = this.getAdvancedValue("limitValue");
        data[3].data = this.getAdvancedValue("accessValue");
        return data;
      }
    },
    getXData() {
      var resultList = [];
      if (this.sliceData.length == 1) {
        const arr = [this.sliceData[0].boilerName, ""];
        resultList = arr;
      } else {
        const arr = this.sliceData.map(item => {
          return item.boilerName;
        });
        resultList = arr;
      }
      return resultList.reverse();
    },
    /** 获取单位（值） */
    getValue() {
      const arr = this.sliceData.map(v => {
        return isDot(v.totalDanFang, 4);
      });
      return arr.reverse();
    },
    /**
     * 获取先进值
     */
    getAdvancedValue(property) {
      const obj = energyRankName.find(item => {
        return item.name === this.formInline.energyType;
      });
      const arr = [];
      if (this.sliceData.length == 1) {
        for (let i = 0; i < 2; i++) {
          arr.push(obj[property]);
        }
      } else {
        for (let i = 0; i <= this.sliceData.length - 1; i++) {
          arr.push(obj[property]);
        }
      }
      return arr;
    },
    /** * 点击查询 */
    onSearch() {
      this.loading = true;
      this.formInline.strId = this.projectVal[this.projectVal.length - 1];
      this.$http
        .post("/S-Energy-Task/getEnergyRanking", Qs.stringify(this.formInline))
        .then(res => {
          if (res.data.success) {
            if (res.data.data != null) {
              const Data = sortBy(res.data.data, "totalDanFang");
              this.tableData = Data;
            }
            this.initTableOrChart();
            this.loading = false;
          } else {
            this.loading = false;
            this.$notify.error({
              title: "错误",
              message: res.data.msg
            });
          }
        });
    },
    initTableOrChart() {
      if (this.currentIndex == 0) {
        this.sliceData = this.tableData.slice(0, 8);
        this.initChart();
        this.chartTitle = energyRankName;
      }
    }
  }
};
</script>
<style scoped>
.top-search {
  padding: 8px 10px 0 10px;
  /* background: rgba(4,22,61,0.60); */
  background: rgba(255, 255, 255, 0.2);
}
.energyConsumption {
  width: calc(100% - 20px);
  height: calc(100% - 20px);
}
.bg {
  background: url(../../assets/energy_bg.png);
  background-size: 100% 100%;
  height: 100%;
  width: 100%;
}
.m-chart {
  height: calc(100% - 80px);
}
.table {
  height: calc(100% - 10px);
}
</style>
