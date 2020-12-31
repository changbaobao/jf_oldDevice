<template>
  <div class="jfDevShow">
    <div ref="header" class="top-btn">
      <el-form ref="formInline" :inline="true" :model="formInline" :rules="rules" class="demo-form-inline" size="small">
        <el-form-item label="项目名称" prop="structureId">
          <t-cascader v-model="formInline.structureId" @handleItemChange="handleItemChange" />
        </el-form-item>
        <el-form-item label="小区" prop="communityId">
          <el-select v-model="formInline.communityId" clearable placeholder="请选择">
            <el-option v-for="(item,index) in communityData" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" prop="kfDevTypeId">
          <el-select v-model="formInline.kfDevTypeId" clearable placeholder="请选择">
            <el-option v-for="( item , index) in devTypeData" :key="index" :label="item.devTypeName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否发放" prop="haveReceived">
          <el-select v-model="formInline.haveReceived" clearable placeholder="请选择">
            <el-option v-for="( item , index) in sendData" :key="index" :label="item.value" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备标识" prop="id">
          <el-input v-model="formInline.id" placeholder="设备标识" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch('formInline')">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-content">
      <el-table
        ref="dTable"
        :data="tableData"
        :header-cell-style="{
          'background-color': '#fafafa'}"
        style="width: 100%"
        :max-height="this.tableHeight"
      >
        <el-table-column v-for="( item , index ) in tableName" :key="index" :prop="item.prop" :label="item.label" />
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.native.prevent="handleHistoryRow(scope.$index, scope.row)">查看历史</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page" style="text-align:right;margin-top:10px;">
        <el-pagination
          background
          :current-page="page.currentPage"
          :page-sizes="page.pageSizes"
          layout="total, prev, pager, next"
          :total="page.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!-- 历史查询弹框 -->
    <el-dialog title="历史查询" :visible.sync="historyVisible" width="60%" style="overflow:hidden;">
      <el-form ref="historyForm" :inline="true" :model="historyForm" class="demo-form-inline" size="small">
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="historyForm.saveStartDate"
            type="datetime"
            style="width:180px;"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="historyForm.saveEndData"
            type="datetime"
            style="width:180px;"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="historySearch">查询</el-button>
          <el-button type="success" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
      <div class="charts">
        <div id="main" ref="houseCharts" style="width:100%;height:360px;" />
        <!-- <div v-if="historyData.length==0">暂无数据</div> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Qs from 'qs'
