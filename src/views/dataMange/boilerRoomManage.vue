<template>
  <div class="boilerRoomManage">
    <div ref="header" class="top-btn">
      <el-form :inline="true">
        <el-form-item>
          <el-cascader
            ref="cascader"
            v-model="project"
            placeholder="选择项目"
            style="width:240px;"
            :options="projectList"
            size="small"
            :props="{
              expandTrigger: 'hover',
              checkStrictly: true,
              label: 'name',
              value: 'id',
              children: 'children'
            }"
            @change="handleItemChange"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="success" icon="el-icon-circle-plus-outline" size="mini" @click="addBoilerRoomClick('添加')">新增锅炉房</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table :header-cell-style="{'background-color': '#fafafa'}" :max-height="this.tableHeight" :data="tableData" style="width: 100%;text-align:center;">
        <el-table-column prop="name" width="120" label="锅炉房名字" />
        <el-table-column prop="ownedArea" width="120" label="既有面积" />
        <el-table-column prop="addArea" width="120" label="新增面积" />
        <el-table-column prop="lowArea" width="120" label="低温面积" />
        <el-table-column prop="standardRoomTemp" width="80" label="标准室温" />
        <el-table-column prop="cityName" label="气象信息区域" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="时间" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.saveDate | dateformat }}</span>
          </template>
        </el-table-column>
        <el-table-column width="180" align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editRow(scope.$index,scope.row )">编辑</el-button>
            <el-button type="danger" size="mini" @click="deleteRow(scope.$index,tableData )">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column width="180" align="center" label="能源设备">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDevRow(scope.$index,scope.row )">编辑设备</el-button>
          </template>
        </el-table-column>
        <el-table-column width="180" align="center" label="图片">
          <template slot-scope="scope">
            <el-button type="success" icon="el-icon-upload" size="mini" round @click="uploadImage(scope.$index,scope.row )" />
            <el-button type="success" icon="el-icon-view" size="mini" round @click="getImage(scope.$index,scope.row )" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加或编辑锅炉房 -->
    <AddOrEditDialog
      v-if="boilerRoomDialog.show"
      :structure-id="structureId"
      :is-show="boilerRoomDialog.show"
      :title="boilerRoomDialog.title"
      :dialog-row="boilerRoomDialog.dialogRow"
      @closeDialog="closeDialog"
      @getTableData="getTableData"
    />
    <!-- 编辑设备弹框 -->
    <el-dialog :title="dialogName" width="70%" :close-on-click-modal="false" :visible.sync="DevVisible">
      <el-form ref="boilerRoom" :model="boilerRoom" :rules="rules" class="demo-form-inline" size="small" label-width="130px">
        <span style="font-weight:bold;font-size:15px;">年度计划：</span>
        <el-row>
          <el-col :span="6">
            <el-form-item prop="yearPlanGasConsumption" label="气耗量">
              <el-input v-model="boilerRoom.yearPlanGasConsumption" maxlength="8" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="yearPlanWaterConsumption" label="水耗量">
              <el-input v-model="boilerRoom.yearPlanWaterConsumption" maxlength="8" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="yearPlanPowerConsumption" label="电耗量">
              <el-input v-model="boilerRoom.yearPlanPowerConsumption" maxlength="8" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="yearPlanHeatConsumption" label="热耗量">
              <el-input v-model="boilerRoom.yearPlanHeatConsumption" maxlength="8" />
            </el-form-item>
          </el-col>
        </el-row>
        <span style="font-weight:bold;font-size:15px;">面积：</span>
        <el-row>
          <el-col :span="6">
            <el-form-item prop="ownedArea" label="既有">
              <el-input v-model="boilerRoom.ownedArea" maxlength="8" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="lowArea" label="低温">
              <el-input v-model="boilerRoom.lowArea" maxlength="8" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="addArea" label="新增">
              <el-input v-model="boilerRoom.addArea" maxlength="8" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="standardRoomTemp" label="室温">
              <el-input v-model="boilerRoom.standardRoomTemp" maxlength="8" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <span style="font-weight:bold;font-size:15px;">燃气指标（1-6月）：</span>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="gasOwnedAreaUp" label="正常单方">
                  <el-input v-model="boilerRoom.gasOwnedAreaUp" maxlength="8" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="gasLowAreaUp" label="低温单方">
                  <el-input v-model="boilerRoom.gasLowAreaUp" maxlength="8" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <span style="font-weight:bold;font-size:15px;">（7-12月）：</span>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="gasOwnedAreaDown" label="正常单方">
                  <el-input v-model="boilerRoom.gasOwnedAreaDown" maxlength="8" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="gasLowAreaDown" label="低温单方">
                  <el-input v-model="boilerRoom.gasLowAreaDown" maxlength="8" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <span style="font-weight:bold;font-size:15px;">水指标（1-6月）：</span>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="waterOwnedAreaUp" label="正常单方">
                  <el-input v-model="boilerRoom.waterOwnedAreaUp" maxlength="8" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="waterLowAreaUp" label="低温单方">
                  <el-input v-model="boilerRoom.waterLowAreaUp" maxlength="8" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <span style="font-weight:bold;font-size:15px;">（7-12月）：</span>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="waterOwnedAreaDown" label="正常单方">
                  <el-input v-model="boilerRoom.waterOwnedAreaDown" maxlength="8" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="waterLowAreaDown" label="低温单方">
                  <el-input v-model="boilerRoom.waterLowAreaDown" maxlength="8" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <span style="font-weight:bold;font-size:15px;">电指标（1-6月）：</span>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="powerOwnedAreaUp" label="正常单方">
                  <el-input v-model="boilerRoom.powerOwnedAreaUp" maxlength="8" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="powerLowAreaUp" label="低温单方">
                  <el-input v-model="boilerRoom.powerLowAreaUp" maxlength="8" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <span style="font-weight:bold;font-size:15px;">（7-12月）：</span>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="powerOwnedAreaDown" label="正常单方">
                  <el-input v-model="boilerRoom.powerOwnedAreaDown" maxlength="8" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="powerLowAreaDown" label="低温单方">
                  <el-input v-model="boilerRoom.powerLowAreaDown" maxlength="8" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <span style="font-weight:bold;font-size:15px;">热量指标（1-6月）：</span>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="heatOwnedAreaUp" label="正常单方">
                  <el-input v-model="boilerRoom.heatOwnedAreaUp" maxlength="8" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="heatLowAreaUp" label="低温单方">
                  <el-input v-model="boilerRoom.heatLowAreaUp" maxlength="8" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <span style="font-weight:bold;font-size:15px;">（7-12月）：</span>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="heatOwnedAreaDown" label="正常单方">
                  <el-input v-model="boilerRoom.heatOwnedAreaDown" maxlength="8" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="heatLowAreaDown" label="低温单方">
                  <el-input v-model="boilerRoom.heatLowAreaDown" maxlength="8" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item>
            <el-button @click="resetDevForm('boilerRoom')">取 消</el-button>
            <el-button type="primary" @click="addDevRoom('boilerRoom')">确 定</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog title="图片上传" :visible.sync="dialogVisible_iamge" width="30%">
      <el-upload
        ref="upload"
        class="upload-demo"
        :data="iamgeParam"
        action="https://jfdp.kingfore.net/KingFore/S-ALiOSS/uploadBoilerRoomImage"
        :limit="num"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false"
        :headers="myHeaders"
        :on-error="handleError"
        :on-success="handleSuccess"
        list-type="picture"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelIamge">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="查看" width="30%" :visible.sync="dialogVisible_getIamge">
      <el-carousel indicator-position="outside" :autoplay="false" @change="getIndex">
        <el-carousel-item v-for="item in urls" :key="item">
          <img :src="item" width="100%" height="100%" @click.stop="handleImgClick(item)" />
        </el-carousel-item>
      </el-carousel>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="delIamge">删除此图片</el-button>
        <el-button @click="dialogVisible_getIamge=false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Qs from 'qs'
