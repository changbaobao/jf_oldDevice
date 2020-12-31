<template>
  <el-row :gutter="20">
    <div class="grid-content">
      <div class="top-btn" style="padding:0 10px;">
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
          @change="handleCascader"
        />
        <!-- <t-cascader style="margin-left:20px;"
                    @handleItemChange="handleCascader"
                    v-model="proNameObj.name"></t-cascader> -->
        <t-select
          v-model="boilerRoomId"
          style="margin:0 10px;"
          :width="200"
          :data="boilerRoom"
          :select-val="boilerRoomId"
          @handleSelect="handleSelect"
        />
        <el-button
          type="danger"
          size="small"
          class="fr"
          @click="handleAdd('添加')"
        >新增</el-button>
        <el-button
          type="primary"
          size="small"
          class="fr"
          style="margin:0 10px;"
          @click="HandleSearch(radioVal)"
        >搜索</el-button>
        <span class="fr m-t10">
          <el-radio-group
            v-model="radioVal"
            @change="handleChangeRadio"
          >
            <el-radio
              v-for="item in radioArr"
              :key="item"
              :label="item"
            />
          </el-radio-group>
        </span>
      </div>
      <div class="tableContent">
        <t-table
          ref="gTable"
          :max-height="maxHeight"
          :page-show="false"
          :table-title-name="tableName"
          :table-data="tableData"
          @handleBtnClick="handleBtnClick"
        />
      </div>
    </div>
    <!-- 添加或编辑 -->
    <meterAddOrEdit
      v-if="addMeterDialog.show"
      :meter-type="radioVal"
      :title="addMeterDialog.title"
      :is-show="addMeterDialog.show"
      :dialog-row="addMeterDialog.dialogRow"
      :structure-id="structureId"
      :boiler-room-id="boilerRoomId"
      @closeDialog="closeDialog"
      @getTableData="HandleSearch"
    />
  </el-row>
</template>
<script>
import tSelect from '../../components/base/t-select'
import tTable from '../../components/base/g-table'
import { energyMeterData } from '../../config/tableTitle/energyTitleName'
import meterAddOrEdit from './component/meterAddOrEditDialog'
import Qs from 'qs'
export default {
  name: 'EnergyMeterManage',
  components: {
    tSelect,
    tTable,
    meterAddOrEdit
  },
  data() {
    return {
      project: [],
      projectList: [],
      structureId: '',
      // proNameObj: {},
      boilerRoom: [], // 选择锅炉
      radioArr: ['气表', '水表', '电表', '热表'], // 单选
      radioVal: '气表', // 单选选中值
      boilerRoomId: '', // 锅炉id
      tableName: [], // 表格属性
      tableData: [], // 表格数据
      addMeterDialog: {
        show: false,
        title: '添加',
        dialogRow: {}
      },
      maxHeight: 444
    }
  },
  watch: {
    project: {
      handler(newVal, oldVal) {
        if (this.$refs.cascader) {
          this.$refs.cascader.dropDownVisible = false
          // this.$refs.cascader.toggleDropDownVisible()
        }
      }
    }
  },
  created() {
    this.getNode()
  },
  mounted() {
    this.tableName = energyMeterData
    this.$nextTick(function() {
      this.maxHeight = window.innerHeight - this.$refs.gTable.$el.offsetTop - 140
      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.maxHeight = window.innerHeight - self.$refs.gTable.$el.offsetTop - 140
      }
    })
  },
  methods: {
    getNode() {
      this.$http.post('/S-Base/getCompanyStructureByRoleTreeJson')
        .then(res => {
          if (res.data.success) {
            this.projectList = res.data.data
          }
        })
    },
    /**
     * 获取项目名称
     */
    handleCascader(val) {
      this.project = val
      val.length == 0 ? this.structureId = '' : this.structureId = val[val.length - 1]
      this.getBoilerRoom(this.structureId)
    },
    getBoilerRoom(id) {
      this.$http.post('/S-Base/selectByBoilerRoom', Qs.stringify({ structureId: id })).then(res => {
        // if (res.data.success) {
        const data = res.data.data
        const arr = []
        for (const i in data) {
          const obj = { label: data[i].name, value: data[i].id }
          arr.push(obj)
        }
        this.boilerRoom = arr
        data.length !== 0 ? this.boilerRoomId = data[0].id : this.boilerRoomId = ''
        // }
      })
    },
    /**
     * 获取选择框的值
     */
    handleSelect(val) {
      this.boilerRoomId = val
    },
    /**
     * 获取单选框选中值
     */
    handleChangeRadio(val) {
      this.radioVal = val
    },
    /**
     * 点击搜索
     */
    HandleSearch(type) {
      this.radioVal = type
      if (this.project.length === 0 || this.boilerRoomId === '') {
        this.$message({
          message: '警告哦,请选择项目类型和锅炉房',
          type: 'warning'
        })
      } else {
        this.$http.post('/S-Energy/getMeterByBoilerRoomId', Qs.stringify({ boilerRoomId: this.boilerRoomId, type: this.radioVal })).then(res => {
          if (res.data.success) {
            this.tableData = res.data.data
          }
        })
      }
    },
    /**
     * 关闭弹框
     */
    closeDialog() {
      this.addMeterDialog.show = false
    },
    /**
     * 新建
     */
    handleAdd(type) {
      if (type == '添加') {
        if (this.project.length === 0 || this.boilerRoomId === '') {
          return this.$message({
            message: '警告哦,请选择项目类型和锅炉房',
            type: 'warning'
          })
        }
      }
      this.addMeterDialog.title = type
      this.addMeterDialog.show = true
    },
    /**
     * 表格编辑或删除
     */
    handleBtnClick(index, row, data, name) {
      if (name === '编辑') {
        this.handleAdd(name)
        this.addMeterDialog.dialogRow = { ...row }
      } else { // 删除
        this.handleDelete(index, row, data)
      }
    },
    /**
     * 删除表格值
     */
    handleDelete(index, row, data) {
      this.$confirm('确认删除此项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/S-Energy/delMeter', Qs.stringify({ meterId: data[index].id })).then(res => {
          if (res.data.success) {
            data.splice(index, 1)
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            })
          }
        })
      })
    }

  }
}
</script>
<style scoped>
.tableContent {
  margin-top: 20px;
}
.tRadio {
  margin: 10px 10px 0 0;
}
</style>
