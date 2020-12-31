<template>
  <div class="grid-content">
    <div ref="header" class="top-btn">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
        <el-form-item label="项目名称：">
          <t-cascader v-model="formInline.structureId" @handleCascaderChange="handleItemChange" />
        </el-form-item>
        <el-form-item label="小区:">
          <el-select v-model="formInline.communityId" clearable placeholder="请选择">
            <el-option v-for="(item,index) in communityData" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型:">
          <el-select v-model="formInline.kfDevTypeId" placeholder="请选择">
            <el-option v-for="(item,index) in devTypeData" :key="index" :label="item.devTypeName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否发放:">
          <el-select v-model="formInline.haveReceived" clearable placeholder="请选择">
            <el-option v-for="(item,index) in sendData" :key="index" :label="item.value" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备标识:">
          <el-input v-model="formInline.id" placeholder="设备标识" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="handleSearch">查询</el-button>
          <el-button type="danger" size="mini" @click="handleAdd('添加')">新增</el-button>
          <span style="display:inline-block;margin:0 10px;">
            <el-upload :headers="myHeaders" :http-request="submitUpload" action>
              <el-button size="mini" type="success">导入</el-button>
            </el-upload>
          </span>
          <el-button type="primary" size="mini" @click="handleDown()">下载模板</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-content">
      <g-table
        ref="devTable"
        :data="tableData"
        :max-height="this.tableHeight"
        :page="page"
        :table-title-name="tableTitle"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
        @handleRowClick="handleExpandChange"
        @handleEditOrDel="handleEditOrDel"
        @handleExpandEdit="handleExpandEdit"
      />
    </div>
    <!-- 添加或编辑 -->
    <addOrEditDev
      v-if="addJfDevDialog.show"
      :is-show="addJfDevDialog.show"
      :title="addJfDevDialog.title"
      :dialog-row="addJfDevDialog.dialogRow"
      @getTableData="getTableData"
      @closeDialog="closeDialog"
    />
    <!-- 折叠表格编辑 -->
    <el-dialog :title="dialogTitle" :visible.sync="expandVisible" width="30%">
      <el-form ref="editForm" :model="editForm" label-width="100px" class="demo-ruleForm" size="small">
        <el-form-item label="实施数据点" prop="realdataId">
          <el-select v-model="editForm.realdataId" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading">
            <el-option v-for="( item , index ) in dataNameArr" :key="index" :label="item.dataName" :value="item._id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleExpandReset('editForm')">取 消</el-button>
          <el-button type="primary" @click="handleExpandSubmit('editForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import Qs from 'qs'
