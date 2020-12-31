<!--
 * @Author: your name
 * @Date: 2020-01-15 10:29:19
 * @LastEditTime: 2020-03-11 10:59:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MicroUI-use\src\views\energyManage\energyTotal.vue
 -->
<template>
  <div class="warn">
    <div ref="header">
      <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline" size="small">
        <el-form-item prop="structureId">
          <el-cascader
            ref="cascader"
            v-model="projectVal"
            :options="structureOption"
            placeholder="选择项目"
            clearable
            size="small"
            :props="{
              expandTrigger: 'hover',
              checkStrictly: true,
              label: 'name',
              value: 'id',
              children: 'children'
            }"
            :show-all-levels="false"
            @change="handleCascaderChange"
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table ref="warnTable" :data="tableData" :max-height="this.tableHeight" :header-cell-style="{'background-color': '#fafafa'}" style="width: 100%">
        <el-table-column v-for="(item,index) in tableTitle" :key="index" :prop="item.name" :label="item.label" :formatter="item.formatter" />
      </el-table>
    </div>
  </div>
</template>
<script>
import Qs from 'qs'
import { parseTime } from '@/utils/index'
export default {
  name: 'WarningAlarm',
  data() {
    return {
      structureOption: [],
      projectVal: [],
      formInline: {
        structureId: ''
      },
      tableData: [],
      tableTitle: [
        { label: '站点名称', name: 'structureName' },
        { label: '报警点名称', name: 'real.dataName' },
        { label: '报警值', name: 'real.value' },
        {
          label: '限制值',
          name: 'real.highLimit',
          formatter: row => {
            return `${row.real.lowestLimit}-${row.real.highLimit}`
          }
        },
        { label: '报警类型', name: 'alarm' },
        {
          label: '数据点更新时间',
          name: 'real.date',
          formatter: row => {
            return parseTime(row.real.date, '{y}-{m}-{d} {h}:{i}:{s}')
          }
        }
      ]
    }
  },
  watch: {
    projectVal: {
      handler(newVal, oldVal) {
        if (this.$refs.cascader) {
          this.$refs.cascader.dropDownVisible = false
        }
      }
    }
  },
  created() {
    this.getStructureNode()
    this.handleSearch()
  },
  mounted() {},
  methods: {
    getStructureNode() {
      this.$http.post('/S-Base/getCompanyStructureByRoleTreeJson').then(res => {
        if (res.data.success) {
          this.structureOption = res.data.data
        }
      })
    },
    handleCascaderChange(val) {
      this.projectVal = val
      this.handleSearch()
    },
    handleSearch() {
      const val = this.projectVal
      val.length !== 0 ? (this.formInline.structureId = val[val.length - 1]) : (this.formInline.structureId = '')
      this.$http
        .post('S-RealData/listRealAlarm', Qs.stringify({ structureId: this.formInline.structureId }))
        .then(res => {
          if (res.data.success) {
            const arr1 = res.data.data
            var arr2 = [].concat.apply([], arr1)
            this.tableData = arr2
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
