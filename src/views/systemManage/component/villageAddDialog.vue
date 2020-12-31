<template>
  <div>
    <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="dialogVisible" width="60%" @close="closeDialog">
      <el-form ref="from" :model="from" label-width="100px" class="demo-ruleForm" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="项目" prop="structureId" required>
              <el-cascader
                v-model="projectVal"
                :options="structureOption"
                size="small"
                :props="props"
                :show-all-levels="false"
                @change="handleCascaderChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="锅炉房" prop="boilerRoomId">
              <el-select v-model="from.boilerRoomId" placeholder="请选择">
                <el-option
                  v-for="item in boilerRoomOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="系统" prop="heatSystemId">
              <el-select v-model="from.heatSystemId" style="width:100%;">
                <el-option
                  v-for="item in SystemData"
                  :key="item.id"
                  :label="item.systemName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供暖位置" prop="heatingPositionId">
              <el-select v-model="from.heatingPositionId" style="width:100%;">
                <el-option
                  v-for="(item,index) in heatingPositionOption"
                  :key="index"
                  :label="item.position"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业主姓名" prop="ownersName">
              <el-input v-model="from.ownersName " />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地址码" prop="addressCode">
              <el-input v-model="from.addressCode" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合计面积" prop="chargeArea">
              <el-input v-model.number="from.chargeArea" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单价" prop="unitPrice">
              <el-input v-model.number="from.unitPrice" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="应收"
              prop="receivable"
            >
              <el-input v-model.number="from.receivable" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性质" prop="nature">
              <el-input v-model="from.nature" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="楼号" prop="building">
              <el-input v-model="from.building" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单元号" prop="unit">
              <el-input v-model="from.unit" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="门牌号" prop="room">
              <el-input v-model="from.room" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="层特性" prop="characteristics">
              <el-select v-model="from.characteristics" style="width:100%;">
                <el-option
                  v-for="item in characteristicsOption"
                  :key="item.id"
                  :label="item.field1"
                  :value="item.field1"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="边户" prop="bianHu">
              <el-select v-model="from.bianHu" style="width:100%;">
                <el-option
                  v-for="(item,index) in bianHuOption"
                  :key="index"
                  :label="item.field1"
                  :value="item.field1"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="朝向" prop="orientation">
              <el-select v-model="from.orientation" style="width:100%;">
                <el-option
                  v-for="(item,index) in orientationOption"
                  :key="index"
                  :label="item.field1"
                  :value="item.field1"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="保温" prop="heatPreservation">
              <el-radio-group v-model="from.heatPreservation">
                <el-radio v-for="(item, i) in PreservationOption" :key="i" :label="item.field1" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经纬度" prop="gISLonLat">
              <el-input v-model.number="from.gISLonLat" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="高度" prop="lon">
              <el-input v-model.number="from.gISHeight" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="详情地址" prop="addressOne">
              <el-input v-model="from.addressOne" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item>
            <el-button type="primary" @click="submitForm('from')">确 定</el-button>
            <el-button @click="resetForm('from')">取消</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { deepCloneEs6, getTreeDeepArr } from '@/utils/index'
