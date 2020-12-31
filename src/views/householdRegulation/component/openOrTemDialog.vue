<!--
 * @Author: your name
 * @Date: 2019-12-03 11:37:20
 * @LastEditTime: 2020-02-19 14:14:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MicroUI-use\src\views\householdRegulation\component\roomDialog.vue
 -->
<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="40%"
    @close="handleClose"
  >
    <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
      <el-form-item v-if="type=='open'" label="阀门开度(%)">
        <el-input v-model.number="formInline.set_opening" placeholder="阀门开度" />
      </el-form-item>
      <el-form-item v-if="type=='temp'" label="温度设定(℃)">
        <el-input v-model.number="formInline.set_temp" placeholder="温度设定" />
      </el-form-item>
      <el-form-item v-if="type=='work'" label="工作模式">
        <el-select v-model="formInline.workMode" placeholder="请选择">
          <el-option label="锁定开度模式" value="129" />
          <el-option label="智能模式-回水温度" value="130" />
          <el-option label="智能模式-室内温度" value="131" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="onSubmit">设置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import Qs from 'qs'
export default {
  props: {
    isShow: Boolean,
    dialogRow: Object,
    selectedData: Array,
    type: String
  },
  data() {
    return {
      dialogVisible: this.isShow,
      formInline: {
        set_opening: '',
        set_temp: '',
        workMode: '129'
      }
    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    /**
       * 关闭弹框
       */
    handleClose() {
      this.$emit('closeDialog')
    },
    async onSubmit() {
      for (let i = 0; i < this.selectedData.length; i++) {
        if (this.type == 'open' || this.type == 'temp') {
          let interName, sendVal
          if (this.type == 'open') {
            interName = 'set_opening'
            sendVal = this.formInline.set_opening
          } else if (this.type == 'temp') {
            interName = 'set_temp'
            sendVal = this.formInline.set_temp
          }
          await this.$http.post('/S-BlackAnt/sendingDate', Qs.stringify({ InterfaceName: interName, nodeId: this.selectedData[i].vlNodeid, sendingValue: sendVal }))
            .then(response => {
              if (response.data.success) {
                if (i == this.selectedData.length - 1) {
                  this.$notify({
                    title: '成功',
                    message: '下发成功',
                    type: 'success'
                  })
                  this.dialogVisible = false
                }
              }
            })
        } else if (this.type == 'work') {
          this.$http.post('/S-BlackAnt/sendingWorkingMode', Qs.stringify({ deviceId: this.selectedData[i].vlNodeid, workMode: this.formInline.workMode }))
            .then(response => {
              if (response.data.success) {
                if (i == this.selectedData.length - 1) {
                  this.$notify({
                    title: '成功',
                    message: '工作模式下发成功',
                    type: 'success'
                  })
                  this.dialogVisible = false
                }
              }
            })
        }
      }
    }
  }
}
</script>