import tCascader from '../../components/base/t-cascader'
import { parseTime } from '@/utils/index'
import echarts from 'echarts'
import publicMinxin from '@/utils/tableHeight.mixin'
export default {
  name: 'JfDevShow',
  components: {
    tCascader
  },
  mixins: [publicMinxin],
  data() {
    return {
      formInline: {
        structureId: '', // 项目id
        communityId: '', // 小区id
        kfDevTypeId: '', // 设备id
        haveReceived: '', // 是否发放
        id: '' // 设备标识
      },
      rules: {
        kfDevTypeId: [{ required: true, message: '请选择设备类型', trigger: 'change' }]
      },
      sendData: [
        { value: '全部', id: '' },
        { value: '已发放', id: 1 },
        { value: '未发放', id: 0 }
      ],
      communityData: [], // 小区
      boilerRoom: [], // 锅炉房
      tableName: [
        { label: '名称', prop: 'devName' },
        { label: '编码', prop: 'devCode' },
        { label: '项目', prop: 'structureName' },
        { label: '小区', prop: 'communityName' },
        { label: '锅炉房', prop: 'boilerRoomName' },
        { label: '供暖位置', prop: 'heatingPositionName' },
        { label: '设备类型', prop: 'devTypeName' }
      ],
      devTypeData: [], // 设备类型
      tableData: [],
      page: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      historyVisible: false,
      historyForm: {
        saveStartDate: '', // 开始时间
        saveEndData: '' // 结束时间
      }
    }
  },
  mounted() {
    const curDate = new Date()
    this.historyForm.saveEndData = parseTime(curDate, '{y}-{m}-{d} {h}:{i}:{s}')
    const Date2 = new Date(curDate.getTime() - 6 * 60 * 60 * 1000)
    this.historyForm.saveStartDate = parseTime(Date2, '{y}-{m}-{d} {h}:{i}:{s}')
    this.getDevType()
  },
  methods: {
    /**
     * 查看历史
     */
    handleHistoryRow(index, row) {
      this.historyVisible = true
      this.historyForm.kfDevId = row.id
      this.historyData = []
      this.$nextTick(() => {
        var myChart = echarts.init(document.getElementById('main'))
        myChart.clear()
      })
    },
    async historySearch() {
      var myChart = echarts.init(document.getElementById('main'))
      myChart.showLoading({
        text: '正在加载数据'
      })
      await this.$http.post('/S-Base/getByHistoryNoHouse', Qs.stringify(this.historyForm)).then(res => {
        if (res.data.success) {
          this.historyData = res.data.data
          myChart.hideLoading()
          if (this.historyData.length !== 0) {
            const nameArr = this.historyData.map(v => {
              return v.paramName
            })

            var option = {
              title: {
                text: '历史数据'
              },
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                data: nameArr,
                selected: {
                  电量: false,
                  湿度: false,
                  温度: true
                }
              },
              xAxis: {
                data: this.getXData()
              },
              yAxis: {
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
              series: this.getYData()
            }
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option)
            window.onresize = myChart.resize
          }
        } else {
          this.$message.error(res.data.msg)
          myChart.hideLoading()
        }
      })
    },
    handleExport() {
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
    getXData() {
      const arr = []
      const historyData = this.historyData[this.historyData.length - 1]
      for (const j in historyData.values) {
        const dates = historyData.values[j].saveDate
        var time = parseTime(dates, '{y}-{m}-{d} {h}:{i}:{s}')
        arr.push(time)
      }
      return arr
    },
    getYData() {
      const arr = []
      this.historyData.forEach(item => {
        item.values = item.values || []
        item.values.map(v => {
          return v.value
        })
        arr.push({ type: 'line', name: item.paramName, data: item.values })
      })
      return arr
    },
    /**
     * 获取项目名称
     */
    handleItemChange(val, item) {
      this.formInline.structureId = item.id
      this.getBoilerRoom(item.id)
      this.getCommunityData(item.id)
    },
    /** 查询设备类型 */
    getDevType() {
      this.$http.post('/S-Base/getAllKfDevType').then(res => {
        if (res.data.success) {
          this.devTypeData = res.data.data.list
        }
      })
    },
    /** 获取小区 */
    getCommunityData(id) {
      this.$http.post('/S-Base/getCommunityByStructureId', Qs.stringify({ structureId: id })).then(res => {
        this.communityData = res.data.data
      })
    },
    /**
     * 获取锅炉房数据
     */
    getBoilerRoom(id) {
      this.$http.post('/S-Base/selectByBoilerRoom', Qs.stringify({ structureId: id })).then(res => {
        this.boilerRoom = res.data.data
      })
    },
    /** 查询表格 */
    handleSearch(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.formInline.pageNo = this.page.currentPage
          this.formInline.pageSize = this.page.pageSize
          this.getTableData(this.formInline)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getTableData(params) {
      this.$http.post('/S-Base/getKfDevTypeParamByKfDevTypeId', Qs.stringify({ kfDevTypeId: this.formInline.kfDevTypeId })).then(res => {
        if (res.data.success) {
          this.tableName.length = 7
          const arr = [{ paramName: '更新时间', paramCode: 'realDataDate' }]
          const data = res.data.data.list
          const dataArr = [...data, ...arr]
          for (const i in dataArr) {
            const item = {}
            item.label = dataArr[i].paramName
            item.prop = dataArr[i].paramCode
            this.tableName.push(item)
          }
          this.$http.post('/S-Base/getRealDataValueByDevs', Qs.stringify(params)).then(res => {
            if (res.data.success) {
              const data = res.data.data.list
              for (const j in data) {
                const item = data[j].devParam
                for (const k in item) {
                  if (item[k].realDataValue == null) {
                    data[j][item[k].paramCode] = ''
                  } else {
                    let value = String(item[k].realDataValue)
                    const arr = value.split('.')
                    const length = arr.length
                    if (length >= 2) {
                      value = parseFloat(value).toFixed(2)
                    }
                    data[j][item[k].paramCode] = value
                    data[j].realDataDate = parseTime(item[0].realDataDate, '{y}-{m}-{d} {h}:{i}:{s}')
                  }
                }
              }
              this.tableData = data
              this.page.total = res.data.data.total
            }
          })
        }
      })
    },
    handleCurrentChange(val) {
      this.formInline.pageNo = val
      this.formInline.pageSize = this.page.pageSize
      this.getTableData(this.formInline)
    },
    handleSizeChange(val) {
      this.formInline.pageNo = this.page.currentPage
      this.formInline.pageSize = val
      this.getTableData(this.formInline)
    }
  }
}
</script>
<style scoped>
</style>
