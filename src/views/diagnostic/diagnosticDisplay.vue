<template>
  <div id="m" class="kfScreenFull bg">
    <!-- 侧边树结构 -->
    <div class="side-tree" :class="{'collopseW':hideSide}">
      <div class="left-tree">
        <el-scrollbar style="height:100%;">
          <aside-tree @handleClickData="handleNodeClick" />
        </el-scrollbar>
      </div>
      <span class="arrow" @click="treeShow">
        <img src="../../assets/arrow.png" alt="">
      </span>
    </div>
    <div v-if="contentShow" class="diagnostic-container">
      <div class="top-content">
        <el-col :span="6" class="h100">
          <div id="diagnosticChart" style="width:100%;height:100%;" />
        </el-col>
        <el-col :span="18" class="h100">
          <div class="tabs">
            <div class="tab-item">
              <div v-for="(item,index) in tabImg" class="item-section all-active" :class="{active:num===index}" @click="tab(item,index)">
                <div class="circle">
                  <a href="javascript:;">
                    <img v-if="num===index" :src="item.imageUrl" alt="">
                    <img v-else :src="item.image_url" alt="">
                    <p>{{ item.name }}</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="check-btn">
            <el-button round icon="el-icon-back" class="go-back" @click="goBack()">单元雷达</el-button>
            <el-button v-if="startCheck" round @click="handleCheck()">开始检查</el-button>
            <span v-else class="m_l10">{{ name }} </span>
          </div>
        </el-col>
      </div>
      <div class="diagnostic-table">
        <el-table
          :data="tableData.filter(data => !search ||
            (data.score).toString().includes((search).toString())
            || search > data.score
          )"
          stripe
          :header-cell-style="{
            'background-color': '#06346B'}"
          height="100%"
          style="width:100%;background:transparent;"
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            prop="name"
            label="名称"
            width="150"
          />
          <el-table-column
            prop="score"
            label="评级"
            align="center"
            width="80"
          />
          <el-table-column
            prop="evaluate"
            label="评估"
            align="center"
            width="180"
          />
          <el-table-column
            prop="reason"
            align="center"
            label="疑似原因"
          />
          <el-table-column
            prop="proposal"
            align="center"
            label="处理方案"
          />
          <el-table-column
            label="操作"
            width="100"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleReadClick(scope.row)">详情</el-button>
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            align="right"
          >
            <template slot="header" slot-scope="scope">
              <el-input
                v-model="search"
                size="mini"
                placeholder="关键字"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog
        title="详情"
        :visible.sync="dialogVisible"
        width="36%"
      >
        <div class="dialogText">
          <span class="m_r10">
            选中值：<strong>{{ dialogVisibleTitle.selectValue }}</strong>
          </span>
          <span class="m_r10">
            取值类型：<strong>{{ dialogVisibleTitle.selectType }}</strong>
          </span>
          <span>名称：<strong>{{ dialogVisibleTitle.selectName }}</strong></span>
        </div>
        <el-table
          :data="selectTable"
          :header-cell-style="{'background-color': '#fafafa'}"
          :max-height="300"
          style="width: 100%;margin-bottom:20px;"
        >
          <el-table-column
            prop="dataName"
            label="名称"
            align="center"
            width="160"
          />
          <el-table-column
            align="center"
            width="180"
            label="时间"
          >
            <template slot-scope="scope">
              {{ scope.row.date|dateformat }}
            </template>
          </el-table-column>
          <el-table-column
            label="值"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.value|rounding }}
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import asideTree from '@/components/asiderTree/sideTree'
import Qs from 'qs'
export default {
  name: 'DiagnosticDisplay',
  components: {
    asideTree
  },
  filters: {
    rounding(value) {
      return Number(value).toFixed(3)
    }
  },
  data() {
    return {
      dialogVisible: false, // 弹框
      selectTable: [], // 弹框表格
      dialogVisibleTitle: {},
      contentShow: false,
      defaultProps: {
        label: 'name',
        isLeaf: 'isLeaf'
      },
      structureId: '', // 项目id
      hideSide: false,
      num: -1,
      name: '',
      tabImg: [],
      startCheck: true,
      tableData: [], // 表格数据
      search: '5', // 搜索关键字
      indicator: [], // 雷达图
      indicatorData: [],
      arrResult: []
    }
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {

    })
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.score == 1 || row.score == 2) {
        return 'bg-row'
      } else {
        return ''
      }
    },
    /**
     * 表格查看详情
     */
    handleReadClick(row) {
      this.dialogVisible = true
      this.dialogVisibleTitle.selectValue = row.selectValue.toFixed(3)
      this.dialogVisibleTitle.selectType = row.selectType
      this.dialogVisibleTitle.selectName = row.selectName
      this.selectTable = row.allParams
    },
    /**
     * 返回
     */
    goBack() {
      this.indicator.length = 0
      this.indicatorData.length = 0
      const arr = []
      for (const index in this.tabImg) {
        const item = this.tabImg[index].checkResult
        for (const v in item) {
          arr.push(item[v])
        }
        this.indicator.push({ text: this.tabImg[index].name, max: 5 })
        this.indicatorData.push(this.tabImg[index].average)
      }
      this.tableData = arr
      this.initEchart()
    },
    getTabImg() {
      this.$http.post('/S-Diagnosis/getDiagnosticStructureRootNodeByStructureId', Qs.stringify({ structureId: this.structureId })).then(res => {
        if (res.data.success) {
          this.tabImg = res.data.data
          this.tabImg.map(item => {
            item.imageUrl = item.image_url.replace('-1', '-2')
            return item
          })
        }
      })
    },
    /**
     * 点击侧边栏
     */
    handleNodeClick(data, node, child) {
      if (data.structureTypeName === '项目') {
        this.structureId = data.id
        this.contentShow = true
        this.getTabImg()
        this.tableData = []
        // this.initEchart()
      }
    },
    /**
     * 点击收起展开
     */
    treeShow() {
      this.hideSide = !this.hideSide
    },
    /**
     * tab切换
     */
    async tab(item, index) {
      this.num = index
      for (const i in this.tabImg) {
        if (this.tabImg[i].name === item.name) {
          this.tableData = this.tabImg[i].checkResult
          this.indicator = []
          this.indicatorData = []
          this.initEchart()
          for (const index2 in this.tabImg[i].checkResult) {
            this.indicator.push({ text: this.tabImg[i].checkResult[index2].name, max: 5 }) // 雷达图
            this.indicatorData.push(this.tabImg[i].checkResult[index2].score)
          }
        }
      }
    },
    initEchart() {
      this.$nextTick(() => {
        const myChart = echarts.init(document.getElementById('diagnosticChart'))
        // 绘制图表
        const option = {
          tooltip: {},
          color: ['#769FED'],
          radar: [{
            indicator: this.indicator,
            textStyle: {
              color: 'red'
            },
            center: ['50%', '50%'],
            radius: 72,
            splitNumber: 3,
            orient: 'horizontal', // 图例列表的布局朝向,默认'horizontal'为横向,'vertical'为纵向.
            name: {
              formatter: (text) => {
                text = text.replace(/\S{4}/g, function(match) {
                  return match + '\n'
                })
                return text
              },
              textStyle: {
                fontSize: 14, // 外圈标签字体大小
                color: '#ffffff'
                // color: '#B1CCFC' // 外圈标签字体颜色
              }
            },
            splitArea: { // 坐标轴在 grid 区域中的分隔区域，默认不显示。
              show: true,
              areaStyle: { // 分隔区域的样式设置。
                color: ['#141c42', '#141c42'] // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
              }
            },
            axisLine: { // 指向外圈文本的分隔线样式
              lineStyle: {
                color: '#153269'
              }
            },
            splitLine: {
              lineStyle: {
                color: '#477CDD ', // 分隔线颜色
                width: 1 // 分隔线线宽
              }
            }
          }],
          series: [{
            name: '雷达图',
            type: 'radar',
            itemStyle: {
              emphasis: {
                lineStyle: {
                  width: 1
                }
              }
            },
            data: [{
              value: this.indicatorData
            }]
          }]
        }
        myChart.setOption(option)
        window.onresize = function() {
          myChart.resize()
        }
      })
    },
    /**
     * 开始检测
     */
    async handleCheck() {
      this.indicator.length = 0
      this.startCheck = false
      let tag = 0
      let idLast = ''
      for (const index in this.tabImg) {
        this.initEchart()
        const id = this.tabImg[index].id
        if ((parseInt(index) + 1) === this.tabImg.length) {
          idLast = id
        }
        const name = this.tabImg[index].name
        this.indicator.push({ text: name, max: 5 })
        this.tabImg[index].checkItems = {}
        this.tabImg[index].checkResult = []
        this.tabImg[index].leiDa = 0
        this.tabImg[index].average = 0
        await this.$http.post('/S-Diagnosis/getDiagnosisProsByStructureIDType', Qs.stringify({ structureId: this.structureId, parentId: id })).then(res => {
          if (res.data.success) {
            const items = res.data.data
            this.tabImg[index].checkItems = items
            for (const index2 in items) {
              const value = items[index2].value
              const nameTwo = items[index2].name
              const diagnosticTypeId = items[index2].diagnosticTypeId
              tag++
              setTimeout(() => {
                this.name = `正在检查: ${name}共${items.length}项,正在检查第${parseInt(index2) + 1}项`
                this.$http.post('/S-Diagnosis/CalDiagnosisByDiagnosisTypeId', Qs.stringify({ diagnosticTypeId: diagnosticTypeId, structureId: this.structureId })).then(res => {
                  if (res.data.data !== null) {
                    if (typeof res.data.data.diagnosisResult === 'object') {
                      console.log(1111)
                      const threeData = res.data.data.diagnosisResult
                      threeData.value = value
                      threeData.name = nameTwo
                      threeData.selectName = res.data.data.selectName
                      threeData.selectType = res.data.data.selectType
                      threeData.selectValue = res.data.data.selectValue
                      threeData.allParams = res.data.data.allParams
                      this.tabImg[index].leiDa = this.tabImg[index].leiDa + threeData.score
                      this.tabImg[index].checkResult.push(threeData)
                      this.tabImg[index].average = (this.tabImg[index].leiDa / this.tabImg[index].checkResult.length).toFixed(2)
                      this.tableData = this.tabImg[index].checkResult
                    } else {
                      console.log(222)
                      const threeData = {}
                      threeData.value = ''
                      threeData.score = ''
                      threeData.name = nameTwo
                      threeData.evaluate = res.data.data.diagnosisResult
                      threeData.selectName = res.data.data.selectName
                      threeData.selectType = res.data.data.selectType
                      threeData.selectValue = res.data.data.selectValue
                      threeData.allParams = res.data.data.allParams
                      this.tabImg[index].checkResult.push(threeData)
                      this.tableData = this.tabImg[index].checkResult
                    }
                  } else {
                    const threeData = {}
                    threeData.value = ''
                    threeData.score = ''
                    threeData.name = nameTwo
                    threeData.evaluate = res.data.msg
                    // threeData.selectName = res.data.data.selectName
                    // threeData.selectType = res.data.data.selectType
                    // threeData.selectValue = res.data.data.selectValue
                    // threeData.allParams = res.data.data.allParams
                    this.tabImg[index].checkResult.push(threeData)
                    this.tableData = this.tabImg[index].checkResult
                  }
                  if ((parseInt(index) + 1) === this.tabImg.length && (parseInt(index2) + 1) === items.length && idLast === id) {
                    this.startCheck = true
                    this.indicatorData.length = 0
                    this.arrResult = []
                    for (const indexLeiDa in this.tabImg) {
                      this.indicatorData.push(this.tabImg[indexLeiDa].average)
                      for (const v in this.tabImg[indexLeiDa].checkResult) {
                        this.arrResult.push(this.tabImg[indexLeiDa].checkResult[v])
                      }
                      this.initEchart()
                    }
                    this.tableData = this.arrResult
                  }
                })
              }, tag * 1000)
            }
          }
        })
      }
    }
  }
}
</script>
<style scoped>

