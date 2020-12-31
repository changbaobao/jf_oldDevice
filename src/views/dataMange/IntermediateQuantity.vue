<template>
  <el-row :gutter="20">
    <el-col :span="14">
      <div class="top-btn">
        <el-form :inline="true">
          <el-form-item>
            <t-cascader v-model="structureId" style="width:200px;" @handleItemChange="handleItemChange" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="dataName" placeholder="请输入数据点名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button type="success" icon="el-icon-circle-plus-outline" @click="addrealDataClick()">新增数据点</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        ref="supplierTable"
        :row-class-name="tableRowClassName"
        :highlight-current-row="true"
        :max-height="tableHeight"
        :header-cell-style="{'background-color': '#fafafa'}"
        :data="tableData"
        style="text-align:center;"
        @row-click="handleRowClick"
      >
        <el-table-column
          prop="dataName"
          label="数据点名字"
        />
        <el-table-column
          prop="saveHistory"
          label="历史"
        />
        <el-table-column
          prop="readWrite"
          label="读写"
        />
        <el-table-column
          align="center"
          width="180"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click.stop="editRow(scope.$index,scope.row )">编辑</el-button>
            <el-button type="danger" size="mini" @click.stop="deleteRow(scope.$index,tableData )">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col v-show="isShow" :span="10">
      <el-form class="demo-form-inline" size="small" label-width="120px">
        <el-form-item label="数据点名字:" style="margin-bottom:28px;float:right;">
          <el-select
            v-model="selectValue"
            size="small"
            filterable
            remote
            reserve-keyword
            placeholder="请输入数据点"
            :remote-method="remoteMethod"
            :loading="loading"
            @change="handleSelectChange"
          >
            <el-option
              v-for="(item , index ) in scopeData"
              :key="index"
              :label="item.dataName"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
        <el-input
          v-model="textarea3"
          type="textarea"
          :rows="18"
          size="medium"
        >
          <el-tag
            v-for="(tag,index) in tags"
            :key="index"
            size="small"
            closable
          >
            {{ tag.dataName }}
          </el-tag>
        </el-input>
        <el-form-item style="margin-top:10px;">
          <el-button type="success" icon="el-icon-circle-plus-outline" size="small" class="fr" @click="reaDaName">保存</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- 添加或编辑弹框 -->
    <el-dialog
      :title="dialogName"
      width="35%"
      :visible.sync="dialogVisible"
    >
      <el-form ref="realData" :model="realData" :rules="rules" class="demo-form-inline" size="small" label-width="160px">
        <el-row>
          <el-col :span="24">
            <el-form-item prop="dataName" label="数据点名字:">
              <el-input v-model="realData.dataName" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="lowestLimit" label="L_报警值:">
              <el-input v-model="realData.lowestLimit" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="highLimit" label="H_报警值:">
              <el-input v-model="realData.highLimit" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="readWrite" label="读写:">
              <el-radio-group v-model="realData.readWrite">
                <el-radio label="读" />
                <el-radio label="写" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="saveHistory" label="是否保存历史:">
              <template>
                <el-radio-group v-model="realData.saveHistory">
                  <el-radio label="是" />
                  <el-radio label="否" />
                </el-radio-group>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item>
            <el-button @click="resetForm('realData')">取 消</el-button>
            <el-button type="primary" @click="addrealData('realData')">确 定</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </el-row>
