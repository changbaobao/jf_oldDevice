<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" width="50%" @close="closeDialog">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm" size="small">
      <el-row>
        <el-col :span="12">
          <el-form-item v-if="title==='添加'" label="唯一标识" prop="id">
            <el-input v-model="ruleForm.id" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目" prop="structureId">
            <el-cascader
              v-model="projectVal"
              :options="structureOption"
              size="small"
              style="width:100%;"
              :props="props"
              :show-all-levels="false"
              @change="handleCascaderChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="小区" prop="communityId">
            <el-select v-model="ruleForm.communityId" placeholder="请选择" style="width:100%;">
              <el-option v-for="(item,index) in communityData" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="锅炉房" prop="boilerRoomId">
            <el-select v-model="ruleForm.boilerRoomId" placeholder="请选择" style="width:100%;">
              <el-option v-for="(item,index) in boilerRoom" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备类型" prop="kfDevTypeId">
            <el-select v-model="ruleForm.kfDevTypeId" placeholder="设备类型" style="width:100%;">
              <el-option v-for="(item,index) in devTypeData" :key="index" :label="item.devTypeName" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供暖位置" prop="heatingPositionId">
            <el-select v-model="ruleForm.heatingPositionId" size="small" style="width:100%;" clearable>
              <el-option v-for="(item,index) in heatingPositionData" :key="index" :label="item.position" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称" prop="devName">
            <el-input v-model="ruleForm.devName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="编码" prop="devCode">
            <el-input v-model="ruleForm.devCode" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经度" prop="lon">
            <el-input v-model="ruleForm.lon" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纬度" prop="lat">
            <el-input v-model="ruleForm.lat" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="自定义1" prop="devCustom1">
            <el-input v-model="ruleForm.devCustom1" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="自定义2" prop="devCustom2">
            <el-input v-model="ruleForm.devCustom2" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建参数" prop="haveReceived">
            <el-radio-group v-model="ruleForm.haveReceived">
              <el-radio :label="1">开</el-radio>
              <el-radio :label="0">关</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="handleSubmitForm('ruleForm')">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { getTreeDeepArr, deepCloneEs6 } from '@/utils/index'