.dialogText {
    line-height: 50px;
    background: #ebf5fd;
    color: #333;
    margin-bottom:10px;
    border-left: 3px solid #70b8f0;
    text-indent: 10px;
}
.kfScreenFull {
    width:100%;
    height: 100%;
    position: relative;
    overflow: hidden;
}
.side-tree {
    position: absolute;
    left:0;
    width:16%;
    height: 100%;
    z-index:510;
    background:url(../../assets/side_bg.png) no-repeat;
    background-size:100% 100%;
    transition:all .5s linear;
}
.side-tree .left-tree {
   width:calc(100% - 20px);
   margin:30px 0px 30px 20px;
   height: calc(100% - 60px);
}
.side-tree .tree-node {
  background:none;
  color:#97E3FF;
  font-size:16px;
}
.side-tree .arrow {
    position: absolute;
    right:0;
    top:50%;
    width:22px;
    height:44px;
    transform: translate(-50%,-50%);
    z-index: 500;
    transform: rotate(0deg);
    transition:all .5s linear;
    cursor: pointer;
}
.arrow img {
    width:100%;
    height:100%;
    display:block;
}
.side-tree.collopseW {
    width:0;
}
.side-tree.collopseW .left-tree {
     display: none;
}
.side-tree.collopseW .arrow {
    right:-22px;
   transform: rotate(-180deg);
}
.bg {
   background: url(../../assets/energy_bg.png);
   background-size:100% 100%;
}
.diagnostic-container {
    padding:20px;
    width:100%;
    height: 100%;
    box-sizing: border-box;
}
.top-content {
    height: 40%;
    width: 100%;
}
.diagnostic-table {
    margin-top:20px;
    height: calc( 60% - 40px );
    width:calc( 100% - 20px );
    border: 1px solid rgba(0,180,220,0.5);
    box-shadow: 0 0 3rem rgba(100,200,255,.5) inset;
    background: rgba(0,0,0,.3);
    padding:10px;
}

