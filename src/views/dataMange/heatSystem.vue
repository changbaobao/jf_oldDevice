<template>
  <div class="heatSystem">
    <div ref="header">
      <el-form :inline="true" :model="form">
        <el-form-item label="项目">
          <t-cascader v-model="form.structureId" style="width:200px;" @handleCascaderChange="handleItemChange" />
        </el-form-item>
        <el-form-item label="小区">
          <t-select
            v-model="form.communtityId"
            style="width:160px;"
            :placeholder="placeSelect"
            :data="communityData"
            :select-val="form.communtityId"
            @handleSelect="handleCommunity"
          />
        </el-form-item>
        <el-form-item label="锅炉房">
          <t-select
            v-model="form.boilerRoomId"
            style="width:160px;"
            :placeholder="placeSelect"
            :data="boilerRoomData"
            :select-val="form.boilerRoomId"
            @handleSelect="handleboiler"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
          <el-button type="success" size="small" @click="addHeatSystemClick('add')">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        :max-height="this.tableHeight"
        style="width: 100%;text-align:center;"
        :header-cell-style="{
          'background-color': '#fafafa'}"
      >
        <el-table-column prop="companyName" label="项目名字" />
        <el-table-column prop="communityName" label="小区名字" />
        <el-table-column prop="boilerName" label="锅炉房名字" />
        <el-table-column prop="systemName" label="系统名字" />
        <el-table-column prop="systemArea" label="系统面积" />
        <el-table-column width="100" label="编辑">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRow(scope.$index,scope.row,tableData )">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column width="100" label="删除">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRow(scope.$index,tableData )">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增或编辑弹框 -->
    <addOrEditDialog
      v-if="addHeatSystemDialog.show"
      :is-show="addHeatSystemDialog.show"
      :structure-id="form.structureId"
      :title="addHeatSystemDialog.title"
      :dialog-row="addHeatSystemDialog.dialogRow"
      @getTableData="getTableData"
      @closeDialog="addHeatSystemDialog.show=false"
    />
  </div>
</template>
<script>
import Qs from 'qs'
import tSelect from '@/components/base/t-select'
import tCascader from '@/components/base/syncB-cascader'
import addOrEditDialog from './components/heatSystemAddDialog'
import publicMinxin from '@/utils/tableHeight.mixin'
export default {
  name: 'HeatSystem',
  components: {
    tSelect,
    tCascader,
    addOrEditDialog
  },
  mixins: [publicMinxin],
  data() {
    return {
      form: {
        structureId: '',
        communtityId: '',
        boilerRoomId: ''
      },
      addHeatSystemDialog: {
        show: false,
        dialogRow: {},
        title: '添加'
      },
      placeSelect: '请选择',
      communityData: [], // 小区
      boilerRoomData: [], // 锅炉房
      tableTitle: [], // 表头
      page: {
        currentPage: 1, // 当前页
        pageSize: 10, // 分页
        total: 0 // 总条数
      },
      tableData: []
    }
  },
  methods: {
    /**
     * 获取项目名称
     */
    handleItemChange(val, item) {
      if (val.length == 0) {
        this.form.structureId = ''
      } else {
        this.form.structureId = val[val.length - 1]
      }
      this.getBoilerRoom(this.form.structureId)
      this.getCommunityData(this.form.structureId)
    },
    /**
     * 根据项目获取小区
     */
    getCommunityData(id) {
      this.$http.post('/S-Base/getCommunityByStructureId', Qs.stringify({ structureId: id })).then(res => {
        const data = res.data.data
        const arr = []
        for (const i in data) {
          const obj = { label: data[i].name, value: data[i].id }
          arr.push(obj)
        }
        this.communityData = arr
      })
    },
    // 查询获取小区id
    handleCommunity(val) {
      this.form.communtityId = val
    },
    getBoilerRoom(id) {
      this.$http.post('/S-Base/selectByBoilerRoom', Qs.stringify({ structureId: id })).then(res => {
        if (res.data.success) {
          const data = res.data.data
          const arr = []
          for (const i in data) {
            const obj = { label: data[i].name, value: data[i].id }
            arr.push(obj)
          }
          this.boilerRoomData = arr
        }
      })
    },
    // 查询获取锅炉房的id
    handleboiler(val) {
      this.form.boilerRoomId = val
    },
    deleteRow(index, rows) {
      const _this = this
      this.$confirm('此操作将彻底删除用户[' + rows[index].systemName + '], 确定吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http
          .get('/S-Base/delHeatSystem', {
            params: {
              id: rows[index].id
            }
          })
          .then(function(response) {
            if (response.data.success) {
              rows.splice(index, 1)
              _this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              })
            }
          })
      })
    },
    /**
     * 编辑
     */
    editRow(index, row, data) {
      this.addHeatSystemDialog.show = true
      this.addHeatSystemDialog.title = '编辑'
      this.addHeatSystemDialog.dialogRow = { ...row }
    },
    /**
     * 新增
     */
    addHeatSystemClick() {
      if (this.form.structureId === '') {
        return this.$message({
          message: '请选择项目',
          type: 'warning'
        })
      }
      this.addHeatSystemDialog.show = true
      this.addHeatSystemDialog.title = '添加'
    },
    /**
     * 搜索查询
     */
    handleSearch() {
      if (this.form.structureId == '' || this.form.structureId == null) {
        return this.$notify({
          title: '请选择项目',
          type: 'error'
        })
      }
      this.getTableData()
    },
    getTableData() {
      const params = { ...this.form, pageNo: this.page.currentPage, pageSize: this.page.pageSize }
      this.$http.post('/S-Base/getByHeatSystem', Qs.stringify(params)).then(res => {
        const { list, total } = res.data.data
        this.tableData = list
        this.page.total = total
      })
    }
  }
}
</script>
