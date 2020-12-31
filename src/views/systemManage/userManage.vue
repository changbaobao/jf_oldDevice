<template>
  <div class="userManage">
    <el-dialog :title="dialogTitle" width="45%" :close-on-click-modal="false" :visible.sync="dialogVisible" @close="closeDialog">
      <el-form ref="from" :model="from" :rules="rules" class="demo-form-inline" size="small" label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="name" label="姓名:">
              <el-input v-model="from.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="phone" label="电话:">
              <el-input v-model="from.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="email" label="邮箱:">
              <el-input v-model="from.email" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="position" label="职位:">
              <el-input v-model="from.position" auto-complete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="sex" label="性别:">
              <template>
                <el-radio v-model="from.sex" label="男">男</el-radio>
                <el-radio v-model="from.sex" label="女">女</el-radio>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="identityCard" label="身份证:">
              <el-input v-model="from.identityCard" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="NC部门" prop="ncDepartment">
              <el-select v-model="from.ncDepartment" filterable remote clearable placeholder="请输入关键词" :remote-method="remoteMethodNC" :loading="loading">
                <el-option v-for="(v ,index ) in managementArr" :key="index" :label="v.managementDepartment" :value="v.managementDepartment" />
              </el-select>
            </el-form-item>

            <!-- <el-form-item  label="NC部门" prop="ncDepartment">
              <el-input v-model="from.ncDepartment"></el-input>
            </el-form-item>-->
          </el-col>
          <el-col :span="12">
            <el-form-item label="NC用户" prop="ncUserId">
              <el-input v-model="from.ncUserId" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="working" label="在职状态:">
              <el-radio-group v-model="from.working">
                <el-radio :label="0">离职</el-radio>
                <el-radio :label="1">在职</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="locking" label="登录锁定:">
              <el-radio-group v-model="from.locking">
                <el-radio :label="1">锁定</el-radio>
                <el-radio :label="0">解锁</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="callEmpno" label="呼叫中心员工号:">
              <el-input v-model="from.callEmpno" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="callEmployeePwd" label="呼叫中心密码:">
              <el-input v-model="from.callEmployeePwd" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="callExtensionNumber" label="呼叫中心分机号:">
              <el-input v-model="from.callExtensionNumber" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item>
            <el-button size="small" @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" size="small" @click="addUserDialogClick('from',addOrEdit)">确 定</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog title="修改用户创建人" width="45%" :close-on-click-modal="false" :visible.sync="dialogCreateUser">
      <el-form ref="ruleForm" :model="ruleForm" :rules="userRolerules" :label-position="labelPosition" label-width="100px" class="demo-ruleForm" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="前创建人：" prop="oldUserId">
              <el-select v-model="ruleForm.oldUserId" filterable remote clearable placeholder="请输入姓名" :remote-method="remoteMethod" :loading="loading">
                <el-option v-for="item in oldUserData" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="新创建人：" prop="newUserId">
              <el-select v-model="ruleForm.newUserId" filterable remote clearable placeholder="请输入姓名" :remote-method="remoteMethod1" :loading="loading">
                <el-option v-for="item in oldUserData" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogCreateUser = false">取 消</el-button>
        <el-button type="primary" size="small" @click="updateCreateUserClick(ruleForm)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看角色 -->
    <el-dialog :title="dialogTitle" width="35%" :visible.sync="dialogRoleVisible">
      <el-table :header-cell-style="{
          'background-color': '#fafafa'}" :data="RoleData" style="width: 100%">
        <el-table-column prop="role_name" label="名称" width="180" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="setRole(scope.$index,scope.row)">设为默认</el-button>
            <el-button type="danger" size="mini" @click="deleteRole(scope.$index,RoleData)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <div ref="header" class="top-btn clearfix" style="padding-bottom:10px;">
      <el-input v-model="str" placeholder="请输姓名/电话号码/邮箱" style="width:200px;" />
      <el-button type="primary" size="mini" @click="addsearch()">搜索</el-button>
      <el-button type="success" icon="el-icon-circle-plus-outline" @click="addUserClick('新增')">新增用户</el-button>
      <el-button type="primary" icon="el-icon-edit" @click="updateCreateUser()">修改用户创建人</el-button>
    </div>
    <div class="table">
      <el-table
        ref="multipleTable"
        :data="userData"
        :max-height="this.tableHeight"
        :header-cell-style="{
          'background-color': '#fafafa'}"
        style="width: 100%;text-align:center;"
        tooltip-effect="dark"
      >
        <el-table-column fixed prop="name" label="姓名" />
        <el-table-column prop="sex" label="性别" />
        <el-table-column prop="phone" label="电话号码" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="position" label="职位" />
        <el-table-column prop="working" :formatter="workingFormat" label="在职" />
        <el-table-column prop="locking" :formatter="lockingFormat" label="登录锁定" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" style="color:#999999;" icon="el-icon-view" size="small" @click="editViews(scope.$index,scope.row)" />
            <el-button type="text" icon="el-icon-edit" size="small" @click="editRow(scope.$index,userData )" />
            <el-button type="text" style="color:#f56c6c;" icon="el-icon-delete" size="small" @click="deleteRow(scope.$index,userData )" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pages" style="margin-top:10px;">
      <el-pagination
        background
        :current-page="pages.currentPage"
        :page-sizes="pages.pageSizes"
        :page-size="pages.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pages.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import Qs from 'qs'
