<template>
  <el-row :gutter="20">
    <div class="grid-content">
      <div ref="header">
        <el-form ref="formInline" :model="formInline" class="demo-form-inline" size="small" label-width="80px">
          <el-row>
            <el-col :span="4">
              <el-form-item label="项目名称" required>
                <t-cascader v-model="formInline.structureId" @handleCascaderChange="handleItemChange" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="小区">
                <el-select v-model="formInline.communityId" clearable placeholder="小区" @change="handleCommunity">
                  <el-option v-for="( item , index ) in communityData" :key="index" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="锅炉房">
                <el-select v-model="formInline.boilerRoomId" clearable placeholder="锅炉房">
                  <el-option v-for="( item , index ) in boilerRoomData" :key="index" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="楼栋">
                <el-select v-model="formInline.buildingNum" clearable placeholder="楼栋">
                  <el-option v-for="( item , index ) in buildingData" :key="index" :label="item.buildingNum" :value="item.buildingNum" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4" style="padding:0 10px;">
              <el-input v-model="formInline.kfDevId" placeholder="输入设备标识" size="small" />
            </el-col>
            <el-col :span="4">
              <el-button type="primary" size="small" @click="handleSearch()">搜索</el-button>
              <el-button type="success" size="small" class="m_l10" @click="handleExport">导出</el-button>
            </el-col>
          </el-row>
        </el-form>
        <div class="table-title" style="padding-bottom:10px;">
          平均室温：
          <strong>{{ avgTem }}℃</strong> 最高室温：
          <strong>{{ maxTem }}℃</strong> 最低室温：
          <strong>{{ minTem }}℃</strong>
        </div>
      </div>
      <div class="table-content">
        <el-table
          id="out-table"
          ref="dTable"
          :data="tableData.filter(data => !search || String(data.list.tem).toLowerCase().includes(search.toLowerCase()))"
          :max-height="this.tableHeight"
          size="mini"
          :header-cell-style="{
            'background-color': '#fafafa'}"
          style="width: 100%;"
        >
          <el-table-column prop="list.kdId" width="140" label="设备ID" />
          <el-table-column prop="list.companyName" width="120" label="项目" />
          <el-table-column prop="list.communityName" width="120" label="小区" />
          <el-table-column prop="list.boilerName" width="120" label="锅炉房" />
          <!-- <el-table-column prop="list.position" label="供暖位置" /> -->
          <el-table-column prop="list.buildingNum" label="楼栋" />
          <el-table-column prop="list.nuitNum" label="单元" />
          <el-table-column prop="list.room" label="室" />
          <el-table-column prop="list.tem" sortable label="温度" />
          <el-table-column prop="list.hum" sortable label="湿度" />
          <el-table-column prop="list.power" sortable label="电量" />
          <el-table-column prop="list.date" width="160" label="数据时间" />
          <el-table-column align="center" width="160">
            <template slot="header" slot-scope="scope">
              <el-input v-model="search" size="mini" placeholder="输入温度值搜索" />
            </template>hi
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleHistoryClick(scope.row)">历史查询</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" width="60%">
        <el-form ref="historyForm" :inline="true" :model="historyForm" class="demo-form-inline" size="small">
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="historyForm.saveStartDate"
              type="datetime"
              style="width:200px;"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              v-model="historyForm.saveEndData"
              type="datetime"
              style="width:200px;"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="historySearch">查询</el-button>
            <el-button type="success" @click="handleExportHistory">导出</el-button>
          </el-form-item>
        </el-form>
        <div class="charts">
          <div id="main" ref="houseCharts" style="width:100%;height:360px;" />
        </div>
      </el-dialog>
    </div>
  </el-row>
