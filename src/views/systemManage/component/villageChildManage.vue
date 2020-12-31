<template>
  <el-dialog :title="title" :visible.sync="dialogChildVisible" :close-on-click-modal="false" width="40%" @close="closeDialog">
    <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm" size="small">
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="ruleForm.phone" />
      </el-form-item>
      <el-form-item label="关系" prop="relationship">
        <el-input v-model="ruleForm.relationship" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { parseTime } from '@/utils/index'
import Qs from 'qs'
export default {
  props: {
    childShow: Boolean,
    title: String,
    dialogChildRow: Object,
    newTenantsId: Number,
    structureId: String
  },
  data() {
    return {
      dialogChildVisible: this.childShow,
      ruleForm: {
        newTenantsId: this.newTenantsId,
        phone: '',
        relationship: '',
        lastTime: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
      }
    }
  },
  mounted() {
    if (this.title == '编辑') {
      this.ruleForm = this.dialogChildRow
    } else {
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
    }
  },
  methods: {
    /**
     * 关闭弹框
     */
    closeDialog() {
      this.$emit('childCloseDialog')
    },
    /**
     * 提交
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.title == '添加') {
            this.$http.post('/S-House/addContactList', Qs.stringify(this.ruleForm))
              .then(res => {
                if (res.data.success) {
                  this.$refs[formName].resetFields()
                  this.dialogChildVisible = false
                  this.$emit('getVillageChildList', this.structureId)
                }
              })
          } else { // 编辑
            const param = {
              id: this.ruleForm._id,
              newTenantsId: this.ruleForm.newTenantsId,
              phone: this.ruleForm.phone,
              relationship: this.ruleForm.relationship,
              lastTime: this.ruleForm.lastTime,
              chargeIden: this.ruleForm.chargeIden
            }
            this.$http.post('/S-House/updateContactList', Qs.stringify(param))
              .then(res => {
                if (res.data.success) {
                  this.$refs[formName].resetFields()
                  this.dialogChildVisible = false
                  this.$emit('getVillageChildList', this.structureId)
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
      this.dialogChildVisible = false
    }
  }
}
</script>
