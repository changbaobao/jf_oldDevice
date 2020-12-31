<template>
  <div class="roomTemMonitor" style="position:relative;">
    <div ref="header">
      <el-form
        inline
        ref="formInline"
        :model="formInline"
        class="demo-form-inline"
      >
        <el-form-item prop="structureId">
          <el-cascader
            ref="conCascader"
            v-model="projectVal"
            :options="structureOption"
            style="width:100%;"
            placeholder="选择项目"
            :props="{
              checkStrictly: true,
              expandTrigger: 'hover',
              label: 'name',
              value: 'id',
              children: 'children'
            }"
            :show-all-levels="false"
            @change="handleItemChange"
          />
        </el-form-item>

        <el-form-item prop="binding">
          <el-select
            v-model="formInline.binding"
            style="width:140px;"
            placeholder="绑定状态筛选"
          >
            <el-option
              v-for="(item, index) in deviceData"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="state">
          <el-select
            v-model="formInline.state"
            style="width:120px;"
            placeholder="选择状态"
          >
            <el-option
              v-for="(item, index) in deviceStatusData"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="formInline.beginTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="开始日期"
          >
          </el-date-picker>
          <el-date-picker
            v-model="formInline.endTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="communityId">
          <el-select
            v-model="formInline.communityId"
            clearable
            placeholder="小区"
            style="width:100%;"
            @change="handleCommunity"
          >
            <el-option
              v-for="(item, index) in communityData"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item prop="heatSystemId">
          <el-select
            v-model="formInline.heatSystemId"
            clearable
            placeholder="选择系统"
            style="width:100%;"
          >
            <el-option
              v-for="(item, index) in SystemData"
              :key="index"
              :label="item.systemName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item prop="building">
          <el-select
            v-model="formInline.building"
            clearable
            placeholder="楼栋"
            style="width:100%;"
          >
            <el-option
              v-for="(item, index) in buildingData"
              :key="index"
              :label="item.buildingNum"
              :value="item.buildingNum"
            />
          </el-select>
        </el-form-item>

        <el-form-item prop="kfDevId">
          <el-input
            v-model="formInline.kfDevId"
            placeholder="输入设备SN号"
            style="width:100%;"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="mini" @click="handleSearch()"
            >搜索</el-button
          >
          <el-button type="success" size="mini" @click="handleExport()"
            >导出</el-button
          >
          <el-button type="warning" size="mini" plain @click="dateDialog = true"
            >导出历史</el-button
          >
          <el-button type="primary" size="mini" @click="handleAddReport"
            >生成简报</el-button
          >
          <el-button type="info" size="mini" @click="handleGDreport"
            >归档简报</el-button
          >
        </el-form-item>
      </el-form>
      <div class="table-title" style="padding-bottom:10px;">
        <span>
          平均室温为
          <strong>{{ avgTem }}℃</strong> 最高室温为
          <strong>{{ maxTem }}℃</strong> 最低室温
          <strong>{{ minTem }}℃</strong>
        </span>
      </div>
    </div>
    <div class="table-content">
      <el-table
        ref="dTable"
        v-loading="loading"
        :data="
          tableData.slice(
            (page.currentPage - 1) * page.pageSize,
            page.currentPage * page.pageSize
          )
        "
        :max-height="this.tableHeight"
        size="mini"
        :header-cell-style="{
          'background-color': '#fafafa'
        }"
        style="width: 100%;"
      >
        <el-table-column prop="kfDevId" width="140" label="设备ID" />
        <el-table-column
          prop="structureName"
          width="120"
          label="项目"
          align="center"
        />
        <el-table-column
          prop="communityName"
          width="100"
          label="小区"
          align="center"
        />
        <el-table-column prop="heatsystemName" label="系统" align="center" />
        <!-- <el-table-column
          prop="heatingPositionName"
          label="供暖位置"
        /> -->
        <el-table-column prop="building" label="楼栋" align="center" />
        <el-table-column prop="unit" label="单元" align="center" />
        <el-table-column prop="room" label="室" align="center" />
        <el-table-column
          prop="realDataValue"
          label="室内温度（℃）"
          align="center"
        />
        <el-table-column
          prop="realDataDataState"
          label="数据状态"
          align="center"
        />
        <!-- <el-table-column
          v-for="item in tableTitle"
          :key="item.name"
          :prop="item.name"
          sortable
          align="center"
          :label="item.label == '室内温度' ? item.label + '（℃）' : item.label"
        /> -->
        <el-table-column
          prop="realDataValueDt"
          width="160"
          label="更新时间"
          align="center"
          :formatter="filterTime"
        >
        </el-table-column>
        <el-table-column label="历史查看" align="center" width="160">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handleHistoryClick(scope.row)"
              >历史查询</el-button
            >
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="160">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handleDelBand(scope.row)"
              >解绑</el-button
            >
            <el-button
              type="text"
              size="small"
              style="color:red;"
              @click="handleDel(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="page" style="margin-top:10px;">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page.sync="page.currentPage"
          :page-size="page.pageSize"
          layout="total,prev, pager, next"
          :total="tableData.length"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      title="导出历史"
      :visible.sync="dateDialog"
      width="42%"
      @close="closeDateDialog()"
    >
      <el-form
        ref="historyForm"
        :inline="true"
        :model="historyForm"
        class="demo-form-inline"
        size="small"
      >
        <el-form-item
          prop="saveStartDate"
          :rules="{
            required: true,
            message: '请选择开始时间',
            trigger: 'change'
          }"
        >
          <el-date-picker
            v-model="historyForm.saveStartDate"
            type="datetime"
            style="width:200px;"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="开始时间"
          />
        </el-form-item>
        <el-form-item
          prop="saveEndData"
          :rules="{
            required: true,
            message: '请选择结束时间',
            trigger: 'change'
          }"
        >
          <el-date-picker
            v-model="historyForm.saveEndData"
            type="datetime"
            style="width:200px;"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="warning"
            plain
            size="mini"
            @click="handleExportHistory('historyForm')"
            >导出</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 生成简报 -->
    <el-dialog :visible.sync="reportDialog" class="reportDialog" width="30%">
      <el-form ref="ruleForm" :model="ruleForm">
        <label style="font-size:16px;">
          根据当前时间生成新室温简报,第
          <el-form-item
            prop="periods"
            style="display:inline-block;"
            :rules="[
              { required: true, message: '请输入期数', trigger: 'blur' }
            ]"
          >
            <el-input v-model="ruleForm.periods" style="width:80px;"></el-input>
          </el-form-item>
          期</label
        >
        <el-form-item
          style="margin-top:10px;"
          prop="texts"
          :rules="[
            { required: true, message: '请输入内容...', trigger: 'blur' }
          ]"
        >
          <el-input
            type="textarea"
            v-model="ruleForm.texts"
            :autosize="{ minRows: 3, maxRows: 5 }"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="handleReportDown('ruleForm')"
            >生成测试报告并下载</el-button
          >
          <el-button @click="handleReportSave('ruleForm')"
            >生成报告并归档</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 归档简报 -->
    <el-dialog :visible.sync="reportGuiDialog" width="30%" title="归档列表">
      <el-table
        :data="reportTable"
        stripe
        :header-cell-style="{
          'background-color': '#f6f6f6'
        }"
        style="width:100%;"
      >
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              @click="handleDownClick(scope.row)"
              type="text"
              size="small"
              >下载</el-button
            >
            <el-button
              type="text"
              size="small"
              style="color:red;"
              @click="handleDelReport(scope.row, scope.$index, reportTable)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 历史查询弹框 -->
    <historyDialog
      v-if="historyDialog.show"
      :is-show="historyDialog.show"
      :dialog-row="historyDialog.dialogRow"
      @closeDialog="historyDialog.show = false"
    />
  </div>
