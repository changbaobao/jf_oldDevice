<template>
  <el-container class="container">
    <el-aside
      id="myPaletteDiv"
      width="200px"
      height="100%"
    />
    <el-container>
      <el-header style="height: 60px;padding-top: 5px;">
        <el-form
          :inline="true"
          class="demo-form-inline"
        >
          <!--<el-cascader size="small" :options="options.projectList" @active-item-change="handleProjectItemChange" @change="handleProjectChange" v-model="projectVal" :props="projectProps" placeholder="请选择项目" style="width: 300px;"> </el-cascader>-->
          <el-cascader
            ref="cascader"
            v-model="projectVal"
            size="small"
            :options="options.projectList"
            :props="projectProps"
            placeholder="请选择项目"
            style="width: 240px;"
            @change="handleProjectChange"
          />
          <el-select
            v-model="chartId"
            size="small"
            filterable
            placeholder="请选择项目下的图表"
            style="width: 200px;"
            clearable
            @change="changeChart"
            @clear="clearChart"
          >
            <el-option
              v-for="item in options.chartList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-tooltip
            class="item"
            effect="dark"
            content="新增保存组态"
            placement="bottom"
          >
            <el-button
              size="mini"
              type="success"
              icon="el-icon-plus"
              @click="addSave"
            />
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="修改保存组态"
            placement="bottom"
          >
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editSave"
            />
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除组态"
            placement="bottom"
          >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteFn"
            />
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="加载实时数据"
            placement="bottom"
          >
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-refresh"
              @click="loadDataFn"
            />
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="复制"
            placement="bottom"
          >
            <el-button
              size="mini"
              type="info"
              @click="handleCopy"
            >复制</el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="替换"
            placement="bottom"
          >
            <el-button
              size="mini"
              type="success"
              @click="handleReplace"
            >替换</el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="报警数据颜色"
            placement="bottom"
          >
            <el-color-picker
              v-model="addChartForm.alarmColor"
              style="float: right;"
            />
          </el-tooltip>

          <el-tooltip
            class="item"
            effect="dark"
            content="离线数据颜色"
            placement="bottom"
          >
            <el-color-picker
              v-model="addChartForm.offlineColor"
              style="float: right;"
            />
          </el-tooltip>

          <el-tooltip
            class="item"
            effect="dark"
            content="组态背景色"
            placement="bottom"
          >
            <el-color-picker
              v-model="addChartForm.backgroundColor"
              :predefine="predefineBgColors"
              style="float: right;"
              @change="changeBgFn"
            />
          </el-tooltip>

          <div><span>当前组态名称：</span> {{ form.activeChart }} </div>
        </el-form>
        <!-- 复制弹框 -->
        <el-dialog
          title="复制"
          width="40%"
          :close-on-click-modal="false"
          :visible.sync="dialogCopyVisible"
        >
          <el-form
            ref="formCopy"
            :inline="true"
            :model="formCopy"
            class="demo-form-inline"
            size="small"
          >
            <el-form-item
              label="名称"
              prop="dataName"
            >
              <el-input
                v-model="formCopy.dataName"
                placeholder="名称"
                style="width:120px;"
              />
            </el-form-item>
            <el-form-item
              label="项目"
              prop="structureId"
            >
              <el-cascader
                v-model="formCopy.structureId"
                size="small"
                :options="options.projectList"
                :props="projectProps"
                placeholder="请选择项目"
                style="width: 180px;"
                change-on-select
                expand-trigger="hover"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="handleCopySubmit('formCopy')"
              >确定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <!-- 替换弹框 -->
        <el-dialog
          title="替换数据"
          width="40%"
          :close-on-click-modal="false"
          :visible.sync="dialogReplaceVisible"
        >
          <el-form
            ref="formInline"
            :inline="true"
            :model="formInline"
            :rules="rules"
            class="demo-form-inline"
            size="small"
          >
            <el-form-item
              label="开始标识"
              prop="Identification"
            >
              <el-input
                v-model="formInline.Identification"
                placeholder="开始标识"
                style="width:120px;"
              />
            </el-form-item>
            <el-form-item
              label="替换标识"
              prop="NewLogo"
            >
              <el-input
                v-model="formInline.NewLogo"
                placeholder="替换标识"
                style="width:120px;"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="handleReplaceSubmit('formInline')"
              >确定</el-button>
            </el-form-item>
          </el-form>
          <el-dialog
            width="50%"
            title="未替换数据点"
            :visible.sync="innerVisible"
            :close-on-click-modal="false"
            append-to-body
          >
            <div style="margin-bottom:20px;">
              <el-tag
                v-for="( item , index ) in noReplaceData"
                :key="index"
                size="small"
                style="margin:5px;"
              >{{ item }}</el-tag>
            </div>
            <div style="text-align:center;">
              <el-button
                type="primary"
                size="small"
                @click="innerSubmit"
              >确定</el-button>
            </div>
          </el-dialog>
        </el-dialog>

        <el-dialog
          title="节点管理"
          :visible.sync="dialogFormVisible"
          :close-on-click-modal="false"
        >
          <el-form
            ref="form"
            :model="form"
            label-width="80px"
          >
            <el-form-item label="名称">
              <el-input
                v-model="form.name"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item
              v-if="isLabeVisible"
              label="字号"
            >
              <el-select
                v-model="form.zh_value"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options3"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="isLabeVisible"
              label="字体"
            >
              <el-select
                v-model="form.zt_value"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options4"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="isLabeVisible"
              label="背景颜色"
            >
              <el-color-picker
                v-model="form.bjcolor_value"
                :predefine="predefineColors"
              />
            </el-form-item>
            <el-form-item
              v-if="isLabeVisible"
              label="字体颜色"
            >
              <el-color-picker
                v-model="form.fontcolor_value"
                :predefine="predefineColors"
              />
            </el-form-item>
            <el-form-item
              v-if="isPipelineVisible"
              label="管道规格"
            >
              <el-select
                v-model="form.gdgg_value"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options5"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="isPipelineVisible"
              label="管道颜色"
            >
              <el-color-picker
                v-model="form.gdcolor_value"
                :predefine="predefineColors"
              />
            </el-form-item>
            <el-form-item label="分类">
              <el-select
                v-model="form.fl_value"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in options.dataType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="数据点">
              <el-select
                v-model="form.sjd_value"
                filterable
                remote
                reserve-keyword
                :remote-method="remoteMethod"
                :loading="loading"
                placeholder="请输入关键词"
                @change="dataPointChange"
              >
                <el-option
                  v-for="item in options.devDetailed"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="关联组态">
              <el-cascader
                v-model="form.projectVal"
                :options="form.projectList"
                :props="projectProps"
                placeholder="请选择项目"
                style="width: 300px;"
                @change="handleProjectFormChange"
              />
              <el-select
                v-model="form.pathId"
                filterable
                placeholder="请选择项目下的图表"
                style="width: 250px;"
                clearable
              >
                <el-option
                  v-for="item in form.chartList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="saveNode"
            >确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog
          title="新增组态"
          :visible.sync="addChartVisible"
        >
          <el-form
            ref="form"
            :model="form"
            label-width="80px"
          >
            <el-form-item label="名称">
              <el-input v-model="addChartForm.name" />
            </el-form-item>
            <el-form-item label="描述">
              <el-input
                v-model="addChartForm.remark"
                type="textarea"
              />
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="addChartVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="saveChart"
            >确 定</el-button>
          </div>
        </el-dialog>
      </el-header>
      <el-main
        id="myDiagramDiv"
        ref="container-Bg"
      >main</el-main>
    </el-container>
  </el-container>