.tabs {
    width:100%;
    height: calc( 100% - 50px );
}
.tabs .tab-item{
  width:100%;
  height: 100%;
  display: flex;
  align-items: center;
	justify-content: center;
  position: relative;
}
.tabs .tab-item .item-section{
    flex: 1;
    padding:20px;
    text-align: center;
}
.tabs .tab-item .item-section.active {
  background:rgba(2,29,61,0.53);
}
.tabs .tab-item .item-section a p {
  color: #fff;
    /* color:#B1CCFC; */
    margin-top:15px;
}
.tabs .tab-item .item-section a {
    width:100%;
    height: 100%;
    display: block;
    color: #fff;
    /* color: #B1CCFC; */
    text-align: center;
    margin:0 auto;
    text-decoration: none;
}
.check-btn {
  height: 50px;
  width:100%;
  position: relative;
  display: flex;
	align-items: center;
	justify-content: center;
}
.check-btn span {
  color:#fff;
  /* color:#93DDFA; */
  font-size:16px;
  font-weight: 600;
}
.check-btn .el-button {
    padding:10px 30px;
    background:#021B46;
    border:2px solid #91DBF8;
    color:#fff;
    /* color:#93DDFA; */
    font-size:16px;
}
.check-btn .go-back {
  position: absolute;
  top:0;
  right:10px;
  color:#fff;
}
</style>