</template>
<script>
import Qs from "qs";
import historyDialog from "./component/historyChartDialog";
import { mapState } from "vuex";
import {
  parseTime,
  arrMaxNum,
  arrMinNum,
  arrAverageNum,
  isDot
} from "@/utils/index";
import publicMinxin from "@/utils/tableHeight.mixin";
export default {
  name: "RoomTemMonitor1",
  components: {
    historyDialog
  },
  mixins: [publicMinxin],
  data() {
    return {
      loading: false,
      reportDialog: false, //生成简报弹框
      ruleForm: { periods: 0, texts: "" },
      reportGuiDialog: false,
      reportTable: [{ date: "2020-07-29 12:12" }],
      dateDialog: false, // 时间弹框
      historyForm: { saveEndData: "", saveStartDate: "" },
      search: "", // 输入框绑定值
      dialogTitle: "",
      projectVal: [], // 项目选择值
      structureOption: [],
      formInline: {
        structureId: "", // 项目id
        communityId: "", // 小区
        heatSystemId: "", // 系统
        binding: "有设备", // 是否有设备
        state: "正常", // 绑定状态
        beginTime: "", // 开始时间
        endTime: "", // 结束时间
        // heatingPositionId: '', // 供暖位置
        building: "", // 楼栋
        kfDevId: "" // 设备标识
      },
      deviceData: ["有设备", "无设备", "全部"],
      deviceStatusData: ["正常", "异常", "全部"],
      communityData: [],
      SystemData: [],
      buildingData: [],
      tableData: [],
      tableTitle: [],
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      historyDialog: {
        show: false,
        dialogRow: {}
      }
    };
  },
  computed: {
    ...mapState(["appID"]),
    maxTem() {
      if (this.tableData.length == 0) return 0;
      let result = this.getValue();
      if (result.length == 0) {
        return 0;
      } else {
        let max = arrMaxNum(result);
        return isDot(max, 1);
      }
    },
    minTem() {
      if (this.tableData.length == 0) return 0;
      let result = this.getValue();
      if (result.length == 0) {
        return 0;
      } else {
        let num = arrMinNum(result);
        return isDot(num, 1);
      }
    },
    avgTem() {
      if (this.tableData.length == 0) return 0;
      let result = this.getValue();
      if (result.length == 0) {
        return 0;
      } else {
        let avg = arrAverageNum(result);
        return isDot(avg, 1);
      }
    }
    // tableList() {
    //   return this.getWarnData();
    // }
  },
  watch: {
    projectVal: {
      handler(newVal, oldVal) {
        if (this.$refs.conCascader) {
          this.$refs.conCascader.dropDownVisible = false;
        }
      }
    }
  },
  created() {
    this.getStructureNode();
  },
  methods: {
    getValue() {
      const computedArr = this.tableData.map(item => {
        return item.realDataValue ? item.realDataValue : 0;
      });
      return computedArr;
    },
    filterTime(row) {
      if (row.realDataValueDt) {
        return parseTime(row.realDataValueDt, "{y}-{m}-{d} {h}:{i}:{s}");
      } else {
        return "";
      }
    },
    // 归档查询
    handleGDreport() {
      this.reportGuiDialog = true;
      this.$http.post("/S-ALiOSS/getWord").then(res => {
        if (res.data.success) {
          const data = res.data.data;
          let list = data.map(item => {
            let str = item;
            var index = str.lastIndexOf("/");
            str = str.substring(index + 1, str.length - 5);
            return { fileUrl: item, date: str };
          });
          this.reportTable = list;
        }
      });
    },
    // 生成简报
    handleAddReport() {
      this.reportDialog = true;
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields();
      });
    },
    /**
     * 生成报告并下载
     */
    handleReportDown(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: "正在下载中请耐心等待...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });

          this.$http({
            method: "post",
            url: "/S-House/getWord",
            data: Qs.stringify({
              periods: this.ruleForm.periods,
              texts: this.ruleForm.texts,
              sign: 0
            }),
            responseType: "blob"
          }).then(response => {
            this.download(response.data, "简报.doc");
            loading.close();
            this.reportDialog = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * 下载
     * @return {[type]} [description]
     */
    download(data, fileName) {
      if (!data) return;
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      // link.download = `${fileName}.docx`
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    },
    /**
     * 生成报告并归档
     */
    handleReportSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: "正在生成报告归档中请耐心等待...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          this.$http({
            method: "post",
            url: "/S-House/getWord",
            params: {
              periods: this.ruleForm.periods,
              texts: this.ruleForm.texts,
              sign: 1
            }
          }).then(response => {
            if (response.status == 200) {
              this.$message.success("归档成功");
            }
            loading.close();
            this.reportDialog = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**下载 */
    handleDownClick(row) {
      window.open(row.fileUrl);
    },
    /**删除 */
    handleDelReport(row, index, data) {
      this.$confirm("此操作将彻底删除该项内容, 继续吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http
          .post(
            "/S-ALiOSS/deleteFileByUrl",
            Qs.stringify({ fileUrl: row.fileUrl })
          )
          .then(res => {
            if (res.data.success) {
              data.splice(index, 1);
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success"
              });
            }
          });
      });
    },
    /**
     * 导出
     */
    handleExport() {
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "设备ID",
          "项目",
          "小区",
          "系统",
          "供暖位置",
          "楼栋",
          "单元",
          "室",
          "室内温度（℃）",
          "数据状态",
          "更新时间"
        ];
        const filterVal = [
          "kfDevId",
          "structureName",
          "communityName",
          "heatsystemName",
          "heatingPositionName",
          "building",
          "unit",
          "room",
          "realDataValue",
          "realDataDataState",
          "realDataValueDt"
        ];

        const list = this.tableData;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel(tHeader, data, "列表excel");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "realDataValueDt") {
            return parseTime(v[j], "{y}-{m}-{d} {h}:{i}:{s}");
          } else {
            return v[j];
          }
        })
      );
    },
    /**
     * 历史导出
     */
    handleExportHistory(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http({
            method: "post",
            url: "S-House/getByExportListRoomtemperature",
            data: Qs.stringify({
              structureId: this.formInline.structureId, // 项目id
              communityId: this.formInline.communityId, // 小区id
              heatSystemId: this.formInline.heatSystemId,
              building: this.formInline.building,
              kfDevId: this.formInline.kfDevId,
              binding: this.formInline.binding, // 是否有设备
              state: this.formInline.state, // 绑定状态
              beginTime: this.formInline.beginTime,
              endTime: this.formInline.endTime,
              saveEndData: this.historyForm.saveEndData,
              saveStartDate: this.historyForm.saveStartDate
            }),
            responseType: "blob"
          }).then(response => {
            this.download(response.data, "历史数据.xls");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    download(data, fileName) {
      if (!data) {
        return;
      }
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    },
    /** 关闭导出历史弹框 */
    closeDateDialog() {
      this.$refs.historyForm.resetFields();
      this.dateDialog = false;
    },
    getStructureNode() {
      this.$http.post("/S-Base/getCompanyStructureByRoleTreeJson").then(res => {
        if (res.data.success) {
          this.structureOption = res.data.data;
        }
      });
    },
    /**
     * 历史查询
     */
    handleHistoryClick(row) {
      this.historyDialog.show = true;
      this.historyDialog.dialogRow = row;
    },
    /**
     * 获取项目id
     */
    handleItemChange(val) {
      this.$refs.formInline.resetFields();
      this.projectVal = val;
      if (val.length === 0) {
        this.formInline.structureId = "";
      } else {
        this.formInline.structureId = val[val.length - 1];
        this.getCommunityData(val[val.length - 1]);
        this.getHeatStystem(val[val.length - 1]);
        // this.getHeatingPosition(val[val.length - 1])
      }
    },
    /** 获取小区数据 */
    getCommunityData(id) {
      this.$http
        .post(
          "/S-Base/getCommunityByStructureId",
          Qs.stringify({ structureId: id })
        )
        .then(res => {
          this.communityData = res.data.data;
        });
    },
    /**
     * 根据小区获取楼栋
     */
    handleCommunity(val) {
      this.getbuildingData({
        structureId: this.formInline.structureId,
        communityId: val
      });
    },
    /**
     * 获取系统数据
     */
    getHeatStystem(id) {
      this.$http
        .post(
          "/S-Base/getByHeatSystem",
          Qs.stringify({ structureId: id, pageNo: 1, pageSize: 1000 })
        )
        .then(res => {
          if (res.data.success) {
            this.SystemData = res.data.data.list;
          }
        });
    },
    /** 获取楼栋 */
    getbuildingData(param) {
      this.$http
        .post("/S-Base/getBybuildingNum", Qs.stringify(param))
        .then(res => {
          if (res.data.success) {
            this.buildingData = res.data.data;
          }
        });
    },
    /**
     * 查询
     */
    handleSearch() {
      if (this.projectVal.length === 0) {
        return this.$message({
          message: "请选择项目名称",
          type: "warning"
        });
      }
      this.getTableData();
    },
    getTableData() {
      this.loading = true;
      this.formInline.pageNo = this.page.currentPage;
      this.formInline.pageSize = 10000;
      this.$http
        .post(
          "/S-House/listNewWebRoomTemperature",
          Qs.stringify(this.formInline)
        )
        .then(res => {
          if (res.data.success) {
            const { list, count } = res.data.data;
            let result = [];
            list.map(item => {
              item.structureName =
                item.structure == null ? "" : item.structure.name;
              item.communityName =
                item.community == null ? "" : item.community.name;
              item.heatsystemName =
                item.heatsystem == null ? "" : item.heatsystem.systemName;
              item.heatingPositionName =
                item.heatingPosition == null
                  ? ""
                  : item.heatingPosition.position;
              if (item.houseDev) {
                item.houseDev.map(v => {
                  v.houseId = v.id;
                  delete v.id;
                  let obj = Object.assign({}, item, v);
                  result.push(obj);
                });
              } else {
                result.push(item);
              }
            });
            this.tableData = result;
            this.loading = false;
          } else {
            this.loading = false;
          }
        });
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
    },
    handleSizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
    },
    /**
     * 删除
     */
    handleDel(row) {
      this.$confirm("此操作将彻底删除, 继续吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post(
              "/S-House/delHouseDevHistory",
              Qs.stringify({ newTenantsId: row.id })
            )
            .then(res => {
              if (res.data.success) {
                this.$notify({
                  title: "成功",
                  message: "删除成功",
                  type: "success"
                });
                this.handleSearch();
              }
            });
        })
        .catch(action => {});
    },
    /**
     * 解绑
     */
    handleDelBand(row) {
      let kfDevId = "";
      if (row.houseDev && row.houseDev.length != 0) {
        const obj = row.houseDev.find(item => {
          return item.type == "室内温度";
        });
        kfDevId = obj.kfDevId;
      } else {
        kfDevId = "";
      }
      this.$http
        .post("/S-House/HouseUnBindKfDev", Qs.stringify({ kfDevId: kfDevId }))
        .then(res => {
          if (res.data.success) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.handleSearch();
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
          }
        });
    }
  }
};
</script>
<style scoped>
.table-title {
  line-height: 35px;
  text-indent: 20px;
}
/deep/.reportDialog .el-form-item__label {
  font-size: 18px;
}
</style>
