<template>
  <div>
    <!-- 添加编辑弹框  -->
    <el-dialog :title="title" width="60%" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="closeDialog">
      <el-form ref="from" :model="from" class="demo-form-inline" label-width="150px" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="date" label="日期：" :rules=" { type: 'string', required: true, message: '请选择日期', trigger: 'change' }">
              <el-date-picker
                v-model="from.date"
                style="width:100%;"
                type="date"
                placeholder="选择日期时间"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="weatherCity" label="天气城市编码：">
              <el-input v-model="from.weatherCity" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="dialog-title">正常面积<span class="bot" /></div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="jiYouArea" label="既有面积：">
              <el-input v-model="from.jiYouArea" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="xinZengArea" label="新增面积：">
              <el-input v-model="from.xinZengArea" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="diWenArea" label="低温面积：">
              <el-input v-model="from.diWenArea" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="dialog-title">室外温度<span class="bot" /></div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="outDoorMaxWDu" label="最高温度：">
              <el-input v-model="from.outDoorMaxWDu" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="outDoorMinWDu" label="最低温度：">
              <el-input v-model="from.outDoorMinWDu" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-col :span="22" style="padding-right:5px;">
                <el-form-item prop="outDoorAvgWDu" label="平均温度：">
                  <el-input v-model="from.outDoorAvgWDu" />
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-button type="text" size="mini" @click="handleAVG()">获取</el-button>
              </el-col>
            </el-row>

          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="dialog-title">室内温度<span class="bot" /></div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="indoorAvgWDu" label="平均温度：">
              <el-input v-model="from.indoorAvgWDu" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="dialog-title">气<span class="bot" /></div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="gasDaily" label="实际日耗量：">
              <el-input v-model="from.gasDaily" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="gasMuBiaoOwned" label="目标既有正常单耗：">
              <el-input v-model="from.gasMuBiaoOwned" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="gasMuBiaoAdd" label="目标新增正常单耗：">
              <el-input v-model="from.gasMuBiaoAdd" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="gasMuBiaoLow" label="目标低温面积单耗：">
              <el-input v-model="from.gasMuBiaoLow" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="dialog-title">水<span class="bot" /></div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="waterDaily" label="实际日耗量：">
              <el-input v-model="from.waterDaily" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="waterMuBiaoOwned" label="目标既有正常单耗：">
              <el-input v-model="from.waterMuBiaoOwned" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="waterMuBiaoAdd" label="目标新增正常单耗：">
              <el-input v-model="from.waterMuBiaoAdd" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="waterMuBiaoLow" label="目标低温面积单耗：">
              <el-input v-model="from.waterMuBiaoLow" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="dialog-title">电<span class="bot" /></div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="powerDaily" label="实际日耗量：">
              <el-input v-model="from.powerDaily" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="powerMuBiaoOwned" label="目标既有正常单耗：">
              <el-input v-model="from.powerMuBiaoOwned" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="powerMuBiaoAdd" label="目标新增正常单耗：">
              <el-input v-model="from.powerMuBiaoAdd" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="powerMuBiaoLow" label="目标低温面积单耗：">
              <el-input v-model="from.powerMuBiaoLow" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="dialog-title">热<span class="bot" /></div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="heatDaily" label="实际日耗量：">
              <el-input v-model="from.heatDaily" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="heatMuBiaoOwned" label="目标既有正常单耗：">
              <el-input v-model="from.heatMuBiaoOwned" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="heatMuBiaoAdd" label="目标新增正常单耗：">
              <el-input v-model="from.heatMuBiaoAdd" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="heatMuBiaoLow" label="目标低温面积单耗：">
              <el-input v-model="from.heatMuBiaoLow" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="resetForm('from')">取 消</el-button>
        <el-button type="primary" size="small" @click="submitForm('from')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import { deepCloneEs6, isDot } from '@/utils/index'
import Qs from 'qs'

export default {
  props: {
    isShow: Boolean,
    title: String,
    dialogRow: Object,
    structureId: String,
    boilerRoomId: String
  },
  data() {
    return {
      dialogVisible: this.isShow,
      from: {
        structureId: this.structureId,
        boilerRoomId: this.boilerRoomId,
        date: '',
        weatherCity: 0,
        jiYouArea: 0,
        xinZengArea: 0,
        diWenArea: 0,
        outDoorMaxWDu: 0,
        outDoorMinWDu: 0,
        outDoorAvgWDu: 0,
        indoorAvgWDu: 0,
        gasDaily: 0,
        gasMuBiaoOwned: 0,
        gasMuBiaoAdd: 0,
        gasMuBiaoLow: 0,
        waterMuBiaoOwned: 0,
        waterMuBiaoAdd: 0,
        waterMuBiaoLow: 0,
        waterDaily: 0,
        powerDaily: 0,
        powerMuBiaoOwned: 0,
        powerMuBiaoAdd: 0,
        powerMuBiaoLow: 0,
        heatDaily: 0,
        heatMuBiaoOwned: 0,
        heatMuBiaoAdd: 0,
        heatMuBiaoLow: 0
      }
    }
  },
  mounted() {
    if (this.title === '编辑') {
      this.dialogRow.input.outDoorAvgWDu = isDot(this.dialogRow.input.outDoorAvgWDu, 2)
      this.from = deepCloneEs6(this.dialogRow.input)
      console.log(this.dialogRow.input, '123132')
    } else {
      this.$nextTick(() => {
        this.$refs['from'].resetFields()
      })
    }
  },
  methods: {
    /** 关闭弹框 */
    closeDialog() {
      this.$emit('closeDialog')
    },
    /** 点击获取 */
    handleAVG() {
      if (this.from.date == '') {
        return this.$message({
          message: '请选择日期',
          type: 'warning'
        })
      }
      this.$http.post('/S-Energy-Task/getTheSameData', Qs.stringify({ cityId: this.from.weatherCity, time: this.from.date })).then(res => {
        if (res.data.success) {
          this.$notify({
            title: '成功',
            message: '获取成功',
            type: 'success'
          })

          if (JSON.stringify(res.data.data) !== '{}') {
            const { avg, max, min } = res.data.data
            this.from.outDoorMaxWDu = max
            this.from.outDoorMinWDu = min
            this.from.outDoorAvgWDu = isDot(avg, 2)
          } else {
            this.from.outDoorMaxWDu = 0
            this.from.outDoorMinWDu = 0
            this.from.outDoorAvgWDu = 0
          }
        }
      })
    },
    /**
     * 弹框确定
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.title == '添加') {
            this.from.id = this.from.boilerRoomId + this.from.date
          }
          this.from.date = this.from.date + ' 08:00:00'
          this.$http.post('/S-Energy-Task/CalEnergyAnalysisByInputToSave', Qs.stringify(this.from)).then(res => {
            if (res.data.success) {
              this.$notify({
                title: '成功',
                message: this.title + '成功',
                type: 'success'
              })
              this.$refs[formName].resetFields()
              this.dialogVisible = false
              this.$emit('getTableData')
            }
          })
        } else {
          return false
        }
      })
    },
    /**
     * 弹框取消
     */
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    }
  }

}

</script>
