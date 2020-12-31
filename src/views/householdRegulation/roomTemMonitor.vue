<template>
  <div class="box">
    <div ref="header">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
        <el-form-item>
          <el-select v-model="formInline.villName" placeholder="小区" clearable @change="getTableData">
            <el-option v-for="item in villageOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.buildName" placeholder="楼栋" clearable @change="getTableData">
            <el-option v-for="item in buildingOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.unitName" placeholder="单元" clearable @change="getTableData">
            <el-option v-for="item in roomOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" plain :disabled="this.multipleSelection.length==0" @click="handleOpenOrTem('open')">开度设定</el-button>
          <el-button type="warning" plain size="mini" :disabled="this.multipleSelection.length==0" @click="handleOpenOrTem('temp')">温度设定</el-button>
          <el-button type="info" plain size="mini" :disabled="this.multipleSelection.length==0" @click="handleOpenOrTem('work')">工作模式</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        :max-height="this.tableHeight"
        style="width: 100%;"
        tooltip-effect="dark"
        :cell-style="cellStyle"
        :header-cell-style="headerCellStyle"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column v-for="(item,index) in tableTitle" :key="index" :prop="item.name" :label="item.data" :width="item.width" :formatter="item.formatter" />
      </el-table>
    </div>
    <div class="pages" style="margin-top:10px;text-align:left;">
      <el-pagination
        :current-page="pages.currentPage"
        :page-size="pages.pageSize"
        layout="total, prev, pager, next"
        :total="pages.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 历史数据弹框 -->
    <roomDialog v-if="roomDialog.show" :is-show="roomDialog.show" :dialog-row="roomDialog.dialogRow" @closeDialog="handleClose" />
    <!-- 开度设定或温度设定弹框 -->
    <openOrTemDialog
      v-if="openOrTemDialog.show"
      :is-show="openOrTemDialog.show"
      :type="openOrTemDialog.type"
      :selected-data="multipleSelection"
      @closeDialog="openOrTemDialog.show = false"
    />
  </div>
</template>
<script>
import Qs from 'qs'
import roomDialog from './component/roomDialog'
import openOrTemDialog from './component/openOrTemDialog'
import publicMinxin from '@/utils/tableHeight.mixin'

export default {
  name: 'RoomTemMonitor',
  components: {
    roomDialog,
    openOrTemDialog
  },
  mixins: [publicMinxin],
  data() {
    return {
      villageOptions: [],
      buildingOptions: [],
      roomOptions: [],
      formInline: {
        villName: '',
        buildName: '',
        unitName: ''
      },
      tableData: [],
      multipleSelection: [],
      tableTitle: [
        {
          data: '小区名称',
          name: 'villageName'
        },
        {
          data: '楼栋',
          name: 'buildingName'
        },
        {
          data: '单元',
          name: 'roomName'
        },
        {
          data: '室温采样时间',
          name: 'thSampletime',
          width: 180
        },
        {
          data: ' 室内温度(℃)',
          name: 'thTemp',
          width: 130
        },
        {
          data: ' 室温设备状态',
          name: 'thState',
          width: 120
        },
        {
          data: '阀门采样时间',
          name: 'vlTimeSample',
          width: 180
        },
        {
          data: '工作模式',
          name: 'vlWorkMode',
          width: 120,
          formatter: row => {
            if (row.vlWorkMode == '129') {
              return '锁定开度模式'
            } else if (row.vlWorkMode == '130') {
              return '智能模式-回水温度'
            } else if (row.vlWorkMode == '131') {
              return '智能模式-室内温度'
            }
          }
        },
        {
          data: '设定温度(℃)',
          name: 'vlTempSet',
          width: 120
        },
        {
          data: '回水温度(℃)',
          name: 'vlTempIntake',
          width: 120
        },
        {
          data: '设定开度(%)',
          name: 'vlSetOpening',
          width: 120
        },
        {
          data: '阀门开度(%)',
          name: 'vlValveOpening',
          width: 120
        },
        {
          data: '阀门设备状态',
          name: 'vlStatus',
          width: 120
        }
      ],
      pages: {
        currentPage: 1,
        pageSize: 100,
        total: null
      },
      openOrTemDialog: {
        show: false,
        type: ''
      },
      roomDialog: {
        show: false,
        dialogRow: {}
      }
    }
  },
  created() {
    this.getVillageData() // 查询小区
    this.getBuildData() // 查询楼栋
    this.getRoomData() // 查询单元号
    this.getTableData()
  },
  methods: {
    getVillageData() {
      this.$http.post('/S-BlackAnt/getVillageNameDropDown').then(response => {
        if (response.data.success) {
          this.villageOptions = response.data.data
        }
      })
    },
    getBuildData() {
      this.$http.post('/S-BlackAnt/getBuildingNameDropDown').then(response => {
        if (response.data.success) {
          this.buildingOptions = response.data.data
        }
      })
    },
    getRoomData() {
      this.$http.post('/S-BlackAnt/getUnitNameDropDown').then(response => {
        if (response.data.success) {
          this.roomOptions = response.data.data
        }
      })
    },
    headerCellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 5 || columnIndex == 6 || columnIndex == 7) {
        return { background: 'rgb(255, 255, 153)' }
      } else if (
        columnIndex == 8 ||
        columnIndex == 9 ||
        columnIndex == 10 ||
        columnIndex == 11 ||
        columnIndex == 12 ||
        columnIndex == 13 ||
        columnIndex == 14
      ) {
        return { background: 'rgb(255, 204, 153)' }
      }
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 5 || columnIndex == 6 || columnIndex == 7) {
        return { background: 'rgb(255, 255, 153)' }
      } else if (
        columnIndex == 8 ||
        columnIndex == 9 ||
        columnIndex == 10 ||
        columnIndex == 11 ||
        columnIndex == 12 ||
        columnIndex == 13 ||
        columnIndex == 14
      ) {
        return { background: 'rgb(255, 204, 153)' }
      }
    },
    /**
     * 开度或温度设定
     */
    handleOpenOrTem(type) {
      this.openOrTemDialog.type = type
      this.openOrTemDialog.show = true
    },
    /**
     * 序号
     */
    indexMethod(index) {
      return index + 1
    },
    /**
     * 表格选择值
     */
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * 点击当前行
     */
    handleRowClick(row, column) {
      this.roomDialog.show = true
      this.roomDialog.dialogRow = { ...row }
    },
    /**
     * 关闭弹框
     */
    handleClose() {
      this.roomDialog.show = false
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.pages.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.pages.currentPage = val
      this.getTableData()
    },
    /**
     * 查询
     */
    getTableData() {
      this.formInline.pageNo = this.pages.currentPage
      this.formInline.pageSize = this.pages.pageSize
      this.$http.post('/S-Test/getData', Qs.stringify(this.formInline)).then(response => {
        if (response.data.success) {
          this.tableData = response.data.data.list
          this.pages.total = response.data.data.total
        }
      })
    }
  }
}
</script>