</template>
<script>
import Qs from 'qs'
import tCascader from '../../components/base/syncB-cascader'
import echarts from 'echarts'
import { parseTime, arrMaxNum, arrMinNum, arrAverageNum, isDot } from '@/utils/index'
import publicMinxin from '@/utils/tableHeight.mixin'
export default {
  name: 'SearchTemManage',
  components: {
    tCascader
  },
  mixins: [publicMinxin],
  data() {
    return {
      search: '',
      dialogTitle: '',
      formInline: {
        structureId: '', // 项目id
        communityId: '', // 小区
        boilerRoomId: '', // 锅炉房
        buildingNum: '', // 楼栋
        kfDevTypeId: '', // 设备类型
        kfDevId: '' // 设备标识
      },
      communityData: [],
      boilerRoomData: [],
      devTypeData: [],
      buildingData: [],
      tableData: [],
      dialogVisible: false,
      historyForm: {
        kfDevId: '',
        saveStartDate: '',
        saveEndData: ''
      },
      avgTem: 0, // 平均温度
      minTem: 0, // 最低温度
      maxTem: 0 // 最高温度
    }
  },
  created() {
    this.getDevType() // 获取设备
  },
  mounted() {
    const curDate = new Date()
    this.historyForm.saveEndData = parseTime(curDate, '{y}-{m}-{d} {h}:{i}:{s}')
    const Date2 = new Date(curDate.getTime() - 24 * 60 * 60 * 1000)
    this.historyForm.saveStartDate = parseTime(Date2, '{y}-{m}-{d} {h}:{i}:{s}')
  },
  methods: {
    /**
     * 历史数据导出
     */
    handleExportHistory() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['时间', '电量', '温度', '湿度']
        const filterVal = ['saveDate', 'value', 'value1', 'value2']
        let arr1 = []
        let arr2 = []
        let arr3 = []
        this.historyData.forEach(item => {
          if (item.paramName === '电量') {
            arr1 = item.values
          } else if (item.paramName === '温度') {
            arr2 = item.values
          } else {
            arr3 = item.values
          }
        })
        for (var i = 0; i < arr1.length; i++) {
          for (var j = 0; j < arr2.length; j++) {
            if (arr1[i].saveDate === arr2[j].saveDate) {
              arr1[i].value1 = arr2[j].value
              break
            }
          }
        }
        for (var i = 0; i < arr1.length; i++) {
          for (var j = 0; j < arr3.length; j++) {
            if (arr1[i].saveDate === arr3[j].saveDate) {
              arr1[i].value2 = arr3[j].value
              break
            }
          }
        }
        arr1.map(item => {
          item.saveDate = parseTime(item.saveDate, '{y}-{m}-{d} {h}:{i}:{s}')
          return item
        })
        const list = arr1
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel(tHeader, data, '列表excel')
      })
    },
    /**
     * 导出
     */
    handleExport() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['设备Id', '项目', '小区', '锅炉房', '供暖位置', '楼栋', '单元', '室', '电量', '温度', '湿度', '数据时间']
        const filterVal = ['kdId', 'companyName', 'communityName', 'boilerName', 'position', 'buildingNum', 'nuitNum', 'room', 'power', 'tem', 'hum', 'date']
        const arr = []
        const arr1 = this.tableData.filter(
          data =>
            !this.search ||
            String(data.list.tem)
              .toLowerCase()
              .includes(this.search.toLowerCase())
        )
        arr1.map(item => {
          arr.push(item.list)
        })
        const list = arr
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel(tHeader, data, '列表excel')
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    /**
     * 获取项目id
     */
    handleItemChange(val) {
      this.formInline.communityId = ''
      this.formInline.boilerRoomId = ''
      if (val.length === 0) {
        this.formInline.structureId = ''
      } else {
        this.formInline.structureId = val[val.length - 1]
        this.getCommunityData(val[val.length - 1])
        this.getBoilerRoom(val[val.length - 1])
      }
    },
    /** 获取小区数据 */
    getCommunityData(id) {
      this.$http.post('/S-Base/getCommunityByStructureId', Qs.stringify({ structureId: id })).then(res => {
        this.communityData = res.data.data
      })
    },
    handleCommunity(val) {
      this.getbuildingData({ structureId: this.formInline.structureId, communityId: val })
    },
    /**
     * 获取锅炉房数据
     */
    getBoilerRoom(id) {
      this.$http.post('/S-Base/selectByBoilerRoom', Qs.stringify({ structureId: id })).then(res => {
        this.boilerRoomData = res.data.data
      })
    },
    /** 获取楼栋 */
    getbuildingData(param) {
      this.$http.post('/S-Base/getBybuildingNum', Qs.stringify(param)).then(res => {
        if (res.data.success) {
          this.buildingData = res.data.data
        }
      })
    },
    /** 获取设备 */
    getDevType(param) {
      this.$http.post('/S-Base/getAllKfDevType').then(res => {
        if (res.data.success) {
          this.devTypeData = res.data.data.list
        }
      })
    },
    /**
     * 查询
     */
    handleSearch() {
      if (this.formInline.structureId === '') {
        return this.$message({
          message: '请选择项目名称',
          type: 'warning'
        })
      }
      this.$http.post('S-Base/getByStruCommBoiler', Qs.stringify(this.formInline)).then(res => {
        if (res.data.success) {
          const data = res.data.data
          for (const i in data) {
            if (data[i].realValue) {
              for (const v in data[i].realValue) {
                const item = data[i].realValue[v]
                if (item.realDataDate === null) {
                  data[i].list.date = ''
                } else {
                  data[i].list.date = parseTime(item.realDataDate, '{y}-{m}-{d} {h}:{i}:{s}')
                }
                if (item.paramName === '温度') {
                  if (item.realDataValue === null) {
                    data[i].list.tem = ''
                  } else {
                    data[i].list.tem = item.realDataValue
                  }
                } else if (item.paramName === '电量') {
                  data[i].list.power = item.realDataValue
                } else if (item.paramName === '湿度') {
                  data[i].list.hum = item.realDataValue
                }
              }
            } else {
              data[i].realValue = []
            }
          }
          this.tableData = res.data.data
          const tableData = this.tableData.filter(item => {
            return item.list.hasOwnProperty('tem')
          })
          // 求最大值最小值和平均值
          const arr = []
          tableData.forEach(item => {
            arr.push(parseFloat(item.list.tem))
          })
          this.maxTem = arr.length == 0 ? 0 : arrMaxNum(arr)
          this.minTem = arr.length == 0 ? 0 : arrMinNum(arr)
          const avgNum = arrAverageNum(arr)
          this.avgTem = isNaN(avgNum) ? 0 : isDot(avgNum, 2)
        }
      })
    },

    /**
     * 点击弹框
     */
    handleHistoryClick(row) {
      let kdId
      row.list.kdId ? (kdId = row.list.kdId) : (kdId = '')
      this.dialogTitle = `历史查询（${kdId} ${row.list.communityName} ${row.list.buildingNum}-${row.list.nuitNum}-${row.list.room}）`
      this.historyForm.kfDevId = row.list.kdId
      this.dialogVisible = true
      this.historyData = []
      this.$nextTick(() => {
        const barChart = this.$refs.houseCharts
        if (barChart) {
          var myChart = echarts.init(document.getElementById('main'))
          myChart.clear()
        }
      })
    },
    /**
     * 历史查询
     */
    historySearch() {
      var myChart = echarts.init(document.getElementById('main'))
      myChart.showLoading({
        text: '正在加载数据'
      })
      this.$http.post('/S-Base/getByHistory', Qs.stringify(this.historyForm)).then(res => {
        if (res.data.success) {
          this.historyData = res.data.data
          myChart.hideLoading()
          var option = {
            title: {
              text: '历史数据'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: this.getName(),
              selected: {
                电量: false,
                湿度: false,
                温度: true
              }
            },
            toolbox: {
              show: true
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.getXData()
            },
            yAxis: {
              type: 'value',
              max: function(value) {
                return value.max + 3
              },
              min: function(value) {
                return value.min - 3
              },
              splitNumber: 8,
              axisLabel: {
                formatter: function(value, index) {
                  return value.toFixed(2)
                }
              },
              splitLine: {
                show: false
              }
            },
            series: [
              {
                name: '温度',
                type: 'line',
                data: this.getYData(),
                markPoint: {
                  data: [
                    { type: 'max', name: '最大值' },
                    { type: 'min', name: '最小值' }
                  ]
                },
                markLine: {
                  data: [{ type: 'average', name: '平均值' }]
                }
              },
              {
                name: '电量',
                type: 'line',
                data: this.getPowerData(),
                markPoint: {
                  data: [
                    { type: 'max', name: '最大值' },
                    { type: 'min', name: '最小值' }
                  ]
                },
                markLine: {
                  data: [{ type: 'average', name: '平均值' }]
                }
              },
              {
                name: '湿度',
                type: 'line',
                data: this.getHumidityData(),
                markPoint: {
                  data: [
                    { type: 'max', name: '最大值' },
                    { type: 'min', name: '最小值' }
                  ]
                },
                markLine: {
                  data: [{ type: 'average', name: '平均值' }]
                }
              }
            ]
          }
          myChart.setOption(option, true)
        } else {
          myChart.hideLoading()
        }
      })
      window.onresize = myChart.resize
    },
    getName() {
      if (this.historyData.length === 0) {
        return []
      } else {
        const arr = []
        this.historyData.forEach(item => {
          arr.push(item.paramName)
        })
        return arr
      }
    },
    getXData() {
      if (this.historyData.length === 0) {
        return []
      } else {
        const arr = []
        const historyData = this.historyData[this.historyData.length - 1]
        for (const j in historyData.values) {
          var time = parseTime(historyData.values[j].saveDate, '{y}-{m}-{d} {h}:{i}:{s}')
          arr.push(time)
        }
        return arr
      }
    },
    /**
     * 获取电量
     */
    getPowerData() {
      if (this.historyData.length === 0) {
        return []
      } else {
        const arr = []
        this.historyData.forEach(item => {
          if (item.paramName === '电量') {
            item.values.forEach(v => {
              arr.push(v.value)
            })
          }
        })
        return arr
      }
    },
    /**
     * 获取湿度
     */
    getHumidityData() {
      if (this.historyData.length === 0) {
        return []
      } else {
        const arr = []
        this.historyData.forEach(item => {
          if (item.paramName === '湿度') {
            item.values.forEach(v => {
              arr.push(v.value)
            })
          }
        })
        return arr
      }
    },
    /**
     * 获取温度
     */
    getYData() {
      if (this.historyData.length === 0) {
        return []
      } else {
        const arr = []
        this.historyData.forEach(item => {
          if (item.paramName === '温度') {
            item.values.forEach(v => {
              arr.push(v.value)
            })
          }
        })
        return arr
      }
    }
  }
}
</script>
<style scoped>
.table-title {
  line-height: 35px;
  text-indent: 20px;
}
</style>
