<template>
  <el-row>
    <el-row :gutter="10">
      <el-col :span="3">
        <t-cascader v-model="proNameObj.name" style="width:100%;" @handleItemChange="handleCascader" />
      </el-col>
      <el-col :span="3">
        <t-select v-model="selectVal" :data="boilerRoom" style="width:100%;" :select-val="selectVal" @handleSelect="handleSelect" />
      </el-col>
      <el-col :span="5">
        <t-date v-model="saveTime" style="width:100%;" @handleDateChange="handleDateChange" />
      </el-col>
      <el-col :span="7">
        <el-radio-group v-model="radioVal" style="width:100%;margin-top:8px;" @change="handleChangeRadio">
          <el-radio label="气表" />
          <el-radio label="水表" />
          <el-radio label="电表" />
          <el-radio label="热表" />
        </el-radio-group>
      </el-col>
      <el-col :span="4">
        <el-input v-model="deviceCoding" placeholder="输入设备编号" size="small" style="width:100%;" />
      </el-col>
      <el-col :span="2">
        <el-button type="primary" size="mini" @click="HandleSearch">搜索</el-button>
      </el-col>
    </el-row>
    <div class="tableConent">
      <el-table
        ref="multipleTable"
        :data="tableData"
        size="small"
        :header-cell-style="{'background-color': '#fafafa'}"
        :max-height="maxHeight"
        style="width: 100%"
        @expand-change="handleExpandChange"
      >
        <el-table-column type="expand" prop="meterImages">
          <template slot-scope="props">
            <div v-if="props.row.meterImages.length!=0" class="meterImgList" style="overflow:hidden;">
              <div v-for="(url ,index ) in props.row.meterImages" class="meterImages">
                <a :href="url" target="_blank">
                  <img :src="url" alt="">
                </a>
              </div>
            </div>
            <p v-else>暂无数据</p>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item,index) in tableTitle"
          :key="index"
          :prop="item.name"
          align="center"
          :label="item.data"
          :formatter="item.formatter"
          :sortable="item.sortable"
          :filters="item.filtersData"
          :filter-method="item.filterHandler"
          :width="item.width"
        />
      </el-table>
    </div>
    </div>
  </el-row>
</template>
<script>
import Qs from 'qs'
import tCascader from '../../components/base/t-cascader'
import tSelect from '../../components/base/t-select'
import tRadio from '../../components/base/t-radio'
import gTable from '../../components/base/g-table'
import tDate from '../../components/base/t-date'
import { waterData, ElectricData, GasData, HotData } from '../../config/tableTitle/energyTitleName'
export default {
  name: 'EnergyDataManage',
  components: {
    tCascader,
    tSelect,
    tRadio,
    gTable,
    tDate
  },
  data() {
    return {
      proNameObj: {}, // 项目名称
      selectVal: '', // 锅炉选中值
      boilerRoom: [], // 锅炉
      radioVal: '气表', // 单选选中值
      saveTime: [], // 时间
      deviceCoding: '', // 设备编号
      tableTitle: [], // 表头
      tableData: [], // 表格数据
      dialogVisible: false,
      waterForm: {// 水表
        meterNum: '', // 表号
        totalWater: '', // 累计水量
        replaceTag: '' // 换表标志
      },
      PowerForm: {// 电表
        meterNum: '', // 表号
        totalPower: '' // 累计电量
      },
      HeatForm: {// 热表
        totalHeat: '', // 累计热量
        totalFlow: '' // 累计流量
      },
      GasForm: {// 气表
        totalBase: '', // 基表数
        totalCard: '', // 卡表数
        rechargeGas: ''// 充气量
      },
      meterImages: [],
      rules: {},
      maxHeight: 100
    }
  },
  mounted() {
    this.tableTitle = GasData
    this.$nextTick(function() {
      this.maxHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 140
      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.maxHeight = window.innerHeight - self.$refs.multipleTable.$el.offsetTop - 140
      }
    })
  },
  methods: {
    /**
     * 获取项目id
     */
    handleCascader(val, item) {
      this.proNameObj = Object.assign({}, item)
      this.selectVal = ''
      this.getBoilerRoom(this.proNameObj.id)
    },
    /**
     * 获取锅炉房
     */
    getBoilerRoom(id) {
      this.$http.post('/S-Base/selectByBoilerRoom', Qs.stringify({ structureId: id })).then(res => {
        // if (res.data.success) {
        const data = res.data.data
        const arr = []
        for (const i in data) {
          const obj = { label: data[i].name, value: data[i].id }
          arr.push(obj)
        }
        this.boilerRoom = arr
        data.length == 0 ? this.selectVal = '' : this.selectVal = data[0].id
        // }
      })
    },
    /**
     * 获取锅炉id
     */
    handleSelect(val) {
      this.selectVal = val
    },
    handleChangeRadio(val) {
      this.radioVal = val
      this.$nextTick(function() {
        this.maxHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 140
        // 监听窗口大小变化
        const self = this
        window.onresize = function() {
          self.maxHeight = window.innerHeight - self.$refs.multipleTable.$el.offsetTop - 140
        }
      })
    },
    /**
     * 获取时间值
     */
    handleDateChange(val) {
      this.saveTime = val
    },
    /**
     * 查询能耗表
     */
    HandleSearch() {
      if (this.selectVal == '' || this.saveTime.length == 0) {
        return this.$message({
          message: '警告哦,请选择项目类型、锅炉房和日期',
          type: 'warning'
        })
      }
      const param = {
        id: this.selectVal,
        beginTime: this.saveTime[0],
        endTime: this.saveTime[1],
        meterType: this.radioVal,
        deviceCoding: this.deviceCoding,
        query: 'boilerRoom'
      }
      if (this.radioVal === '水表') {
        this.tableTitle = waterData
      } else if (this.radioVal === '电表') {
        this.tableTitle = ElectricData
      } else if (this.radioVal === '气表') {
        this.tableTitle = GasData
      } else if (this.radioVal === '热表') {
        this.tableTitle = HotData
      }
      this.$http.post('/S-Energy/getEnergyData', Qs.stringify(param)).then(res => {
        if (res.data.success) {
          const tableTitle = []
          const data = res.data.data.map(item => {
            tableTitle.push({ text: item.meter.meterName, value: item.meter.meterName })
            return { ...item, meterImages: [] }
          })
          this.tableData = data
          const res1 = new Map()
          const arr = tableTitle.filter((a) => !res1.has(a.text) && res1.set(a.text, 1))
          this.tableTitle.map(item => {
            item.data == '表名称' ? item.filtersData = arr : item.filtersData = []
            return item
          })
        }
      })
    },
    /**
     * 表格展开
     */
    handleExpandChange(row, expandedRows, expanded) {
      if (expandedRows.length !== 0) {
        this.$http.post('/S-ALiOSS/getEnergyMeterDateImage', Qs.stringify({ prefix: row.id })).then(res => {
          if (res.data.success) {
            row.meterImages = res.data.data
          }
        })
      }
    }
  }
}
</script>
<style scoped>
.meterImages {
   width:60px;
   height: 60px;
   margin:0 10px 10px 0;
   float: left;
}
.meterImages a {
  width: 100%;
  height: 100%;
  display: inline-block;
}
.meterImages img {
  width: 100%;
  height: 100%;
}
.tableConent {
  margin-top:20px;
}
</style>