import { deepCloneEs6 } from '@/utils/index'
import publicMinxin from '@/utils/tableHeight.mixin'
export default {
  name: 'UserManage',
  mixins: [publicMinxin],
  data() {
    // var checkPhone = (rule, value, callback) => {
    //   if (!value) {
    //     return callback(new Error('手机号不能为空'))
    //   } else {
    //     const reg = /^1\d{10}$/
    //     if (reg.test(value)) {
    //       callback()
    //     } else {
    //       return callback(new Error('请输入正确的手机号'))
    //     }
    //   }
    // }
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }, 100)
    }
    return {
      managementArr: [],
      userId: '',
      loading: false,
      labelPosition: 'left',
      oldUserData: [],
      ruleForm: {
        oldUserId: '',
        newUserId: ''
      },
      dialogCreateUser: false,
      dialogRoleVisible: false, // 角色弹框
      RoleData: [],
      dialogTitle: '', // 弹框标题
      find: '',
      addOrEdit: '',
      editRowIndex: -11,
      editRowData: {},
      from: {
        name: '',
        sex: '',
        phone: '',
        email: '',
        position: '',
        zip: '',
        ncDepartment: '',
        ncUserId: '',
        working: '',
        locking: '',
        callEmpno: '',
        callEmployeePwd: '',
        callExtensionNumber: '',
        identityCard: '' // 身份证号
      },
      str: '',
      userData: [],
      dialogVisible: false,
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      shuzu: [],
      pages: {
        currentPage: 1,
        pageSize: 10,
        total: null,
        pageSizes: [10, 20, 30, 40, 50, 100]
      },
      rules: {
        name: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        email: [{ required: true, validator: checkEmail, trigger: 'blur' }],
        position: [{ required: true, message: '请输入职位名称', trigger: 'blur' }],
        working: [{ required: true, message: '请选择在职状态', trigger: 'change' }],
        locking: [{ required: true, message: '请选择账号状态', trigger: 'change' }],
        identityCard: [
          {
            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            message: '证件号码格式有误！',
            trigger: 'blur'
          }
        ],
        phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }]
        // phone: [{ required: true, validator: checkPhone, trigger: 'blur' }]
      },
      userRolerules: {
        oldUserId: [{ required: true, message: '请选择输入原创建人', trigger: 'blur' }],
        newUserId: [{ required: true, message: '请选择输入新创建人', trigger: 'blur' }]
      }
    }
  },
  created() {
    const params = { name: this.str, pageNo: this.pages.currentPage, pageSize: this.pages.pageSize }
    this.getTableData(params)
  },
  methods: {
    closeDialog() {
      this.$nextTick(() => {
        this.$refs.from.resetFields()
        this.dialogVisible = false
      })
    },
    updateCreateUser() {
      this.dialogCreateUser = true
    },
    updateCreateUserClick(ruleForm) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          console.log(ruleForm.oldUserId)
          console.log(ruleForm.newUserId)
        }
        const params = { oldRoleId: ruleForm.oldUserId, newRoleId: ruleForm.newUserId }
        this.$http.post('/S-Base/UpdateUserRoleCreator', Qs.stringify(params)).then(res => {
          if (res.data.success) {
            this.$notify({
              title: '成功',
              message: res.data.msg,
              type: 'success'
            })
            this.dialogCreateUser = false
          }
        })
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.oldUserData = this.getCreateUserData(query)
        }, 200)
      } else {
        this.oldUserData = []
      }
    },
    remoteMethod1(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.oldUserData = this.getCreateUserData(query)
        }, 200)
      } else {
        this.oldUserData = []
      }
    },
    /**
     * 远程搜索查询nc部门
     */
    remoteMethodNC(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.$http
            .post('S-EquipmentInventory/getByDepartmentGroup', Qs.stringify({ regexDepartName: query }))
            .then(res => {
              if (res.data.success) {
                this.loading = false
                this.managementArr = res.data.data
              }
            })
            .catch(function(err) {
              console.log(err)
            })
        }, 300)
      } else {
        this.managementArr = []
      }
    },
    getCreateUserData(query) {
      var _this = this
      const params = { name: query, pageNo: 1, pageSize: 30 }
      this.$http.post('/S-Base/getListUserNamePhoneEmail', Qs.stringify(params)).then(res => {
        if (res.data.success) {
          _this.oldUserData = res.data.data.list
        }
      })
    },
    workingFormat(row, column, cellValue, index) {
      if (row.working === 1) {
        return '在职'
      }
      if (row.working === 0) {
        return '离职'
      }
    },
    lockingFormat(row, column, cellValue, index) {
      if (row.locking === 1) {
        return '锁定'
      }
      if (row.locking === 0) {
        return '解锁'
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pages.pageSize = val
      const params = { name: this.str, pageNo: this.pages.currentPage, pageSize: val }
      this.getTableData(params)
    },
    handleCurrentChange(val) {
      this.pages.currentPage = val
      const params = { name: this.str, pageNo: val, pageSize: this.pages.pageSize }
      this.getTableData(params)
    },
    /**
     * 查看角色内容
     */
    editViews(index, rows) {
      this.userId = rows.userId
      this.dialogTitle = '角色'
      this.dialogRoleVisible = true
      this.RoleData = []
      this.$http
        .post('/S-Base/getByUserById', Qs.stringify({ id: rows.id }))
        .then(res => {
          this.RoleData = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    /**
     * 设置默认角色
     */
    setRole(index, rows) {
      this.$http.post('/S-Base/updateUserRoleDefaults', Qs.stringify({ roleId: rows.id, userId: this.userId })).then(res => {
        if (res.data.success) {
          this.$notify({
            title: '成功',
            message: res.data.msg,
            type: 'success'
          })
        }
      })
    },
    /**
     * 删除角色
     */
    deleteRole(index, rows) {
      this.$confirm('此操作将彻底删除[' + rows[index].role_name + ']用户, 继续吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http
          .get('/S-Base/delUserRole', {
            params: {
              userId: this.userId,
              roleId: rows[index].id
            }
          })
          .then(response => {
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
    addUserDialogClick(formName, addOrEdit) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var _this = this
          if (addOrEdit === 'add') {
            this.$http
              .get('/S-Base/addUser', {
                params: {
                  name: this.from.name,
                  sex: this.from.sex,
                  phone: this.from.phone,
                  email: this.from.email,
                  position: this.from.position,
                  zip: this.from.zip,
                  identityCard: this.from.identityCard,
                  ncDepartment: this.from.ncDepartment,
                  ncUserId: this.from.ncUserId,
                  working: this.from.working,
                  locking: this.from.locking,
                  callEmpno: this.from.callEmpno,
                  callEmployeePwd: this.from.callEmployeePwd,
                  callExtensionNumber: this.from.callExtensionNumber
                }
              })
              .then(function(response) {
                if (response.data.success) {
                  _this.userData.push(response.data.data)
                  _this.$notify({
                    title: '成功',
                    message: '添加成功',
                    type: 'success'
                  })
                  _this.dialogVisible = false
                } else {
                  _this.$notify({
                    title: '添加失败',
                    message: response.data.msg,
                    type: 'error'
                  })
                }
              })
          } else {
            this.$http
              .get('/S-Base/updateUser', {
                params: {
                  id: this.addOrEdit,
                  name: this.from.name,
                  sex: this.from.sex,
                  phone: this.from.phone,
                  email: this.from.email,
                  position: this.from.position,
                  zip: this.from.zip,
                  identityCard: this.from.identityCard,
                  ncDepartment: this.from.ncDepartment,
                  ncUserId: this.from.ncUserId,
                  working: this.from.working,
                  locking: this.from.locking,
                  callEmpno: this.from.callEmpno,
                  callEmployeePwd: this.from.callEmployeePwd,
                  callExtensionNumber: this.from.callExtensionNumber
                }
              })
              .then(function(response) {
                if (response.data.success) {
                  _this.editRowData.id = _this.addOrEdit
                  _this.editRowData.name = _this.from.name
                  _this.editRowData.sex = _this.from.sex
                  _this.editRowData.phone = _this.from.phone
                  _this.editRowData.email = _this.from.email
                  _this.editRowData.position = _this.from.position
                  _this.editRowData.zip = _this.from.zip
                  _this.editRowData.ncDepartment = _this.from.ncDepartment
                  _this.editRowData.ncUserId = _this.from.ncUserId
                  _this.editRowData.working = _this.from.working
                  _this.editRowData.locking = _this.from.locking
                  _this.editRowData.identityCard = _this.from.identityCard
                  _this.editRowData.callEmpno = _this.from.callEmpno
                  _this.editRowData.callEmployeePwd = _this.from.callEmployeePwd
                  _this.editRowData.callExtensionNumber = _this.from.callExtensionNumber
                  _this.$notify({
                    title: '成功',
                    message: '修改成功',
                    type: 'success'
                  })
                  _this.dialogVisible = false
                } else {
                  _this.$notify({
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
    addsearch() {
      const params = { name: this.str, pageNo: this.pages.currentPage, pageSize: this.pages.pageSize }
      this.getTableData(params)
    },
    getTableData(params) {
      this.$http.post('/S-Base/getListUserNamePhoneEmail', Qs.stringify(params)).then(response => {
        if (response.data.success) {
          this.userData = response.data.data.list
          // this.oldUserData = response.data.data.list
          this.pages.total = response.data.data.total
        }
      })
    },
    addUserClick(type) {
      this.dialogTitle = type
      this.addOrEdit = 'add'
      this.from = {
        name: '',
        sex: '',
        phone: '',
        email: '',
        position: '',
        zip: '',
        ncDepartment: '',
        ncUserId: '',
        working: 1,
        locking: 0,
        callEmpno: '',
        callEmployeePwd: '',
        callExtensionNumber: '',
        identityCard: '' // 身份证号
      }
      console.log(this.from.callEmpno, 'hahahaha-------')
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
      this.$confirm('此操作将彻底删除用户[' + rows[index].name + '], 确定吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http
          .get('/S-Base/delUser', {
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
    }
  }
}
</script>
