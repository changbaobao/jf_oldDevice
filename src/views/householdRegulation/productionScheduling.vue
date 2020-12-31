<!--
 * @Author: your name
 * @Date: 2020-02-04 15:12:26
 * @LastEditTime: 2020-03-05 10:40:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MicroUI-use\src\views\householdRegulation\productionScheduling.vue
 -->
<template>
  <div class="productionScheduling kfScreenFull">
    <div
      class="table"
      style="margin-bottom:10px;"
    >
      <el-table
        :data="tableData"
        :header-cell-style="{'background-color': '#fafafa'}"
        size="mini"
        style="width: 100%"
      >
        <el-table-column
          v-for="(item,index) in tableTitle"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :sortable="item.sort"
          :formatter="item.formatter"
          :width="item.width"
        />
      </el-table>
    </div>
    <el-card :body-style="{ padding: '10px 10px' }">
      <schedEchart
        :id="backObj.id"
        height="320px"
        width="100%"
        :chart-option="backObj.chartOption"
      />
    </el-card>
    <div
      class="table"
      style="margin:10px 0;"
    >
      <el-table
        :data="productData"
        :header-cell-style="{'background-color': '#fafafa'}"
        size="mini"
        style="width: 100%"
      >
        <el-table-column
          label="热源名称"
          width="120"
          prop="name"
        />
        <el-table-column
          label="气象预报"
          prop="weatherForecast"
          width="130"
        />
        <el-table-column
          label="平均气温(℃)"
          prop="avg"
          :formatter="avgFormater"
          width="130"
        />
        <el-table-column
          label="供水温度(℃)"
          prop="supplytemp"
          :formatter="supplyFormater"
          width="130"
        />
        <el-table-column label="回水温度(℃)">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.backtemp"
              size="mini"
            />
          </template>
        </el-table-column>
        <el-table-column label="计划流量(m³/h)">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.planFlow"
              size="mini"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="预测负荷(GJ)"
          prop="Forecastload"
        />
        <el-table-column
          label="计算时间"
          prop="saveDate"
          width="180"
        />
        <el-table-column
          label="操作"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click.native="handleEdit(scope.$index, scope.row)"
            >计算</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-card :body-style="{ padding: '10px 10px' }">
      <schedEchart
        :id="yuCeObj.id"
        height="320px"
        width="100%"
        :chart-option="yuCeObj.chartOption"
      />
    </el-card>
  </div>
