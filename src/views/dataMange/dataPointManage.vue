<template>
  <div class="dataPointManage">
    <div ref="header" class="grid-content" style="padding:0 10px">
      <div class="top-btn" style="padding-bottom:10px;">
        <el-button type="success" size="small" @click="handleAdd('读写')">读写</el-button>
        <el-button type="warning" size="small" @click="handleAdd('存历史')">存历史</el-button>
        <el-button type="danger" size="small" @click="handleAdd('关联')">关联</el-button>
        <span style="display:inline-block;" class="m_l10">
          <el-upload :headers="myHeaders" :http-request="submitUpload" action>
            <el-button size="small" type="success">导入</el-button>
          </el-upload>
        </span>
        <span style="display:inline-block;" class="m_l10">
          <el-upload :headers="myHeaders" :http-request="batchUpload" action>
            <el-button size="small" type="primary">批量删除导入</el-button>
          </el-upload>
        </span>
        <el-button type="success" size="small" @click="handleExport">导出</el-button>
        <span class="fr">
          <el-cascader
            v-model="projectVal"
            placeholder="选择项目"
            style="width:150px;"
            :options="projectList"
            size="small"
            filterable
            :props="{
              label: 'name',
              value: 'id',
              children: 'children'
            }"
            expand-trigger="hover"
            :show-all-levels="false"
            @change="handleItemChange"
          />
          <!-- <t-cascader style="width:150px;" @handleCascaderChange="handleItemChange" v-model="projectVal"></t-cascader> -->
          <el-select v-model="grouping" clearable placeholder="分组" size="small" style="width:120px;">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <span>
            <span>
              <el-input v-model="keywords" size="small" style="width:180px;" placeholder="通过数据点名称进行搜索" />
            </span>
            <span>
              <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
            </span>
          </span>
        </span>
        <el-button type="danger" size="small" :disabled="this.multipleSelection.length===0" @click="handleBatchDelete">批量删除</el-button>
      </div>
      <div class="table-content">
        <data-point-table
          ref="dTable"
          :table-height="this.tableHeight"
          :table-data="tableData"
          :page="page"
          @EnumsBind="EnumsBind"
          @showAddEnumsView="showAddEnumsView"
          @handleSelectionChange="handleSelectionChange"
          @handleEnumsEdit="handleEnumsEdit"
          @handleEnumsDelete="handleEnumsDelete"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
          @handleDelete="handleDelete"
          @handleEdit="handleEdit"
        />
      </div>
    </div>
    <!-- 编辑弹框 -->
    <el-dialog title="编辑" width="40%" :visible.sync="EditVisible">
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px" class="demo-ruleForm" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="dataName">
              <el-input v-model="editForm.dataName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位" prop="calUnit">
              <el-input v-model="editForm.calUnit" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报警" prop="warning">
              <el-radio-group v-model="editForm.warning">
                <el-radio label="是" />
                <el-radio label="否" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="自定义json" prop="customJson">
              <el-input v-model="editForm.customJson" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="自定义1" prop="custom1">
              <el-input v-model="editForm.custom1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="自定义2" prop="custom2">
              <el-input v-model="editForm.custom2" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="自定义3" prop="custom3">
              <el-input v-model="editForm.custom3" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="自定义4" prop="custom4">
              <el-input v-model="editForm.custom4" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item style="margin-top:20px;">
            <el-button @click="EditVisible=false">取 消</el-button>
            <el-button type="primary" @click="handleEditSure('editForm')">确 定</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 读写存历史弹框 -->
    <el-dialog :title="dialogName" width="30%" :visible.sync="readOrHistoryVisible">
      <div v-if="dialogName==='读写'||dialogName==='存历史'">
        <el-form ref="formReadHistory" :model="formReadHistory" label-width="100px" size="small">
          <el-form-item v-if="dialogName==='读写'" label="读写">
            <el-radio-group v-model="formReadHistory.readWrite">
              <el-radio label="读" />
              <el-radio label="写" />
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="dialogName==='存历史'" label="是否存历史">
            <el-radio-group v-model="formReadHistory.saveHistory">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="handleReadHistorySure('formReadHistory')">确 定</el-button>
            <el-button size="small" @click="readOrHistoryVisible=false">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 关联弹框内容 -->
      <div v-if="dialogName==='关联'">
        <t-cascader @handleCascaderChange="handleItemChangeDialog" />
        <el-button type="primary" size="small" class="m_l10" @click="handleResolve()">确定</el-button>
      </div>
    </el-dialog>
    <!-- 添加枚举或编辑枚举 -->
    <el-dialog :title="dialogName" width="40%" :visible.sync="EnumsVisible">
      <el-form ref="enums" :model="enums" :rules="rules" label-width="80px" class="demo-ruleForm" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="枚举值" prop="value">
              <el-input v-model="enums.value" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="枚举内容" prop="name">
              <el-input v-model="enums.name" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item style="margin-top:20px;">
            <el-button @click="cancelEidts('enums')">取 消</el-button>
            <el-button type="primary" @click="handleEnumsSure('enums')">确 定</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 批量绑定弹框 -->
    <el-dialog title="批量绑定" width="45%" :visible.sync="EnumsBindVisible">
      <div class="top-search clearfix">
        <el-input v-model="bindWord" placeholder="请输入数据点进行搜索" size="small" class="fl m_r10" style="width:200px;" />
        <el-button type="primary" class="fl" size="small" @click="handleBindSearch">搜索</el-button>
        <el-button type="success" class="fl" size="small" @click="handleBindSubmit">确定</el-button>
      </div>
      <div class="table-content">
        <el-table
          ref="bindTable"
          :data="bindTableData"
          tooltip-effect="dark"
          style="width: 100%;margin-top:10px;"
          :header-cell-style="{
            'background-color': '#fafafa'}"
          @selection-change="handleBindSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="名称" prop="dataName" width="150" />
          <el-table-column prop="value" label="值" width="120" />
          <el-table-column prop="companyStructure.name" label="所属项目" show-overflow-tooltip />
        </el-table>
        <div class="page" style="margin-top:20px;text-align:right;">
          <el-pagination
            :current-page="Bindpage.currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="Bindpage.pageSize"
            layout="total, sizes, prev, pager, next"
            :total="Bindpage.total"
            @size-change="handleBindSizeChange"
            @current-change="handleBindCurrentChange"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import tCascader from '../../components/base/syncB-cascader'
