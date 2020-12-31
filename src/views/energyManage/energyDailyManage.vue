<template>
  <el-row :gutter="20">
    <div class="grid-content">
      <div ref="header" class="top-btn" style="padding-bottom:15px;">
        <t-cascader v-model="proNameObj.name" style="margin-left:20px;" @handleItemChange="handleCascader" />
        <el-select v-model="selectVal" placeholder="选择锅炉房" size="small" style="margin:0 10px;" @change="handleSelect">
          <el-option v-for="item in boilerRoom" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <t-date v-model="saveTime" @handleDateChange="handleDateChange" />
        <el-button type="success" size="small" class="fr" style="margin:0 10px;" @click="uploadExport">导出</el-button>
        <el-button type="danger" size="small" class="fr" style="margin:0 10px;" :disabled="this.saveTime.length==0" @click="handleCalculate">重新计算</el-button>
        <el-button type="primary" size="small" class="fr" style="margin:0 10px;" @click="HandleSearch">搜索</el-button>
      </div>
      <div class="tableContent">
        <t-table
          ref="gTable"
          :max-height="this.tableHeight"
          :page-show="false"
          :table-title-name="tableName"
          :table-data="tableData"
          @handleBtnClick="handleBtnClick"
        />
      </div>
    </div>
  </el-row>
</template>
<script>
import Qs from 'qs'
import tCascader from '@/components/base/t-cascader'
import tSelect from '@/components/base/t-select'
import tTable from '@/components/base/g-table'
import tDate from '@/components/base/t-date'
import { energyDailyData } from '../../config/tableTitle/energyTitleName'
import { getBetweenDateStr, parseTime } from '@/utils/index'
import publicMinxin from '@/utils/tableHeight.mixin'
export default {
  name: 'EnergyDailyManage',
  components: {
    tCascader,
    tSelect,
    tTable,
    tDate
  },
  mixins: [publicMinxin],
  data() {
    return {
      proNameObj: {},
      boilerRoom: [],
      boilerName: '', // 锅炉名
      selectVal: '',
      saveTime: [], // 时间
      tableName: energyDailyData, // 表头
      tableData: [] // 表格数据
    }
  },
  mounted() {},
  methods: {
    /**
     * 重新计算
     */
    handleCalculate() {
      this.$confirm('计算时间较长确定要计算吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const day1 = new Date(this.saveTime[0])
          const day2 = new Date(this.saveTime[1])
          const scope = (day2 - day1) / (1000 * 60 * 60 * 24) // 计算相差天数
          if (scope > 31) {
            this.$message({
              message: '时间范围不能超过31天，请重新选择',
              type: 'error'
            })
          } else {
            const arr2 = getBetweenDateStr(this.saveTime[0], this.saveTime[1])
            this.getComputed(arr2)
          }
        })
        .catch(() => {})
    },
    async getComputed(arr2) {
      for (let v = 0; v < arr2.length; v++) {
        await this.$http.post('/S-Energy-Task/calEnergyDailyByBoilerRoomIdToSave', Qs.stringify({ boilerRoomId: this.selectVal, date: arr2[v] })).then(res => {
          if (res.data.success) {
            setTimeout(() => {
              this.$message({
                message: `${arr2[v]}计算成功`,
                type: 'success'
              })
              if (arr2.length - 1 == v) {
                this.$message({
                  message: '全部计算成功',
                  type: 'success'
                })
              }
            }, v * 1000)
          }
        })
      }
    },
    handleBtnClick(index, row, data, name) {
      this.$http.post('/S-Energy-Task/calEnergyDailyByBoilerRoomIdToSave', Qs.stringify({ boilerRoomId: row.boilerRoomId, date: row.date })).then(res => {
        if (res.data.success) {
          this.$message({
            message: res.data.data,
            type: 'success'
          })
        }
      })
    },
    /**
     * 文件导出
     */
    uploadExport() {
      for (const i in this.tableData) {
        this.tableData[i]._id = parseTime(this.tableData[i]._id, '{y}-{m}-{d}')
      }
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = this.tableName.map(item => {
          return item.data
        })
        const filterVal = this.tableName.map(item => {
          return item.name
        })
        const list = this.tableData
        const data = this.formatJson(filterVal, list)
        const title = this.$store.state.username + this.proNameObj.name + '-' + this.boilerName + '-' + this.saveTime[0] + '至' + this.saveTime[1]
        excel.export_json_to_excel(tHeader, data, title)
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    handleCascader(val, item) {
      this.proNameObj = Object.assign({}, item)
      this.boilerRoom = []
      this.selectVal = ''
      this.getBoilerRoom(this.proNameObj.id)
    },
    getBoilerRoom(id) {
      this.$http.post('/S-Base/selectByBoilerRoom', Qs.stringify({ structureId: id })).then(res => {
        // if (res.data.success) {
        const data = res.data.data
        this.boilerRoom = data
        data.length !== 0 ? (this.selectVal = data[0].id) : (this.selectVal = '')
        // }
      })
    },
    /**
     * 获取锅炉id
     */
    handleSelect(val) {
      this.selectVal = val
      var obj = {}
      obj = this.boilerRoom.find(function(item) {
        return item.value === val
      })
      this.boilerName = obj.label
    },
    handleDateChange(val) {
      this.saveTime = val
    },
    /**
     * 搜索
     */
    HandleSearch() {
      if (this.proNameObj.name === '' || this.selectVal === '' || this.saveTime.length === 0) {
        this.$message({
          message: '警告哦,请选择项目类型、锅炉房和时间',
          type: 'warning'
        })
      } else {
        const param = { boilerRoomId: this.selectVal, beginTime: this.saveTime[0], endTime: this.saveTime[1] }
        this.$http.post('/S-Energy/getEnergyDailyByBoilerRoomId', Qs.stringify(param)).then(res => {
          if (res.data.success) {
            this.tableData = res.data.data
          }
        })
      }
    }
  }
}
</script>
<style>
</style>
