<template>
  <div class="roleContainer">
    <el-row :gutter="20">
      <el-col :span="9">
        <div class="grid-content bg-fff pad10">
          <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose"
            :close-on-click-modal="shade"
          >
            <el-form ref="from" :model="from" label-width="100px" class="demo-ruleForm" size="small">
              <el-form-item label="名称" prop="roleName" :rules="{required: true, message: '名称不能为空', trigger: 'blur'}">
                <el-input v-model="from.roleName" />
              </el-form-item>
              <el-form-item label="描述" prop="remark">
                <el-input v-model="from.remark" />
              </el-form-item>
              <el-form-item label="分组" prop="grouping">
                <el-input v-model="from.grouping" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :disabled="addBtnDisable" @click="addUserDialogClick('from')">确定</el-button>
                <el-button @click="dialogVisible = false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
          <div style="overflow:hidden;">
            <div class="adding">
              <el-button type="primary" size="mini" @click="addRole('add')">
                <i class="el-icon-plus" />
                <span>添加角色</span>
              </el-button>
            </div>
            <div class="inp">
              <el-input
                v-model="find"
                placeholder="请输入角色名称"
                @keyup.enter.native="addsearch"
              >
                <i slot="prefix" class="el-input__icon el-icon-search" style="cursor: pointer;" @click="addsearch" />
              </el-input>
            </div>
          </div>
          <div class="mintable" style="margin-top:10px;">
            <el-table
              highlight-current-row
              :data="tableData"
              :header-cell-style="{'background-color': '#fafafa'}"
              @row-click="handleRowclick"
            >
              <el-table-column
                prop="roleName"
                label="名称"
              />
              <el-table-column
                label="创建时间"
                prop="createTime"
                :formatter="filterTime"
              />
              <el-table-column
                align="center"
                label="操作"
              >
                <template slot-scope="scopeS">
                  <el-button type="text" icon="el-icon-edit" size="mini" @click.native.prevent="editRow(scopeS.$index,tableData)" />
                  <el-button type="text" style="color:#f56c6c;" icon="el-icon-delete" size="mini" @click.native.prevent="deleteRow(scopeS.$index,tableData )" />
                </template>
              </el-table-column>
            </el-table>
            <div class="block" style="margin-top:10px;">
              <el-pagination
                :current-page="rolepages.currentPage"
                :page-size="rolepages.pageSize"
                background
                layout="total,prev, pager, next"
                :total="rolepages.total"
                @size-change="handleSizeChangeByrole"
                @current-change="handleCurrentChangeByrole"
              />
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="15">
        <div class="grid-content bg-fff">
          <div class="cut">
            <el-tabs v-model="activeName" class="altitude">
              <el-tab-pane label="添加人员" name="first">
                <div class="add">
                  <el-button class="remove" type="primary" size="small" :disabled="this.roleId==''" @click="addMore()">
                    <i class="el-icon-plus" />
                    <span>批量添加</span>
                  </el-button>
                  <el-button class="remove" type="primary" name="first" size="small" :disabled="this.roleId==''|| this.idArry.length==0" @click="delRoleMa()">
                    <i class="el-icon-delete" />
                    <span>批量删除</span>
                  </el-button>
                  <el-dialog
                    title="添加"
                    :visible.sync="dialogVisiblepi"
                    width="60%"
                    :before-close="handleClose"
                    :close-on-click-modal="shade"
                  >
                    <div class="location">
                      <el-input
                        v-model="seek"
                        size="small"
                        placeholder="请输入用户名称"
                        @keyup.enter.native="refer"
                      >
                        <i slot="prefix" class="el-input__icon el-icon-search" style="cursor: pointer;" @click="refer" />
                      </el-input>
                    </div>
                    <template>
                      <el-table
                        ref="multipleTable"
                        :data="tableData4"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange"
                      >
                        <el-table-column
                          type="selection"
                          width="55"
                        />
                        <el-table-column
                          prop="name"
                          label="姓名"
                        />
                        <el-table-column
                          prop="sex"
                          label="性别"
                        />
                        <el-table-column
                          prop="phone"
                          label="电话号码"
                        />
                        <el-table-column
                          prop="email"
                          label="邮箱"
                        />
                        <el-table-column
                          prop="position"
                          label="职位"
                        />
                      </el-table>
                    </template>
                    <div class="pages">
                      <div class="block">
                        <el-pagination
                          :current-page="pages.currentPage"
                          :page-size="pages.pageSize"
                          layout="total,prev, pager, next, jumper"
                          :total="pages.total"
                          @size-change="handleSizeChange"
                          @current-change="handleCurrentChange"
                        />
                      </div>
                    </div>
                    <span slot="footer" class="dialog-footer">
                      <el-button size="small" @click="dialogVisiblepi = false">取 消</el-button>
                      <el-button type="primary" size="small" @click="addRoleMa()">确 定</el-button>
                    </span>
                  </el-dialog>
                  <div class="table">
                    <el-table
                      ref="multipleTable"
                      :data="tableData3"
                      tooltip-effect="dark"
                      style="width: 100%"
                      @selection-change="handleSelectionChange"
                    >
                      <el-table-column
                        type="selection"
                        width="55"
                      />
                      <el-table-column
                        prop="name"
                        label="姓名"
                      />
                      <el-table-column
                        prop="sex"
                        label="性别"
                      />
                      <el-table-column
                        prop="phone"
                        label="电话号码"
                      />
                      <el-table-column
                        prop="email"
                        label="邮箱"
                      />
                      <el-table-column
                        prop="position"
                        label="职位"
                      />
                      <!-- <el-table-column
                        prop="locking"
                        label="登录状态">
                      </el-table-column> -->
                      <el-table-column
                        prop="working"
                        :formatter="workingFormat"
                        label="在职状态"
                      />
                      <el-table-column
                        class="you"
                        label="操作"
                      >
                        <template slot-scope="scope">
                          <el-button
                            class="green"
                            type="text"
                            size="smalsl"
                            @click.native.prevent="delete3Row(scope.$index,tableData3 )"
                          >
                            删除
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="所属模块" name="second">
                <el-row>
                  <el-col :span="12" style="border: 10px solid rgb(247, 247, 247);padding:10px;min-height:500px;">
                    <el-button type="primary" size="small" @click="subStrByRoleId('module')">保存</el-button>
                    <div class="left-min">
                      <div class="treeRole" style="margin-left:15px">
                        <el-tree
                          ref="tree"
                          :data="muneData"
                          show-checkbox
                          node-key="id"
                          highlight-current
                          :props="defaultProps"
                          @check="handleClickTree"
                        />
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="12" style="border: 10px solid rgb(247, 247, 247);padding:10px;min-height:500px;" />
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="所属管辖" name="third">
                <el-row>
                  <el-col :span="12" style="border: 10px solid rgb(247, 247, 247);padding:10px;min-height:500px;">
                    <el-button type="primary" size="small" @click="subStrByRoleId('structure')">保存</el-button>
                    <div class="left-min">
                      <div class="treeRole" style="margin-left:15px">
                        <el-tree
                          ref="tree2"
                          :data="muneDataStr"
                          show-checkbox
                          node-key="id"
                          highlight-current
                          :props="defaultProps2"
                          @check="handleClickTree"
                        />
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="12" style="border: 10px solid rgb(247, 247, 247);padding:10px;min-height:500px;" />
                </el-row>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import qs from 'qs'
