<template>
  <el-row :gutter="20">
    <div class="grid-content">
      <div class="table-content">
        <el-col :span="14">
          <div ref="header" class="top-btn" style="padding-bottom:10px;">
            <el-button type="success" icon="el-icon-circle-plus-outline" size="small" @click="handleAdd('添加')">新增</el-button>
          </div>
          <t-table
            :table-height="this.tableHeight"
            :hidden="true"
            :table-data="tableMainData"
            :table-title-name="tableTitleName"
            @handleRowClick="handleRowClick"
            @handleClick="handleBtnClick"
          />
        </el-col>
        <el-col :span="10">
          <div ref="header" class="top-btn" style="padding-bottom:10px;">
            <el-button type="success" icon="el-icon-circle-plus-outline" size="small" @click="handleAttachAdd('添加')">新增</el-button>
          </div>
          <t-table :table-height="this.tableHeight" :hidden="true" :table-data="tableData" :table-title-name="tableFname" @handleClick="handleFClick" />
        </el-col>
      </div>
      <!-- 添加或编辑 -->
      <el-dialog :title="title" :visible.sync="dialogVisible" width="30%">
        <el-form ref="form" :model="form" label-width="100px" size="small">
          <el-form-item label="名称" prop="devTypeName">
            <el-input v-model="form.devTypeName" autocomplete="off" />
          </el-form-item>
          <el-form-item label="型号" prop="specification">
            <el-input v-model="form.specification" autocomplete="off" />
          </el-form-item>
          <el-form-item label="版本" prop="version">
            <el-input v-model="form.version" autocomplete="off" />
          </el-form-item>
          <el-form-item>
            <el-button @click="resetForm('form')">取 消</el-button>
            <el-button type="primary" @click="submitForm('form')">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 附表添加或编辑 -->
      <el-dialog :title="title" :visible.sync="addOrEditVisible" width="30%">
        <el-form ref="attachForm" :model="attachForm" label-width="100px" size="small">
          <el-form-item label="参数名称" prop="paramName">
            <el-input v-model="attachForm.paramName" autocomplete="off" />
          </el-form-item>
          <el-form-item label="编码" prop="paramCode">
            <el-input v-model="attachForm.paramCode" autocomplete="off" />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="attachForm.sort" autocomplete="off" />
          </el-form-item>
          <el-form-item>
            <el-button @click="handleResetForm('attachForm')">取 消</el-button>
            <el-button type="primary" @click="handleSubmitForm('attachForm')">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </el-row>
