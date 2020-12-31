<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <div class="grid-content bg-fff" style="height: calc(100vh - 110px);padding:10px;overflow-y:auto;">
        <el-tree
          ref="sideTree"
          :props="defaultProps"
          :data="treeData"
          accordion
          show-checkbox
        />
      </div>
    </el-col>
    <el-col :span="18">
      <div class="grid-content" style="background#fff;">
        <div class="top-btn" style="margin-bottom:20px;">
          <el-date-picker
            v-model="beginDate"
            type="date"
            size="small"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
          <el-button type="primary" size="small" class="m_l10" @click="handleSearch">搜索</el-button>
        </div>
        <el-card>
          <el-table
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column
              prop="name"
              label="锅炉房名称"
            />
            <el-table-column
              prop="map.input.outDoorAvgWDu"
              :formatter="filterAvg"
              label="平均温度"
            />
            <el-table-column
              prop="map.gas.jiYouMBZongLiang"
              label="目标燃气总量"
            />
            <el-table-column
              prop="map.power.jiYouMBZongLiang"
              label="目标电总量"
            />
            <el-table-column
              prop="map.water.jiYouMBZongLiang"
              label="目标水总量"
            />
          </el-table>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import Qs from 'qs'
import utils from '@/utils/creatTree'
export default {
  name: 'EnergyPrediction',
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      beginDate: '',
      tableData: []
    }
  },
  created() {
    this.getTreeData()
  },
  methods: {
    /**
       * 平均温度保留两位小数
       */
    filterAvg(rows) {
      const avg = rows.map.input.outDoorAvgWDu
      return avg.toFixed(2)
    },
    /**
       * 搜索查询
       */
    handleSearch() {
      var checkedArr = this.$refs.sideTree.getCheckedNodes()
      if (checkedArr.length === 0) {
        return this.$message({
          message: '警告,请勾选项目名称',
          type: 'warning'
        })
      } else if (this.beginDate === '') {
        return this.$message({
          message: '警告,请选择时间',
          type: 'warning'
        })
      } else {
        const resultArr = []
        checkedArr.forEach(item => {
          if (item.structureTypeName === '项目') {
            resultArr.push(item.id)
          }
        })
        this.$http.post('/S-Energy-Task/getByDateStructureId', Qs.stringify({ StructureId: resultArr, beginDate: this.beginDate }, { indices: false }))
          .then(res => {
            if (res.data.success) {
              this.tableData = res.data.data
            } else {
              this.tableData = []
            }
          })
      }
    },
    /**
     * 加载侧边栏树结构
     */
    getTreeData() {
      this.$http.post('/S-Base/getCompanyStructureByRole', Qs.stringify({ type: 1 }))
        .then(res => {
          if (res.data.success) {
            this.treeData = utils.creatTree(res.data.data)
            // this.options = this.IterationDelateMenuChildren(treeData)
          }
        })
    }
  }
}
</script>
<style scoped>

</style>
