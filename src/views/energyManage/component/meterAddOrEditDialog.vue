<template>
  <div>
    <!-- 添加编辑弹框  -->
    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" width="46%" @close="closeDialog">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="表名称" prop="meterName">
              <el-input v-model="ruleForm.meterName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="表号" prop="meterNum">
              <el-input v-model="ruleForm.meterNum" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型" prop="type">
              <el-select v-model="ruleForm.type" placeholder="请选择类型" style="width:100%;">
                <el-option v-for="( item , index ) in radioArr" :key="index" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="换算" prop="conversion">
              <el-input v-model.number="ruleForm.conversion" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原始单位" prop="originalUnit">
              <el-select v-model="ruleForm.originalUnit" placeholder="请选择用途" style="width:100%;">
                <el-option v-for="( item , index ) in originalUnitArr" :key="index" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="热源计量关系" prop="heatRelationship">
              <el-select v-model="ruleForm.heatRelationship" placeholder="请选择计量关系" style="width:100%;">
                <el-option v-for="( item , index ) in heatRelationArr" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="品牌" prop="brand">
              <el-input v-model="ruleForm.brand" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="型号" prop="model">
              <el-input v-model="ruleForm.model" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用途" prop="used">
              <el-select v-model="ruleForm.used" placeholder="请选择用途" style="width:100%;">
                <el-option v-for="( item , index ) in usedArr" :key="index" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格" prop="specifications">
              <el-input v-model="ruleForm.specifications" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="精度" prop="accuracy">
              <el-input v-model="ruleForm.accuracy" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上限" prop="upperLimit">
              <el-input v-model="ruleForm.upperLimit" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采集方式" prop="collectionMode">
              <el-select v-model="ruleForm.collectionMode" placeholder="请选择用途" style="width:100%;">
                <el-option v-for="( item , index ) in collectionModeArr" :key="index" :label="item.name" :value="item.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数值类型" prop="valueType">
              <el-select v-model="ruleForm.valueType" placeholder="请选择用途" style="width:100%;">
                <el-option v-for="( item , index ) in valueTypeArr" :key="index" :label="item.name" :value="item.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算类型" prop="settlementType">
              <el-input v-model="ruleForm.settlementType" />
              <!-- <el-select v-model="ruleForm.valueType" placeholder="请选择用途" style="width:100%;">
                            <el-option :label="item.name" :value="item.name" v-for="( item , index ) in valueTypeArr" :key="index"></el-option>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计量范围" prop="measurementRange">
              <el-input v-model="ruleForm.measurementRange" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="超量程处理" prop="overrangeTreatment">
              <el-radio-group v-model="ruleForm.overrangeTreatment">
                <el-radio label="不归零" />
                <el-radio label="归零" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="统一计费" prop="unifiedBilling">
              <el-radio-group v-model="ruleForm.unifiedBilling">
                <el-radio label="是" />
                <el-radio label="否" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="小时汇总" prop="hourSummary">
              <el-radio-group v-model="ruleForm.hourSummary">
                <el-radio label="是" />
                <el-radio label="否" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="天汇总" prop="tianHui">
              <el-radio-group v-model="ruleForm.tianHui">
                <el-radio label="是" />
                <el-radio label="否" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安装位置" prop="installationLocation">
              <el-input v-model="ruleForm.installationLocation" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出厂日期" prop="dateOfProduction">
              <el-date-picker v-model="ruleForm.dateOfProduction" type="date" style="width:100%;" value-format="yyyy-MM-dd" placeholder="选择日期" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="dateOfInput" label="投入日期:">
              <el-date-picker v-model="ruleForm.dateOfInput" type="date" style="width:100%;" value-format="yyyy-MM-dd" placeholder="选择日期" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备编码" prop="deviceCoding">
              <el-input v-model="ruleForm.deviceCoding" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名称" prop="deviceName">
              <el-input v-model="ruleForm.deviceName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="state">
              <el-radio-group v-model="ruleForm.state">
                <el-radio label="有效" />
                <el-radio label="无效" />
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="关联数据点1" prop="realDataIdOne">
              <el-select
                v-model="ruleForm.realDataIdOne"
                style="width:100%;"
                filterable
                remote
                size="small"
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remoteMethod"
                :loading="loading"
              >
                <el-option v-for="item in options4" :key="item._id" :label="item.dataName" :value="item._id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联数据点2" prop="realDataIdTwo">
              <el-select
                v-model="ruleForm.realDataIdTwo"
                filterable
                style="width:100%;"
                remote
                size="small"
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remoteMethod2"
                :loading="loading"
              >
                <el-option v-for="item in options2" :key="item._id" :label="item.dataName" :value="item._id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供暖面积" prop="heatArea">
              <el-input v-model.number="ruleForm.heatArea" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="ruleForm.remark" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item style="margin-top:20px;">
            <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
            <el-button @click="resetForm('ruleForm')">取消</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { deepCloneEs6, parseTime } from '@/utils/index'
import Qs from 'qs'