import { array_diff, deepCloneEs6, parseTime } from '@/utils/index'
import utils from '@/utils/creatTree'
export default {
  name: 'RoleManage',
  data() {
    return {
      addBtnDisable: false,
      dialogTitle: '', // 弹框标题
      checkedKeys: [],
      halfCheckedKeys: [],
      muneDataStr: [],
      defaultSetnode: [],
      seek: '',
      alluser: [],
      selectedUser: [],
      roleId: '',
      idArry: '',
      dialogVisiblepi: false,
      shade: false,
      find: '',
      dialogVisible: false,
      addOrEdit: '',
      editRowData: {},
      editRowIndex: -11,
      from: {
        roleName: '',
        remark: '',
        grouping: ''
      },
      tableData: [],
      activeName: 'first',
      tableData4: [],
      tableData3: [],
      currentPage1: 1,
      currentPage2: 1,
      currentPage3: 1,
      currentPage4: 1,
      pages: {
        currentPage: 1,
        pageSize: 10,
        total: ''
      },
      rolepages: {
        pageSize: 10,
        total: null,
        currentPage: 1
      },
      muneData: [],
      defaultProps: {
        children: 'children',
        label: 'chineseName'
      },
      defaultProps2: {
        children: 'children',
        label: 'NAME'
      }
    }
  },
  computed: {
    tab3() { return this.tableData3.map(t => (t.id)) }
  },
  created() {
    this.init({
      pageNo: this.pages.currentPage,
      pageSize: this.pages.pageSize
    })
    this.getUser()
    this.getCompanyData(this.pages.currentPage, this.pages.pageSize)
  },
  mounted() {
  },
  methods: {
    filterTime(row) {
      return parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}')
    },
    workingFormat(row, column, cellValue, index) {
      if (row.working === 1) {
        return '在职'
      }
      if (row.working === 0) {
        return '离职'
      }
    },
    handleClickTree(nodeObj, selectNodestate) {
      this.halfCheckedKeys = selectNodestate.halfCheckedKeys
      const checkKey = selectNodestate.checkedKeys
      this.checkedKeys = array_diff(checkKey, this.halfCheckedKeys)
    },
    /** 所属管辖保存 */
    subStrByRoleId(type) {
      if (type === 'structure') {
        this.halfCheckedKeys = this.$refs.tree2.getHalfCheckedKeys()
        this.checkedKeys = this.$refs.tree2.getCheckedKeys()
        const params = {
          roleId: this.roleId,
          structureIds: this.checkedKeys,
          halfStructureIds: this.halfCheckedKeys
        }
        this.$http({
          headers: { 'Content-Type': 'application/json' },
          method: 'post',
          url: '/S-Base/addStructureRoleByStructureIdsNew',
          data: params
        }).then(res => {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success'
          })
          this.init({
            pageNo: this.pages.currentPage,
            pageSize: this.pages.pageSize
          })
        })
        // this.$http.post(
        //   `/S-Base/addStructureRoleByStructureIds?structureIds=${this.checkedKeys.join(',')}&roleId=${this.roleId}&halfStructureIds=${this.halfCheckedKeys.join(',')}`).then(res => {
        //   this.$notify({
        //     title: '成功',
        //     message: '修改成功',
        //     type: 'success'
        //   })
        //   this.init({
        //     pageNo: this.pages.currentPage,
        //     pageSize: this.pages.pageSize
        //   })
        // })
      }
      if (type === 'module') {
        this.halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
        this.checkedKeys = this.$refs.tree.getCheckedKeys()
        this.$http.post(
          `/S-Base/addModuleRoleByModuleIdsHalf?moduleIds=${this.checkedKeys.join(',')}&roleId=${this.roleId}&halfModuleIds=${this.halfCheckedKeys.join(',')}`).then(res => {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success'
          })
          this.init({
            pageNo: this.pages.currentPage,
            pageSize: this.pages.pageSize
          })
        })
      }
    },
    delUserRole(addedid, showObj) {
      const allId = showObj.map(t => (t.id))
      const a = new Set(allId)
      const b = new Set(addedid)
      const dfrcset = [...new Set([...a].filter(x => !b.has(x)))]
      const middleArray = showObj.reduce((obj, t) => {
        obj[t.id] = t
        return obj
      },
      {})
      showObj = dfrcset.map(t => (middleArray[t]))
      return showObj
    },
    addMore() {
      this.dialogVisiblepi = true
      this.tableData4 = this.delUserRole(this.tab3, this.alluser)
    },
    headerStyle({ row, rowIndex }) {
      return 'table-th'
    },
    addRoleMa() {
      this.$http.post(`/S-Base/addUserRoleByUserIds?userIds=${this.idArry.join(',')}&roleId=${this.roleId}`)
        .then(res => {
          this.tableData3 = [...this.tableData3, ...this.selectedUser]
          this.tableData4 = this.delUserRole(this.idArry, this.tableData4)
          this.dialogVisiblepi = false
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    handleClose(done) {
      done()
    },
    delRoleMa() {
      this.$http.post(`/S-Base/delUserRoleByUserIds?userIds=${this.idArry.join(',')}&roleId=${this.roleId}`)
        .then(res => {
          this.tableData3 = this.delUserRole(this.idArry, this.tableData3)
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    handleSizeChange(val) {
      this.getCompanyData(this.pages.currentPage, val)
    },
    handleCurrentChange(val) {
      this.getCompanyData(val, this.pages.pageSize)
    },
    getCompanyData(pageNo, pageSize) {
      var _this = this
      this.$http.post('/S-Base/getUserByRole', qs.stringify({ pageNo: pageNo, pageSize: pageSize }))
        .then(function(res) {
          if (res.data.success) {
            _this.tableData4 = _this.delUserRole(_this.tableData3.map(t => (t.id)), res.data.data.list)
            _this.pages.currentPage = res.data.data.pageNum
            _this.pages.total = res.data.data.total
          }
        })
    },
    refer() {
      var that = this
      this.$http.get('/S-Base/getListUserNamePhoneEmail', {
        params: {
          name: that.seek
        }
      }).then(function(response) {
        if (response.data.success) {
          that.tableData4 = response.data.data.list
          that.pages.total = response.data.data.total
          that.$notify({
            title: '成功',
            message: '查询成功',
            type: 'success'
          })
        }
      })
    },
    /**
     * 获取角色
     */
    getUser() {
      this.$http.post('/S-Base/getUserByRole')
        .then(res => {
          this.tableData4 = res.data.data.list
          this.pages.total = res.data.data.total
          this.alluser = this.tableData4.slice()
        })
    },
    handleSelectionChange(val) {
      const idArry = val.map(t => { return t.id })
      this.idArry = idArry
      this.selectedUser = val
    },
    /**
     * 点击选中的值
     */
    handleRowclick(row, event, column) {
      this.roleId = row.id
      this.$http.post(`/S-Base/getByUserRoleId?userRoleId=${row.id}`)
        .then(reponse => {
          this.tableData3 = reponse.data.data
        })
      this.$http.post(`/S-Authorization/getModuleByRole?roleId=${row.id}`).then(
        res => {
          const setKey = res.data.data.filter((t) => t.checked === 1 && t.halfChecked !== 1).map(t => (t.id))
          this.muneData = utils.creatTree(res.data.data)
          this.setCheckedKeys(setKey)
        }
      )
      this.$http.post(`/S-Authorization/getCompanyStructureByRole?roleId=${row.id}`).then(
        res => {
          const setKey1 = res.data.data.filter((t) => t.checked === 1 && t.halfChecked !== 1).map(t => (t.id))
          this.muneDataStr = utils.creatTree(res.data.data)
          this.setCheckedKeys2(setKey1)
        }
      )
    },
    setCheckedKeys(arr) {
      this.$refs.tree.setCheckedKeys(arr)
    },
    setCheckedKeys2(arr) {
      this.$refs.tree2.setCheckedKeys(arr)
    },
    addRole(type) {
      this.dialogTitle = '添加'
      this.addOrEdit = type
      this.dialogVisible = true
    },
    init(params) {
      this.$http.post('/S-Base/getRoleByRole', qs.stringify(params))
        .then(reponse => {
          this.tableData = reponse.data.data.list
          this.rolepages.total = reponse.data.data.total
        })
    },
    /**
     * 页码发生改变
     */
    handleSizeChangeByrole(val) {
      const params = { roleName: this.find, pageNo: this.rolepages.currentPage, pageSize: val }
      this.init(params)
    },
    /**
     * 当前页发生改变
     */
    handleCurrentChangeByrole(val) {
      const params = { roleName: this.find, pageNo: val, pageSize: this.rolepages.pageSize }
      this.init(params)
    },
    delete3Row(index, rows) {
      const _this = this
      this.$confirm('此操作将彻底删除[' + rows[index].name + ']用户, 继续吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('/S-Base/delUserRole', {
          params: {
            userId: rows[index].id,
            roleId: rows[index].role_id
          }
        }).then(function(response) {
          if (response.data.success) {
            rows.splice(index, 1)
            _this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            })
          } else {
            _this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error'
            })
          }
        })
      })
    },
    addUserDialogClick(formName) {
      this.addBtnDisable = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.addOrEdit === 'add') {
            this.$http.get('/S-Base/addRole', {
              params: {
                roleName: this.from.roleName,
                remark: this.from.remark,
                grouping: this.from.grouping
              }
            }).then(response => {
              if (response.data.success) {
                this.tableData.unshift(response.data.data)
                this.$notify({
                  title: '成功',
                  message: '添加成功',
                  type: 'success'
                })
                this.addBtnDisable = false
                this.dialogVisible = false
              } else {
                this.$notify({
                  title: '添加失败',
                  message: response.data.msg,
                  type: 'error'
                })
              }
            })
          } else {
            this.$http.get('/S-Base/updateRole', {
              params: {
                id: this.addOrEdit,
                roleName: this.from.roleName,
                remark: this.from.remark,
                grouping: this.from.grouping
              }
            }).then(response => {
              if (response.data.success) {
                this.editRowData.id = this.addOrEdit
                this.editRowData.roleName = this.from.roleName
                this.editRowData.remark = this.from.remark
                this.editRowData.grouping = this.from.grouping
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success'
                })
                this.addBtnDisable = false
                this.dialogVisible = false
              } else {
                this.$notify({
                  title: '修改失败',
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
    addUserClick() {
      this.addOrEdit = 'add'
      this.from = {}
      this.dialogVisible = true
    },
    editRow(index, rows) {
      this.addOrEdit = rows[index].id
      this.editRowIndex = index
      this.editRowData = rows[index]
      this.from = deepCloneEs6(rows[index])
      this.dialogTitle = '编辑'
      this.dialogVisible = true
    },
    deleteRow(index, rows) {
      const _this = this
      this.$confirm('此操作将彻底删除[' + rows[index].roleName + ']用户, 继续吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('/S-Base/delRole', {
          params: {
            roleId: rows[index].id
          }
        }).then(function(response) {
          if (response.data.success) {
            rows.splice(index, 1)
            _this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            })
          } else {
            _this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error'
            })
          }
        })
      })
    },
    /**
     * 搜索
     */
    addsearch() {
      const params = { roleName: this.find, pageNo: this.rolepages.currentPage, pageSize: this.rolepages.pageSize }
      this.roleId = ''
      this.tableData3 = []
      this.muneData = []
      this.muneDataStr = []
      this.init(params)
    }
  }
}
</script>
<style scoped>
.el-main{
    flex-basis:auto;
}
.pages{
  width: 460px;
  height: 45px;
  margin: 0 auto;
  margin-top: 20px;
}
 .adding {
  float: left;
  margin-right:5px;
}
.inp{
  float: right;
}
.dad{
  float: left;
}
.cut{
  background-color: #fff;
  padding: 14px;
  border-radius: 8px;
}
.table{
  width: 100%;
  margin-top: 24px;
}
.table-th{
  text-align: center;
}
.cell{
  text-align: center;
}
.inside{
  width: 100%;
}
.inside-nei{
  width: 100%;
  margin: 0 auto;
}
.list{
  width: 100%;
  height: 35px;
  margin-bottom: 30px;
}
.lisy{
  width: 100%;
  height: 35px;
}
.prim{
  width: 50%;
  height: 35px;
  float: left;
}
.prim span{
  width: 82px;
  height: 35px;
  line-height: 35px;
  float: left;
  display: block;
  text-align: center;
  letter-spacing: 25px;
  font-weight: bold;
  padding-left: 14px;
  color: #666;
}
.prim .create{
  letter-spacing: 5px;
}
.prim input{
  width: 132px;
  height: 28px;
  margin-top: 1.5px;
  border-radius: 5px;
  padding-left: 16px;
  border: none;
  border: 1px solid #666;
  float: left;
}
.location{
  position: absolute;
  right: 50px;
  top: 12px;
}
</style>