</template>
<script>
import Qs from 'qs'
import tCascader from '@/components/base/t-cascader'
export default {
  name: 'IntermediateQuantity',
  components: {
    tCascader
  },
  data() {
    return {
      tableHeight: window.innerHeight - 202,
      tableEndIndex: 0,
      dialogName: '', // 弹框标题
      structureId: '', // 项目
      // radio2: '读',
      // radio1: '否',
      dataName: '', // 数据点名字
      selectValue: '', // 远程搜索绑定值
      nodeName: '', // 点击的树节点名字
      scopeData: [], // 模糊查询数据
      tags: [], // tag
      tableName: [],
      editRowIndex: null,
      content: null,
      editorOption: {},
      isShow: false,
      updateId: '',
      arr: [],
      realData: {
        dataName: '', // 数据点名字
        custom4: '', // 自定义4
        readWrite: '', // 读写
        grouping: '', // 分组
        lowestLimit: '', // L_报警值
        highLimit: '', // H_报警值
        saveHistory: '' // 是否保存历史
      },
      loading: false,
      textarea3: '',
      rules: {
        dataName: [
          { required: true, message: '请输入数据点名称', trigger: 'blur' }
        ],
        readWrite: [
          { required: true, message: '请选择读或者写', trigger: 'change' }
        ],
        saveHistory: [
          { required: true, message: '请选择是或者否', trigger: 'change' }
        ],
        lowestLimit: [
          { required: true, message: '请输入是或者否', trigger: 'blur' }
        ],
        highLimit: [
          { required: true, message: '请输入是或者否', trigger: 'blur' }
        ]
      },
      tableData: [],
      tableDatas: [],
      dialogVisible: false,
      realDataArr: [],
      realDataArrIndex: -1,
      page: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      }

    }
  },
  methods: {
    highlight: function() { // 回显高亮方法，根据已经选择的id，调用 element-ui table的设置高亮方法
      for (var a = 0; a < this.tableData.length; a++) {
        if (a === this.tableEndIndex) {
          this.$refs.supplierTable.setCurrentRow(this.tableData[a])
        }
      }
    },
    tableRowClassName({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex
    },
    reaDaName(textarea3) {
      const coustom = this.replaceStraaa(this.textarea3, this.realDataArr, '保存')
      this.$http.post('/S-RealData/getByUpdateReal', Qs.stringify({ id: this.dataCodes, coustom4: coustom }, { indices: false })).then(response => {
        if (response.data.success) {
          this.tableData[this.realDataArrIndex].custom4 = coustom
          // this.tableData.push(response.data.data)
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success'
          })
          this.dialogVisible = false
        } else {
          this.$notify({
            title: '添加失败',
            message: response.data.msg,
            type: 'error'
          })
        }
      })
    },

    /**
     * 远程搜索查询数据点
     */
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.$http.post('/S-RealData/getRealByDataName', Qs.stringify({ dataName: query })).then(res => {
            if (res.data.success) {
              this.scopeData = res.data.data
              this.loading = false
            }
          }).catch(function(err) {
            console.log(err)
          })
        }, 300)
      } else {
        this.scopeData = []
      }
    },
    /**
     * 点击当前行表格
     */
    handleRowClick(row, event, column) {
      this.dataCodes = row._id
      this.realDataArrIndex = row.index
      this.isShow = true
      // this.textarea3 = row.custom4
      // this.realDataArr = []
      const arrId = this.findAllDataCode(row.custom4)
      this.arr_custom4_id = arrId
      this.$http.post('/S-RealData/getRealDataValue', Qs.stringify({ dataCodes: arrId }, { indices: false })).then(res => {
        if (res.data.success) {
          this.realDataArr = res.data.data
          const bbb = this.replaceStraaa(row.custom4, this.realDataArr, '显示')
          this.textarea3 = bbb
        }
      }).catch(function(err) {
        console.log(err)
      })
    },
    replaceStraaa(allStr, arrRealData, type) {
      for (const index in arrRealData) {
        const item = arrRealData[index]
        if (type === '显示') {
          const reg = new RegExp(item._id, 'g')
          allStr = allStr.replace(reg, item.dataName)
        }
        if (type === '保存') {
          const reg2 = new RegExp(item.dataName, 'g')
          allStr = allStr.replace(reg2, item._id)
        }
      }

      return allStr
    },
    findAllDataCode(custom4) {
      if (custom4 === undefined) {
        return ''
      }
      if (custom4 === null) {
        return ''
      }
      const pattern = /@(.+?)@/g
      const bbbb = custom4.match(pattern)
      for (const index in bbbb) {
        let item = bbbb[index]
        item = item.replace(/\@/g, '').replace(/\@/g, '')
        bbbb[index] = item
      }
      return bbbb
    },
    /**
    * 数据点值发生改变添加tag
    */
    handleSelectChange(vId) {
      let obj = {}
      obj = this.scopeData.find((item) => { // 这里的scopeData就是上面遍历的数据源
        return item._id === vId// 筛选出匹配数据
      })
      this.realDataArr.push(obj)
      this.arr.push(obj.dataName)
      const dataNames = '@' + obj.dataName + '@'
      this.textarea3 = this.textarea3 + '  ' + dataNames
    },
    /** 取消编辑 */
    resetDevForm(formName) {
      this.$refs[formName].resetFields()
      this.DevVisible = false
    },
    /** 删除 */
    deleteRow(index, rows) {
      this.$confirm('此操作将彻底删除用户[' + rows[index].dataName + '], 确定吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('/S-RealData/delRealData', {
          params: {
            id: rows[index]._id
          }
        }).then(response => {
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
    },
    /**
     * 获取项目名称
     */
    handleItemChange(val, item) {
      this.structureId = item.id
    },
    /** 编辑 */
    editRow(index, rows) {
      this.editRowIndex = index
      this.realData.id = rows._id
      this.realData.dataName = rows.dataName
      this.realData.custom4 = rows.custom4
      this.realData.readWrite = rows.readWrite
      this.realData.grouping = rows.grouping
      this.realData.lowestLimit = rows.lowestLimit
      this.realData.highLimit = rows.highLimit
      this.realData.saveHistory = rows.saveHistory
      this.dialogVisible = true
    },
    /** 添加 */
    addrealDataClick() {
      if (this.structureId === '') {
        this.$notify({
          title: '请选择项目名称',
          type: 'error'
        })
      } else {
        this.dialogName = '添加'
        this.realData.dataName = ''
        this.realData.custom4 = ''
        this.realData.grouping = ''
        this.realData.lowestLimit = ''
        this.realData.highLimit = ''
        this.realData.readWrite = '读'
        this.realData.saveHistory = '否'
        this.dialogVisible = true
      }
    },
    /** 添加或编辑 */
    addrealData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.realData.companyStructureId = this.structureId
          if (this.realData.id) { // 编辑
            // this.realData.id = this.updateId
            this.$http.post('/S-RealData/getByUpdateRealDate', Qs.stringify(this.realData)).then(response => {
              if (response.data.success) {
                const dataNew = response.data.data
                dataNew._id = dataNew.id
                this.$set(this.tableData, this.editRowIndex, dataNew)
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success'
                })
                this.dialogVisible = false
              } else {
                this.$notify({
                  title: '修改失败',
                  message: response.data.msg,
                  type: 'error'
                })
              }
            })
          } else { // 添加
            this.$http.post('/S-RealData/getAddRealDate', Qs.stringify(this.realData)).then(response => {
              if (response.data.success) {
                const dataNew = response.data.data
                dataNew._id = dataNew.id
                this.tableData.unshift(dataNew)
                this.tableEndIndex = 0
                this.handleRowClick(this.tableData[0], '', '')
                this.highlight()
                this.$notify({
                  title: '成功',
                  message: '添加成功',
                  type: 'success'
                })
                this.dialogVisible = false
              } else {
                this.$notify({
                  title: '添加失败',
                  message: response.data.msg,
                  type: 'error'
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
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    /**
     * 搜索查询
     */
    handleSearch() {
      if (this.structureId === null || this.structureId === '') {
        this.$notify({
          title: '请选择项目',
          type: 'error'
        })
      } else {
        if (this.dataName === null || this.dataName === '') {
          this.getTableData({ companyStructureId: this.structureId })
        } else {
          this.getTableData({ companyStructureId: this.structureId, dataName: this.dataName })
        }
      }
    },
    getTableData(params) {
      this.$http.post('/S-RealData/getRealGroup', Qs.stringify(params)).then(res => {
        this.tableData = res.data.data
        this.page.total = res.data.data.total
        this.textarea3 = ''
      })
    },

    /**
     * 数据点名字搜索查询
     */
    handleDataName() {
      if (this.dataName === null || this.dataName === '') {
        this.$notify({
          title: '请输入数据点名字',
          type: 'error'
        })
      } else {
        this.getTableDataName({ dataName: this.dataName })
      }
    },
    getTableDataName(params) {
      this.$http.post('/S-RealData/getRealByDataName', Qs.stringify(params)).then(res => {
        this.tableName = res.data.data
        this.page.total = res.data.data.total
      })
    },
    handleCurrentChange(val) {
      this.realData.pageNo = val
      this.realData.pageSize = this.page.pageSize
      this.getTableData(this.realData)
    },
    handleSizeChange(val) {
      this.realData.pageNo = this.page.currentPage
      this.realData.pageSize = val
      this.getTableData(this.realData)
    }
  }

}
</script>
<style scoped>
.el-table__body tr.current-row>td {
        background:#99FFFF !important;}
</style>