</template>
<script>
import schedEchart from '@/components/Charts/MixChart'
import { parseTime, isDot } from '@/utils/index'
import Qs from 'qs'
export default {
  name: 'ProductionScheduling',
  components: { schedEchart },
  data() {
    return {
      backObj: {
        id: 'backChart',
        chartOption: {},
      },
      yuCeObj: {
        id: 'yuCeChart',
        chartOption: {},
      },
      tableData: [],
      tableTitle: [
        { label: '热源名称', prop: 'name', sort: true, width: 120 },
        {
          label: '供水温度(℃)',
          prop: 'SupplyTem.real.value',
          formatter: (row) => {
            if (row.SupplyTem != null && row.SupplyTem.real !== '') {
              const num = Number(row.SupplyTem.real.value)
              return isDot(num, 2)
            } else {
              return 0
            }
          },
        },
        {
          label: '回水温度(℃)',
          prop: 'BackTem.real.value',
          formatter: (row) => {
            if (row.BackTem != null && row.BackTem.real !== '') {
              const numb = Number(row.BackTem.real.value)
              return isDot(numb, 2)
            } else {
              return 0
            }
          },
        },
        {
          label: '供水压力(MPa)',
          prop: 'SupplyPa.real.value',
          formatter: (row) => {
            if (row.SupplyPa != null && row.SupplyPa.real !== '') {
              const numb = Number(row.SupplyPa.real.value)
              return isDot(numb, 2)
            } else {
              return 0
            }
          },
        },
        {
          label: '回水压力(MPa)',
          prop: 'BackPa.real.value',
          formatter: (row) => {
            if (row.BackPa != null && row.BackPa.real !== '') {
              const numb = Number(row.BackPa.real.value)
              return isDot(numb, 2)
            } else {
              return 0
            }
          },
        },
        {
          label: '瞬时热量(MWh)',
          prop: 'InstantHeat.real.value',
          formatter: (row) => {
            if (row.InstantHeat != null && row.InstantHeat.real !== '') {
              const numb = Number(row.InstantHeat.real.value)
              return isDot(numb, 2)
            } else {
              return 0
            }
          },
        },
        {
          label: '瞬时流量(m³/h)',
          prop: 'InstantFlow.real.value',
          formatter: (row) => {
            if (row.InstantFlow != null && row.InstantFlow.real !== '') {
              const numb = Number(row.InstantFlow.real.value)
              return isDot(numb, 2)
            } else {
              return 0
            }
          },
        },
        { label: '累计热量(GJ)', prop: 'CumulativeHeat.real.value' },
        {
          label: '单方负荷(GJ/㎡)',
          prop: 'CumulativeHeat.real.value',
          formatter: (row) => {
            if (
              row.CumulativeHeat &&
              row.CumulativeHeat.real !== '' &&
              row.CumulativeHeat.real.value &&
              row.area !== 0
            ) {
              const str = row.CumulativeHeat.real.value
              return isDot(Number(str) / row.area, 2)
            } else {
              return 0
            }
          },
        },
      ],
      productData: [],
    }
  },
  mounted() {
    this.getTableData()
    this.getBottomData()
  },
  methods: {
    avgFormater(row) {
      return isDot(row.avg, 2)
    },
    supplyFormater(row) {
      return isDot(row.supplytemp, 2)
    },
    getTableData() {
      this.$http.get('/S-Base/getRoomTemDispatch').then((res) => {
        if (res.data.success) {
          const data = res.data.data
          const arr = []
          arr.push(
            { name: '鹤煤电厂', ...data.hm },
            { name: '鹤淇电厂', ...data.hq },
            { name: '同力电厂', ...data.fh }
          )
          this.tableData = arr
          this.initChart()
        }
      })
    },
    initChart() {
      // let LineTitle = ['供水温度', '回水温度', '供水压力', '回水压力', '瞬时流量', '瞬时热量']
      const LineTitle = ['供水温度', '回水温度']
      const data = this.tableData[0].SupplyTem.history
      const SupplyTemArr = this.filterArr('SupplyTem')
      const BackTemArr = this.filterArr('BackTem')
      const seriesData = [
        {
          name: '供水温度',
          type: 'line',
          symbol: 'circle',
          showSymbol: false,
          connectNulls: true,
          data: SupplyTemArr.arr,
        },
        {
          name: '回水温度',
          type: 'line',
          symbol: 'circle',
          showSymbol: false,
          connectNulls: true,
          data: BackTemArr.arr,
        },
        {
          name: '供水温度',
          type: 'line',
          symbol: 'circle',
          showSymbol: false,
          connectNulls: true,
          data: SupplyTemArr.arr1,
        },
        {
          name: '回水温度',
          type: 'line',
          symbol: 'circle',
          showSymbol: false,
          connectNulls: true,
          data: BackTemArr.arr1,
        },
        {
          name: '供水温度',
          type: 'line',
          symbol: 'circle',
          showSymbol: false,
          connectNulls: true,
          data: SupplyTemArr.arr2,
        },
        {
          name: '回水温度',
          type: 'line',
          symbol: 'circle',
          showSymbol: false,
          connectNulls: true,
          data: BackTemArr.arr2,
        },
      ]
      // 绘制图表
      this.backObj.chartOption = {
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            const data = [
              '鹤煤电厂',
              '鹤煤电厂',
              '鹤淇电厂',
              '鹤淇电厂',
              '同力电厂',
              '同力电厂',
            ]
            var res = params[0].name + '</br>'
            for (var i = 0; i < params.length; i++) {
              const currIndex = params[i].seriesIndex
              if (currIndex == 0 || currIndex == 2 || currIndex == 4) {
                res +=
                  '<span style="color:red;">' +
                  data[currIndex] +
                  '</span>' +
                  '</br>'
              }
              res += params[i].seriesName + ':' + params[i].value + '</br>'
            }
            return res
          },
        },
        legend: {
          type: 'scroll',
          data: LineTitle,
          itemWidth: 18,
          itemHeight: 12,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data.map((item) => {
            return parseTime(item.saveDate, '{y}-{m}-{d} {h}:{i}')
          }),
        },
        yAxis: {
          type: 'value',
          max: '150',
        },
        series: seriesData,
      }
    },
    filterArr(property) {
      const obj = {
        arr: [],
        arr1: [],
        arr2: [],
      }
      this.tableData.forEach((item) => {
        if (item.name == '鹤煤电厂') {
          item[property].history.map((v) => {
            if (Number(v.value) > 150 || Number(v.value) < 1) {
              v.value = null
            }
            obj.arr.push(v.value)
          })
        } else if (item.name == '鹤淇电厂') {
          item[property].history.map((v) => {
            if (Number(v.value) > 150 || Number(v.value) < 1) {
              v.value = null
            }
            obj.arr1.push(v.value)
          })
        } else if (item.name == '同力电厂') {
          item[property].history.map((v) => {
            if (Number(v.value) > 150 || Number(v.value) < 1) {
              v.value = null
            }
            obj.arr2.push(v.value)
          })
        }
      })
      return obj
    },
    getBottomData() {
      this.$http.post('/S-Energy-Task/getForecastload').then((res) => {
        if (res.data.success) {
          const data = res.data.data
          const result = []
          result.push(
            { name: '鹤煤电厂', ...(data.hm.length == 0 ? {} : data.hm[0]) },
            { name: '鹤淇电厂', ...(data.hq.length == 0 ? {} : data.hq[0]) },
            { name: '同力电厂', ...(data.fh.length == 0 ? {} : data.fh[0]) }
          )
          this.productData = result
          this.initSchedChart(data)
        }
      })
    },
    initSchedChart(data) {
      const { fh, hm, hq } = data
      const fhArr = fh.reverse()
      const hmArr = hm.reverse()
      const hqArr = hq.reverse()
      // 绘制图表
      this.yuCeObj.chartOption = {
        tooltip: {
          // 提示框组件
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: '3%',
          right: '5%',
          bottom: '3%',
          containLabel: true,
          show: false, // 网格边框是否显示，上和右边框
        },
        xAxis: {
          type: 'category',
          boundaryGap: true, // 坐标轴两边留白
          splitLine: {
            // 网格线 x轴对应的是否显示
            show: false,
          },
          data: fhArr.map((item) => {
            return item.date
          }),
        },
        yAxis: [
          // 双y坐标轴
          {
            name: '负荷(GJ)',
            type: 'value',
            splitLine: {
              // 网格线 y轴对应的是否显示
              show: false,
            },
            axisLabel: {
              formatter: '{value}',
            },
          },
          {
            name: '气温 (℃)',
            splitLine: {
              // 网格线 y轴对应的是否显示
              show: false,
            },
            // min: 0,
            type: 'value',
            inverse: false,
            axisLine: {
              lineStyle: {
                color: '#2f4554',
              },
            },
          },
        ],
        series: [
          {
            name: '鹤煤电厂',
            type: 'bar',
            stack: 'sum',
            barWidth: '50%',
            color: '#ee4e40',
            data:
              hmArr == undefined
                ? []
                : hmArr.map((item) => {
                    if (item.realLoad < 0) {
                      return 0
                    } else {
                      return item.realLoad
                    }
                  }),
          },
          {
            name: '鹤淇电厂',
            type: 'bar',
            stack: 'sum',
            color: ' #01e1e3',
            data:
              hqArr == undefined
                ? []
                : hqArr.map((item) => {
                    if (item.realLoad < 0) {
                      return 0
                    } else {
                      return item.realLoad
                    }
                  }),
          },
          {
            name: '同力电厂',
            type: 'bar',
            stack: 'sum',
            color: ' #f29200',
            data:
              fhArr == undefined
                ? []
                : fhArr.map((item) => {
                    if (item.realLoad < 0) {
                      return 0
                    } else {
                      return item.realLoad
                    }
                  }),
          },
          {
            name: '气温',
            type: 'line',
            yAxisIndex: 1, // yAxisIndex 1 表示第二个y轴，默认为0
            color: '#f2655b',
            data: fhArr.map((item) => {
              return isDot(item.avg, 2)
            }),
          },
        ],
      }
    },
    /**
     * 点击计算
     */
    handleEdit(index, row) {
      const Num = 100.5 * row.planFlow
      const supplyValue =
        Number((row.Forecastload * 1000) / Num) + Number(row.backtemp)
      const param = {
        boilerRoomId: row.boilerRoomId,
        supplytemp: isDot(supplyValue, 4),
        backtemp: row.backtemp,
        planFlow: row.planFlow,
        loadValue: row.Forecastload,
      }
      this.$http
        .post('/S-Energy-Task/saveCalculatedTemp', Qs.stringify(param))
        .then((res) => {
          if (res.data.success) {
            const data = res.data.data
            this.$notify({
              title: '成功',
              message: '计算成功',
              type: 'success',
            })
            this.getBottomData()
          }
        })
    },
  },
}
</script>
<style scoped>
</style>