import AddOrEditDialog from './components/boilerRoomAddOrEdit'
import publicMinxin from '@/utils/tableHeight.mixin'
export default {
  name: 'BoilerRoomManage',
  components: {
    AddOrEditDialog
  },
  mixins: [publicMinxin],
  data() {
    return {
      dialogVisible_getIamge: false,
      urls: [],
      urlsIndex: 0,
      myHeaders: { token: this.$store.state.token },
      iamgeParam: { boilerRoomId: '' },
      num: 3,
      boilerRoomId: '',
      dialogVisible_iamge: false,
      fileList: [],
      dialogName: '', // 弹框标题
      project: [],
      structureId: '', // 项目
      projectList: [],
      boilerRoomDialog: {
        show: false, // 弹框显示隐藏
        title: '添加',
        dialogRow: {}
      },
      boilerRoom: {
        saveDate: '', // 时间
        ownedArea: '', // 既有面积
        addArea: '', // 新增面积
        lowArea: '', // 低温面积
        gasOwnedAreaUp: '',
        gasLowAreaUp: '',
        gasOwnedAreaDown: '',
        gasLowAreaDown: '',
        waterOwnedAreaUp: '',
        waterLowAreaUp: '',
        waterOwnedAreaDown: '',
        waterLowAreaDown: '',
        powerOwnedAreaUp: '',
        powerLowAreaUp: '',
        powerOwnedAreaDown: '',
        powerLowAreaDown: '',
        heatOwnedAreaUp: '',
        heatLowAreaUp: '',
        heatOwnedAreaDown: '',
        heatLowAreaDown: '',
        standardRoomTemp: '',
        yearPlanGasConsumption: '',
        yearPlanWaterConsumption: '',
        yearPlanPowerConsumption: '',
        yearPlanHeatConsumption: ''
      },
      rules: {
        ownedArea: [{ required: true, message: '请输入既有面积', trigger: 'blur' }],
        addArea: [{ required: true, message: '请输入新增面积', trigger: 'blur' }],
        lowArea: [{ required: true, message: '请输入低温面积', trigger: 'blur' }],
        gasOwnedAreaUp: [{ required: true, message: '请输入燃气正常单方面积（1-6月）', trigger: 'blur' }],
        gasLowAreaUp: [{ required: true, message: '请输入燃气低温单方面积（1-6月）', trigger: 'blur' }],
        gasOwnedAreaDown: [{ required: true, message: '请输入燃气正常单方面积（7-12月）', trigger: 'blur' }],
        gasLowAreaDown: [{ required: true, message: '请输入燃气低温单方面积（7-12月）', trigger: 'blur' }],
        waterOwnedAreaUp: [{ required: true, message: '请输入水正常单方面积（1-6月）', trigger: 'blur' }],
        waterLowAreaUp: [{ required: true, message: '请输入水低温单方面积（1-6月）', trigger: 'blur' }],
        waterOwnedAreaDown: [{ required: true, message: '请输入水正常单方面积（7-12月）', trigger: 'blur' }],
        waterLowAreaDown: [{ required: true, message: '请输入水低温单方面积（7-12月）', trigger: 'blur' }],
        powerOwnedAreaUp: [{ required: true, message: '请输入电正常单方面积（1-6月）', trigger: 'blur' }],
        powerLowAreaUp: [{ required: true, message: '请输入电低温单方面积（1-6月）', trigger: 'blur' }],
        powerOwnedAreaDown: [{ required: true, message: '请输入电正常单方面积（7-12月）', trigger: 'blur' }],
        powerLowAreaDown: [{ required: true, message: '请输入电低温单方面积（7-12月）', trigger: 'blur' }],
        heatOwnedAreaUp: [{ required: true, message: '请输入气正常单方面积（1-6月）', trigger: 'blur' }],
        heatLowAreaUp: [{ required: true, message: '请输入气低温单方面积（1-6月）', trigger: 'blur' }],
        heatOwnedAreaDown: [{ required: true, message: '请输入气正常单方面积（7-12月）', trigger: 'blur' }],
        heatLowAreaDown: [{ required: true, message: '请输入气低温单方面积（7-12月）', trigger: 'blur' }]
      },
      tableData: [],
      boilersData: [],
      DevVisible: false,
      saveDate: ''
    }
  },
  watch: {
    project: {
      handler(newVal, oldVal) {
        if (this.$refs.cascader) {
          this.$refs.cascader.dropDownVisible = false
        }
      }
    }
  },
  created() {
    this.getNode()
  },
  methods: {
    handleImgClick(url) {
      window.open(url, '_blank')
    },
    delIamge() {
      this.$confirm('此操作将永久删除该张图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.post('/S-ALiOSS/deleteFileByUrl', Qs.stringify({ fileUrl: this.urls[this.urlsIndex] })).then(res => {
            if (res.data.success) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.dialogVisible_getIamge = false
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    getIndex(index) {
      this.urlsIndex = index
    },
    getImage(index, rows) {
      this.$http.post('/S-ALiOSS/getBoilerRoomImage', Qs.stringify({ boilerRoomId: rows.id })).then(res => {
        if (res.data.success) {
          this.urls = res.data.data
        }
      })
      this.dialogVisible_getIamge = true
    },
    handleSuccess(res, file) {
      this.$notify({
        title: '提示',
        type: 'success',
        message: res.msg
      })
    },
    handleError(res, file) {
      this.$notify.error({
        title: '提示',
        message: '上传失败！！'
      })
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList)
    },
    handlePreview(file) {
      // console.log(file)
    },
    cancelIamge() {
      this.dialogVisible_iamge = false
      this.fileList = []
    },
    uploadImage(index, rows) {
      this.iamgeParam.boilerRoomId = rows.id
      this.dialogVisible_iamge = true
    },
    getNode() {
      this.$http.post('/S-Base/getCompanyStructureByRoleTreeJson').then(res => {
        if (res.data.success) {
          this.projectList = res.data.data
        }
      })
    },
    /** 编辑设备 */
    editDevRow(index, rows) {
      this.DevVisible = true
      this.dialogName = '编辑'
      // this.boilerRoom = Object.assign({}, rows)
      this.boilerRoom.id = rows.id
      this.boilerRoom.lowArea = rows.lowArea
      this.boilerRoom.addArea = rows.addArea
      this.boilerRoom.ownedArea = rows.ownedArea
      this.boilerRoom.gasOwnedAreaUp = rows.gasOwnedAreaUp
      this.boilerRoom.gasLowAreaUp = rows.gasLowAreaUp
      this.boilerRoom.gasOwnedAreaDown = rows.gasOwnedAreaDown
      this.boilerRoom.gasLowAreaDown = rows.gasLowAreaDown
      this.boilerRoom.waterOwnedAreaUp = rows.waterOwnedAreaUp
      this.boilerRoom.waterLowAreaUp = rows.waterLowAreaUp
      this.boilerRoom.waterOwnedAreaDown = rows.waterOwnedAreaDown
      this.boilerRoom.waterLowAreaDown = rows.waterLowAreaDown
      this.boilerRoom.powerOwnedAreaUp = rows.powerOwnedAreaUp
      this.boilerRoom.powerLowAreaUp = rows.powerLowAreaUp
      this.boilerRoom.powerOwnedAreaDown = rows.powerOwnedAreaDown
      this.boilerRoom.powerLowAreaDown = rows.powerLowAreaDown
      this.boilerRoom.heatOwnedAreaUp = rows.heatOwnedAreaUp
      this.boilerRoom.heatLowAreaUp = rows.heatLowAreaUp
      this.boilerRoom.heatOwnedAreaDown = rows.heatOwnedAreaDown
      this.boilerRoom.heatLowAreaDown = rows.heatLowAreaDown
      this.boilerRoom.standardRoomTemp = rows.standardRoomTemp
      this.saveDate = rows.saveDate
      this.boilerRoom.yearPlanGasConsumption = rows.yearPlanGasConsumption
      this.boilerRoom.yearPlanWaterConsumption = rows.yearPlanWaterConsumption
      this.boilerRoom.yearPlanPowerConsumption = rows.yearPlanPowerConsumption
      this.boilerRoom.yearPlanHeatConsumption = rows.yearPlanHeatConsumption
    },
    /** 编辑设备确定 */
    addDevRoom(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http.post('/S-Base/updateBoilerRoom', Qs.stringify(this.boilerRoom)).then(res => {
            const data = res.data.data
            data.saveDate = this.saveDate
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success'
            })
            this.getTableData()
            this.DevVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /** 取消编辑 */
    resetDevForm(formName) {
      this.$refs[formName].resetFields()
      this.DevVisible = false
    },
    /** 删除 */
    deleteRow(index, rows) {
      this.$confirm('此操作将彻底删除[' + rows[index].name + '], 确定吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http
          .get('/S-Base/delBoilerRoom', {
            params: {
              id: rows[index].id
            }
          })
          .then(response => {
            if (response.data.success) {
              rows.splice(index, 1)
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              })
            }
          })
      })
    },
    /**
     * 获取项目名称
     */
    handleItemChange(val) {
      this.project = val
      val.length == 0 ? (this.structureId = '') : (this.structureId = val[val.length - 1])
      this.handleSearch()
    },
    /** 编辑 */
    editRow(index, rows) {
      this.boilerRoomDialog.dialogRow = { ...rows }
      this.addBoilerRoomClick('编辑')
    },
    /** 添加 锅炉房 */
    addBoilerRoomClick(type) {
      if (this.project.length === 0) {
        return this.$message({
          message: '警告，请选择项目',
          type: 'warning'
        })
      }
      this.boilerRoomDialog.title = type
      this.boilerRoomDialog.show = true
    },
    /**
     * 关闭弹框
     */
    closeDialog() {
      this.boilerRoomDialog.show = false
    },
    /**
     * 搜索查询
     */
    handleSearch() {
      if (this.project.length === 0) {
        this.$notify({
          title: '请选择查询内容',
          type: 'error'
        })
      } else {
        this.getTableData()
      }
    },
    getTableData() {
      this.$http.post('/S-Base/selectByBoilerRoom', Qs.stringify({ structureId: this.structureId })).then(res => {
        this.tableData = res.data.data
      })
    }
  }
}
</script>