import dataPointTable from '../../components/base/dataPointTable'
import Qs from 'qs'
import { parseTime } from '@/utils/index'
import publicMinxin from '@/utils/tableHeight.mixin'
export default {
  name: 'DataPointManage',
  components: {
    tCascader,
    dataPointTable
  },
  mixins: [publicMinxin],
  data() {
    return {
      EditVisible: false,
      EnumsBindVisible: false,
      enumsBind: {},
      bindWord: '',
      bindTableData: [],
      Bindpage: {
        pageSize: 5,
        total: 0,
        currentPage: 1
      },
      bindSelectionVal: [],
      arrData: [],
      myHeaders: { token: this.$store.state.token },
      placeholder: '通过数据点名称搜索...',
      keywords: '', // 模糊搜索关键字
      tableData: [], // 表格数据
      multipleSelection: [], // 表格选中的值
      projectVal: [],
      projectList: [],
      // projectVal: '', // 项目名称选中的值
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      options: [], // 分组
      grouping: '',
      readOrHistoryVisible: false, // 弹框显示隐藏
      EnumsVisible: false, // 枚举弹框
      dialogName: '', // 弹框名称
      formReadHistory: {
        saveHistory: '是', // 存历史
        readWrite: '读' // 读写
      },
      fieldName: '', // readWrite/saveHistory
      price: '', // 读写/是否
      realDataRow: {},
      structureId: '',
      editForm: {
        _id: '',
        customJson: '',
        warning: '',
        custom1: '',
        custom2: '',
        custom3: '',
        custom4: '',
        grouping: ''
      },
      EditIndex: null,
      enums: {
        name: '', // 枚举值
        value: '' // 枚举内容
      },
      rules: {
        name: [{ required: true, message: '必填:请输入枚举的内容', trigger: 'blur' }],
        value: [{ required: true, message: '必填:请输入枚举的值', trigger: 'blur' }]
      },
      enumsIndex: null
    }
  },
  created() {
    this.getNode()
  },
  methods: {
    getNode() {
      this.$http.post('/S-Base/getCompanyStructureByRoleTreeJson').then(res => {
        if (res.data.success) {
          this.projectList = res.data.data
        }
      })
    },
    /**
     * 绑定确定
     */
    handleBindSubmit() {
      if (this.bindSelectionVal.length === 0) {
        this.$message({
          message: '请勾选至少一个项目',
          type: 'warning'
        })
      } else {
        const dataCodes = this.bindSelectionVal.map(item => {
          return item._id
        })
        this.$http.post('S-RealData/getByUpdateEnums', Qs.stringify({ id: this.enumsBind._id, dataCodes: dataCodes }, { indices: false })).then(res => {
          if (res.data.success) {
            this.$message({
              message: res.data.data,
              type: 'success'
            })
            this.$refs.bindTable.clearSelection()
            this.bindTableData = []
            const params = {
              id: '',
              companyStructureId: this.projectVal,
              grouping: this.grouping,
              name: this.keywords,
              pageNo: this.page.currentPage,
              pageSize: this.page.pageSize
            }
            this.getTableData(params, true)
            this.EnumsBindVisible = false
          }
        })
      }
    },
    handleBindSizeChange(val) {
      this.Bindpage.pageSize = val
      const params = {
        name: this.bindWord,
        pageNo: this.Bindpage.currentPage,
        pageSize: val
      }
      this.getTableData(params)
    },
    handleBindCurrentChange(val) {
      this.Bindpage.currentPage = val
      const params = {
        name: this.bindWord,
        pageNo: val,
        pageSize: this.Bindpage.pageSize
      }
      this.getTableData(params)
    },
    /**
     * 绑定搜索
     */
    handleBindSearch() {
      const params = {
        name: this.bindWord,
        pageNo: this.Bindpage.currentPage,
        pageSize: this.Bindpage.pageSize
      }
      this.getTableData(params)
    },
    /**
     * 获取选中的值
     */
    handleBindSelectionChange(val) {
      this.bindSelectionVal = val
    },
    /**
     * 批量绑定
     */
    EnumsBind(name, row, enums) {
      this.bindWord = ''
      this.bindSelectionVal = []
      this.enumsBind = enums
      this.EnumsBindVisible = true
    },
    /**
     * 批量删除
     */
    handleBatchDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请勾选至少一个项目进行删除',
          type: 'warning'
        })
      } else {
        const ids = this.multipleSelection.map(item => {
          return item._id
        })
        this.$http.post('S-RealData/delRealDatas', Qs.stringify({ ids: ids }, { indices: false })).then(res => {
          if (res.data.success) {
            const params = {
              id: '',
              companyStructureId: this.projectVal[this.projectVal.length - 1],
              name: this.keywords,
              grouping: this.grouping,
              pageNo: this.page.currentPage,
              pageSize: this.page.pageSize
            }
            this.getTableData(params, true)
            this.$notify({
              title: '成功',
              message: res.data.msg,
              type: 'success'
            })
          }
        })
      }
    },
    /**
     * 导出表格
     */
    handleExport() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['标识', '名称', '单位 ', '值', '报警', '时间', '读写', '存历史', '分组', '底限', '高限']
        const filterVal = ['_id', 'dataName', 'calUnit', 'value', 'warning', 'date', 'readWrite', 'saveHistory', 'grouping', 'lowestLimit', 'highLimit']
        this.tableData.map(item => {
          item.date = parseTime(item.date, '{y}-{m}-{d} {h}:{i}:{s}')
          return item
        })
        const list = this.tableData
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel(tHeader, data, '列表excel')
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    /**
     * 获取项目名称
     */
    handleItemChange(val) {
      this.projectVal = val
      this.getGrouping(this.projectVal[this.projectVal.length - 1])
    },
    getGrouping(id) {
      this.$http.post('S-RealData/getRealDataByGrouping', Qs.stringify({ companyStructureId: id })).then(res => {
        const data = res.data.data
        const arr = []
        data.forEach(item => {
          arr.push({ label: item, value: item })
        })
        this.options = arr
      })
    },
    // 弹框项目
    handleItemChangeDialog(val) {
      if (val.length !== 0) {
        this.structureId = val[val.length - 1]
      } else {
        this.structureId = ''
      }
    },
    /**
     * 点击关联确定
     */
    handleResolve() {
      const ids = this.multipleSelection.map(item => {
        return item._id
      })
      this.$http.post('S-RealData/AssociatedStructure', Qs.stringify({ StructureId: this.structureId, ids: ids }, { indices: false })).then(res => {
        if (res.data.success) {
          this.$message({ type: 'success', message: res.data.msg })
          this.$refs.dTable.clearSelect([])
        }
      })
      this.readOrHistoryVisible = false
    },
    /**
     * 按钮添加
     */
    handleAdd(type) {
      this.dialogName = type
      if (this.dialogName === '读写' || this.dialogName === '存历史' || this.dialogName === '关联') {
        if (this.multipleSelection.length === 0) {
          this.$message({
            message: '请选择至少一个项目',
            type: 'warning'
          })
        } else {
          this.readOrHistoryVisible = true
        }
      }
    },
    /**
     * 导入
     */
    submitUpload(item) {
      const formData = new FormData()
      formData.append('excelFile', item.file)
      this.$http({
        method: 'post',
        url: 'S-RealData/insertRealChangeByExcel? excelFile',
        data: formData,
        responseType: 'blob'
      })
        .then(response => {
          this.download(response.data, '导出数据.xls')
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
     * 批量删除导入
     */
    batchUpload(item) {
      const formData = new FormData()
      formData.append('excelFile', item.file)
      this.$http({
        method: 'post',
        url: 'S-RealData/insertRealChangeByExcelRemove? excelFile',
        data: formData,
        responseType: 'blob'
      })
        .then(response => {
          this.download(response.data, '批量删除导出数据.xls')
        })
        .then(res => {
          this.$notify({
            title: '成功',
            message: '上传成功',
            type: 'success'
          })
        })
    },
    download(data, fileName) {
      if (!data) {
        return
      }
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
    },
    /**
     * 模糊搜索
     */
    handleSearch() {
      if (this.keywords === '' && this.projectVal.length === 0) {
        this.$message({
          message: '选择数据点或搜索名称不能为空',
          type: 'warning'
        })
      } else {
        const params = {
          id: '',
          grouping: this.grouping,
          companyStructureId: this.projectVal[this.projectVal.length - 1],
          name: this.keywords,
          pageNo: this.page.currentPage,
          pageSize: this.page.pageSize
        }
        this.getTableData(params, true)
      }
    },
    /**
     * 读写弹框确定
     */
    handleReadHistorySure() {
      if (this.dialogName === '读写') {
        this.fieldName = 'readWrite'
        this.price = this.formReadHistory.readWrite
      } else if (this.dialogName === '存历史') {
        this.fieldName = 'saveHistory'
        this.price = this.formReadHistory.saveHistory
      }
      const ids = this.multipleSelection.map(item => {
        return item._id
      })
      this.$http
        .post('/S-RealData/changeFieldValueByIDS', Qs.stringify({ ids: ids, fieldName: this.fieldName, value: this.price }, { indices: false }))
        .then(res => {
          if (res.data.success) {
            const arr1 = this.multipleSelection
            const arr2 = this.tableData
            for (const i in arr1) {
              for (const j in arr2) {
                if (arr1[i]._id === arr2[j]._id) {
                  if (this.dialogName === '读写') {
                    arr2[j].readWrite = this.price
                  } else if (this.dialogName === '存历史') {
                    arr2[j].saveHistory = this.price
                  }
                }
              }
            }
            this.readOrHistoryVisible = false
            this.$ref.dTable.clearSelect([])
          }
        })
    },
    handleEdit(index, rows) {
      this.EditVisible = true
      this.EditIndex = index
      this.editForm = rows
    },
    /**
     * 编辑确定按钮
     */
    handleEditSure() {
      this.editForm.id = this.editForm._id
      this.time = this.editForm.date
      this.enums = this.editForm.enums
      delete this.editForm.date
      delete this.editForm.companyStructure
      delete this.editForm.enums
      this.$http.post('S-RealData/updateRealData', Qs.stringify(this.editForm)).then(res => {
        if (res.data.success) {
          const data = res.data.data
          data.enums = this.enums
          data.date = this.time
          this.$set(this.tableData, this.EditIndex, data)
          this.EditVisible = false
        }
      })
    },

    /**
     * 表格选项发生改变绑定值
     */
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * 页码发生改变
     */
    handleSizeChange(val) {
      this.page.pageSize = val
      var params = {
        id: '',
        companyStructureId: this.projectVal[this.projectVal.length - 1],
        grouping: this.grouping,
        name: this.keywords,
        pageNo: this.page.currentPage,
        pageSize: val
      }
      this.getTableData(params, true)
    },
    /**
     * 当前页发生改变
     */
    handleCurrentChange(val) {
      this.page.currentPage = val
      const params = {
        id: '',
        companyStructureId: this.projectVal[this.projectVal.length - 1],
        grouping: this.grouping,
        name: this.keywords,
        pageNo: val,
        pageSize: this.page.pageSize
      }
      this.getTableData(params, true)
    },
    /**
     * 分页请求表格数据
     */
    getTableData(params, flag) {
      this.$http.post('/S-RealData/getRealDataByWhere', Qs.stringify(params)).then(res => {
        if (res.data.success) {
          const { result, totalPage } = res.data.data
          const arr = result.map(item => {
            if (!item.enums) {
              item.enums = []
            }
            return item
          })
          if (flag) {
            this.tableData = arr
            this.page.total = totalPage
          } else {
            this.bindTableData = arr
            this.Bindpage.total = totalPage
          }
        }
      })
    },
    /**
     * 删除
     */
    handleDelete(index, rows) {
      this.$confirm('此操作将永久删除[' + rows[index].dataName + '], 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.get('/S-RealData/delRealData?id=' + rows[index]._id).then(response => {
            if (response.data.success) {
              rows.splice(index, 1)
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              })
            }
          })
        })
        .catch(() => {})
    },
    /**
     * 添加枚举
     */
    showAddEnumsView(val, index, row) {
      this.enums = {}
      this.dialogName = val
      this.EnumsVisible = true
      this.realDataRow = row
    },
    /**
     * 编辑枚举
     */
    handleEnumsEdit(val, index, row) {
      this.dialogName = val
      this.EnumsVisible = true
      this.enumsIndex = index
      this.enums.enumsId = row.enumsId
      this.enums.name = row.name
      this.enums.value = row.value
    },
    /**
     * 取消枚举
     */
    cancelEidts(formName) {
      this.$refs[formName].resetFields()
      this.EnumsVisible = false
    },
    /**
     * 删除枚举
     */
    handleEnumsDelete(index, rows) {
      this.$confirm('此操作将永久删除[' + rows[index].name + '], 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.doDeleteEnums(index, rows)
        })
        .catch(() => {})
    },
    /**
     * 删除枚举接口
     */
    doDeleteEnums(index, rows) {
      this.$http.get('/S-RealData/delEnums?enumsId=' + rows[index].enumsId).then(response => {
        if (response.data.success) {
          rows.splice(index, 1)
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          })
        }
      })
    },
    /**
     * 添加枚举弹框确定
     */
    handleEnumsSure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.enums.enumsId) {
            // 编辑
            this.$http.get('/S-RealData/updateEnums', { params: this.enums }).then(resp => {
              if (resp && resp.status === 200) {
                const params = {
                  id: '',
                  companyStructureId: this.projectVal[this.projectVal.length - 1],
                  name: this.keywords,
                  grouping: this.grouping,
                  pageNo: this.page.currentPage,
                  pageSize: this.page.pageSize
                }
                this.getTableData(params, true)
                this.$message({ type: resp.data.status, message: resp.data.msg })
                this.EnumsVisible = false
              }
            })
          } else {
            // 添加
            const params = { id: this.realDataRow._id, name: this.enums.name, value: this.enums.value }
            this.$http.post('/S-RealData/addEnums', Qs.stringify(params)).then(resp => {
              if (resp && resp.status === 200) {
                const arr = this.realDataRow.enums
                arr.push(resp.data.data)
                this.$message({ type: resp.data.status, message: resp.data.msg })
                this.EnumsVisible = false
              }
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style scoped>
.top-btn {
  margin-bottom: 20px;
  overflow: hidden;
}
</style>

