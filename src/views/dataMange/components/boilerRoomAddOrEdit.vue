<template>
  <div>
    <el-dialog
      :title="title"
      width="50%"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      @close="closeDialog"
    >
      <el-form ref="from" :model="from" :rules="rules" label-width="140px" class="demo-ruleForm" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="name" label="锅炉房名字:">
              <el-input v-model="from.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="heatNum" label="热源数量:">
              <el-input v-model.number="from.heatNum" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="heatDimensions" label="热源规模:">
              <el-input v-model="from.heatDimensions" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="fuelType" label="燃料类型:">
              <el-select v-model="from.fuelType" placeholder="请选择" style="width:100%;">
                <el-option
                  v-for="item in fuelTypeOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="attribute" label="属性:">
              <el-select v-model="from.attribute" placeholder="请选择" style="width:100%;">
                <el-option
                  v-for="item in attributeOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="stationMode" label="场站模式:">
              <el-radio-group v-model="from.stationMode">
                <el-radio label="有人" />
                <el-radio label="无人" />
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="areaCounty" label="行政区县:">
              <el-cascader
                v-model="cityValue"
                :options="citysOptions"
                :props="{ value: 'label', label: 'label'}"
                @change="handleCityChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="starterTime" label="启动时间:">
              <el-date-picker
                v-model="from.starterTime"
                style="width:100%;"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="endTime" label="截止时间:">
              <el-date-picker
                v-model="from.endTime"
                type="date"
                style="width:100%;"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="state" label="状态:">
              <el-radio-group v-model="from.state">
                <el-radio label="有人" />
                <el-radio label="无人" />
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="meteorological" label="气象信息区域:">
              <el-select
                v-model="from.meteorological"
                filterable
                remote
                reserve-keyword
                style="width:100%;"
                placeholder="请输入气象信息区域进行搜索"
                :remote-method="remoteMethod"
                :loading="loading"
              >
                <el-option
                  v-for="(item,index) in weatherOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="remark" label="备注:">
              <el-input v-model="from.remark" type="textarea" auto-complete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item>
            <el-button @click="resetForm('from')">取 消</el-button>
            <el-button type="primary" @click="submitForm('from')">确 定</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { parseTime, deepCloneEs6, getTreeDeepArr1 } from '@/utils/index'
import { fuelTypeOptions, attributeOptions } from '@/utils/boilerRoom'
import Qs from 'qs'
export default {
  props: {
    isShow: Boolean,
    title: String,
    dialogRow: Object,
    structureId: String
  },
  data() {
    return {
      dialogVisible: this.isShow,
      from: {
        structureId: this.structureId,
        name: '',
        meteorological: '', // 气象信息区域
        remark: '', // 备注
        heatNum: '', // 热源数量
        heatDimensions: '', // 热源规模
        fuelType: '', //  燃料类型
        attribute: '', //  属性
        stationMode: '', //  场站模式
        areaCounty: '', //  行政区县
        starterTime: '', //  启动时间
        endTime: '', //  截止时间
        state: ''//  状态
      },
      rules: {
        name: [
          { required: true, message: '请输入锅炉房名称', trigger: 'blur' }
        ],
        meteorological: [
          { required: true, message: '请输入气象信息区域', trigger: 'blur' }
        ]
      },
      fuelTypeOptions: fuelTypeOptions, // 燃料类型
      weatherOptions: [], // 气象信息区域
      attributeOptions: attributeOptions, // 属性
      citysOptions: [], // 省县市
      cityValue: [],
      loading: false
    }
  },
  created() {
    this.getCityData()// 查询省市县
  },
  mounted() {
    if (this.title === '编辑') {
      if (this.dialogRow.starterTime && this.dialogRow.starterTime !== null) {
        this.dialogRow.starterTime = parseTime(this.dialogRow.starterTime, '{y}-{m}-{d}')
      }
      if (this.dialogRow.endTime && this.dialogRow.endTime !== null) {
        this.dialogRow.endTime = parseTime(this.dialogRow.endTime, '{y}-{m}-{d}')
      }
      if (this.dialogRow.areaCounty !== undefined && this.dialogRow.areaCounty !== '') {
        const str = this.dialogRow.areaCounty
        var index = str.lastIndexOf('\/')
        this.dialogRow.areaCounty = str.substring(index + 1, str.length)
      } else {
        this.dialogRow.areaCounty = ''
      }
      this.from = deepCloneEs6(this.dialogRow)
    } else {
      this.$nextTick(() => {
        this.$refs['from'].resetFields()
      })
    }
  },

  methods: {
    getCityData() {
      let requstUrl = ''
      if (process.env.NODE_ENV === 'production') {
        requstUrl = 'https://39.107.77.111:10098/data/citys.json'
      } else {
        requstUrl = 'http://localhost:9528/data/citys.json'
      }
      this.$http.get(requstUrl).then((response) => {
        this.citysOptions = response.data
        const city = getTreeDeepArr1(this.from.areaCounty, this.citysOptions)
        this.cityValue = city
      })
    },
    /**
     * 三级联动发生改变
     */
    handleCityChange(val) {
      this.cityValue = val
    },
    /**
     * 远程搜索气候
     */
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.getWeatherDown(query)
        }, 200)
      } else {
        this.weatherOptions = []
      }
    },
    /** 获取天气位置下拉 */
    getWeatherDown(query) {
      this.$http.post('/S-WeatherForecast/dropDownMojiCity', Qs.stringify({ cityName: query })).then(res => {
        if (res.data.success) {
          this.weatherOptions = res.data.data
        }
      })
    },
    /** 关闭弹框 */
    closeDialog() {
      this.$emit('closeDialog')
    },
    /** * 提交 */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.cityValue.length == 0 ? this.from.areaCounty = '' : this.from.areaCounty = this.cityValue.join('/')
          if (this.title === '添加') { // 添加
            this.$http.post('/S-Base/addBoilerRoom', Qs.stringify(this.from)).then(response => {
              if (response.data.success) {
                this.$notify({
                  title: '成功',
                  message: '添加成功',
                  type: 'success'
                })
                this.$refs[formName].resetFields()
                this.dialogVisible = false
                this.$emit('getTableData')
              } else {
                this.$notify({
                  title: '失败',
                  message: response.data.msg,
                  type: 'error'
                })
              }
            })
          } else { // 编辑
            delete this.from.appid
            this.from.saveDate = ''
            this.$http.post('/S-Base/updateBoilerRoom', Qs.stringify(this.from)).then(response => {
              if (response.data.success) {
                // let data = response.data.data
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success'
                })
                this.$refs[formName].resetFields()
                this.dialogVisible = false
                this.$emit('getTableData')
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
    }
  }
}
</script>
