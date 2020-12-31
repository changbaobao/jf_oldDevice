
<template>
    <el-dialog
        title="下发"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible" @close="closeDialog">
      <el-form :model="ruleForm"  :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" size="small">
         <el-form-item label="值" prop="value">
            <el-input v-model.number="ruleForm.value"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm()">确定</el-button>
        </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script>
import Qs from 'qs'
export default {
  props: {
    isShow: Boolean,
    dialogRow: Object
  },
  data () {
    return {
      dialogVisible: this.isShow,
      ruleForm: {
        mainDataCode: this.dialogRow.dataCode,
        value: ''
      }
    }
  },
  watch: {
    dialogVisible (newValue, oldValue) {
      this.dialogVisible = newValue
      console.log(newValue, oldValue, 'heheheheh---')
    }
  },
  created () {
    this.getShishiData()
  },
  mounted () {
    console.log(this.isShow, 'hehehe')
  },
  methods: {
    getShishiData () {
      this.$http.post('/S-RealData/getRealDataByPK', Qs.stringify({id: this.dialogRow.dataCode})).then(res => {
        if (res.data.success) {
          this.ruleForm.value = res.data.data.value
        }
      })
    },
    closeDialog () {
      this.$emit('closeDialog')
    },
    /**
     * 确定
     */
    submitForm () {
      this.$http.post('/S-SendInstructionsTask/SendInstructionsByMain', Qs.stringify(this.ruleForm)).then(res => {
        if (res.data.success) {
          this.$notify({
            title: '成功',
            message: res.data.msg,
            type: 'success'
          })
        } else {
          this.$notify({
            title: '失败',
            message: res.data.msg,
            type: 'success'
          })
        }
        this.dialogVisible = false
      })
    }
  }
}
</script>
