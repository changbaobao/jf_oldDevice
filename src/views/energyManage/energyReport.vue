<template>
  <div class="energyReport">
    <div class="grid-content">
      <div ref="header" class="top-btn" style="padding:0 10px 10px 10px;">
        <el-cascader
          ref="cascader"
          v-model="projectVal"
          :options="projectList"
          size="small"
          clearable
          :props="{
            expandTrigger: 'hover',
            checkStrictly: true,
            label: 'name',
            value: 'id',
            children: 'children'
          }"
          placeholder="选择项目"
          expand-trigger="hover"
          :show-all-levels="false"
          @change="handleCascader"
        />
        <el-select v-model="selectVal" placeholder="选择锅炉房" size="small">
          <el-option v-for="item in boilerRoom" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-date-picker v-model="startEndData" size="small" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
        <el-button type="danger" size="small" @click="addEnergy('添加')">新增</el-button>
        <el-button type="success" size="small" @click="exportTableData">导出</el-button>
        <el-button type="primary" size="small" :disabled="this.startEndData.length==0" @click="handleAllCalculate">批量计算</el-button>
      </div>
      <el-row>
        <el-table
          id="out-table"
          :max-height="this.tableHeight"
          :cell-style="cellStyle"
          :data="energrReportData"
          stripe
          :highlight-current-row="true"
          style="width: 100%"
        >
          <el-table-column width="180" label="操作" fixed="left" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="editData(scope.$index,scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="handleCalculate(scope.$index,scope.row)">计算</el-button>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item,index) in tableTitle"
            :key="index"
            :label="item.data"
            :prop="item.name"
            :fixed="item.fixed"
            :width="item.width"
            :formatter="item.formatter"
          >
            <el-table-column v-for="(v,elem) in item.children" :key="elem" :label="v.data" :prop="v.name" :width="v.width" :formatter="v.formatter">
              <el-table-column v-for="( elem, i ) in v.children" :key="i" :label="elem.data" :prop="elem.name" :width="elem.width" :formatter="elem.formatter" />
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
    <!-- 添加或编辑 -->
    <addOrEditDialog
      v-if="addReportDialog.show"
      :structure-id="projectVal[projectVal.length-1]"
      :boiler-room-id="selectVal"
      :is-show="addReportDialog.show"
      :title="addReportDialog.title"
      :dialog-row="addReportDialog.dialogRow"
      @closeDialog="closeDialog"
      @getTableData="getTableData"
    />
  </div>
