<template>
  <div id="inspectionTasks" class="grid-content">
    <div class="table-content">
      <el-row :gutter="20">
        <!-- 巡检项目 -->
        <el-col :span="12">
          <div class="top-btn m_b10">
            <el-button type="success" icon="el-icon-circle-plus-outline" size="small" @click="addTasksClick('巡检新增')">新增</el-button>
            <t-search v-model="regexName" :width="200" :placeholder="placeholder" @handleSearch="handleRegexSearch" />
          </div>
          <el-table
            ref="supplierTable"
            :max-height="maxHeight"
            :highlight-current-row="true"
            :header-cell-style="{
              'background-color': '#fafafa'}"
            :data="tableData"
            style="width: 100%"
            @row-click="handleRowClick"
          >
            <el-table-column
              prop="name"
              label="巡检项目"
              width="100"
            />
            <el-table-column
              prop="startTime"
              label="起始时间"
            />
            <el-table-column
              prop="taskDuration"
              width="120"
              label="任务时长(小时)"
            />
            <el-table-column
              prop="periodicTasks"
              label="周期任务"
            />
            <el-table-column
              prop="periodicStepLength"
              label="任务步长"
            />
            <el-table-column label="操作" align="center" width="120" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click.stop="handleMainStart(scope.$index,scope.row)">启动</el-button>
                <el-button type="text" size="small" icon="el-icon-edit" @click.stop="handleBtnClick(scope.$index,scope.row,tableData,'编辑')" />
                <el-button type="text" style="color:#f56c6c;" size="small" icon="el-icon-delete" @click.stop="handleBtnClick(scope.$index,scope.row,tableData,'删除')" />
              </template>
            </el-table-column>
          </el-table>
          <!-- <div class="page" style="text-align:right;margin-top:10px;">
                      <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page.sync="page.currentPage"
                      :page-size="page.pageSize"
                      layout="total, prev, pager, next"
                      :total="page.total">
                      </el-pagination>
                  </div> -->
        </el-col>
        <!-- 项目表格 -->
        <el-col :span="6">
          <div class="top-btn m_b10">
            <el-button type="success" :disabled="checkRowId==''" icon="el-icon-circle-plus-outline" size="small" @click="addTasksClick('项目新增')">新增</el-button>
          </div>
          <el-table
            ref="ProjectTable"
            :header-cell-style="{
              'background-color': '#fafafa'}"
            :highlight-current-row="true"
            :data="ProjectTableData"
            :max-height="maxHeight"
            style="width: 100%"
            @row-click="handleProjectRow"
          >
            <el-table-column
              label="项目名称"
              prop="structName"
            />
            <el-table-column label="操作" align="center" width="120">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click.stop="handleChildStart(scope.$index,scope.row)">启动</el-button>
                <el-button type="text" style="color:#f56c6c;" size="small" icon="el-icon-delete" @click.stop="handleBtnProject(scope.$index,scope.row,ProjectTableData,'el-icon-delete')" />
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <!-- 数据点 -->
        <el-col :span="6">
          <div class="top-btn m_b10">
            <el-button type="success" :disabled="structId==''" icon="el-icon-circle-plus-outline" size="small" @click="addTasksClick('数据点新增')">新增</el-button>
          </div>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>数据点列表</span>
            </div>
            <div class="text">
              <el-tag
                v-for="tag in tablePointsData"
                :key="tag.id"
                size="mini"
                closable
                style="margin:0 8px 8px 0;"
                @close="handleTagClose(tablePointsData,tag)"
              >
                {{ tag.dataName }}
              </el-tag>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 添加或编辑弹框 -->
    <el-dialog :visible.sync="addOrEditVisible" width="40%" :title="modelTitle">
      <el-form ref="addOrEditForm" :model="addOrEditForm" :rules="rules" label-width="120px" class="demo-ruleForm" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="巡检名称" prop="name">
              <el-input v-model="addOrEditForm.name" placeholder="巡检名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务时长(小时)" prop="taskDuration">
              <el-select v-model="addOrEditForm.taskDuration" placeholder="任务时长" clearable>
                <el-option
                  v-for="item in optionsArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="周期任务" prop="periodicTasks">
              <el-radio-group v-model="addOrEditForm.periodicTasks">
                <el-radio label="是" />
                <el-radio label="否" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="addOrEditForm.periodicTasks=='是'" label="起始时间" prop="startTime">
              <el-select v-model="addOrEditForm.startTime" placeholder="起始时间" clearable>
                <el-option
                  v-for="item in optionsArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-if="addOrEditForm.periodicTasks=='是'" :span="12">
            <el-form-item label="任务步长" prop="periodicStepLength">
              <el-select v-model="addOrEditForm.periodicStepLength" placeholder="任务步长" clearable>
                <el-option
                  v-for="item in optionsArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="addOrEditForm.remarks" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit('addOrEditForm')">确定</el-button>
          <el-button @click="addOrEditVisible = fasle">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 项目添加弹框 -->
    <el-dialog :visible.sync="projectVisible" :close-on-click-modal="false" title="项目添加" width="30%">
      <el-form ref="projectForm" :model="projectForm" :inline="true" class="demo-ruleForm" size="small">
        <el-form-item label="项目名称">
          <el-cascader
            v-model="projectForm.structId"
            :options="options"
            size="small"
            clearable
            :show-all-levels="false"
            :props="props"
            @change="handleCascaderChange"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="projectSubmit('projectForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 数据点列表弹框 -->
    <el-dialog :visible.sync="PointsVisible" title="数据点添加">
      <el-form ref="PointsForm" :model="PointsForm" class="demo-ruleForm" size="small" label-width="80px">
        <el-row>
          <el-col :span="9">
            <el-form-item label="项目名称">
              <el-cascader
                v-model="PointsForm.companyStructureId"
                :options="options"
                size="small"
                clearable
                :show-all-levels="false"
                :props="props"
                @change="handleCascaderPoint"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7" style="padding:0 10px;">
            <el-select v-model="PointsForm.grouping" clearable placeholder="分组" size="small">
              <el-option
                v-for="item in optionsGroup"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="8" style="padding:0 10px;">
            <el-select
              v-model="PointsForm.name"
              filterable
              remote
              clearable
              reserve-keyword
              size="small"
              placeholder="请输入关键词搜索"
              :remote-method="remoteMethod"
              :loading="loading"
              @change="handleSelectChange"
            >
              <el-option
                v-for="item in options4"
                :key="item._id"
                :label="item.dataName"
                :value="item.dataName"
              />
            </el-select>
          </el-col>
        </el-row>
      </el-form>
      <div v-if="PointsTags.length!==0" class="tags">
        <el-card class="box-card">
          <el-tag
            v-for="tag in PointsTags"
            :key="tag._id"
            size="small"
            closable
            style="margin:0 5px 5px 0;"
            @close="handleClose(tag)"
          >
            {{ tag.dataName }}
          </el-tag>
        </el-card>
      </div>
      <span v-if="PointsTags.length!==0" slot="footer" class="dialog-footer">
        <el-button size="small" @click="PointsVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handlePointSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import tSearch from '../../components/base/t-search'
