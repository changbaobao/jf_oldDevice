<template>
  <div class="kfScreenFull bg energyDispaly">
    <div class="side-tree" :class="{ collopseW: hideSide }">
      <div class="left-tree">
        <el-scrollbar style="height:100%;">
          <el-tree
            ref="asideTree"
            class="tree-node"
            :props="props"
            :load="loadNode"
            :default-expanded-keys="[rootNode.id]"
            accordion
            node-key="id"
            highlight-current
            :expand-on-click-node="false"
            :current-node-key="currentKey"
            lazy
            @node-click="handleNodeClick"
          />
        </el-scrollbar>
      </div>
      <span class="arrow" @click="treeShow">
        <img src="../../assets/arrow.png" alt="" />
      </span>
    </div>
    <div v-if="!contentShow" class="no-scopeImg" />
    <div v-if="contentShow" class="energy-container pad10">
      <!-- 顶部滚动 -->
      <div class="top-energyContent">
        <div class="top-text h100">
          <span class="top-splitLine" />
          <ul v-if="warnData.length > 0" class="text-container">
            <li v-for="(item, index) in warnData">
              <span class="m_r10">{{ item.date | dateformat }}</span>
              <span class="red m_r10"> #{{ item.dataName }}</span>
              <span class="red m_r10">当前值: {{ item.value }}</span>
              <span class="red m_r10"> 低限：{{ item.lowestLimit }}</span>
              <span class="red m_r10"> 高限：{{ item.highLimit }}</span>
            </li>
          </ul>
          <div v-if="warnData.length === 0" class="no-scope">
            <p>暂无报警信息</p>
          </div>
        </div>
      </div>
      <!-- 上部分展示 -->
      <div class="m-energyContent m_b10">
        <el-row :gutter="20" class="h100">
          <el-col :span="12" class="h100">
            <div class="l-section bor h100">
              <div class="h50">
                <h2 class="chart-title">
                  <i class="chart-title-dot m_r10" />
                  能耗预测
                  <i class="chart-title-rect m_l10" />
                </h2>
                <div
                  id="EnergyConsumption"
                  style="height:calc( 100% - 21px );width:100%;"
                />
              </div>
              <div class="h50">
                <h2 class="chart-title m-t10">
                  <i class="chart-title-dot m_r10" />
                  达标率
                  <i class="chart-title-rect m_l10" />
                </h2>
                <echart-l
                  :id="energybroken"
                  :chart-data="ComplianceRateDaily"
                  :width="width"
                  :height="height"
                  style="height:calc( 100% - 31px );"
                />
              </div>
            </div>
          </el-col>
          <el-col :span="12" class="h100">
            <div class="r-section h100">
              <el-row :gutter="20" class="h100">
                <el-col :span="8" class="h100">
                  <div
                    class="top-item weather-section bor m_b10"
                    style="height:40%;"
                  >
                    <span class="windy">
                      <i class="icon-windy" />
                      {{ WeatherInfo.windLevel }}级
                    </span>
                    <h2
                      class="chart-title m_b10"
                      style="font-size:20px;padding:5px;color:#DBE1F5;"
                    >
                      <i class="chart-title-weather m_r10">
                        <img :src="weatherInfoImg" />
                      </i>
                      {{ WeatherInfo.temp }}℃
                    </h2>
                    <ul class="weather-list">
                      <li>
                        当前体感温度
                        <strong> {{ WeatherInfo.realFeel }}℃</strong>
                      </li>
                      <li>
                        今日气温均值<strong>{{ WeatherInfo.avg1 }}℃</strong>
                      </li>
                      <li>
                        明日气温均值<strong>{{ WeatherInfo.avg2 }}℃</strong>
                      </li>
                      <li>
                        后日气温均值<strong>{{ WeatherInfo.avg3 }}℃</strong>
                      </li>
                    </ul>
                  </div>
                  <div class="bot-item bor">
                    <h2 class="chart-title">
                      室温分布
                      <i class="chart-title-rectS m_l10" />
                    </h2>
                    <echart-p
                      :id="temperature"
                      :name="heatName"
                      :pie-data="heatingData"
                      :width="width"
                      :height="height"
                      style="height:calc( 100% - 21px );"
                      :color="temperatureColor"
                    />
                  </div>
                </el-col>
                <el-col :span="8" class="h100">
                  <div
                    class="top-item bor m_b10"
                    style="height:40%;padding:10px 0 0 0;"
                  >
                    <h2 class="chart-title m_b10" style="text-align:center;">
                      能耗排名
                    </h2>
                    <table class="chart-table">
                      <thead>
                        <tr>
                          <th />
                          <th>单方</th>
                          <th>排名</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="site in tableData"
                          v-if="tableData.length > 0"
                        >
                          <td v-text="site.name" />
                          <td v-text="site.unilateral" />
                          <td v-text="site.rank" />
                        </tr>
                      </tbody>
                    </table>
                    <p v-if="tableData.length === 0" class="table-text">
                      暂无数据
                    </p>
                  </div>
                  <div class="bot-item bor">
                    <h2 class="chart-title">
                      达标率分布
                      <i class="chart-title-rectS m_l10" />
                    </h2>
                    <echart-p
                      :id="SuccessRate"
                      :name="successName"
                      :pie-data="successRateData"
                      :width="width"
                      :height="height"
                      style="height:calc( 100% - 21px );"
                      :color="SuccessRateColor"
                    />
                  </div>
                </el-col>
                <el-col :span="8" class="h100">
                  <div class="bor h100">
                    <div class="top-item m_b10">
                      <div class="item-section m_b10">
                        <h2 class="chart-title m_b10">本供暖季供暖时间</h2>
                        <el-progress
                          :percentage="100"
                          color="#EC6F39"
                          :show-text="false"
                        />
                        <div class="result m-t10">
                          128/128
                        </div>
                      </div>
                    </div>
                    <div class="bot-item" style="height:calc(100% - 63px);">
                      <h2 class="chart-title m_b10">
                        能耗进度
                        <i class="chart-title-rectS m_l10" />
                      </h2>
                      <div class="quillBox" style="height:calc(100% - 31px);">
                        <echart-quill
                          :id="gas"
                          :title="heatTitle"
                          :width="width"
                          :height="height"
                          style="height:33%;"
                          :value="gasValue"
                          :border-color="gasColor"
                        />
                        <echart-quill
                          :id="electricity"
                          :title="powerTitle"
                          :width="width"
                          :height="height"
                          :value="powerValue"
                          :border-color="powerColor"
                          style="height:33%;"
                        />
                        <echart-quill
                          :id="water"
                          :title="waterTitle"
                          :width="width"
                          :height="height"
                          :value="waterValue"
                          :border-color="waterColor"
                          style="height:33%;"
                        />
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 下部分展示 -->
      <div class="bot-energyContent clearfix">
        <div class="bor h100">
          <el-col :span="12" class="h100">
            <div class="h100">
              <h2 class="chart-title">
                <i class="chart-title-dot m_r10" />
                月度能耗环比
                <i class="chart-title-rect m_l10" />
              </h2>
              <echart-compare
                :id="energySequential"
                :value="SequentialData"
                :width="width"
                :height="height"
                style="height:calc( 100% - 21px );"
              />
            </div>
          </el-col>
          <el-col :span="12" class="h100">
            <h2 class="chart-title" style="padding-left:20px;">
              <i class="chart-title-square m_r10" />
              累计能耗同比
              <i class="chart-title-rect m_l10" />
            </h2>
            <div
              id="energyCompared"
              style="width:100%;height:calc( 100% - 21px );"
            />
            <!-- <echart-dui :energyCompare="energyCompare" :id="energyCompared" :width="width" :height="height" style="height:calc( 100% - 21px );"></echart-dui> -->
          </el-col>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Qs from "qs";