</template>
<script>
import { GetDateDiff, parseTime, getBetweenDateStr } from '@/utils/index'
import Qs from 'qs'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import addOrEditDialog from './component/reportAddOrEdit'
import { energyReportTitle } from '../../config/tableTitle/energyTitleName'
import publicMinxin from '@/utils/tableHeight.mixin'
export default {
  name: 'EnergyReport',
  components: {
    addOrEditDialog
  },
  mixins: [publicMinxin],
  data() {
    return {
      tableSpcNum: 132,
      projectList: [],
      projectVal: [],
      energrReportData: [],
      boilerRoom: [],
      selectVal: '', // 锅炉房id
      startEndData: [], // 时间
      pages: {
        currentPage: 0, // 当前页
        pageSize: 50, // 每页条数
        total: 1000 // 总条数
      },
      tableTitle: energyReportTitle,
      addReportDialog: {
        show: false,
        title: '添加',
        dialogRow: {}
      }
    }
  },
  watch: {
    projectVal: {
      handler(newVal, oldVal) {
        if (this.$refs.cascader) {
          this.$refs.cascader.dropDownVisible = false
        }
      }
    }
  },
  created() {
    this.getNode()
  },
  methods: {
    getNode() {
      this.$http.post('/S-Base/getCompanyStructureByRoleTreeJson').then(res => {
        if (res.data.success) {
          this.projectList = res.data.data
        }
      })
    },
    /**
     * 选中项目
     */
    handleCascader(val) {
      this.projectVal = val
      this.boilerRoom = []
      this.selectVal = ''
      const id = val.length == 0 ? '' : val[val.length - 1]
      this.getBoilerRoom(id)
    },
    getBoilerRoom(id) {
      this.$http.post('/S-Base/selectByBoilerRoom', Qs.stringify({ structureId: id })).then(res => {
        // if (res.data.success) {
        this.boilerRoom = res.data.data
        this.boilerRoom.length !== 0 ? (this.selectVal = this.boilerRoom[0].id) : (this.selectVal = '')
        // }
      })
    },
    /**
     * 左侧固定添加背景色
     */
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (column.label === '日期' || column.label === '平均温度') {
        return 'background:	#ebf5fd'
      }
    },
    exportTableData() {
      // 导出
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
      /* get binary string as output */
      var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '能耗分析.xlsx')
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    },
    /**
     * 计算
     */
    handleCalculate(index, row) {
      this.$http
        .post('/S-Energy-Task/CalEnergyAnalysisByBoilerRoomIdToSave', Qs.stringify({ boilerRoomId: row.boilerRoomId, date: row.date + ' 00:00:00' }))
        .then(res => {
          if (res.data.success) {
            this.$message({
              message: res.data.data,
              type: 'success'
            })
          }
        })
    },
    /**
     * 添加
     */
    addEnergy(type) {
      if (type == '添加') {
        if (this.projectVal.length === 0 || this.selectVal === '') {
          return this.$message({
            message: '警告哦,请选择项目类型、锅炉房!!!',
            type: 'warning'
          })
        }
      }
      this.addReportDialog.title = type
      this.addReportDialog.show = true
    },
    // 修改
    editData(index, row) {
      this.addReportDialog.dialogRow = { ...row }
      this.addEnergy('编辑')
    },
    /** 关闭弹框 */
    closeDialog() {
      this.addReportDialog.show = false
    },
    /**
     * 批量计算
     */
    handleAllCalculate() {
      this.$confirm('计算时间较长确定要计算吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var startDate = parseTime(this.startEndData[0], '{y}-{m}-{d}')
          var endDate = parseTime(this.startEndData[1], '{y}-{m}-{d}')
          if (GetDateDiff(startDate, endDate) > 31) {
            this.$message({
              message: '时间范围不能超过31天，请重新选择',
              type: 'warning'
            })
          } else {
            const arr2 = getBetweenDateStr(startDate, endDate)
            this.initComputed(arr2)
          }
        })
        .catch(() => {})
    },
    async initComputed(arr2) {
      for (let v = 0; v < arr2.length; v++) {
        const loading = this.$loading({
          lock: true,
          text: `正在计算...`,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        const newText = `正在计算...${arr2[v]}`
        loading.setText(newText)
        await this.$http
          .post('/S-Energy-Task/CalEnergyAnalysisByBoilerRoomIdToSave', Qs.stringify({ boilerRoomId: this.selectVal, date: arr2[v] + ' 00:00:00' }))
          .then(res => {
            if (res.data.success) {
              setTimeout(() => {
                const loadText = `${arr2[v]}计算完成`
                loading.setText(loadText)
                this.$message({
                  message: `${arr2[v]}计算成功`,
                  type: 'success',
                  duration: 1000
                })
                if (v == arr2.length - 1) {
                  loading.close()
                }
              }, v * 1000)
            } else {
              this.$message.error(res.data.msg)
            }
          })
      }
    },
    /** 点击搜索 */
    handleSearch() {
      if (this.projectVal.length === 0 || this.selectVal === '' || this.startEndData.length === 0) {
        return this.$message({
          message: '警告,项目类型、锅炉房和时间必填',
          type: 'warning'
        })
      }
      this.getTableData()
    },
    getTableData() {
      const param = {
        boilerRoomId: this.selectVal,
        beginDate: parseTime(this.startEndData[0], '{y}-{m}-{d}'),
        endDate: parseTime(this.startEndData[1], '{y}-{m}-{d}'),
        pageNo: this.pages.currentPage,
        pageSize: this.pages.pageSize
      }
      this.$http.post('/S-Energy-Task/getReportByBoilerRoomId', Qs.stringify(param)).then(res => {
        if (res.data.success) {
          this.energrReportData = res.data.data
        }
      })
    }
  }
}
</script>

<style scoped>
.dialog-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 22px;
}
.bot {
  width: 4px;
  height: 14px;
  background: #409eff;
  display: inline-block;
  vertical-align: middle;
  margin-left: 10px;
}
</style>