import { IterationDelateMenuChildren } from '@/utils/index'
import utils from '@/utils/creatTree'
import Qs from 'qs'
export default {
  name: 'InspectionTasks',
  components: {
    tSearch
  },
  data() {
    return {
      props: {
        label: 'name',
        value: 'id',
        children: 'children'
      },
      maxHeight: 200,
      loading: false,
      options: [],
      options4: [],
      optionsArr: [
        {
          value: '1',
          label: '1'
        },
        {
          value: '2',
          label: '2'
        },
        {
          value: '3',
          label: '3'
        },
        {
          value: '4',
          label: '4'
        },
        {
          value: '5',
          label: '5'
        },
        {
          value: '6',
          label: '6'
        },
        {
          value: '7',
          label: '7'
        },
        {
          value: '8',
          label: '8'
        },
        {
          value: '9',
          label: '9'
        },
        {
          value: '10',
          label: '10'
        },
        {
          value: '11',
          label: '11'
        },
        {
          value: '12',
          label: '12'
        },
        {
          value: '13',
          label: '13'
        },
        {
          value: '14',
          label: '14'
        },
        {
          value: '15',
          label: '15'
        },
        {
          value: '16',
          label: '16'
        },
        {
          value: '17',
          label: '17'
        },
        {
          value: '18',
          label: '18'
        },
        {
          value: '19',
          label: '19'
        },
        {
          value: '20',
          label: '20'
        },
        {
          value: '21',
          label: '21'
        },
        {
          value: '22',
          label: '22'
        },
        {
          value: '23',
          label: '23'
        },
        {
          value: '24',
          label: '24'
        }
      ],
      regexName: '', // 巡检名称
      placeholder: '请输入巡检名称',
      tableData: [],
      checkRowId: '', // 巡检id
      structId: '', // 项目id
      editChekIndex: null, // 编辑索引
      ProjectTableData: [], // 项目表格数据
      tablePointsData: [], // 数据点列表表格
      page: {// 分页
        currentPage: 1,
        pageSize: 200
      },
      modelTitle: '', // 弹框标题
      addOrEditVisible: false, // 添加或编辑弹框
      addOrEditForm: {
        name: '', // 名称
        startTime: '8', // 起始时间
        periodicStepLength: '', // 任务步长
        periodicTasks: '', // 周期任务
        taskDuration: '', // 任务时长
        remarks: ''// 备注
      },
      tableEndIndex: 0,
      rules: {
        name: [
          { required: true, message: '请输入巡检名称', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        taskDuration: [
          { required: true, message: '请输入任务时长', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请输入起始时间', trigger: 'change' }
        ]
      },
      projectVisible: false, // 项目添加弹框
      projectForm: {// 项目表单
        structId: [], // 项目id
        structName: ''
      },
      PointsVisible: false, // 数据点列表弹框
      PointsForm: {
        companyStructureId: [], // 项目id
        grouping: '', // 分组
        name: '' // 关键字
      },
      PointsTags: [],
      optionsGroup: [] // 项目分组
    }
  },
  watch: {
    addOrEditVisible: function(val) {
      if (this.$refs.addOrEditForm !== undefined) {
        this.$refs.addOrEditForm.resetFields()
      }
    }
  },
  created() {
    this.getNode()
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
        this.maxHeight = window.innerHeight - this.$refs.ProjectTable.$el.offsetTop - 146
      })
    },
    /**
     * 树结构
     */
    getNode() {
      this.$http.post('/S-Base/getCompanyStructureByRole', Qs.stringify({ type: 1 }))
        .then(res => {
          if (res.data.success) {
            const treeData = utils.creatTree(res.data.data)
            this.options = IterationDelateMenuChildren(treeData)
          }
        })
    },
    /**
     * 主表启动
     */
    handleMainStart(index, row) {
      this.$http.post(`/S-EquipmentInspection/MainTableTiming?temId=${row.id}`).then(res => {
        if (res.data.success) {
          this.$notify({
            title: '成功',
            message: res.data.msg,
            type: 'success'
          })
        } else {
          this.$notify({
            title: '失败',
            message: '任务启动失败',
            type: 'error'
          })
        }
      })
    },
    /**
     * 从表启动
     */
    handleChildStart(index, row) {
      this.$http.post(`/S-EquipmentInspection/TimingFromTable?temStructId=${row.id}`).then(res => {
        if (res.data.success) {
          this.$notify({
            title: '成功',
            message: res.data.msg,
            type: 'success'
          })
        } else {
          this.$notify({
            title: '失败',
            message: '任务启动失败',
            type: 'error'
          })
        }
      })
    },

    /**
     * 点击项目列表当前行
     */
    handleProjectRow(row) {
      this.structId = row.id// 项目i
      if (row.dataPoints === null || row.dataPoints === undefined || row.dataPoints === []) {
        this.tablePointsData = []
      } else {
        this.tablePointsData = row.dataPoints
      }
    },
    /**
     * 远程搜索
     */
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          if (this.PointsForm.companyStructureId === undefined) {
            this.PointsForm.companyStructureId = []
          }
          const params = {
            companyStructureId: this.PointsForm.companyStructureId[this.PointsForm.companyStructureId.length - 1],
            grouping: this.PointsForm.grouping,
            name: query
          }
          this.$http.post('/S-RealData/getRealDataByWhere', Qs.stringify(params)).then(res => {
            if (res.data.success) {
              this.options4 = res.data.data.result
            }
          })
        }, 200)
      } else {
        this.options4 = []
      }
    },
    handleSelectChange(dataName) {
      if (dataName !== '') {
        const obj = this.options4.find((item) => { // 这里的scopeData就是上面遍历的数据源
          return item.dataName === dataName// 筛选出匹配数据
        })
        if (this.PointsTags.length === 0) {
          this.PointsTags.push(obj)
        } else {
          let tag = true
          for (const a in this.PointsTags) {
            const b = this.PointsTags[a]
            if (b._id === obj._id) {
              tag = false
            }
          }
          if (tag) {
            this.PointsTags.push(obj)
          }
        }
      }
    },
    // 新增
    addTasksClick(val) {
      if (val === '巡检新增') {
        this.modelTitle = '新增'
        this.addOrEditForm = {
          name: '', // 名称
          startTime: '8', // 起始时间
          periodicStepLength: '4', // 任务步长
          periodicTasks: '', // 周期任务
          taskDuration: '', // 任务时长
          remarks: ''// 备注
        }
        this.addOrEditVisible = true
      } else if (val === '项目新增') {
        this.projectForm = {}
        this.projectVisible = true
      } else {
        this.PointsForm = {}
        this.PointsTags = []
        this.PointsVisible = true
      }
    },
    /**
     * 巡检模板查询
     */
    handleRegexSearch(val) {
      this.regexName = val
      const params = {
        regexName: this.regexName,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize
      }
      this.$http.post('S-EquipmentInspection/getInspectionTemplateByRegexName', Qs.stringify(params)).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data
        }
      })
    },
    // 新增或编辑确定
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // if (this.addOrEditForm.periodicTasks === '否') {
          //   this.addOrEditForm.startTime = '8'
          //   this.addOrEditForm.periodicStepLength = '4'
          // }
          if (this.addOrEditForm.id) { // 编辑
            const params = {
              id: this.addOrEditForm.id,
              name: this.addOrEditForm.name, // 名称
              startTime: this.addOrEditForm.startTime, // 起始时间
              periodicStepLength: this.addOrEditForm.periodicStepLength, // 任务步长
              periodicTasks: this.addOrEditForm.periodicTasks, // 周期任务
              taskDuration: this.addOrEditForm.taskDuration, // 任务时长
              remarks: this.addOrEditForm.remarks// 备注
            }
            this.$http.post('S-EquipmentInspection/updateInspectionTemplate', Qs.stringify(params)).then(res => {
              if (res.data.success) {
                this.$set(this.tableData, this.editChekIndex, res.data.data)
                this.addOrEditVisible = false
                this.$notify({
                  title: '成功',
                  message: '编辑成功',
                  type: 'success'
                })
              }
            })
          } else { // 新增
            this.$http.post('S-EquipmentInspection/addInspectionTemplate', Qs.stringify(this.addOrEditForm)).then(res => {
              if (res.data.success) {
                this.tableData.unshift(res.data.data)
                this.addOrEditVisible = false
                this.tableEndIndex = 0
                this.highlight()
                this.handleRowClick(res.data.data)
                this.handleProjectRow(res.data.data)
                this.$refs[formName].resetFields()
                this.$notify({
                  title: '成功',
                  message: '添加成功',
                  type: 'success'
                })
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
     * 设置高亮
     *
     */
    highlight() { // 回显高亮方法，根据已经选择的id，调用 element-ui table的设置高亮方法
      for (var a = 0; a < this.tableData.length; a++) {
        if (a === this.tableEndIndex) {
          this.$refs.supplierTable.setCurrentRow(this.tableData[a])
        }
      }
    },
    highlight2() { // 回显高亮方法，根据已经选择的id，调用 element-ui table的设置高亮方法
      for (var a = 0; a < this.ProjectTableData.length; a++) {
        if (a === this.tableEndIndex) {
          this.$refs.ProjectTable.setCurrentRow(this.ProjectTableData[a])
        }
      }
    },
    /**
     * 巡检修改删除
     */
    handleBtnClick(index, row, data, name) {
      if (name === '编辑') { // 编辑
        this.modelTitle = '编辑'
        this.addOrEditForm = Object.assign({}, row)
        this.editChekIndex = index
        this.addOrEditVisible = true
      } else if (name === '删除') { // 删除
        this.$confirm('此操作将永久删除[' + data[index].name + '], 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doDeleteCheck(index, data)
        }).catch(() => {})
      }
    },
    doDeleteCheck(index, rows) {
      this.$http.post('/S-EquipmentInspection/delInspectionTemplate?inspectionTemplateId=' + rows[index].id).then((response) => {
        if (response.data.success) {
          rows.splice(index, 1)
          this.ProjectTableData = []
          this.tablePointsData = []
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          })
        }
      })
    },
    /**
     * 点击表格当前行
     * 查询巡检模板下属项目
     */
    handleRowClick(row) {
      this.checkRowId = row.id
      this.$http.post('S-EquipmentInspection/getInspectionTemStructByParentId', Qs.stringify({ parentId: row.id })).then(res => {
        if (res.data.success) {
          this.ProjectTableData = res.data.data
          this.tablePointsData = []
        }
      })
    },
    /**
       * 获取项目id
       */
    handleCascaderChange(ids) {
      if (ids.length === 0) {
        this.projectForm.structId = []
      } else {
        this.projectForm.structId = ids
        const item = this.getCascaderObj(ids, this.options)
        const objEnd = item[item.length - 1]
        this.projectForm.structName = objEnd.name
      }
    },
    getCascaderObj(val, opt) {
      return val.map(function(value, index, array) {
        for (var itm of opt) {
          if (itm.id === value) { opt = itm.children; return itm }
        }
        return null
      })
    },
    /**
     * 点击项目表格的删除或启动
     */
    handleBtnProject(index, row, data, icon) {
      if (icon === 'el-icon-delete') {
        this.$confirm('此操作将永久删除[' + data[index].structName + '], 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteProject(index, data)
        }).catch(() => {})
      }
    },
    /** 项目删除 */
    deleteProject(index, rows) {
      this.$http.post('/S-EquipmentInspection/delInspectionTemStruct', Qs.stringify({ inspectionTemStructId: rows[index].id })).then((response) => {
        if (response.data.success) {
          rows.splice(index, 1)
          this.tablePointsData = []
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          })
        }
      })
    },
    /**
     * 数据点项目
     */
    handleCascaderPoint(ids) {
      if (ids.length === 0) {
        this.PointsForm.companyStructureId = []
      } else {
        this.PointsForm.companyStructureId = ids
        this.getGrouping(ids[ids.length - 1])
      }
    },
    /**
     * 根据项目id差分组
     *
     */
    getGrouping(id) {
      this.$http.post('S-RealData/getRealDataByGrouping', Qs.stringify({ companyStructureId: id })).then(res => {
        const data = res.data.data
        const arr = []
        data.forEach(item => {
          arr.push({ label: item, value: item })
        })
        this.optionsGroup = arr
      })
    },
    /**
     * 删除tag
     */
    handleClose(tag) {
      this.PointsTags.splice(this.PointsTags.indexOf(tag), 1)
    },
    /**
     * 删除表格tag
     */
    handleTagClose(data, tag) {
      const idArr = []
      idArr.push(tag.id)
      this.$http.post('S-EquipmentInspection/delDataPointByDataPointIds', Qs.stringify({ inspectionTemStructId: this.structId, DataPointIds: idArr }, { indices: false })).then(res => {
        if (res.data.success) {
          data.splice(data.indexOf(tag), 1)
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          })
        }
      })
    },
    /**
     * 数据点确定
     */
    handlePointSubmit() {
      const PointsArr = []

      this.PointsTags.map(item => {
        let unit = ''
        if (item.calUnit) {
          unit = item.calUnit
        } else {
          unit = ''
        }
        PointsArr.push({ id: item._id, dataName: item.dataName, unit: unit })
      })
      this.$http.post(`S-EquipmentInspection/addDataPointByDataPointMaps?inspectionTemStructId=${this.structId}`,
        JSON.stringify(PointsArr),
        { headers: { 'Content-Type': 'application/json' }}
      ).then(res => {
        if (res.data.success) {
          if (this.tablePointsData.length === 0) {
            this.tablePointsData = res.data.data
          } else {
            const arr1 = this.tablePointsData
            const arr2 = res.data.data
            const arr1Ids = arr1.map(item => item.id)
            const result = arr2.filter(item => !arr1Ids.includes(item.id))
            this.tablePointsData = [...arr1, ...result]
          }
          this.ProjectTableData.map(item => {
            if (item.id === this.structId) {
              item.dataPoints = this.tablePointsData
            }
            return item
          })
          this.PointsVisible = false
        }
      })
    },
    /**
     * 项目添加确定
     */
    projectSubmit(formName) {
      const params = {
        parentId: this.checkRowId,
        structId: this.projectForm.structId[this.projectForm.structId.length - 1],
        structName: this.projectForm.structName
      }
      this.$http.post('S-EquipmentInspection/addInspectionTemStruct', Qs.stringify(params)).then(res => {
        if (res.data.success) {
          this.ProjectTableData.unshift(res.data.data)
          this.projectVisible = false
          this.tableEndIndex = 0
          this.highlight2()
          this.handleProjectRow(res.data.data)
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success'
          })
        }
      })
    }
  }
}
</script>
<style>
.table-content {
    width:100%;
    height: 100%;
}
.el-table__body tr.current-row>td {
    background:#ebf5fd !important;
}
.box-card .el-card__header {
  padding:12px 20px;
}
</style>
