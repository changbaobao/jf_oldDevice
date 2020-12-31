<!--
 * @Author: your name
 * @Date: 2019-12-03 11:37:20
 * @LastEditTime: 2019-12-03 17:45:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MicroUI-use\src\views\householdRegulation\component\roomDialog.vue
 -->
<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="50%"
    @close="handleClose"
  >
    <el-row>
      <el-col :span="8">
        <el-date-picker
          v-model="sTime"
          size="small"
          type="date"
          style="width:100%;"
          value-format="yyyy-MM-dd"
          placeholder="开始日期"
        />
      </el-col>
      <el-col class="line" :span="1" style="text-align:center;">--</el-col>
      <el-col :span="8">
        <el-date-picker
          v-model="eTime"
          style="width:100%;"
          type="date"
          size="small"
          value-format="yyyy-MM-dd"
          placeholder="结束日期"
        />
      </el-col>
      <el-col :span="2" style="padding-left:10px;">
        <el-button type="primary" size="mini" @click="handleSerach">搜索</el-button>
      </el-col>
    </el-row>
    <el-row>
      <div id="historyChart" style="width:100%;height:300px;" />
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" size="small" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import Qs from 'qs'
import { parseTime } from '@/utils/index'
import echarts from 'echarts'
export default {
  props: {
    isShow: Boolean,
    dialogRow: Object
  },
  data() {
    return {
      chart: null,
      dialogVisible: this.isShow,
      sTime: parseTime(new Date(), '{y}-{m}-{d}'),
      eTime: parseTime(new Date(), '{y}-{m}-{d}'),
      staData: [],
      thData: [] // 室温
    }
  },
  computed: {
    title() {
      return `${this.dialogRow.villageName}  ${this.dialogRow.buildingName} ${this.dialogRow.roomName}`
    }
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.clear()
    }
  },
  mounted() {
    this.handleSerach()
  },
  methods: {
    /**
       * 点击搜索
       */
    handleSerach() {
      const param = {
        staNodeId: this.dialogRow.vlNodeid,
        thNodeId: this.dialogRow.thNodeId,
        // thNodeId: '866971033487690',
        sTime: this.sTime,
        eTime: this.eTime
      }

      this.$http.post('/S-BlackAnt/getStatusThHisdate', Qs.stringify(param))
        .then(res => {
          if (res.data.success) {
            this.thData = res.data.data[0].thHis
            this.staData = res.data.data[0].statusHis
            this.initChart()
          }
        })
    },
    initChart() {
      this.$nextTick(() => {
      // 基于准备好的dom，初始化echarts实例
        this.chart = echarts.init(document.getElementById('historyChart'))
        const option = {
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: this.thData.map(item => {
              item.sampleTime = parseTime(item.sampleTime, '{y}-{m}-{d} {h}:{i}:{s}')
              return item.sampleTime
            })
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: this.thData.map(item => { return item.TEMP }),
            type: 'line'
          }]
        }
        this.chart.setOption(option)
        window.addEventListener('resize', () => {
          this.chart.resize()
        })
      })
    },
    /**
       * 关闭弹框
       */
    handleClose() {
      this.$emit('closeDialog')
    }
  }
}
</script>
