<template>
  <div class="energyConsumption" style="height:100%;width:100%;">
    <div ref="header" class="top-search">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
        <!-- <el-form-item>
                        <el-checkbox v-model="checked">一次管网热损失率</el-checkbox>
        </el-form-item>-->
        <el-form-item>
          <el-cascader
            ref="conCascader"
            v-model="projectVal"
            :options="structureOption"
            placeholder="选择项目"
            size="small"
            :props="{
              checkStrictly: true,
              expandTrigger: 'hover',
              label: 'name',
              value: 'id',
              children: 'children'
            }"
            :show-all-levels="false"
            @change="handleCascaderChange"
          />
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.brId" placeholder="选择锅炉房" clearable>
            <el-option v-for="item in boilerRoomOption" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="formInline.startDate" type="date" value-format="yyyy-MM-dd" placeholder="开始日期" />
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="formInline.endDate" type="date" value-format="yyyy-MM-dd" placeholder="结束日期" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="onSearch">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" size="mini" @click="handleExportTable">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        id="out-table"
        ref="dTable"
        v-loading="loading"
        :data="tableData"
        stripe
        :max-height="this.tableHeight"
        :header-cell-style="{'background-color': '#fafafa'}"
        style="width:100%;"
      >
        <el-table-column
          v-for="(item,index) in tableTitle"
          :key="index"
          :prop="item.name"
          :label="item.data"
          :width="item.width"
          align="center"
          :formatter="item.formatter"
        />
        <!-- <el-table-column prop="Loss" label="一次管网热损失率" v-if="this.checked"  align="center" width="200"></el-table-column> -->
      </el-table>
    </div>
  </div>
</template>
<script>
import Qs from 'qs'
import { energyConsumptionTitle } from '../../config/tableTitle/energyTitleName'
import { preSevenDate, currentDefaultTime, isDot } from '@/utils/index'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import publicMinxin from '@/utils/tableHeight.mixin'
export default {
  name: 'EnergyConsumption',
  mixins: [publicMinxin],
  data() {
    return {
      checked: false,
      projectVal: [], // 项目选择值
      structureOption: [],
      boilerRoomOption: [],
      formInline: {
        groupId: '',
        brId: '',
        startDate: preSevenDate(),
        endDate: currentDefaultTime()
      },
      tableTitle: energyConsumptionTitle,
      tableData: [],
      loading: false
    }
  },
  watch: {
    projectVal: {
      handler(newVal, oldVal) {
        if (this.$refs.cascader) {
          this.$refs.conCascader.dropDownVisible = false
        }
      }
    }
  },
  created() {
    this.getStructureNode()
  },
  mounted() {},
  methods: {
    getStructureNode() {
      this.$http.post('/S-Base/getCompanyStructureByRoleTreeJson').then(res => {
        if (res.data.success) {
          this.structureOption = res.data.data
        }
      })
    },
    handleCascaderChange(val) {
      this.projectVal = val
      this.projectVal.length !== 0 ? (this.formInline.groupId = val[val.length - 1]) : (this.formInline.groupId = '')
      this.getBoilerRoom()
    },
    /**
     *获取锅炉房
     */
    getBoilerRoom() {
      this.$http.post('/S-Base/selectByBoilerRoom', Qs.stringify({ structureId: this.formInline.groupId })).then(res => {
        this.boilerRoomOption = res.data.data
        this.boilerRoomOption.length == 0 ? (this.formInline.brId = '') : (this.formInline.brId = res.data.data[0].id)
      })
    },
    /**
     * 导出表格
     */
    handleExportTable() {
      var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
      /* get binary string as output */
      var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '能耗一览表.xlsx')
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    },
    /** * 搜索 ***/
    onSearch() {
      this.loading = true
      this.$http.post('/S-Energy-Task/getEnergyPreview', Qs.stringify(this.formInline)).then(res => {
        if (res.data.success) {
          const arr = []
          res.data.data.map(item => {
            if (item.res) {
              item.res.map(i => {
                i.name = item.name
                i.daily.gasDailyTotal == undefined ? (i.daily.gasDailyTotal = 0) : (i.daily.gasDailyTotal = i.daily.gasDailyTotal)
                i.daily.powerDailyTotal == undefined ? (i.daily.powerDailyTotal = 0) : (i.daily.powerDailyTotal = i.daily.powerDailyTotal)
                i.daily.waterDailyTotal == undefined ? (i.daily.waterDailyTotal = 0) : (i.daily.waterDailyTotal = i.daily.waterDailyTotal)
                // if (i.daily.gasDailyTotal && i.daily.waterDailyTotal && i.daily.gasDailyTotal && i.daily.powerDailyTotal) {
                // 累计燃气*1.228 kgce/m3+累计电*0.1229 kgce/（kW·h）+累计水*0.0857 kgce/t
                const num = i.daily.gasDailyTotal * 1.228 + i.daily.powerDailyTotal * 0.1229 + i.daily.waterDailyTotal * 0.0857
                i.zonEnergy = isDot(num, 2)
                // 供暖系统综合能耗/供暖面积
                if (i.heatingArea != 0 && i.heatingArea != null) {
                  const zon = i.zonEnergy / i.heatingArea
                  i.areaEnergy = isDot(zon, 2)
                } else {
                  i.areaEnergy = 0
                }
                // （累计燃气*1.228 kgce/m3+累计电*0.1229 kgce/（kW·h）+累计水*0.0857 kgce/t）/热源供热量（热源出口热表值）
                if (i.daily.heatDailyTotal && i.daily.heatDailyTotal != undefined && i.daily.heatDailyTotal != 0) {
                  const dail = i.zonEnergy / i.daily.heatDailyTotal
                  i.heatZonEnergy = isDot(dail, 2)
                } else {
                  i.heatZonEnergy = 0
                }
                // （锅炉出水热表-所有换热站入站热表和） /锅炉出水热表

                arr.push(i)
              })
            }
          })
          this.tableData = arr
          // this.getRowSpan()
          this.loading = false
        } else {
          console.error('12')
        }
      })
    }
  }
}
</script>
<style scoped>
</style>