</template>
<script>
import gojsConfig from '@/components/configManage/gojsConfigEdit'
import Qs from 'qs'
export default {
  name: 'ConfigurationEditManage',
  data() {
    return {
      dialogReplaceVisible: false,
      innerVisible: false,
      dialogCopyVisible: false,
      noReplaceData: [],
      formCopy: {
        dataName: '',
        structureId: [],
      },
      formInline: {
        Identification: '',
        NewLogo: '',
      },
      rules: {
        Identification: [
          { required: true, message: '请输入数据点开始标识', trigger: 'blur' },
        ],
        NewLogo: [
          { required: true, message: '请输入替换标识', trigger: 'blur' },
        ],
      },
      gridVisible: true,
      predefineBgColors: ['#A3C493', '#898789', '#F8F4DE', '#E2C898'],
      selectProjectItemInfo: null,
      addChartForm: {
        name: null,
        remark: null,
        backgroundColor: '#e9eef3',
        offlineColor: '#666666',
        alarmColor: '#ff0000',
      },
      addChartVisible: false,
      selectListInfo: null,
      projectVal: [],
      selectProject: null,
      chartId: null,
      options: {
        dataType: [],
        projectList: [],
        chartList: [],
        devDetailed: [],
      },
      projectProps: {
        expandTrigger: 'hover',
        checkStrictly: true,
        value: 'id',
        label: 'name',
        children: 'children',
      },
      selectedProject2: null,
      optionsProject: [],
      predefineColors: [
        '#ff4500',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577',
      ],
      options1: [
        {
          value: '1',
          label: '选项1',
        },
      ],
      options2: [
        {
          value: '2',
          label: '选项2',
        },
      ],
      options3: [
        {
          value: '10',
          label: '10',
        },
        {
          value: '15',
          label: '15',
        },
        {
          value: '20',
          label: '20',
        },
        {
          value: '25',
          label: '25',
        },
        {
          value: '30',
          label: '30',
        },
        {
          value: '35',
          label: '35',
        },
        {
          value: '40',
          label: '40',
        },
      ],
      options4: [
        {
          value: '微软雅黑',
          label: '微软雅黑',
        },
        {
          value: '宋体',
          label: '宋体',
        },
        {
          value: 'Arial',
          label: 'Arial',
        },
      ],
      options5: [
        {
          value: '1',
          label: '1',
        },
        {
          value: '2',
          label: '2',
        },
        {
          value: '3',
          label: '3',
        },
        {
          value: '4',
          label: '4',
        },
        {
          value: '5',
          label: '5',
        },
        {
          value: '6',
          label: '6',
        },
        {
          value: '7',
          label: '7',
        },
        {
          value: '8',
          label: '8',
        },
        {
          value: '9',
          label: '9',
        },
        {
          value: '10',
          label: '10',
        },
      ],
      dialogFormVisible: false,
      isLabeVisible: false,
      isPathVisible: false,
      isPipelineVisible: false,
      loading: false,
      saveType: null,
      form: {
        node_projectId: '',
        name: '',
        sb_value: '',
        sjd_value: '',
        zh_value: '',
        zt_value: '',
        bjcolor_value: '',
        fontcolor_value: '',
        gdgg_value: '',
        gdcolor_value: '',
        fl_value: '',
        pathId: '',
        projectVal: [],
        projectList: [],
        chartList: [],
      },
      formLabelWidth: '120px',
    }
  },
  computed: {},
  watch: {
    projectVal: {
      handler(newVal, oldVal) {
        if (this.$refs.cascader) {
          this.$refs.cascader.dropDownVisible = false
        }
      },
    },
  },
  created() {},
  mounted() {
    const vm = this
    gojsConfig.setVm(this)
    gojsConfig.GOJSInit('myDiagramDiv')
    gojsConfig.GOJSTypeInIt('myPaletteDiv') // 左侧
    this.$http.post('/S-Base/getCompanyStructureByRoleTreeJson').then((res) => {
      if (res.data.success) {
        vm.options.projectList = res.data.data
        vm.form.projectList = res.data.data
      }
    })
  },
  methods: {
    /**
     * 复制
     */
    handleCopy() {
      if (this.projectVal.length === 0) {
        this.$message('请选择项目路径！')
        return
      }
      if (this.chartId === '') {
        this.$message('请选择要复制数据点！')
        return
      }
      this.formCopy = {}
      this.dialogCopyVisible = true
    },
    // handleStructureIdChange (val) {
    //   this.formCopy.structureId = val
    // },
    /**
     * 复制确定
     */
    handleCopySubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const structureId = this.formCopy.structureId[
            this.formCopy.structureId.length - 1
          ]
          this.$http
            .post(
              '/S-Base/updateByConfiguration',
              Qs.stringify({
                ConfigurationId: this.chartId,
                dataName: this.formCopy.dataName,
                structureId: structureId,
              })
            )
            .then((res) => {
              if (res.data.success) {
                this.chartId = res.data.data.id
                this.getConfigurationByStructureId()
                // let obj = this.options.chartList.find(item => {
                //   return item.value === this.chartId
                // })
                // this.form.activeChart = obj.label
                gojsConfig.GOSJLoad(res.data.data.content, true)
                this.dialogCopyVisible = false
              }
            })
        }
      })
    },
    /**
     * 替换
     */
    handleReplace() {
      this.formInline = {}
      this.dialogReplaceVisible = true
    },
    /**
     * 替换确定
     */
    handleReplaceSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formInline.ConfigurationId = this.chartId
          this.$http
            .post(
              '/S-Base/getByConfigurationRealData',
              Qs.stringify(this.formInline)
            )
            .then((res) => {
              if (res.data.success) {
                gojsConfig.GOSJLoad(res.data.data.content, true)
                if (res.data.data.dataName.length !== 0) {
                  this.innerVisible = true
                  this.noReplaceData = res.data.data.dataName
                } else {
                  this.dialogReplaceVisible = false
                }
              }
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    innerSubmit() {
      this.innerVisible = false
      this.dialogReplaceVisible = false
    },
    buildTree(data, options) {
      options = options || {}
      var ID_KEY = options.idKey || 'id'
      var PARENT_KEY = options.parentKey || 'parentId'
      var CHILDREN_KEY = options.childrenKey || 'children'
      var tree = []
      var childrenOf = {}
      var item
      var id
      var parentId
      for (var i = 0, length = data.length; i < length; i++) {
        item = data[i]
        id = item[ID_KEY]
        parentId = item[PARENT_KEY] || 0
        childrenOf[id] = childrenOf[id] || []
        item[CHILDREN_KEY] = childrenOf[id]
        if (parentId != 0) {
          childrenOf[parentId] = childrenOf[parentId] || []
          childrenOf[parentId].push(item)
        } else {
          tree.push(item)
        }
      }
      return tree
    },
    // // 后退
    // pagesRetreatFn () {
    //   this.data.historyPages
    //   debugger
    // },
    // pagesAdvanceFn () {
    //   this.data.historyPages
    //   debugger
    // },
    changeBgFn(color) {
      this.$refs['container-Bg'].$el.style.backgroundColor = color
    },
    // load 实时数据
    loadDataFn() {
      gojsConfig.reData(false)
    },
    // 数据点改变时 修改节点名称
    dataPointChange(newVal) {
      this.form.name = this.options.devDetailed.filter(
        (item) => item.value === newVal
      )[0].label
    },
    // 删除组态
    deleteFn() {
      if (!this.chartId) {
        this.$message('请选择将被删除的组态！')
        // return false;
      }
      this.$confirm('此操作将永久删除该组态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$http
            .post(
              '/S-Base/delConfiguration',
              Qs.stringify({ ConfigurationId: this.chartId })
            )
            .then((res) => {
              if (res.data.success) {
                this.$message({
                  type: 'success',
                  message: '删除成功!',
                })
                gojsConfig.GOSJLoad({}, false)
                this.chartId = ''
                this.getConfigurationByStructureId()
              } else {
                this.$message.error(res.data.msg)
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 根据项目id 获取所有组态
    getConfigurationByStructureId(flag) {
      const val = flag
        ? this.form.projectVal[this.form.projectVal.length - 1]
        : this.projectVal[this.projectVal.length - 1]
      const that = this
      this.$http
        .post(
          '/S-Base/getConfigurationByStructureId',
          Qs.stringify({ StructureId: val })
        )
        .then((res) => {
          if (res.data.success) {
            if (flag) {
              that.form.chartList = res.data.data.map((item) => ({
                value: item.id,
                label: item.name,
              }))
            } else {
              that.options.chartList = res.data.data.map((item) => ({
                value: item.id,
                label: item.name,
              }))
            }
          } else {
            that.$message.error(res.data.msg)
          }
        })
    },
    // 选择项目 改变时
    handleProjectChange(val) {
      this.projectVal = val
      val = val[val.length - 1]
      this.getNode(val)
      // 通过项目id 获取所有组态
      this.getConfigurationByStructureId()
      this.chartId = ''
      // 根据项目id 获取分组list
      // this.$http.post('/S-RealData/getRealDataByGrouping', Qs.stringify({companyStructureId: val})).then(res => {
      //   if (res.data.success) {
      //     that.options.dataType = res.data.data.map((item) => ({
      //       value: item,
      //       label: item
      //     }))
      //   } else {
      //     that.$message.error(res.data.msg)
      //   }
      // })
    },
    handleProjectFormChange(val) {
      this.form.projectVal = val
      val = val[val.length - 1]
      this.getNode(val)
      // 通过项目id 获取所有组态
      this.getConfigurationByStructureId(true)
    },
    // 选择项目节点 改变时
    // handleProjectItemChange (val) {
    //   if (val.length > 1) {
    //     return false
    //   }
    //   val = val[val.length - 1]
    //   this.$http.post('/S-Base/getStructureByParentID', Qs.stringify({parentId: val})).then(res => {
    //     if (res.data.success) {
    //       let data = res.data.data
    //       this.getNode(val)
    //       let list = this.selectProjectItemInfo
    //       let arr = []
    //       data.forEach((item, index) => {
    //         this.$http.post('/S-Base/getStructureByParentID', Qs.stringify({parentId: item.id})).then(res => {
    //           if (res.data.data.length > 0) {
    //             item.children = []
    //           }
    //           item.children.push(res.data.data)
    //           list.children = arr
    //           this.selectListInfo = list
    //         })
    //       })
    //     } else {
    //       this.$message.error(res.data.msg)
    //     }
    //   })
    // },
    getNode(val) {
      for (const item of this.options.projectList) {
        if (item.id === val) {
          this.selectProjectItemInfo = item
        } else if (item.children) {
          this.getChildrenNode(item.children, val)
        }
      }
    },
    getChildrenNode(childrenItem, val) {
      for (const item of childrenItem) {
        if (item.id === val) {
          this.selectProjectItemInfo = item
        } else if (item.children) {
          this.getChildrenNode(item.children, val)
        }
      }
    },
    clearChart() {
      gojsConfig.GOSJLoad({}, false)
    },
    changeChart(newVal) {
      this.form.activeChart = this.options.chartList.filter(
        (item) => item.value === newVal
      )[0].label

      this.$http
        .post(
          '/S-Base/getConfigurationById',
          Qs.stringify({ id: this.chartId })
        )
        .then((res) => {
          if (res.data.success) {
            let backgroundColor = res.data.data[0].backgroundColor
            backgroundColor = backgroundColor || '#e9eef3'
            this.$refs[
              'container-Bg'
            ].$el.style.backgroundColor = backgroundColor
            gojsConfig.GOSJLoad(res.data.data[0].content, false)
            this.addChartForm.backgroundColor = res.data.data[0].backgroundColor
          } else {
            this.$message.error(res.data.msg)
          }
        })
    },
    // 保存节点信息
    saveNode() {
      alert('12121212')
      gojsConfig.GOJSSaveNode()
      this.dialogFormVisible = false
    },
    // 新增图 保存
    addSave() {
      this.saveType = 'add'
      if (this.projectVal.length === 0) {
        this.$message('请选择项目路径！')
        return false
      }
      const fullPath = this.selectProjectItemInfo.name
      this.$confirm('您确认将新增组态保存在' + fullPath + '项目下?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.addChartVisible = true
        })
        .catch(() => {})
    },
    // 修改图 保存
    editSave() {
      this.saveType = 'edit'
      if (!this.chartId) {
        this.$message('请选择需要修改的组态图！')
      }
      const fullPath = this.selectProjectItemInfo.name
      const chartName = this.options.chartList.filter(
        (item) => item.value === this.chartId
      )[0].label
      this.$confirm(
        '您确认修改' + fullPath + '项目下的' + chartName + '组态?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          gojsConfig.GOJSSave()
        })
        .catch(() => {})
    },
    // add保存组态
    saveChart() {
      gojsConfig.GOJSSave()
    },
    projectChange() {
      let requstUrl = ''
      if (process.env.NODE_ENV === 'production') {
        requstUrl = 'https://39.107.77.111:10098/data/getProjectChart.json'
      } else {
        requstUrl = 'http://localhost:9528/data/getProjectChart.json'
      }
      this.$http
        .get(requstUrl, { projectId: this.selectProject })
        .then((res) => {
          this.options.chartList = res.data.data
        })
    },
    // 数据点 模糊查询数据
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        const projectId = this.projectVal[this.projectVal.length - 1]
        if (!projectId) {
          this.$message('请选择项目！')
          // return false
        }
        // 根据项目id 获取数据点
        this.$http
          .post(
            '/S-RealData/getRealByDataName',
            Qs.stringify({
              dataName: query,
            })
          )
          .then((res) => {
            this.loading = false
            if (res.data.success) {
              this.options.devDetailed = res.data.data.map((item) => ({
                value: item.dataCode,
                label: item.dataName,
              }))
            } else {
              // this.options.dataPoint = [];
              // this.$message.error(res.data.msg)
            }
          })
      } else {
        this.options.devDetailed = []
      }
    },
  },
}
</script>
<style scoped>
.container {
  background-color: #e9eef3;
  height: calc(100vh - 150px);
}
.el-main /deep/ {
  padding: 0;
}
.el-select /deep/ {
  width: 100%;
}
.el-button + .el-button /deep/ {
  margin-left: 0px;
}
</style>