import Qs from 'qs'
export default {
  props: {
    isShow: Boolean,
    dialogRow: Object,
    title: String,
    structureId: String
  },
  data() {
    return {
      dialogVisible: this.isShow,
      props: {
        label: 'name',
        value: 'id',
        children: 'children'
      },
      from: {
        addressCode: '',
        addressOne: '',
        ownersName: '',
        chargeArea: '',
        unitPrice: '',
        receivable: '',
        nature: '',
        building: '',
        unit: '',
        room: '',
        characteristics: '',
        bianHu: '',
        orientation: '',
        heatPreservation: '',
        gISLonLat: '',
        gISHeight: '',
        structureId: this.structureId,
        heatSystemId: '',
        boilerRoomId: '',
        heatingPositionId: ''
      },
      structureOption: [],
      projectVal: [],
      boilerRoomOption: [], // 锅炉房
      SystemData: [], // 系统
      heatingPositionOption: [], // 供暖位置
      characteristicsOption: [], // 层特性
      bianHuOption: [], // 边户
      orientationOption: [], // 朝向
      PreservationOption: [] // 保温
    }
  },
  created() {
    this.getStructureNode() //   查询项目
    this.getCharacteristicsData()// 查询层特性
    this.getbianHuData()// 查询边户
    this.getOrientation()// 查询朝向
    this.getPreservation()// 查询保温
  },
  mounted() {
    if (this.title === '编辑') {
      this.from = deepCloneEs6(this.dialogRow.newTenants)
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
    getStructureNode() {
      this.$http.post('/S-Base/getCompanyStructureByRoleTreeJson')
        .then(res => {
          if (res.data.success) {
            this.structureOption = res.data.data
            const name = getTreeDeepArr(this.structureId, this.structureOption)
            this.projectVal = name
            this.handleCascaderChange(this.projectVal)
          }
        })
    },
    handleCascaderChange(val) {
      this.projectVal = val
      this.projectVal.length !== 0 ? this.from.structureId = val[val.length - 1] : this.from.structureId = ''
      this.getBoilerRoom()
      this.getHeatingPosition()
      this.getHeatStystem()
    },
    /** 获取锅炉房 */
    getBoilerRoom() {
      this.$http.post('/S-Base/selectByBoilerRoom', Qs.stringify({ structureId: this.from.structureId }))
        .then(res => {
          if (res.data.success) {
            this.boilerRoomOption = res.data.data
          }
        })
    },
    /** 获取供暖位置 */
    getHeatingPosition() {
      this.$http.post('/S-Base/getHeatingPositionByStructureId', Qs.stringify({ structureId: this.from.structureId })).then(res => {
        if (res.data.success) {
          this.heatingPositionOption = res.data.data
        }
      })
    },
    /** 获取系统数据 */
    getHeatStystem() {
      this.$http.post('/S-Base/getByHeatSystem', Qs.stringify({ structureId: this.from.structureId, pageNo: 1, pageSize: 1000 })).then(res => {
        if (res.data.success) {
          this.SystemData = res.data.data.list
        }
      })
    },
    /** 层特性 */
    getCharacteristicsData() {
      this.$http.post('/S-Base/getselDatadictionaryInfo', Qs.stringify({ mainId: '1d7f49d9fb024b8baf8dab5824eff1d6' }))
        .then(res => {
          if (res.data.success) {
            this.characteristicsOption = res.data.data
          }
        })
    },
    /**  边户 */
    getbianHuData() {
      this.$http.post('/S-Base/getselDatadictionaryInfo', Qs.stringify({ mainId: 'df17b30db2ac4504897164e028c1d48a' }))
        .then(res => {
          if (res.data.success) {
            this.bianHuOption = res.data.data
          }
        })
    },
    /** 朝向 */
    getOrientation() {
      this.$http.post('/S-Base/getselDatadictionaryInfo', Qs.stringify({ mainId: '095662a8fba4439c848b2ea7456ba759' }))
        .then(res => {
          if (res.data.success) {
            this.orientationOption = res.data.data
          }
        })
    },
    /** 保温 */
    getPreservation() {
      this.$http.post('/S-Base/getselDatadictionaryInfo', Qs.stringify({ mainId: 'f745c179009f4f2fb045920b9905b6f5' }))
        .then(res => {
          if (res.data.success) {
            this.PreservationOption = res.data.data
          }
        })
    },
    /** * 提交 */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.title === '添加') { // 添加
            this.$http.post('/S-House/addNewTenants', Qs.stringify(this.from)).then(res => {
              if (res.data.success) {
                const { structureId } = res.data.data
                this.$refs[formName].resetFields()
                this.dialogVisible = false
                this.$emit('getVillageList', structureId)
              }
            })
          } else { // 编辑
            const param = {
              id: this.from._id,
              addressCode: this.from.addressCode,
              addressOne: this.from.addressOne,
              ownersName: this.from.ownersName,
              chargeArea: this.from.chargeArea,
              unitPrice: this.from.unitPrice,
              receivable: this.from.receivable,
              nature: this.from.nature,
              building: this.from.building,
              unit: this.from.unit,
              room: this.from.room,
              characteristics: this.from.characteristics,
              bianHu: this.from.bianHu,
              orientation: this.from.orientation,
              heatPreservation: this.from.heatPreservation,
              gISLonLat: this.from.gISLonLat,
              gISHeight: this.from.gISHeight,
              structureId: this.from.structureId,
              heatSystemId: this.from.heatSystemId,
              boilerRoomId: this.from.boilerRoomId,
              heatingPositionId: this.from.heatingPositionId
            }
            this.$http.post('/S-House/UpdateNewTenants', Qs.stringify(param)).then(res => {
              if (res.data.success) {
                const { structureId } = res.data.data
                this.$refs[formName].resetFields()
                this.dialogVisible = false
                this.$emit('getVillageList', structureId)
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