</template>
<script>
import Qs from 'qs'
import tTable from '@/components/TableBase/tablePage'
import { mainDevTable, fDevTable } from '../../config/tableTitle/systemTitleName'
import publicMinxin from '@/utils/tableHeight.mixin'
export default {
  name: 'WirelessDevType',
  components: {
    tTable
  },
  mixins: [publicMinxin],
  data() {
    return {
      title: '',
      devTypeName: '',
      tableTitleName: [], // 表头
      tableFname: [],
      tableMainData: [],
      tableData: [],
      form: {
        devTypeName: '',
        specification: '',
        version: '',
        remark: '',
        sort: ''
      },
      selectedIndex: '',
      attachForm: {
        paramName: '',
        paramCode: '',
        sort: 1
      },
      dialogVisible: false,
      addOrEditVisible: false,
      kfDevTypeId: ''
    }
  },
  mounted() {
    this.tableTitleName = mainDevTable
    this.tableFname = fDevTable
    this.getDevType()
  },
  methods: {
    getDevType() {
      this.$http.post('/S-Base/getAllKfDevType').then(res => {
        this.tableMainData = res.data.data.list
      })
    },
    // 添加
    handleAdd(name) {
      this.title = name
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
      })
    },
    /**
     * 附表添加
     */
    handleAttachAdd() {
      if (this.kfDevTypeId === '') {
        this.$message({
          message: '请选择所属名称',
          type: 'warning'
        })
      } else {
        this.addOrEditVisible = true
        this.$nextTick(() => {
          this.$refs['attachForm'].resetFields()
        })
        this.attachForm = { paramName: '', paramCode: '', sort: 1 }
        this.title = `(${this.devTypeName}) 添加`
      }
    },
    /**
     * 点击当前行表格
     */
    handleRowClick(row, event, column) {
      this.devTypeName = row.devTypeName
      this.kfDevTypeId = row.id
      this.$http.post('/S-Base/getKfDevTypeParamByKfDevTypeId', Qs.stringify({ kfDevTypeId: row.id })).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.list
        }
      })
    },
    /**
     * 表格编辑或删除
     */
    handleBtnClick(index, rows, data, name) {
      if (name === '编辑') {
        this.title = '编辑'
        const row = data[index]
        this.selectedIndex = index
        this.form.id = row.id
        this.form.devTypeName = row.devTypeName
        this.form.specification = row.specification
        this.form.version = row.version
        this.dialogVisible = true
      } else {
        // 删除
        this.handleDelete(index, data)
      }
    },
    handleDelete(index, data) {
      this.$confirm('确认删除此项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/S-Base/delKfDevType', Qs.stringify({ kfDevTypeId: data[index].id })).then(res => {
          if (res.data.success) {
            data.splice(index, 1)
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$notify({
              title: '失败',
              message: res.data.msg,
              type: 'error'
            })
          }
        })
      })
    },
    /** 附表编辑或删除 */
    handleFClick(index, rows, data, name) {
      if (name === '编辑') {
        this.title = `(${this.devTypeName}) 编辑`
        const row = data[index]
        this.addOrEditVisible = true
        this.attachForm.id = row.id
        this.selectedIndex = index
        this.attachForm.paramName = row.paramName
        this.attachForm.paramCode = row.paramCode
        this.attachForm.sort = row.sort
      } else {
        this.handleDeleteClick(index, data)
      }
    },
    /** 附表删除 */
    handleDeleteClick(index, data) {
      this.$confirm('确认删除此项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/S-Base/delKfDevTypeParam', Qs.stringify({ kfDevTypeParamId: data[index].id })).then(res => {
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
     * 弹框确定
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.id) {
            // 编辑
            this.$http.post('/S-Base/updateKfDevType', Qs.stringify(this.form)).then(res => {
              if (res.data.success) {
                this.$set(this.tableMainData, this.selectedIndex, res.data.data)
                this.$notify({
                  title: '成功',
                  message: '编辑成功',
                  type: 'success'
                })
                this.$refs[formName].resetFields()
                this.dialogVisible = false
              }
            })
          } else {
            // 添加
            this.$http.post('/S-Base/insertKfDevType', Qs.stringify(this.form)).then(res => {
              if (res.data.success) {
                this.tableMainData.push(res.data.data)
                this.$notify({
                  title: '成功',
                  message: '添加成功',
                  type: 'success'
                })
                this.$refs[formName].resetFields()
                this.dialogVisible = false
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * 弹框取消
     */
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    // 附表确定
    handleSubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.attachForm.id) {
            // 编辑
            this.$http.post('/S-Base/updateKfDevTypeParam', Qs.stringify(this.attachForm)).then(res => {
              if (res.data.success) {
                this.$set(this.tableData, this.selectedIndex, res.data.data)
                this.$notify({
                  title: '成功',
                  message: `(${this.devTypeName})编辑成功`,
                  type: 'success'
                })
                this.$refs[formName].resetFields()
                this.addOrEditVisible = false
              }
            })
          } else {
            // 添加
            this.attachForm.kfDevTypeId = this.kfDevTypeId
            this.$http.post('/S-Base/insertKfDevTypeParam', Qs.stringify(this.attachForm)).then(res => {
              if (res.data.success) {
                this.tableData.push(res.data.data)
                this.$notify({
                  title: '成功',
                  message: `(${this.devTypeName})添加成功`,
                  type: 'success'
                })
                this.$refs[formName].resetFields()
                this.addOrEditVisible = false
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /** 附表取消 */
    handleResetForm(formName) {
      this.$refs[formName].resetFields()
      this.addOrEditVisible = false
    }
  }
}
</script>
<style scoped>
</style>
