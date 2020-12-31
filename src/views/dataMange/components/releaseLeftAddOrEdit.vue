
<template>
  <el-dialog :title="addReleaseLDialog.title" width="30%" :close-on-click-modal="false" :visible.sync="dialogVisible" @close="closeDialog">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm" size="small">
      <el-form-item label="项目" prop="structureId">
        <el-cascader
          v-model="projectVal"
          :options="structureOption"
          style="width:100%;"
          size="small"
          :disabled="addReleaseLDialog.type=='edit'"
          :props="props"
          :show-all-levels="false"
          @change="handleCascaderChange"
        />
      </el-form-item>
      <el-form-item label="数据点" prop="dataCode">
        <el-select
          v-model="ruleForm.dataCode"
          size="small"
          filterable
          clearable
          :disabled="addReleaseLDialog.type=='edit'"
          style="width:100%;"
          remote
          reserve-keyword
          placeholder="请输入数据点进行查询"
          :remote-method="remoteMethod"
          :loading="loading"
          @change="handleScopeChange"
        >
          <el-option v-for="(item , index ) in scopeData" :key="index" :label="item.dataName" :value="item._id" />
        </el-select>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name" style="width:100%;" />
      </el-form-item>
      <el-form-item label="启动" prop="run">
        <el-radio-group v-model="ruleForm.run" style="width:100%;">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="下发频率" prop="sendFrequency">
        <el-select v-model="ruleForm.sendFrequency" placeholder="请选择" style="width:100%;">
          <el-option label="10" value="10" />
          <el-option label="20" value="20" />
          <el-option label="30" value="30" />
          <el-option label="60" value="60" />
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model.number="ruleForm.sort" style="width:100%;" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import tCascader from '../../../components/base/t-cascader'
import { getTreeDeepArr, deepCloneEs6 } from '@/utils/index'
import Qs from 'qs'
export default {
  props: {
    isShow: Boolean,
    dialogRow: Object
  },
  data() {
    return {
      dialogVisible: this.isShow,
      loading: false,
      structureId: '', // 项目id
      projectVal: [],
      structureOption: [],
      props: {
        label: 'name',
        value: 'id',
        children: 'children'
      },
      scopeData: [], // 数据点
      dataName: '',
      ruleForm: {
        dataCode: '',
        name: '',
        run: 1,
        sendFrequency: '',
        sort: 1
      },
      rules: {
        dataCode: [{ required: true, message: '请输入数据点', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        run: [{ required: true, message: '请选择是否启动', trigger: 'change' }],
        sendFrequency: [{ required: true, message: '请选择下发频率', trigger: 'change' }],
        sort: [{ required: true, message: '请输入排序', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['addReleaseLDialog'])
  },
  components: { tCascader },
  created() {
    this.getStructureNode()
  },
  mounted() {
    if (this.addReleaseLDialog.type == 'edit') {
      this.getEditData()
    } else {
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields()
      })
    }
  },
  methods: {
    async getEditData() {
      this.dialogRow.run == true ? (this.dialogRow.run = 1) : (this.dialogRow.run = 0)
      this.ruleForm = deepCloneEs6(this.dialogRow)
      await this.getShiShiData()
      await this.getStructureNode()
    },
    getShiShiData() {
      this.$http.post('/S-RealData/getRealDataByPK', Qs.stringify({ id: this.dialogRow.dataCode })).then(res => {
        if (res.data.success) {
          const dataName = res.data.data.dataName
          const dataCode = res.data.data.dataCode
          this.scopeData.push({ dataName: dataName, _id: dataCode })
          if (res.data.data.companyStructure !== undefined && res.data.data.companyStructure.id) {
            this.structureId = res.data.data.companyStructure.id
          } else {
            this.structureId = ''
          }
        }
      })
    },
    getStructureNode() {
      this.$http.post('/S-Base/getCompanyStructureByRoleTreeJson').then(res => {
        if (res.data.success) {
          this.structureOption = res.data.data
          if (this.addReleaseLDialog.type == 'edit') {
            const name = getTreeDeepArr(this.structureId, this.structureOption)
            this.projectVal = name
            this.handleCascaderChange(this.projectVal)
          }
        }
      })
    },
    handleCascaderChange(val) {
      this.projectVal = val
    },
    /**
     * 远程搜索查询数据点
     */
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          const param = { dataName: query }
          if (this.projectVal.length !== 0) {
            param.companyStructureId = this.projectVal[this.projectVal.length - 1]
          }
          this.$http
            .post('/S-RealData/getRealByDataNameAndSid', Qs.stringify(param))
            .then(res => {
              if (res.data.success) {
                const { data } = res.data.data
                this.scopeData = data
                this.loading = false
              }
            })
            .catch(function(err) {
              console.log(err)
            })
        }, 300)
      } else {
        this.scopeData = []
      }
    },
    handleScopeChange(val) {
      if (this.addReleaseLDialog.title == '添加') {
        if (val !== '') {
          const obj = this.scopeData.find(item => {
            return item.dataCode === val
          })
          this.ruleForm.name = obj.dataName
        } else {
          this.ruleForm.name = ''
        }
      }
    },
    /**
     * 关闭弹框
     */
    closeDialog() {
      this.$emit('closeDialog')
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http
            .post('/S-RealData/saveSendInstructionsMain', Qs.stringify(this.ruleForm))
            .then(res => {
              if (res.data.success) {
                this.$notify({
                  title: '成功',
                  message: res.data.msg,
                  type: 'success'
                })
                this.$refs[formName].resetFields()
                this.dialogVisible = false
                this.$emit('getLtableData')
              }
            })
            .catch(function(err) {
              console.log(err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    }
  }
}
</script>
