<template>
  <div class="heatingMeteorological">
    <el-row :gutter="10">
      <el-col :span="10">
        <el-card class="box-card probabilityChart">
          <div slot="header" class="clearfix">
            <span>{{ labelName }}供暖概率</span>
            <el-button
              style="float: right;padding:0;"
              type="text"
              @click="handleReport"
              >生成报告</el-button
            >
          </div>
          <div class="defail-chart">
            <heatingChart
              :id="heatingObj.id"
              width="100%"
              height="240px"
              :chart-option="heatingObj.chartOption"
            />
            <div class="date-form">
              <el-form ref="DateForm" :model="DateForm" label-width="180px">
                <el-form-item :label="DateForm.endLabel" prop="endDate">
                  <el-date-picker
                    v-model="DateForm.endDate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="结束日期"
                    @change="handleEndDate"
                  />
                </el-form-item>
                <el-form-item :label="DateForm.startLabel" prop="startDate">
                  <el-date-picker
                    v-model="DateForm.startDate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    @change="handleStartDate"
                  />
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card probabilityChart">
          <div slot="header" class="clearfix">
            <span>今日供暖等级</span>
          </div>
          <div class="defail-chart" style="min-height:340px;">
            <div class="currentWeather">
              <heatingChart
                :id="levelObj.id"
                width="100%"
                height="220px"
                :chart-option="levelObj.chartOption"
              />
              <p>{{ levelData.heatTip }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card probabilityChart">
          <div slot="header" class="clearfix">
            <span>天气概况</span>
          </div>
          <div
            class="defail-chart"
            style="min-height:340px;display: flex;flex-direction: column;justify-content: center;"
          >
            <div class="currentWeather">
              <i class="icon-weather">
                <img :src="weatherCondition.weatherImg" alt />
              </i>
              <h2 class="tem m-t10">{{ weatherCondition.temp }}℃</h2>
              <p>相对湿度：{{ weatherCondition.humidity }}%</p>
              <p>体感温度：{{ weatherCondition.realFeel }}℃</p>
              <p>风向：{{ weatherCondition.windDir }}</p>
              <p>风力等级：{{ weatherCondition.windLevel }}级</p>
              <p>{{ weatherCondition.tips }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="box-card probabilityChart m-t10">
      <div slot="header" class="clearfix">
        <span>未来七天天气概况</span>
      </div>
      <div class="weather-list">
        <div v-for="(item, index) in weatherSeventData" class="weather-item">
          <div class="weather-item-info">
            <h2>{{ item.date }}</h2>
            <h3 class="m-t10">{{ item.condition }}</h3>
            <p class="m-t10">平均温度：{{ item.tempAvg }}℃</p>
            <p>供暖等级：{{ item.level }}</p>
            <p>{{ item.gaiLv }}</p>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import heatingChart from "@/components/Charts/MixChart";
import echarts from "echarts";
import Qs from "qs";
import {
  initHeatLevel,
  getCurrentYear,
  initHeatOption
} from "./components/heatMeteorological";
export default {
  name: "HeatingMeteorological",
  components: { heatingChart },
  data() {
    return {
      heatingObj: { id: "heatChart", chartOption: {} },
      levelObj: { id: "levelChart", chartOption: {} },
      labelName: "延长",
      DateForm: {
        startLabel: "延长供暖预测结束时间:",
        startDate: "",
        endLabel: "供暖正式结束时间:",
        endDate: ""
      },
      heatingData: {}, // 延长供暖概率
      levelData: {}, // 供暖等级
      weatherSeventData: [], // 七天天气
      weatherCondition: {} // 实时天气
    };
  },
  mounted() {
    this.getHeating();
    this.getWeatherCondition();
    this.get15daysSurvey();
  },
  methods: {
    /** 点击生成报告 */
    handleReport() {
      const { value } = this.heatingData;
      const { startDate, endDate } = this.DateForm;

      let routeUrl = this.$router.resolve({
        path: "/reportView",
        query: {
          forecastTime: startDate,
          formalTime: endDate
        }
      });
      window.open(routeUrl.href, "_blank");
    },
    /**
     * 获取天气实况
     */
    getWeatherCondition() {
      this.$http
        .post(
          "S-WeatherForecast/WeatherCondition",
          Qs.stringify({ cityId: 426 })
        )
        .then(res => {
          const data = res.data.condition;
          data.weatherImg = require(`../../assets/weather/W${data.icon}.png`);
          this.weatherCondition = data;
        });
    },
    /** 获取供暖概率 */
    getHeating() {
      this.$http
        .post("S-Energy-Task/getAdvanceOrExtendProbability")
        .then(res => {
          if (res.data.success) {
            this.heatingData = res.data.data;
            const { value, forecastTime, formalTime } = this.heatingData;
            const currentYear = getCurrentYear();

            this.DateForm.startDate =
              forecastTime == null || forecastTime == ""
                ? ""
                : currentYear + "-" + forecastTime;
            this.DateForm.endDate =
              formalTime == null || formalTime == ""
                ? ""
                : currentYear + "-" + formalTime;
            // 4月1日后默认为提前供暖判断，11月30日后默认为结束供暖判断
            let dates = `${currentYear}-03-31`;
            let dates2 = `${currentYear}-12-01`;
            if (
              this.DateForm.startDate > dates &&
              this.DateForm.startDate < dates2
            ) {
              this.labelName = "提前";
              this.DateForm.startLabel = "提前供暖预测开始时间:";
              this.DateForm.endLabel = "供暖正式开始时间:";
            } else {
              this.labelName = "延长";
              this.DateForm.startLabel = "延长供暖预测结束时间:";
              this.DateForm.endLabel = "供暖正式结束时间:";
            }

            this.initHeating(value);
          }
        });
    },
    /** 供暖概率 */
    initHeating(value) {
      var data = [
        {
          name: "供暖概率",
          value: value
        }
      ];
      this.heatingObj.chartOption = initHeatOption(data);
    },
    /** 预测开始时间发生改变 */
    handleStartDate(val) {
      this.DateForm.startDate = val;
      const { startDate, endDate } = this.DateForm;
      if (startDate == "" || startDate == null) {
        return this.$message.error("错误，预测开始时间不能为空");
      }
      if (endDate == "" || endDate == null) {
        return this.$message.error("错误，结束时间不能为空");
      }
      this.uplateHeatingDate(startDate, endDate);
    },
    /** 修改供暖时间 */
    uplateHeatingDate(startDate, endDate) {
      const forecastTime = startDate.substring(5);
      const formalTime = endDate.substring(5);
      const params = {
        id: this.heatingData.id,
        ForecastTime: forecastTime,
        formalTime: formalTime
      };

      this.$http
        .post("S-Energy-Task/updateHeatingWeather", Qs.stringify(params))
        .then(res => {
          if (res.data.success) {
            this.$notify({
              title: "成功",
              message: res.data.msg,
              type: "success"
            });
            this.getHeating();
          }
        });
    },
    handleEndDate(val) {
      this.DateForm.endDate = val;
      const { startDate, endDate } = this.DateForm;
      if (startDate == "" || startDate == null) {
        return this.$message.error("错误，预测开始时间不能为空");
      }
      if (endDate == "" || endDate == null) {
        return this.$message.error("错误，结束时间不能为空");
      }
      this.uplateHeatingDate(startDate, endDate);
    },
    /**
     * 获取七天天气
     */
    get15daysSurvey() {
      this.$http.post("/S-Energy-Task/forecast15daysSurvey").then(res => {
        if (res.data.success) {
          const data = res.data.data;
          this.getLevel(data[0]);
          const seventData = data.slice(1);
          const arr = seventData.map(item => {
            const str = item.grade;
            item.level = str.substring(0, 2);
            item.gaiLv = str.substring(str.length - 4, str.length);
            return item;
          });
          this.weatherSeventData = arr;
        }
      });
    },
    /** 供暖等级 */
    getLevel(data) {
      const { grade } = data;
      const level = grade.substring(0, 2);
      const heatTip = grade.substring(3);
      this.levelData = { level: level, heatTip: heatTip };
      this.levelObj.chartOption = initHeatLevel(level);
    }
  }
};
</script>
<style lang="scss" scoped>
.date-form {
  display: flex;
  justify-content: center;
}
.weather {
  &-list {
    width: 100%;
    overflow: hidden;
    background: #fff;
    display: flex;
    flex-direction: row;
  }
  &-item {
    flex: 1;
    border-right: 1px dashed #ccc;
    &:last-of-type {
      border-right: none;
    }
    &-info {
      text-align: center;
      padding: 10px;
      h2 {
        font-size: 18px;
      }
      h3 {
        font-size: 16px;
        color: #017ed2;
      }
      p {
        line-height: 34px;
      }
    }
  }
}
.currentWeather {
  text-indent: 2em;
  .icon-weather {
    display: inline-block;
    width: 58px;
    height: 58px;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  .tem {
    font-size: 24px;
    color: #017ed2;
    line-height: 40px;
  }
  p {
    line-height: 34px;
  }
}
</style>
