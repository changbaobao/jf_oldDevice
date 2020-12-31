
<template>
  <el-dialog :title="title" width="80%" :visible.sync="dialogVisible" :append-to-body="true" :close-on-click-modal="false" @close="handleClose">
    <el-form ref="heatSystem" :model="heatSystem" class="demo-form-inline" size="small" label-width="120px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="小区:" prop="communtityId">
            <el-select v-model="heatSystem.communtityId" clearable style="width:100%;">
              <el-option v-for="item in communityData" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="锅炉房:" prop="boilerRoomId">
            <el-select v-model="heatSystem.boilerRoomId" clearable style="width:100%;">
              <el-option v-for="item in boilerRoomData" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="systemName" label="供热系统名称:">
            <el-input v-model="heatSystem.systemName" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="systemArea" label="供热系统面积:">
            <el-input v-model="heatSystem.systemArea" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item prop="systemCode" label="供热编号:">
            <el-input v-model="heatSystem.systemCode" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="systemRange" label="系统范围:">
            <el-input v-model="heatSystem.systemRange" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="rangeDb" label="系统范围关键字:">
            <el-input v-model="heatSystem.rangeDb" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <!-- <el-form-item prop="heatType" label="供暖形式:"> -->
          <el-col :span="20" style="padding:0 10px 0 20px;">
            <el-select v-model="heatSystem.heatType" clearable size="small" style="width:100%;" placeholder="选择供暖形式">
              <el-option v-for="item in heatTypeData" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-button icon="el-icon-search" type="primary" size="mini" @click="handleSearch()" />
          </el-col>
          <!-- </el-form-item> -->
        </el-col>
      </el-row>

      <el-row>
        <el-form-item v-for="( item, index ) in resultList" :key="index" :prop="item.prop" :label="item.label" style="width:25%;float:left;">
          <search-select :select-val="heatSystem[item.prop]" :name="item.prop" :data="scopeData" @handleChange="handleChange" />
        </el-form-item>
      </el-row>

      <el-form-item style="text-align:right;padding-right:20px;">
        <el-button @click="resetForm('heatSystem')">取 消</el-button>
        <el-button type="primary" @click="submitForm('heatSystem')">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import searchSelect from '../../../components/searchSelect/index'