export default {
  props: {
    isShow: Boolean,
    title: String,
    dialogRow: Object,
    structureId: String,
    boilerRoomId: String,
    meterType: String
  },
  data() {
    return {
      dialogVisible: this.isShow,
      radioArr: ['水表', '电表', '气表', '热表'], // 单选
      usedArr: ['办公', '热水', '供暖'], // 用途
      originalUnitArr: ['m³', 'KWH', 'MWH'], // 原始单位
      collectionModeArr: [
        { id: 0, name: '人工采集' },
        { id: 1, name: '直接自动采集' },
        { id: 2, name: '自控间接采集' },
        { id: 3, name: '不采集' }
      ],
      valueTypeArr: [
        { id: 0, name: '累计值' },
        { id: 1, name: '瞬时值' },
        { id: 2, name: '余量值' }
      ],
      heatRelationArr: [
        { id: 1, name: '加' },
        { id: -1, name: '减' },
        { id: 0, name: '不计算' }
      ],
      ruleForm: {
        meterName: '',
        meterNum: '',
        type: this.meterType,
        heatArea: 0, // 供暖面积
        brand: '', // 品牌
        conversion: 1, // 换算
        originalUnit: '', // 原始单位
        model: '', // 型号
        used: '', // 用途
        remark: '', // 备注,
        realDataIdOne: '',
        realDataIdTwo: '',
        specifications: '', // 规格
        accuracy: '', // 精度
        upperLimit: '', // 上限
        collectionMode: '', // 采集方式
        valueType: '', // 数值类型
        overrangeTreatment: '', // 超量程处理
        unifiedBilling: '', // 统一计费
        settlementType: '', // 结算类型
        measurementRange: '', // 计量范围
        hourSummary: '', // 小时汇总
        tianHui: '', // 天汇总：是 ，否
        installationLocation: '', // 安装位置
        dateOfProduction: parseTime(new Date(), '{y}-{m}-{d}'), // 出厂日期
        dateOfInput: parseTime(new Date(), '{y}-{m}-{d}'), // 投入日期
        heatRelationship: 1, // 计量关系
        deviceCoding: '', // 设备编码
        deviceName: '', // 设备名称
        state: '' // 状态：  有效，无效
      },
      rules: {
        meterName: [{ required: true, message: '请输入表名称', trigger: 'blur' }],
        meterNum: [{ required: true, message: '请输入表号', trigger: 'blur' }],
        type: [{ required: true, message: '请选择表类型', trigger: 'change' }],
        conversion: [{ required: true, message: '请输入换算', trigger: 'blur' }],
        originalUnit: [{ required: true, message: '选择原始单位', trigger: 'change' }],
        heatRelationship: [{ required: true, message: '选择计量关系', trigger: 'change' }],
        collectionMode: [{ required: true, message: '选择采集方式', trigger: 'change' }], // 采集方式
        valueType: [{ required: true, message: '选择数值类型', trigger: 'change' }]
      },
      loading: false,
      options4: [],
      options2: []
    }
  },
  mounted() {
    if (this.title === '编辑') {
      this.ruleForm = deepCloneEs6(this.dialogRow)
      this.dialogRow.realDateOneValue != undefined ? this.options4.push(this.dialogRow.realDateOneValue) : (this.options4 = [])
      this.dialogRow.realDateTwoValue != undefined ? this.options2.push(this.dialogRow.realDateTwoValue) : (this.options2 = [])
    } else {
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields()
      })
    }
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.$http.post('/S-RealData/getRealDataByWhere', Qs.stringify({ name: query })).then(res => {
            if (res.data.success) {
              this.options4 = res.data.data.result
            }
          })
        }, 200)
      } else {
        this.options4 = []
      }
    },
    remoteMethod2(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.$http.post('/S-RealData/getRealDataByWhere', Qs.stringify({ name: query })).then(res => {
            if (res.data.success) {
              this.options2 = res.data.data.result
            }
          })
        }, 200)
      } else {
        this.options2 = []
      }
    },
    /** 关闭弹框 */
    closeDialog() {
      this.$emit('closeDialog')
    },
    /**
     * 弹框确定
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.ruleForm.collectionMode == '直接自动采集') {
            return this.$message({
              message: '请关联数据点',
              type: 'error'
            })
          }
          if (this.title == '添加') {
            this.ruleForm.boilerRoomId = this.boilerRoomId
            this.ruleForm.structureId = this.structureId
            this.$http.post('/S-Energy/saveMeter', Qs.stringify(this.ruleForm)).then(res => {
              if (res.data.success) {
                const { type } = res.data.data
                this.dialogVisible = false
                this.$refs[formName].resetFields()
                this.$emit('getTableData', type)
              }
            })
          } else {
            delete this.ruleForm.saveTime
            delete this.ruleForm.realDateOneValue
            delete this.ruleForm.realDateTwoValue
            this.$http.post('/S-Energy/saveMeter', Qs.stringify(this.ruleForm)).then(res => {
              if (res.data.success) {
                const { type } = res.data.data
                this.$refs[formName].resetFields()
                this.dialogVisible = false
                this.$emit('getTableData', type)
              }
            })
          }
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

<style lang="scss" scoped>
</style>
