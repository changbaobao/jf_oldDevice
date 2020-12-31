<template>
  <div class="grid-content kfScreenFull">
    <el-row :gutter="12">
      <el-button size="mini" type="primary" plain class="fr m_r10" @click="dialogVisible = true">统计</el-button>
    </el-row>
    <el-row :gutter="12" style="height:20%;margin-top:10px;">
      <el-col :span="8" class="h100">
        <div class="card-m h100">
          <div class="l-icon" style="background:#02DAFF;" />
          <div class="f-count">
            <div class="top-num">
              <countTo :start-val="startVal" :end-val="statisticalData.totalNumber" :duration="3000" />
            </div>
            <div class="bot-text">
              总任务量
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8" class="h100">
        <div class="card-m h100">
          <div class="l-icon" style="background:#675BFF;" />
          <div class="f-count">
            <div class="top-num">
              <countTo :start-val="startVal" :end-val="statisticalData.totalFinished" :duration="3000" />
            </div>
            <div class="bot-text">
              完成量
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8" class="h100">
        <div class="card-m h100">
          <div class="l-icon" style="background:#F74C07;" />
          <div class="f-count">
            <div class="top-num">
              <countTo :start-val="startVal" :end-val="statisticalData.totalUnfinished" :duration="3000" />
            </div>
            <div class="bot-text">
              未完成量
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="12" class="grid-bottom">
      <el-col :span="12" class="h100 statisticalContent">
        <el-card shadow="always" class="h100">
          <div id="conclusion" style="width:100%;height:100%;" />
        </el-card>
      </el-col>
      <el-col :span="12" class="h100">
        <el-card shadow="hover" class="h100 statisticalContent">
          <div id="patrolStatus" style="width:100%;height:100%;" />
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="30%"
    >
      <div class="statisticalDialog">
        <el-date-picker
          v-model="date"
          style="width:100%;"
          type="daterange"
          size="small"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        />
        <el-scrollbar style="height:300px;">
          <el-tree
            ref="sideTree"
            :data="treeData"
            show-checkbox
            style="margin-top:10px;"
            node-key="id"
            accordion
            :props="defaultProps"
          />
        </el-scrollbar>
        <span slot="footer" class="dialog-footer" style="margin-top:10px;">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit()">确 定</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import echarts from 'echarts'
import utils from '@/utils/creatTree'
import Qs from 'qs'
import countTo from 'vue-count-to'
export default {
  name: 'InspectionStatistical',
  components: { countTo },
  data() {
    return {
      startVal: 0,
      dialogVisible: false,
      date: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      statisticalData: {
        'conclusion': [],
        'totalNumber': 0,
        'templateName': [],
        'totalFinished': 0,
        'totalUnfinished': 0
      }
    }
  },
  mounted() {
    this.getTreeData()
  },
  methods: {
    getTreeData() {
      this.$http.post('/S-Base/getCompanyStructureByRole', Qs.stringify({ type: 1 })).then(res => {
        if (res.data.success) {
          this.treeData = utils.creatTree(res.data.data)
        }
      })
    },
    /**
     * 点击确定
     */
    handleSubmit() {
      const structId = this.$refs.sideTree.getCheckedKeys()
      if (this.date.length === 0 || structId.length === 0) {
        return this.$notify({
          title: '警告',
          message: '项目和时间为必选项',
          type: 'warning'
        })
      }
      const param = {
        structId: structId,
        beginTime: this.date[0],
        endTime: this.date[1]
      }
      this.$http.post('/S-EquipmentInspection/getByStatistics', Qs.stringify(param, { indices: false })).then(res => {
        if (res.data.success) {
          this.statisticalData = res.data.data
          this.getConclusion()// 任务完成
          this.patrolStatus()// 巡检状态
          this.$refs.sideTree.setCheckedKeys([])
          this.date = []
          this.dialogVisible = false
        }
      })
    },
    getConclusion() {
      this.$nextTick(() => {
      // 基于准备好的dom，初始化echarts实例
        const barChart = echarts.init(document.getElementById('conclusion'))
        const data = this.statisticalData.conclusion
        const ConclusionTitle = data.map(item => {
          return item._id
        })
        const option = {
          title: {
            text: '任务结论',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          color: ['#437FF1 ', '#EC6F39', ' #CC55F5'],
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ConclusionTitle
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: data.map(item => {
                item.name = item._id
                item.value = item.conclusionCount
                return item
              }),
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        barChart.setOption(option)
        window.addEventListener('resize', function() {
          barChart.resize()
        })
      })
    },
    patrolStatus() {
      this.$nextTick(() => {
      // 基于准备好的dom，初始化echarts实例
        const barChart = echarts.init(document.getElementById('patrolStatus'))
        const data = this.statisticalData.templateName
        const patrolStatus = data.map(item => { return item._id })
        const option = {
          title: {
            text: '巡检状态',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          color: ['#45E4D8', '#ECAC39', '#6B81DF', '#94B9FF'],
          legend: {
            orient: 'vertical',
            left: 'left',
            data: patrolStatus
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: data.map(item => {
                item.name = item._id
                item.value = item.nemeCount
                return item
              }),
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        barChart.setOption(option)
        window.addEventListener('resize', function() {
          barChart.resize()
        })
      })
    }
  }
}
</script>
<style scoped>
.grid-content {
    height: 100%;
    box-sizing: border-box;
}
.grid-bottom {
    margin:15px 0;
    height: calc( 80% - 60px);
}
.card-m {
    width:100%;
    height: 100%;
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    background-color: #fff;
    color: #303133;
    display: flex;
    align-items:center;/*垂直居中*/
}
.l-icon {
    width:25%;
    height: 100%;
}
.f-count {
    flex: 1;
    font-weight: 700;
    font-size: 32px;
    text-align: center;
}
.f-count .top-num span{
    font-size: 30px;
}
.f-count .bot-text {
    font-size: 14px;
    margin-top: 10px;
    color: #999;
    letter-spacing:3px;
}
.el-scrollbar__wrap {
    overflow-x: hidden !important;
}
</style>
