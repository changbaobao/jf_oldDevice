<!--
 * @Author: your name
 * @Date: 2019-05-16 09:50:57
 * @LastEditTime: 2020-03-11 14:34:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MicroUI-use\src\views\dataMange\saveHistoryManage.vue
 -->
<template>
  <el-card class="box-card" :body-style="{ padding: '0' }">
    <search-form
      :structure-id="structureId"
      :tab-index="tabIndex"
      :tags="tags"
      @handleHistory="handleHistory"
      @handleSearch="handleSearch"
      @handleSwitch="handleSwitch"
      @handleBtnClick="handleBtnClick"
      @handleSelectChange="handleSelectChange"
      @handleSystemChange="handleSystemChange"
    >
      <span v-if="tabIndex == 2 && ChartOrTable == 1" style="margin-left:10px;">
        含0
        <el-switch
          v-model="isZero"
          :disabled="JSON.stringify(this.historyForm) == '{}'"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="handleHistorySwitch"
        />
      </span>
    </search-form>

    <div class="tags m_t10">
      <el-tag
        v-for="(tag, index) in tags"
        :key="index"
        size="small"
        closable
        @close="handleClose(tag, index)"
        >{{ tag.dataName }}</el-tag
      >
    </div>
    <div
      v-if="templateData.length > 0"
      class="template"
      style="margin-top:15px;"
    >
      <el-collapse>
        <el-collapse-item>
          <template slot="title">
            <span style="font-weight:600;color:#909399;text-indent:20px;"
              >模板</span
            >
          </template>
          <div>
            <el-tag
              v-for="(tag, index) in templateData"
              :key="index"
              size="medium"
              closable
              @click.native="handleTagClick(tag)"
              @close="handleTemplateClose(tag, index)"
              >{{ tag.templateName }}</el-tag
            >
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- 历史数据 -->
    <div v-if="tabIndex == 2" class="main-table" style="margin-top:10px;">
      <div v-if="ChartOrTable == 1">
        <div class="hEchart" style="width:100%;min-height:500px;" />
      </div>
      <t-table v-else :table-data="mainScopeData" :table-name="tags" />
    </div>
    <div v-if="tabIndex == 1" class="main-table" style="margin-top:10px;">
      <t-table :table-data="mainScopeData" :table-name="tags" />
    </div>
    <!-- 模板弹框 -->
    <el-dialog
      title="添加模板名称"
      :visible.sync="dialogFormVisible"
      width="35%"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        label-width="100px"
        size="small"
      >
        <el-form-item
          label="模板名称"
          prop="name"
          :rules="[
            { required: true, message: '请输入模板名称', trigger: 'blur' },
            {
              min: 1,
              max: 15,
              message: '长度在 1 到 15 个字符',
              trigger: 'blur'
            }
          ]"
        >
          <el-input v-model="ruleForm.name" auto-complete="off" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >确定</el-button
          >
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>
<script>
import Qs from "qs";
import searchForm from "./components/saveHistoryForm";
import tTable from "@/components/tableComponent/t-table";
import echarts from "echarts";
import { GetDateDiff, parseTime } from "@/utils/index";
import { chartOption, getMaxMin } from "./components/historyOption";
export default {
  name: "SaveHistoryManage",
  components: {
    searchForm,
    tTable
  },
  data() {
    return {
      myChart: null,
      structureId: "", // / 项目id
      tags: [],
      tabIndex: 2, // 实时历史
      ChartOrTable: 1,
      historyForm: {},
      mainScopeData: [],
      dialogFormVisible: false,
      ruleForm: {
        name: ""
      },
      templateData: [],
      isZero: false
    };
  },
  watch: {
    $route(to, from) {
      // 监听路由是否变化
      if (to.params.structId !== from.params.structId) {
        this.structureId = to.params.structId;
      }
    }
  },
  created() {
    this.structureId = this.$route.params.structId;
    this.getTemplateData();
  },
  mounted() {},
  methods: {
    getTemplateData() {
      this.$http
        .post("/S-HistoryData/getHistoryDataTimplate")
        .then(res => {
          if (res.data.success) {
            this.templateData = res.data.data;
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },

    /** 实时历史切换 */
    handleHistory(val) {
      this.tabIndex = val;
      this.mainScopeData = [];
    },
    /**
     * 表格图表
     */
    handleSwitch(val) {
      this.ChartOrTable = val;
      this.getHistoryData(this.historyForm);
    },
    /**
     *含0开发发生改变
     */
    handleHistorySwitch(val) {
      this.isZero = val;
      this.getChartData(this.historyForm);
    },
    /**
     * 保存模板
     */
    handleBtnClick(type) {
      if (type == "模板") {
        if (this.tags.length == 0) {
          return this.$message({
            message: "警告,请选择数据点",
            type: "warning"
          });
        }
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs.ruleForm.resetFields();
        });
      } else {
        // 导出
        this.handleDownload();
      }
    },
    /**
     * 表格数据导出
     */
    handleDownload() {
      import("@/vendor/Export2Excel").then(excel => {
        const tHead = ["时间"]; // 表头
        const HeadVal = ["dt"]; // 表格值
        for (let i = 0; i < this.tags.length; i++) {
          tHead.push(this.tags[i].dataName);
          HeadVal.push(this.tags[i].dataCode);
        }
        const tHeader = tHead;
        const filterVal = HeadVal;
        const dataArr = this.mainScopeData.map(item => {
          item.dt = parseTime(item.dt, "{y}-{m}-{d} {h}:{i}:{s}");
          return item;
        });
        const list = dataArr;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel(tHeader, data, "列表excel");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    /**
     * 模板生成确定
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const arr = this.tags.map(item => {
            return item.dataCode;
          });
          const param = {
            templateName: this.ruleForm.name,
            dataCodes: arr,
            sort: "0",
            isRealData: this.tabIndex
          };
          this.$http
            .post("/S-HistoryData/addHistoryDataTimplate", Qs.stringify(param))
            .then(res => {
              if (res.data.success) {
                this.templateData.push(res.data.data);
                this.$message({
                  message: "添加模板成功",
                  type: "success"
                });
                this.dialogFormVisible = false;
              }
            })
            .catch(function(err) {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
    /**
     * 删除模板的tag
     */
    handleTemplateClose(item, index) {
      this.$http
        .post(
          "/S-HistoryData/delHistoryDataTimplate",
          Qs.stringify({ id: item.id })
        )
        .then(res => {
          if (res.data.success) {
            this.$message({
              message: "删除模板成功",
              type: "success"
            });
            this.getTemplateData();
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    /**
     * 点击模板tag的值
     */
    handleTagClick(tag) {
      tag.isRealData === 2 ? (this.tabIndex = 2) : (this.tabIndex = 1);
      this.tags = [];
      for (let i = 0; i < tag.dataCodesObj.length; i++) {
        this.tags.push(tag.dataCodesObj[i]);
      }
    },
    /**
     * 选择系统
     */
    handleSystemChange(arr) {
      for (let i = 0; i < arr.length; i++) {
        const obj = arr[i];
        if (this.tags.length === 0) {
          this.tags.push(obj);
        } else {
          let tag = true;
          for (const a in this.tags) {
            const b = this.tags[a];
            if (b._id === obj._id) {
              tag = false;
            }
          }
          if (tag) {
            if (this.tags.length < 20) {
              this.tags.push(obj);
            } else {
              this.$message({
                message: "警告,选择数据点不能超出20个",
                type: "warning"
              });
            }
          }
        }
      }
    },
    /**
     * 选择数据点
     */
    handleSelectChange(val, item) {
      const obj = item;
      if (this.tags.length === 0) {
        this.tags.push(obj);
      } else {
        let tag = true;
        for (const a in this.tags) {
          const b = this.tags[a];
          if (b._id === obj._id) {
            tag = false;
          }
        }
        if (tag) {
          if (this.tags.length < 20) {
            this.tags.push(obj);
          } else {
            this.$message({
              message: "警告,选择数据点不能超出20个",
              type: "warning"
            });
          }
        }
      }
    },
    /**
     * 删除tag对应的值
     */
    handleClose(tag, index) {
      this.tags.splice(index, 1);
    },
    /**
     * 点击查询
     */
    handleSearch(type, item) {
      this.tabIndex = type;
      if (this.tags.length === 0) {
        return this.$message({
          message: "警告,请选择数据点进行查询",
          type: "warning"
        });
      }

      if (type == 1) {
        this.getRealData();
      } else {
        // 历史
        this.historyForm = item;
        const startTime = item.startTime.replace(/ \d+(:\d+){2}/, "");
        const endTime = item.endTime.replace(/ \d+(:\d+){2}/, "");
        if (GetDateDiff(startTime, endTime) > 30) {
          return this.$message.error("错误，时间范围不能超出30天");
        }
        this.getHistoryData(item);
      }
    },
    /**
     * 查询历史
     */
    getHistoryData(form) {
      if (this.ChartOrTable == 0) {
        // 表格
        this.getTableData(form);
      } else {
        this.getChartData(form);
      }
    },

    /**
     * 查询历史
     */
    async getChartData(form) {
      for (let i = 0; i < this.tags.length; i++) {
        this.chartData = [];
        const tagArr = new Array(this.tags[i].dataCode);
        const param = {
          saveStartDate: form.startTime,
          saveEndData: form.endTime,
          dataCode: tagArr
        };
        await this.$nextTick(() => {
          this.myChart = echarts.init(document.querySelector(".hEchart"));
          this.myChart.clear();
          this.myChart.showLoading({
            text: `正在加载 ${this.tags[i].dataName}`
          });
          setTimeout(() => {
            this.$http
              .post(
                "/S-HistoryData/getByDataCodes",
                Qs.stringify(param, { indices: false })
              )
              .then(res => {
                if (res.data.success) {
                  const resData = res.data.data;
                  var arr = [];
                  if (resData.length !== 0) {
                    let tag = 0;
                    let it = {};
                    for (let i = 0; i < resData.length; i++) {
                      const item = resData[i];
                      if (i === 0) {
                        tag = item.saveDate;
                      }
                      if (tag !== item.saveDate) {
                        arr.push(it);
                        tag = item.saveDate;
                        it = {};
                      }
                      it.dt = item.saveDate;
                      it[item.dataCode] = item.value;
                    }
                    arr.push(it);
                  }

                  // this.historyData = arr
                  this.mainScopeData = arr.map((item, index) => {
                    return { ...item, ...this.mainScopeData[index] };
                  });
                  var json = [];
                  var jsonS = [];
                  arr.forEach(item => {
                    json.push(item[this.tags[i].dataCode]);
                    jsonS.push(item[this.tags[i].dataCode]);
                  });
                  jsonS.sort(function(a, b) {
                    return a - b;
                  });

                  var minN = jsonS.length == 0 ? 0 : jsonS[0];
                  var maxN = jsonS.length == 0 ? 0 : jsonS[jsonS.length - 1];

                  if (!this.isZero && minN == 0 && maxN != 0) {
                    // 不含0
                    const result = json.map(item => {
                      const name = item;
                      name == 0 ? (item = "") : (item = name);
                      return item;
                    });
                    this.chartData.push({
                      name: this.tags[i].dataName,
                      data: result,
                      type: "line",
                      connectNulls: true,
                      symbol: "none",
                      markPoint: {
                        data: [
                          { type: "max", name: "最大值" },
                          { type: "min", name: "最小值" }
                        ]
                      }
                    });
                  } else {
                    this.chartData.push({
                      name: this.tags[i].dataName,
                      data: json,
                      type: "line",
                      symbol: "none",
                      markPoint: {
                        data: [
                          { type: "max", name: "最大值" },
                          { type: "min", name: "最小值" }
                        ]
                      }
                    });
                  }
                  const { min, max } = this.getMinMax(this.chartData);

                  this.myChart.setOption(
                    chartOption(arr, this.tags, this.chartData, min, max),
                    true
                  );

                  if (i == this.tags.length - 1) {
                    this.myChart.hideLoading();
                  }

                  window.addEventListener("resize", () => {
                    this.myChart.resize();
                  });
                } else {
                  this.myChart.hideLoading();
                  this.searching = false;
                  this.$notify.error({
                    title: "错误",
                    message: `${this.tags[i].dataName} 加载超时`
                  });
                }
              })
              .catch(function(err) {
                console.log(err);
              });
          }, 2000);
        });
      }
    },
    getMinMax(scopeData) {
      const arr = [];
      scopeData.map(item => {
        item.data.map(v => {
          arr.push(Number(v));
        });
      });
      const obj = {};
      obj.max = Math.max(...arr);
      obj.min = Math.min(...arr);
      return obj;
    },
    getTableData(form) {
      const tagArr = this.tags.map(item => {
        return item.dataCode;
      });
      const param = {
        saveStartDate: form.startTime,
        saveEndData: form.endTime,
        dataCode: tagArr
      };
      this.mainScopeData = [];
      this.$http
        .post(
          "/S-HistoryData/getByDataCodes",
          Qs.stringify(param, { indices: false })
        )
        .then(res => {
          if (res.data.success) {
            const resData = res.data.data;
            const arr = [];
            let tag = 0;
            let it = {};
            for (let i = 0; i < resData.length; i++) {
              const item = resData[i];
              if (i === 0) {
                tag = item.saveDate;
              }
              if (tag !== item.saveDate) {
                arr.push(it);
                tag = item.saveDate;
                it = {};
              }
              it.dt = item.saveDate;
              it[item.dataCode] = item.value;
            }
            arr.push(it);
            this.mainScopeData = arr;
          }
        });
    },
    /**
     * 查询实时数据
     */
    getRealData() {
      this.mainScopeData = [];
      const tagArr = this.tags.map(item => {
        return item.dataCode;
      });
      this.$http
        .post(
          "/S-RealData/getRealDataValue",
          Qs.stringify({ dataCodes: tagArr }, { indices: false })
        )
        .then(res => {
          if (res.data.success) {
            const resData = res.data.data;
            const arr = [];
            let tag = 0;
            let it = {};
            for (let i = 0; i < resData.length; i++) {
              const item = resData[i];
              if (i === 0) {
                tag = parseTime(item.date, "{y}-{m}-{d} {h}:{i}:{s}");
              }
              if (tag !== parseTime(item.date, "{y}-{m}-{d} {h}:{i}:{s}")) {
                arr.push(it);
                tag = parseTime(item.date, "{y}-{m}-{d} {h}:{i}:{s}");
                it = {};
              }
              it.dt = parseTime(item.date, "{y}-{m}-{d} {h}:{i}:{s}");
              it[item.dataCode] = item.value + "(" + it.dt + ")";
            }
            arr.push(it);
            this.mainScopeData = arr;
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  }
};
</script>
<style scoped>
.el-tag {
  margin: 5px 5px;
}
.historyCanvas {
  min-height: 400px;
  padding: 15px;
  box-sizing: border-box;
  background: #fff;
}
</style>