import echarts from "echarts";
import echartT from "../../components/echart-Z/echart-bar";
import echartL from "../../components/echart-Z/echart-line";
import echartP from "../../components/echart-Z/echart-pie";
import echartCompare from "../../components/echart-Z/echart-compare";
import echartDui from "../../components/echart-Z/echart-dui";
import echartQuill from "../../components/echart-Z/echart-WGP";
import util from "@/utils/heatTime";
import { parseTime } from "@/utils/index";
import resize from "../../components/Charts/mixins/resize";
export default {
  name: "HeatEnergyDisplay",
  mixins: [resize],
  inject: ["reload"],
  components: {
    echartT,
    echartL,
    echartP,
    echartCompare,
    echartDui,
    echartQuill
  },
  data() {
    return {
      chart: null,
      CurrentNode: null,
      CurrentNodeResolve: null,
      rootNode: {
        id: ""
      },
      currentKey: "", // 当前选中key
      parentId: "", // 项目父级id
      grandParentId: "", // 项目父父级id
      heatName: "室温分布",
      successName: "达标率分布",
      boilerRoomId: "", // 锅炉房id
      structureId: "", // 项目id
      props: {
        // 配置父子树的属性名
        label: "name",
        isLeaf: "isLeaf",
        children: ""
      },
      hideSide: false,
      contentShow: false,
      animate: false,
      warnData: [], // 报警信息
      width: "100%", // 宽度
      height: "100%", // 高度
      energybroken: "energybroken", // 折线
      temperature: "temperature", // 室温
      SuccessRate: "SuccessRate", // 达标率
      energySequential: "energySequential", // 能耗环比
      water: "water", // 水球
      electricity: "electricity", // 电球
      gas: "gas", // 气球
      EnergyConsumption: [], // 能耗预测
      ComplianceRateDaily: [], // 达标
      WeatherInfo: {}, // 天气信息
      temperatureColor: ["#437FF1", "#ECCF39", "#CC55F5"], // 室温饼图颜色
      SuccessRateColor: ["#45E4D8 ", "#ECAC39", "#6B81DF", "#CC55F5"], // 达标率饼图颜色
      tableData: [], // 表格数据
      weatherInfoImg: "", // 天气图片
      successRateData: [], // 达标率饼图
      heatingData: [], // 室温饼图
      SequentialData: {}, // 环比
      energyCompare: [], // 能耗同比
      waterValue: "", // 水球值
      waterColor: "#257DB3", // 水球边框颜色
      powerColor: "#486BE0", // 电球边框颜色
      gasColor: "#BEA315", // 气球边框颜色
      waterTitle: "水",
      powerTitle: "电",
      heatTitle: "热",
      powerValue: "", // 电球
      gasValue: "" // 气球
    };
  },
  computed: {
    // 计算本季度供暖占比
    comTime: function() {
      const timeTotal = util.DateDiff("2018-11-07", "2019-03-15"); // 总供暖时间
      const currentTime = parseTime(new Date(), "{y}-{m}-{d}"); // 当前时间
      const timeB = util.DateDiff("2018-11-07", currentTime);
      return (timeB / timeTotal) * 100;
    },
    heatTime: function() {
      const currentTime = parseTime(new Date(), "{y}-{m}-{d}");
      return util.DateDiff("2018-11-07", currentTime);
    },
    heatZon: function() {
      return util.DateDiff("2018-11-07", "2019-03-15");
    }
  },
  watch: {
    $route(to, from) {
      // 监听路由是否变化
      if (to.params.structId !== from.params.structId) {
        this.currentKey = to.params.structId;
        this.parentId = to.params.parent;
        this.grandParentId = to.params.grandId;
        this.reload();
      }
    }
  },
  created() {
    setInterval(this.textMove, 3000);
    this.currentKey = this.$route.params.structId;
    this.parentId = this.$route.params.parent;
    this.grandParentId = this.$route.params.grandId;
  },
  mounted() {},
  methods: {
    /**
     * 查询报警信息
     *
     */
    getWarnInfo() {
      this.$http
        .post(
          "S-RealData/getIsWarningByCompanyStructureId",
          Qs.stringify({ companyStructureId: this.structureId })
        )
        .then(res => {
          if (res.data.success) {
            this.warnData = res.data.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    /**
     * 查询能耗预测
     */
    getEnergyConsumption() {
      let axiosBaseUrl = "";
      process.env.NODE_ENV === "production"
        ? (axiosBaseUrl =
            "https://39.107.77.111:10098/data/energyConsumption.json")
        : (axiosBaseUrl = "http://localhost:9528/data/energyConsumption.json");
      this.$http.get(axiosBaseUrl).then(response => {
        this.EnergyConsumption = response.data.data;
        this.initEchart();
      });
    },
    initEchart() {
      this.$nextTick(() => {
        // 基于准备好的dom，初始化echarts实例
        const barChart = echarts.init(
          document.getElementById("EnergyConsumption")
        );
        const avgData = this.getAvgData();
        const avgMax = Math.max.apply(null, avgData);
        const avgMin = Math.min.apply(null, avgData);
        barChart.setOption({
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
            data: ["平均气温", "预测耗热量", "实际耗热量"],
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
              name: "耗热量(GJ)",
              nameTextStyle: {
                color: "#fff",
                fontSize: 12
              },
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
              name: "预测耗热量",
              type: "bar",
              itemStyle: {
                normal: {
                  color: "#675BFF"
                }
              },
              data: this.getForecastDaily()
            },
            {
              name: "实际耗热量",
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
        window.addEventListener("resize", () => {
          barChart.resize();
        });
      });
    },
    getXData() {
      const dateArr = [];
      this.EnergyConsumption.forEach(item => {
        dateArr.push(parseTime(item.date, "{y}-{m}-{d}"));
      });
      return dateArr;
    },
    getAvgData() {
      const avgArr = [];
      this.EnergyConsumption.forEach(item => {
        avgArr.push(item.temAvg_YuCe);
      });
      return avgArr;
    },
    /** 预测 */
    getForecastDaily() {
      const avgArr = [];
      this.EnergyConsumption.forEach(item => {
        avgArr.push(item.jiYouWCDanFang_YuCe);
      });
      return avgArr;
    },
    /** 实际能耗 */
    getActual() {
      const avgArr = [];
      this.EnergyConsumption.forEach(item => {
        avgArr.push(item.jiYouWCDanFang_ShiJi);
      });
      return avgArr;
    },
    /**
     * 查询能耗达标率Daily
     */
    getComplianceRateDaily() {
      let requstUrl = "";
      if (process.env.NODE_ENV === "production") {
        requstUrl =
          "https://39.107.77.111:10098/data/getComplianceRateDaily.json";
      } else {
        requstUrl = "http://localhost:9528/data/getComplianceRateDaily.json";
      }
      this.$http.get(requstUrl).then(response => {
        this.ComplianceRateDaily = response.data.data;
      });
    },
    /**
     * 查询月度能耗环比
     */
    getEergyReport() {
      let requstUrl = "";
      if (process.env.NODE_ENV === "production") {
        requstUrl =
          "https://39.107.77.111:10098/data/EnergyReportMonthlyRatio.json";
      } else {
        requstUrl = "http://localhost:9528/data/EnergyReportMonthlyRatio.json";
      }
      this.$http.get(requstUrl).then(response => {
        this.SequentialData = response.data.data;
      });
    },
    /**
     * 查询室温分布
     */
    getTemperatureRoom() {
      this.$http
        .post(
          "S-Energy-Task/getByShiWenFenBu",
          Qs.stringify({ boilerRoomId: this.boilerRoomId })
        )
        .then(res => {
          if (res.data.success) {
            const obj = res.data.data;
            const arr = [];
            let item = 0;
            let item1 = 0;
            let item2 = 0;
            if (obj.DaYuShiBaTwoTwo === 0 || obj.ZongShu === 0) {
              item = 0;
            } else {
              item = (obj.DaYuShiBaTwoTwo / obj.ZongShu).toFixed(2);
            }
            if (obj.DaYuTwoTwo === 0 || obj.ZongShu === 0) {
              item1 = 0;
            } else {
              item1 = (obj.DaYuTwoTwo / obj.ZongShu).toFixed(2);
            }
            if (obj.XiaoYuShiBa === 0 || obj.ZongShu === 0) {
              item2 = 0;
            } else {
              item2 = (obj.XiaoYuShiBa / obj.ZongShu).toFixed(2);
            }
            arr.push(
              { name: `小于18℃占比${parseInt(item2 * 100)}%`, value: item2 },
              { name: `18℃至22℃占比${parseInt(item * 100)}%`, value: item },
              { name: `大于22℃占比${parseInt(item1 * 100)}%`, value: item1 }
            );
            this.heatingData = arr;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    /**
     * 查询达标率
     */
    getComplianceDays() {
      this.$http
        .post(
          "S-Energy-Task/getComplianceRateDays",
          Qs.stringify({ boilerRoomId: this.boilerRoomId })
        )
        .then(res => {
          if (res.data.success) {
            const obj = res.data.data;
            const pieArr = [];
            pieArr.push(
              { name: "100%以下", value: obj.intervalOne },
              { name: "100%~120%", value: obj.intervalTwo },
              { value: obj.intervalThree, name: "120%~140%" },
              { value: obj.intervalFour, name: "140%以上" }
            );
            this.successRateData = pieArr;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    /** 查询排名 */
    getRankData() {
      this.tableData = [
        { name: "热", unilateral: "0.287GJ/㎡", rank: 1 },
        { name: "水", unilateral: "5t/㎡", rank: 1 },
        { name: "电", unilateral: "1.7kwh/㎡", rank: 1 }
      ];
    },
    // 查询天气
    getWeaher(id) {
      this.$http
        .post(
          "S-WeatherForecast/ThreeDayWeatherForecast",
          Qs.stringify({ cityId: id })
        )
        .then(res => {
          if (res.data.success) {
            this.WeatherInfo = res.data.data;
            this.weatherInfoImg = require(`../../assets/weather/W${
              res.data.data.icon
            }.png`);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //   侧边栏显示隐藏
    treeShow() {
      this.hideSide = !this.hideSide;
    },
    // 顶部定时
    textMove() {
      this.animate = true;
      setTimeout(() => {
        this.warnData.push(this.warnData[0]);
        this.warnData.shift();
        this.animate = false;
      }, 500);
    },
    /**
     懒加载tree结构数据
    */
    loadNode(node, resolve) {
      this.CurrentNodeResolve = resolve;
      this.CurrentNode = node;
      if (node.level === 0) {
        let id = "";
        this.grandParentId === undefined
          ? (id = this.parentId)
          : (id = this.grandParentId);
        this.rootNode.id = id;
        this.getTree(0, resolve);
      } else {
        this.rootNode.id = this.parentId;
        this.getTree(node.data.id, resolve);
      }
    },
    async getTree(id, resolve) {
      await this.$http
        .post("/S-Base/getStructureByParentID", Qs.stringify({ parentId: id }))
        .then(res => {
          if (res.data.success) {
            if (res.data.data.length === 0 && id !== 0) {
              this.getBoilerRoom(id, resolve);
            }
            resolve(res.data.data);
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    getBoilerRoom(id, resolve) {
      this.$http
        .post("/S-Base/selectByBoilerRoom", Qs.stringify({ structureId: id }))
        .then(res => {
          if (res.data.success) {
            const arr = [];
            for (let i = 0; i < res.data.data.length; i++) {
              arr.push({
                id: res.data.data[i].id,
                name: res.data.data[i].name,
                structureTypeName: "锅炉房",
                meteorological: res.data.data[i].meteorological
              });
              const flag = false;
              this.$set(res.data.data[i], "isLeaf", flag);
            }
            resolve(arr);
          } else {
            resolve([]);
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    /**
    点击当前锅炉房节点
    */
    handleNodeClick(data, node, child) {
      if (data.structureTypeName === "锅炉房") {
        this.contentShow = true;
        this.structureId = node.parent.data.id; // 项目id
        this.boilerRoomId = data.id; // 锅炉房id
        this.getWeaher(data.meteorological); // 获取天气信息
        this.getWarnInfo(); // 报警信息
        this.getMonthlyEnergyConsumption(); // 查询能耗同比
        this.getEnergyConsumption(); // 能耗预测
        this.getComplianceRateDaily(); // 达标率
        this.getComplianceDays(); // 达标分布
        this.getTemperatureRoom(); // 室温分布
        this.getRankData(); // 获取排名
        this.getEergyReport(); // 查询月度能耗环比
        this.getGasWeterPowerHeater(); // 查询气水电
      }
    },
    /**
     * 查询气水电
     */
    getGasWeterPowerHeater() {
      this.waterValue = "0.98";
      this.powerValue = "1";
      this.gasValue = "1.02";
    },

    /**
     * 查询能耗同比
     */
    getMonthlyEnergyConsumption() {
      let requstUrl = "";
      if (process.env.NODE_ENV === "production") {
        requstUrl =
          "https://39.107.77.111:10098/data/getMonthlyEnergyConsumption.json";
      } else {
        requstUrl =
          "http://localhost:9528/data/getMonthlyEnergyConsumption.json";
      }
      this.$http.get(requstUrl).then(response => {
        this.energyCompare = response.data.data.map;
        this.getCompareEchart();
      });
    },
    getCompareEchart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById("energyCompared"));
      const option = {
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
          data: ["18-19采暖季", "17-18采暖季", "16-17采暖季"],
          textStyle: { color: "#B3B2BA ", fontSize: 12 }
        },
        grid: {
          left: "3%",
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
            name: "18-19采暖季",
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
            name: "17-18采暖季",
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
            name: "16-17采暖季",
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
      // window.addEventListener('resize', () => {
      //   chart.resize()
      // })
    },
    getXdata() {
      const arr = [];
      if (this.energyCompare.length !== 0) {
        this.energyCompare[0][0].forEach(item => {
          arr.push(item.DateList);
        });
      }
      return arr;
    },
    get18Data() {
      const arr = [];
      if (this.energyCompare.length !== 0) {
        this.energyCompare[0][0].forEach(item => {
          arr.push(item.WanCheng);
        });
      }
      return arr;
    },
    get17Data() {
      const arr = [];
      if (this.energyCompare.length !== 0) {
        this.energyCompare[1][1].forEach(item => {
          arr.push(item.WanCheng);
        });
      }
      return arr;
    },
    get16Data() {
      const arr = [];
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
<style scoped>
@import "../../styles/energyZon.css";
</style>
