<!--
 * @Author: your name
 * @Date: 2020-01-15 10:29:19
 * @LastEditTime: 2020-03-05 10:20:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MicroUI-use\src\views\energyManage\energyTotal.vue
 -->
<template>
  <div class="kfScreenFull">
    <el-row
      :gutter="10"
      style="margin:10px 0;"
    >
      <el-col :span="8">
        <el-card :body-style="{padding: '20px 0' }">
          <el-table
            ref="totalTable"
            :data="tableData"
            :header-cell-style="{
          'background-color': '#fafafa'}"
            size="small"
            highlight-current-row
            height="250"
            style="width: 100%"
            @row-click="handleRowClick"
          >
            <el-table-column
              v-for="(item,i) in tableTitle"
              :key="i"
              :label="item.label"
              :prop="item.name"
              :formatter="item.formatter"
            />
          </el-table>
        </el-card>

      </el-col>
      <el-col :span="8">
        <el-card>
          <e-chart
            :id="heatTotalObj.id"
            :chart-data="heatTotalObj.chartData"
            :chart-title="heatTotalObj.title"
            height="250px"
            width="100%"
          />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <Chart
            :id="chartObj.id"
            height="250px"
            width="100%"
            :chart-option="chartObj.areaOption"
          />
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-table
        :data="tableTData"
        :header-cell-style="{'background-color': '#fafafa'}"
        :default-sort="{prop: 'AvgHeat', order: 'descending'}"
        style="width: 100%"
      >
        <el-table-column
          v-for="(item,index) in tableTarr"
          :key="index"
          :label="item.label"
          :prop="item.name"
          :sortable="item.sort"
          :formatter="item.formatter"
        />
      </el-table>
    </el-row>
  </div>
</template>
<script>
import eChart from './component/energyTotalChart'
import Chart from '@/components/Charts/MixChart'
import Qs from 'qs'
import { isDot } from '@/utils/index'

export default {
  name: 'EnergyTotal',
  components: { eChart, Chart },
  data() {
    return {
      heatTotalObj: { id: 'heatTotal', chartData: [], title: '累计热' },
      chartObj: { id: 'heatChartPie', areaOption: {} },
      baseData: [],
      tableData: [],
      tableTitle: [
        {
          label: '换热站',
          name: 'name',
          width: 100,
        },
        {
          label: '累计耗热(GJ)',
          name: 'heat',
          formatter: (row) => {
            return isDot(Number(row.heat), 2)
          },
        },
        {
          label: '折算标煤(tce)',
          name: 'water',
          formatter: (row) => {
            return isDot(Number(row.heat) * 0.03412, 2)
          },
        },
        {
          label: '单位面积标煤(kgce/㎡)',
          name: 'area',
          formatter: (row) => {
            const total = Number(row.heat) * 0.03412
            return row.area == 0 || row.area == undefined
              ? 0
              : isDot((total / row.area) * 1000, 2)
          },
        },
        {
          label: '单平米耗热(GJ/㎡)',
          name: 'AvgHeat',
        },
      ],
      currentRow: {},
      tableTarr: [
        {
          label: '换热站',
          name: 'name',
        },
        {
          label: '累计耗热(GJ)',
          name: 'heat',
          formatter: (row) => {
            return isDot(Number(row.heat), 2)
          },
        },
        {
          label: '折算标煤(tce)',
          name: 'heat',
          formatter: (row) => {
            return isDot(Number(row.heat) * 0.03412, 2)
          },
        },
        {
          label: '单位面积标煤(kgce/㎡)',
          name: 'power',
          formatter: (row) => {
            const total = Number(row.heat) * 0.03412
            return row.area == 0 || row.area == undefined
              ? 0
              : isDot((total / row.area) * 1000, 2)
          },
        },
        {
          label: '单平米耗热(GJ/㎡)',
          name: 'AvgHeat',
          sort: true,
        },
      ],
      tableTData: [],
      pieData: [],
      pieTitle: ['鹤煤电厂', '鹤淇电厂', '同力电厂'],
      titleText: '面积占比',
    }
  },
  created() {},
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      this.$http.post('/S-Energy-Task/getGroupedData').then((res) => {
        if (res.data.success) {
          this.baseData = res.data.data
          const data = this.baseData[0]
          this.tableData = [
            {
              name: '鹤煤电厂',
              ...data.hm,
              AvgHeat:
                data.hm.area == 0
                  ? 0
                  : isDot(Number(data.hm.heat) / data.hm.area, 2),
            },
            {
              name: '鹤淇电厂',
              ...data.hq,
              AvgHeat:
                data.hq.area == 0
                  ? 0
                  : isDot(Number(data.hq.heat) / data.hq.area, 2),
            },
            {
              name: '同力电厂',
              ...data.fh,
              AvgHeat:
                data.fh.area == 0
                  ? 0
                  : isDot(Number(data.fh.heat) / data.fh.area, 2),
            },
          ]
          this.currentRow = this.tableData[0]
          this.$refs.totalTable.setCurrentRow(this.currentRow)
          this.initLineChart()
          this.initPieChart()
          this.getTableTdata()
        }
      })
    },
    initLineChart() {
      const data = this.baseData[0]
      this.heatTotalObj.chartData = [
        { name: '鹤煤电厂', data: isDot(Number(data.hm.heat), 2) },
        { name: '鹤淇电厂', data: isDot(Number(data.hq.heat), 2) },
        { name: '同力电厂', data: isDot(Number(data.fh.heat), 2) },
      ]
    },
    initPieChart() {
      const data = this.baseData[0]
      this.chartObj.areaOption = {
        title: {
          text: '面积占比',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true,
        },
        color: ['#ee4e40', '#f29200', '#01e1e3'],
        legend: {
          orient: 'vertical',
          top: 'middle',
          right: '5%',
          icon: 'rect',
          itemWidth: 12,
          itemHeight: 12,
          textStyle: {
            fontSize: 14,
          },
          data: ['鹤煤电厂', '鹤淇电厂', '同力电厂'],
        },
        series: [
          {
            name: '面积占比',
            type: 'pie',
            center: ['40%', '50%'],
            data: [
              { name: '鹤煤电厂', value: data.hm.area },
              { name: '鹤淇电厂', value: data.hq.area },
              { name: '同力电厂', value: data.fh.area },
            ],
          },
        ],
      }
    },
    /**
     * 点击表格当前行
     */
    handleRowClick(row, column, event) {
      this.currentRow = row
      this.getTableTdata()
    },
    getTableTdata() {
      this.$http
        .post(
          '/S-Energy-Task/getGroupedDataBystr',
          Qs.stringify({
            groupName:
              this.currentRow.name == '同力电厂'
                ? '盾安热力'
                : this.currentRow.name,
          })
        )
        .then((res) => {
          if (res.data.success) {
            const arr = res.data.data.map((item) => {
              if (item.area == 0 || item.area == undefined) {
                item.AvgHeat = 0
              } else {
                item.AvgHeat = isDot(Number(item.heat) / item.area, 2)
              }
              return item
            })
            this.tableTData = arr
          }
        })
    },
  },
}
</script>
