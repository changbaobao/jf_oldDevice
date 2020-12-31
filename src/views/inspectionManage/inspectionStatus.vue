<template>
  <div class="grid-content">
    <div class="top-btn">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
        <el-form-item label="项目" required>
          <t-cascader v-model="formInline.structId" @handleCascaderChange="handleCascaderChange" />
        </el-form-item>
        <el-form-item label="日期" required>
          <el-date-picker
            v-model="formInline.date"
            size="small"
            style="width:240px;"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="任务结论">
          <el-select v-model="formInline.conclusion" placeholder="任务结论" style="width:140px;" clearable size="small">
            <el-option
              v-for="item in conclusionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="巡检状态">
          <el-select v-model="formInline.patrolStatus" placeholder="巡检状态" style="width:140px;" clearable size="small">
            <el-option
              v-for="item in patrolStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-content">
      <el-table
        ref="dTable"
        :data="tableData"
        stripe
        :max-height="maxHeight"
        :header-cell-style="{
          'background-color': '#fafafa'}"
        style="width: 100%"
      >
        <el-table-column
          label="日期"
          width="120"
        >
          <template slot-scope="scope">{{ scope.row.date|filterDate }}</template>
        </el-table-column>
        <el-table-column
          prop="structName"
          label="项目名称"
          width="140"
        />
        <el-table-column
          prop="templateName"
          width="140"
          label="巡检项目"
        />
        <el-table-column label="数据点列表" align="center" width="200">
          <template slot-scope="scope">
            <div v-for="item in scope.row.dataPoints">
              <span>{{ item.dataName }}</span>:
              <span>{{ item.inputValue }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="taskDuration"
          width="140"
          align="center"
          label="任务时长（小时）"
        />
        <el-table-column
          prop="conclusion"
          label="任务结论"
        />
        <el-table-column
          prop="patrolStatus"
          width="120"
          label="巡检状态"
        />
        <el-table-column
          align="center"
          label="巡检照片"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" :disabled="scope.row.imageUrls==null" @click="handleImageView(scope.$index,scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="remarks"
          width="120"
          label="巡检备注"
        />
        <el-table-column
          width="160"
          align="center"
          label="实际完成时间"
        >
          <template slot-scope="scope">{{ scope.row.effectEndTime|dateformat }}</template>
        </el-table-column>
        <el-table-column
          width="160"
          align="center"
          label="计划完成时间"
        >
          <template slot-scope="scope">{{ scope.row.planEndTime|dateformat }}</template>
        </el-table-column>
        <el-table-column
          width="160"
          align="center"
          label="起始时间"
        >
          <template slot-scope="scope">{{ scope.row.beginTime|dateformat }}</template>
        </el-table-column>
        <el-table-column
          prop="Executor"
          label="执行人"
        />
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="text" style="color:#f56c6c;" size="small" icon="el-icon-delete" @click="handleDeleteClick(scope.$index,scope.row,tableData)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="巡检照片"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-carousel indicator-position="none" :autoplay="false">
        <el-carousel-item v-for="item in imageList" :key="item">
          <img :src="item" style="width:100%;height:100%;background-size:100%;" @click="imageUrlOpen(item)">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>
<script>
import tCascader from '@/components/base/sync-cascader'
import Qs from 'qs'
export default {
  name: 'InspectionStatus',
  components: {
    tCascader
  },
  data() {
    return {
      conclusionList: [// 任务结论
        { value: '运行正常', label: '运行正常' },
        { value: '数值异常', label: '数值异常' },
        { value: '正常停机', label: '正常停机' },
        { value: '维护中 待维修', label: '维护中 待维修' },
        { value: '任务异常结束', label: '任务异常结束' }
      ],
      patrolStatusList: [// 巡检状态
        { value: '待巡检', label: '待巡检' },
        { value: '超时巡检', label: '超时巡检' },
        { value: '正常巡检', label: '正常巡检' },
        { value: '超时未巡检', label: '超时未巡检' }
      ],
      formInline: {
        structId: '', // 项目id
        date: '', // 日期
        conclusion: '', // 任务完成
        patrolStatus: '' // 巡检状态
      },
      maxHeight: 0,
      tableData: [],
      page: {
        total: 100,
        currentPage: 1,
        pageSize: 10
      },
      dialogVisible: false,
      imageList: [] // 图片展示
    }
  },
  mounted() {
    this.listenResize()
    window.addEventListener('resize', this.listenResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.listenResize)
  },
  methods: {
    listenResize() {
      this.$nextTick(() => {
        this.maxHeight = window.innerHeight - this.$refs.dTable.$el.offsetTop - 30
      })
    },
    imageUrlOpen(item) {
      window.open(item)
    },
    // 查看照片
    handleImageView(index, row) {
      this.dialogVisible = true
      this.imageList = row.imageUrls
    },
    /**
     * 获取项目id
     */
    handleCascaderChange(ids) {
      if (ids.length === 0) {
        this.formInline.structId = ''
      } else {
        this.formInline.structId = ids[ids.length - 1]
      }
    },
    /**
     * 点击搜索
     */
    onSubmit() {
      if (this.formInline.structId === '' || this.formInline.date.length === 0) {
        return this.$notify({
          title: '警告',
          message: '项目和时间为必选项',
          type: 'warning'
        })
      }
      const param = {
        structId: this.formInline.structId,
        beginTime: this.formInline.date[0],
        endTime: this.formInline.date[1],
        patrolStatus: this.formInline.patrolStatus,
        conclusion: this.formInline.conclusion
      }
      this.$http.post('/S-EquipmentInspection/getEquPatTaskBystructIdAndTime', Qs.stringify(param)).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data
        }
      })
    },
    /**
     * 删除
     */
    handleDeleteClick(index, row, data) {
      this.$confirm('此操作将永久删除[' + data[index].templateName + '], 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doDeleteData(index, row, data)
      }).catch(() => {})
    },
    doDeleteData(index, row, data) {
      this.$http.post(`S-EquipmentInspection/delEquipmentPatrolTaskByID?taskId=${row._id}`).then(res => {
        if (res.data.success) {
          data.splice(index, 1)
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          })
        }
      })
    }
  }
}
</script>
<style scoped>

</style>
