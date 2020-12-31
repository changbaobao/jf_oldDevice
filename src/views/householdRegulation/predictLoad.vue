<!--
 * @Author: your name
 * @Date: 2020-02-04 12:38:27
 * @LastEditTime: 2020-03-04 16:16:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MicroUI-use\src\views\householdRegulation\predictLoad.vue
 -->
<template>
  <div class="predictLoad kfScreenFull">
    <el-card :body-style="{ padding: '10px 10px' }">
      <MixChart
        height="450px"
        width="100%"
        :chart-option="chartOption"
      />
    </el-card>
    <div
      class="table"
      style="margin-top:10px;"
    >
      <el-table
        :data="tableData"
        :header-cell-style="{'background-color': '#fafafa'}"
        size="small"
        style="width: 100%"
      >
        <el-table-column
          v-for="( item ,index) in tableTitle"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
          :width="item.width"
        />
      </el-table>
    </div>
  </div>
</template>
<script>
import { isDot } from '@/utils/index'
import MixChart from '@/components/Charts/MixChart'
export default {
  name: 'PredictLoad',
  components: { MixChart },
  data() {
    return {
      chartOption: {},
      baseData: [],
      tableData: [],
      tableTitle: [
        {
          prop: 'date',
          label: '日期',
        },
        {
          prop: 'MinWDu',
          label: '天气预报',
          formatter: (row) => {
            return `${row.MinWDu}~${row.MaxWDu}℃`
          },
        },
      ],
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.$http.post('/S-Energy-Task/listForecast').then((res) => {
        if (res.data.success) {
          this.baseData = res.data.data
          const { listMaps, one, Two, Three } = res.data.data
          const arr = listMaps.map((item, index) => {
            return {
              ...item,
              oneYuCe:
                one[index] == undefined ? '' : one[index].jiYouMBZongLiang_YuCe,
              TwoYuCe:
                Two[index] == undefined ? '' : Two[index].jiYouMBZongLiang_YuCe,
              ThreeYuCe:
                Three[index] == undefined
                  ? ''
                  : Three[index].jiYouMBZongLiang_YuCe,
              total: 0,
            }
          })
          this.tableData = arr
          const resultTitle = [
            { prop: 'oneYuCe', label: `${one[0].name}(GJ)` },
            { prop: 'TwoYuCe', label: `${Two[0].name}(GJ) ` },
            { prop: 'ThreeYuCe', label: `${Three[0].name}(GJ)` },
          ]
          const totalArr = [
            {
              prop: 'total',
              label: '合计',
              formatter: (row) => {
                const total =
                  Number(row.oneYuCe) +
                  Number(row.TwoYuCe) +
                  Number(row.ThreeYuCe)
                return isDot(total, 2)
              },
            },
          ]
          this.tableTitle = [...this.tableTitle, ...resultTitle, ...totalArr]
          this.initChart()
        }
      })
    },
    initChart() {
      const { listMaps, one, Two, Three } = this.baseData
      // 绘制图表
      this.chartOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: listMaps.map((item) => {
              return item.date
            }),
            splitLine: {
              show: false, // 去掉网格线
            },
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: '预测负荷(GJ)',
            splitLine: {
              show: false, // 去掉网格线
            },
          },
          {
            type: 'value',
            name: '气温(℃)',
          },
        ],
        series: [
          {
            name: one.length == 0 ? '' : one[0].name,
            type: 'bar',
            stack: 'sum',
            barWidth: '50%',
            color: '#ee4e40',
            data: one.map((item) => {
              if (item.jiYouMBZongLiang_YuCe < 0) {
                return 0
              } else {
                return item.jiYouMBZongLiang_YuCe
              }
            }),
          },
          {
            name: Two.length == 0 ? '' : Two[0].name,
            type: 'bar',
            stack: 'sum',
            color: '#01e1e3',
            data: Two.map((item) => {
              if (item.jiYouMBZongLiang_YuCe < 0) {
                return 0
              } else {
                return item.jiYouMBZongLiang_YuCe
              }
            }),
          },
          {
            name: Three.length == 0 ? '' : Three[0].name,
            type: 'bar',
            stack: 'sum',
            color: '#f29200',
            data: Three.map((item) => {
              if (item.jiYouMBZongLiang_YuCe < 0) {
                return 0
              } else {
                return item.jiYouMBZongLiang_YuCe
              }
            }),
          },
          {
            name: '气温',
            type: 'line',
            yAxisIndex: 1,
            color: '#f2655b',
            data: listMaps.map((item) => {
              return item.temAvg
            }),
          },
        ],
      }
    },
  },
}
</script>