import Qs from 'qs'
export default {
  components: {
    searchSelect
  },
  props: {
    isShow: Boolean,
    title: String,
    dialogRow: Object,
    structureId: String
  },
  data() {
    return {
      dialogVisible: this.isShow,
      communityData: [],
      boilerRoomData: [],
      heatTypeData: [
        {
          id: '散',
          name: '散热器'
        },
        {
          id: '地',
          name: '地暖'
        },
        {
          id: '风',
          name: '风机盘管'
        },
        {
          id: '气',
          name: '默认'
        }
      ],
      heatSystem: {
        structureId: this.structureId,
        communtityId: '',
        boilerRoomId: '',
        heatStationId: '',
        systemName: '',
        systemArea: 0,
        systemCode: '',
        systemRange: '',
        rangeDb: '',
        heatType: '',
        oneSupplyTem: '',
        oneBackTem: '',
        oneSupplyPa: '',
        oneBackPa: '',
        twoSupplyTem: '',
        twoBackTem: '',
        twoSupplyPa: '',
        twoBackPa: '',
        controllerType: '',
        targetTem: '',
        setValue: '',
        valveOpening: '',
        valveFeedback: '',
        outdoorTem: '',
        beginTem: '',
        curvature1: '',
        curvature2: '',
        curvature3: '',
        curvature4: '',
        branch1OpenTime: '',
        branch2OpenTime: '',
        branch3OpenTime: '',
        branch4OpenTime: '',
        branch1OpeningScore: '',
        branch2OpeningScore: '',
        branch3OpeningScore: '',
        branch4OpeningScore: '',
        branch1NoddingTime: '',
        branch2NoddingTime: '',
        branch3NoddingTime: '',
        branch4NoddingTime: '',
        branch1Knots: '',
        branch2Knots: '',
        branch3Knots: '',
        branch4Knots: '',
        branch1Repair: '',
        branch2Repair: '',
        branch3Repair: '',
        branch4Repair: '',
        instantHeat: '',
        instantFlow: ''
      },
      resultList: [
        { prop: 'oneSupplyTem', label: '一次供水温度' },
        { prop: 'oneBackTem', label: '一次回水温度' },
        { prop: 'oneSupplyPa', label: '一次供水压力' },
        { prop: 'oneBackPa', label: '一次回水压力' },
        { prop: 'twoSupplyTem', label: '二次供水温度' },
        { prop: 'twoBackTem', label: '二次回水温度' },
        { prop: 'twoSupplyPa', label: '二次供水压力' },
        { prop: 'twoBackPa', label: '二次回水压力' },
        { prop: 'controllerType', label: '控制类型' },
        { prop: 'targetTem', label: '目标值' },
        { prop: 'setValue', label: '设定值' },
        { prop: 'pumpFrequency', label: '水泵频率' },
        { prop: 'valveOpening', label: '阀开度' },
        { prop: 'valveFeedback', label: '阀反馈' },
        { prop: 'outdoorTem', label: '室外温度' },
        { prop: 'beginTem', label: '起始温度' },
        { prop: 'curvature1', label: '曲线1' },
        { prop: 'curvature2', label: '曲线2' },
        { prop: 'curvature3', label: '曲线3' },
        { prop: 'curvature4', label: '曲线4' },
        { prop: 'branch1OpenTime', label: '分1开时' },
        { prop: 'branch2OpenTime', label: '分2开时' },
        { prop: 'branch3OpenTime', label: '分3开时' },
        { prop: 'branch4OpenTime', label: '分4开时' },
        { prop: 'branch1OpeningScore', label: '分1开分' },
        { prop: 'branch2OpeningScore', label: '分2开分' },
        { prop: 'branch3OpeningScore', label: '分3开分' },
        { prop: 'branch4OpeningScore', label: '分4开分' },
        { prop: 'branch1NoddingTime', label: '分1结时' },
        { prop: 'branch2NoddingTime', label: '分2结时' },
        { prop: 'branch3NoddingTime', label: '分2结时' },
        { prop: 'branch4NoddingTime', label: '分4结时' },
        { prop: 'branch1Knots', label: '分1结分' },
        { prop: 'branch2Knots', label: '分2结分' },
        { prop: 'branch3Knots', label: '分3结分' },
        { prop: 'branch4Knots', label: '分4结分' },
        { prop: 'branch1Repair', label: '分1修' },
        { prop: 'branch2Repair', label: '分2修' },
        { prop: 'branch3Repair', label: '分3修' },
        { prop: 'branch4Repair', label: '分4修' },
        { prop: 'instantHeat', label: '瞬时热量' },
        { prop: 'instantFlow', label: '瞬时流量' }
      ],
      scopeData: []
    }
  },
  created() {
    this.initData()
  },
  mounted() {
    if (this.title == '添加') {
      this.$nextTick(() => {
        this.$refs['heatSystem'].resetFields()
      })
    } else {
      this.heatSystem = { ...this.dialogRow }
      console.log(this.heatSystem, '1111111-----')
      if (this.heatSystem.realValue !== null && this.heatSystem.realValue.length !== 0) {
        const arr = []
        this.heatSystem.realValue.map(item => {
          arr.push({ _id: item._id, dataName: item.dataName })
        })
        this.scopeData = arr
      }
    }
  },
  methods: {
    initData() {
      this.getBoilerRoom(this.heatSystem.structureId)
      this.getCommunityData(this.heatSystem.structureId)
    },
    /**
     * 根据项目获取小区
     */
    getCommunityData(id) {
      this.$http.post('/S-Base/getCommunityByStructureId', Qs.stringify({ structureId: id })).then(res => {
        this.communityData = res.data.data
      })
    },
    getBoilerRoom(id) {
      this.$http.post('/S-Base/selectByBoilerRoom', Qs.stringify({ structureId: id })).then(res => {
        this.boilerRoomData = res.data.data
      })
    },
    /**
     * 点击查询
     */
    handleSearch() {
      if (this.heatSystem.systemCode == '') {
        return this.$message({
          message: '供热编号不能为空',
          type: 'warning'
        })
      } else if (this.heatSystem.rangeDb == '') {
        return this.$message({
          message: '系统范围关键字不能为空',
          type: 'warning'
        })
      } else if (this.heatSystem.heatType == '') {
        return this.$message({
          message: '系统类型不能为空',
          type: 'warning'
        })
      }
      const param = {
        systemCode: this.heatSystem.systemCode,
        rangeDb: this.heatSystem.rangeDb,
        heatType: this.heatSystem.heatType
      }
      this.$http.post('/S-RealData/listHsystemRealData', Qs.stringify(param)).then(res => {
        if (res.data.success) {
          const data = res.data.data
          if (JSON.stringify(data) == '{}') {
            this.resultList.map(item => {
              this.heatSystem[item.prop] = ''
            })
            this.scopeData = []
          } else {
            const arr = []
            Object.keys(data).forEach((key, index) => {
              this.heatSystem[key] = data[key].id
              arr.push({ _id: data[key].id, dataName: data[key].name })
            })
            this.scopeData = arr
          }
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.title == '添加') {
            this.$http.post('/S-Base/addHeatSystem', Qs.stringify(this.heatSystem)).then(res => {
              if (res.data.success) {
                const data = res.data.data
                this.$notify({
                  title: '成功',
                  message: '添加成功',
                  type: 'success'
                })
                this.$refs[formName].resetFields()
                this.dialogVisible = false
                this.$emit('getTableData')
              }
            })
          } else {
            this.$http.post('/S-Base/updateHeatSystem', Qs.stringify(this.heatSystem)).then(res => {
              if (res.data.success) {
                this.$notify({
                  title: '成功',
                  message: '编辑成功',
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
    },
    handleClose() {
      this.$emit('closeDialog')
    },
    handleChange(val, name) {
      this.heatSystem[name] = val
      console.log(this.heatSystem, '12313131312313213-----')
    }
  }
}
</script>