import Qs from 'qs'
export default {
  props: {
    isShow: Boolean,
    dialogRow: Object,
    title: String
  },
  data() {
    return {
      dialogVisible: this.isShow,
      props: {
        label: 'name',
        value: 'id',
        children: 'children'
      },
      structureOption: [],
      projectVal: [],
      boilerRoom: [], // 锅炉房数据
      heatingPositionData: [], // 供暖位置
      communityData: [], // 小区数据
      devTypeData: [], // 设备数据
      ruleForm: {
        id: '', // 唯一标识
        structureId: '', // 项目id
        communityId: '', // 小区id
        boilerRoomId: '', // 锅炉房id
        kfDevTypeId: '', // 设备id
        heatingPositionId: '', // 供暖位置id
        devName: '', // 名称
        devCode: '', // 编码
        lon: '', // 经度
        lat: '', // 纬度
        devCustom1: '', // 自定义1
        devCustom2: '', // 自定义2
        haveReceived: 0 // 创建参数
      },
      rules: {
        id: [{ required: true, message: '请输入id', trigger: 'blur' }],
        devName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        kfDevTypeId: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
        devCode: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getStructureNode()
    this.getDevType()
  },
  mounted() {
    if (this.title === '编辑') {
      this.ruleForm = deepCloneEs6(this.dialogRow)
    } else {
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields()
      })
    }
  },
  methods: {
    /** 关闭弹框 */
    closeDialog() {
      this.$emit('closeDialog')
    },
    getStructureNode() {
      this.$http.post('/S-Base/getCompanyStructureByRoleTreeJson').then(res => {
        if (res.data.success) {
          this.structureOption = res.data.data
          const name = getTreeDeepArr(this.ruleForm.structureId, this.structureOption)
          this.projectVal = name
          if (this.title === '编辑') {
            this.handleCascaderChange(this.projectVal)
          }
        }
      })
    },
    handleCascaderChange(val) {
      this.projectVal = val
      this.projectVal.length !== 0 ? (this.ruleForm.structureId = val[val.length - 1]) : (this.ruleForm.structureId = '')
      this.getBoilerRoom(this.ruleForm.structureId)
      this.getCommunityData(this.ruleForm.structureId)
      this.getHeatingPosition(this.ruleForm.structureId)
    },
    /** 获取供暖位置 */
    getHeatingPosition(id) {
      this.$http.post('/S-Base/getHeatingPositionByStructureId', Qs.stringify({ structureId: id })).then(res => {
        if (res.data.success) {
          this.heatingPositionData = res.data.data
        }
      })
    },
    /** 获取小区 */
    getCommunityData(id) {
      this.$http.post('/S-Base/getCommunityByStructureId', Qs.stringify({ structureId: id })).then(res => {
        this.communityData = res.data.data
      })
    },
    /**
     * 获取锅炉房数据
     */
    getBoilerRoom(id) {
      this.$http.post('/S-Base/selectByBoilerRoom', Qs.stringify({ structureId: id })).then(res => {
        this.boilerRoom = res.data.data
      })
    },
    /** 获取设备类型 */
    getDevType() {
      this.$http.post('/S-Base/getAllKfDevType').then(res => {
        if (res.data.success) {
          this.devTypeData = res.data.data.list
        }
      })
    },
    /** 添加或编辑确定 */
    handleSubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.title == '添加') {
            this.$http.post('/S-Base/addKfDev', Qs.stringify(this.ruleForm)).then(res => {
              if (res.data.success) {
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
            this.$http.post('/S-Base/updateKfDev', Qs.stringify(this.ruleForm)).then(res => {
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
          //   let params = {
          //     id: this.ruleForm.id,
          //     structureId: this.ruleForm.projectVal[this.ruleForm.projectVal.length - 1], // 项目id
          //     communityId: this.ruleForm.communityId, // 小区id
          //     boilerRoomId: this.ruleForm.boilerRoomId, // 锅炉房id
          //     kfDevTypeId: this.ruleForm.kfDevTypeId, // 设备id
          //     devName: this.ruleForm.devName, // 名称
          //     devCode: this.ruleForm.devCode, // 编码
          //     heatingPositionId: this.ruleForm.heatingPositionId,
          //     lon: this.ruleForm.lon, // 经度
          //     lat: this.ruleForm.lat, // 纬度
          //     devCustom1: this.ruleForm.devCustom1, // 自定义1
          //     devCustom2: this.ruleForm.devCustom2, // 自定义2
          //     createParam: this.ruleForm.createParam// 创建参数
          //   }
          //   // this.ruleForm.structureId = this.ruleForm.projectVal[this.ruleForm.projectVal.length - 1]
          //   if (this.dialogTitle === '编辑') { // 编辑
          //     this.$http.post('/S-Base/updateKfDev', Qs.stringify(params)).then(res => {
          //       if (res.data.success) {
          //         let data = res.data.data
          //         data.structureName = this.proName
          //         data.communityName = this.communityName
          //         data.boilerRoomName = this.boilerRoomName
          //         data.devTypeName = this.devTypeName
          //         this.$set(this.tableData, this.selectIndex, data)
          //         this.$notify({
          //           title: '成功',
          //           message: '编辑成功',
          //           type: 'success'
          //         })
          //         this.dialogVisible = false
          //       }
          //     })
          //   } else { // 添加
          //     this.$http.post('/S-Base/addKfDev', Qs.stringify(params)).then(res => {
          //       if (res.data.success) {
          //         let data = res.data.data
          //         data.structureName = this.proName
          //         data.communityName = this.communityName
          //         data.boilerRoomName = this.boilerRoomName
          //         data.devTypeName = this.devTypeName
          //         this.tableData.push(data)
          //         for (let i in this.tableData) {
          //           this.$set(this.tableData[i], 'children', [])
          //         }
          //         this.$notify({
          //           title: '成功',
          //           message: '添加成功',
          //           type: 'success'
          //         })
          //         this.$refs[formName].resetFields()
          //         this.dialogVisible = false
          //       }
          //     })
          //   }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /** 取消 */
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    }
  }
}
</script>