import tCascader from '../../components/base/sync-cascader'
import gTable from '../../components/TableBase/jfdevTable'
import addOrEditDev from './components/jfDevAddOrEdit'
import { jfDevData } from '../../config/tableTitle/dataTitleName'
import publicMinxin from '@/utils/tableHeight.mixin'
export default {
  name: 'JfDev',
  components: {
    tCascader,
    addOrEditDev,
    gTable
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
      myHeaders: { token: this.$store.state.token },
      sendData: [
        { value: '全部', id: '' },
        { value: '已发放', id: 1 },
        { value: '未发放', id: 0 }
      ],
      communityData: [], // 小区
      boilerRoom: [], // 锅炉房
      devTypeData: [], // 设备类型
      tableData: [],
      tableTitle: jfDevData, // 表头
      page: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      addJfDevDialog: {
        show: false,
        title: '添加',
        dialogRow: {}
      },
      expandVisible: false, // 折叠编辑弹框
      dialogTitle: '',
      editForm: {
        realdataId: '' // 实施数据点
      },
      loading: false,
      dataNameArr: [],
      tableRow: {}, // 表格当前行
      expandRow: {} // 折叠编辑
    }
  },
  created() {
    this.getDevType()
  },
  mounted() {},
  methods: {
    /** 导入 */
    submitUpload(item) {
      const formData = new FormData()
      formData.append('excelFile', item.file)
      this.$http({
        method: 'post',
        url: 'S-Base/insertByImport?excelFile',
        data: formData,
        responseType: 'blob'
      })
        .then(response => {
          this.download(response.data, '金房设备批量导入模板.xls')
        })
        .then(res => {
          this.$notify({
            title: '成功',
            message: '上传成功',
            type: 'success'
          })
        })
    },
    /**
     * 下载模板
     */
    handleDown() {
      this.$http({
        method: 'post',
        url: 'S-Base/downstudents',
        responseType: 'blob'
      })
        .then(response => {
          this.download(response.data, '设备批量导入模板.xls')
        })
        .then(res => {})
    },
    /**
     * 下载
     * @return {[type]} [description]
     */
    download(data, fileName) {
      if (!data) return
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
    },
    /**
     * 获取项目名称
     */
    handleItemChange(val, item) {
      if (val.length === 0 || item.length === 0) {
        this.formInline.structureId = ''
      } else {
        const node = item[item.length - 1]
        this.formInline.structureId = node.id
        this.getBoilerRoom(val[val.length - 1])
        this.getCommunityData(val[val.length - 1])
      }
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
    handleSearch() {
      this.getTableData()
    },
    getTableData() {
      const param = {
        structureId: this.formInline.structureId, // 项目id
        communityId: this.formInline.communityId, // 小区id
        kfDevTypeId: this.formInline.kfDevTypeId, // 设备id
        haveReceived: this.formInline.haveReceived, // 是否发放
        id: this.formInline.id, // 设备标识
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize
      }
      this.$http.post('/S-Base/getKfDev', Qs.stringify(param)).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.list
          this.page.total = res.data.data.total
          for (const i in this.tableData) {
            this.$set(this.tableData[i], 'children', [])
          }
        }
      })
    },
    handleCurrentChange(val) {
      this.page.pageNo = val
      this.getTableData()
    },
    handleSizeChange(val) {
      this.page.pageNo = 1
      this.page.pageSize = val
      this.getTableData()
    },
    /** 添加 */
    handleAdd(val) {
      this.addJfDevDialog.title = val
      this.addJfDevDialog.show = true
    },
    /** 编辑 */
    handleEditOrDel(index, row, data, name) {
      if (name === '编辑') {
        this.handleAdd('编辑')
        this.addJfDevDialog.dialogRow = row
      } else {
        // 删除
        this.handleDelete(index, row, data)
      }
    },
    /**
     * 关闭弹框
     *
     */
    closeDialog() {
      this.addJfDevDialog.show = false
    },
    /** 删除 */
    handleDelete(index, row, data) {
      this.$confirm('确认删除此项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/S-Base/delKfDev', Qs.stringify({ kfDevid: data[index].id })).then(res => {
          if (res.data.success) {
            data.splice(index, 1)
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            })
          }
        })
      })
    },
    /**
     * 展开当前行
     */
    handleExpandChange(row, expandedRows) {
      if (expandedRows.length !== 0) {
        // 展开
        this.tableRow = row
        const devId = row.kfDevTypeId || row.devTypeId
        this.$http.post('/S-Base/getKfDevParamConfigRealValue', Qs.stringify({ kfDevId: row.id, kfDevTypeId: devId })).then(res => {
          if (res.data.success) {
            row.children = res.data.data
          }
        })
      }
    },
    /** 编辑折叠表格 */
    handleExpandEdit(index, row) {
      this.expandRow = row
      this.editForm.realdataId = this.tableRow.devCode
      this.dialogTitle = '编辑' + '(' + row.paramName + ')'
      this.expandVisible = true
    },
    /**
     * 实时数据点搜索
     */
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.getRealData(query)
        }, 200)
      } else {
        this.dataNameArr = []
      }
    },
    getRealData(query) {
      this.$http.post('/S-RealData/getRealByDataName', Qs.stringify({ dataName: query })).then(res => {
        if (res.data.success) {
          this.dataNameArr = res.data.data
        }
      })
    },
    /** 编辑提交 */
    handleExpandSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const obj = {
            id: this.expandRow.devParamConfigId,
            kfDevId: this.tableRow.id,
            kfDevTypeParamId: this.expandRow.devTypeParamId,
            realdataId: this.editForm.realdataId
          }
          this.$http.post('/S-Base/updateKfDevParamConfig', Qs.stringify(obj)).then(res => {
            if (res.data.success) {
              const data = res.data.data
              this.expandRow.devParamConfigId = data.DevParamConfig.id
              this.tableRow.id = data.DevParamConfig.kfDevId
              this.expandRow.devTypeParamId = data.DevParamConfig.kfDevTypeParamId
              this.editForm.realdataId = data.DevParamConfig.realdataI
              this.expandRow.realDataObj = Object.assign({}, this.expandRow.realDataObj, { value: data.realData.value, date: data.realData.date })
              this.$notify({
                title: '成功',
                message: res.data.msg,
                type: 'success'
              })
              this.$refs[formName].resetFields()
              this.expandVisible = false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleExpandReset(formName) {
      this.$refs[formName].resetFields()
      this.expandVisible = false
    }
  }
}
</script>
<style scoped>
</style>
