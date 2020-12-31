<!--
 * @Author: your name
 * @Date: 2020-01-13 14:49:17
 * @LastEditTime: 2020-03-05 10:52:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MicroUI-use\src\views\householdRegulation\realTimeMonitor.vue
 -->
<template>
  <div class="realTimeMonitorHe">
    <div ref="header">
      <el-form ref="formInline" :model="formInline" :inline="true" class="demo-form-inline" size="small">
        <el-form-item prop="structureId">
          <el-cascader
            ref="cascader"
            v-model="projectVal"
            placeholder="选择项目"
            :options="options"
            :props="{
              expandTrigger: 'hover',
              checkStrictly: true,
              label: 'name',
              value: 'id',
              children: 'children'
            }"
            @change="handleCascaderChange"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="success" size="mini" @click="handleExport()">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        id="outTable"
        ref="heTable"
        :data="tableData"
        :max-height="this.tableHeight"
        :header-cell-style="{'background-color': '#fafafa'}"
        style="width: 100%"
      >
        <el-table-column v-for="(item,index) in tableTitle" :key="index" :prop="item.name" :label="item.label" :width="item.width" :sortable="item.sort">
          <el-table-column
            v-for="(elem,i) in item.children"
            :key="elem.label"
            :prop="elem.name"
            :label="elem.label"
            :sortable="elem.sort"
            :formatter="elem.formatter"
          />
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import Qs from 'qs'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import Minxins from '@/utils/tableHeight.mixin'
export default {
  name: 'RealTimeMonitorHe',
  mixins: [Minxins],
  data() {
    return {
      options: [],
      projectVal: [],
      formInline: {
        structureId: ''
      },
      tableData: [],
      tableTitle: [
        {
          label: '站点名称',
          name: 'structureName',
          width: 120
        },
        {
          label: '系统',
          name: 'systemName',
          width: 100
        },
        {
          label: '面积',
          name: 'systemArea',
          sort: true,
          width: 100
        },
        {
          label: '一次',
          name: '',
          children: [
            {
              label: '供温',
              name: 'oneSupplyTem.value',
              sort: true,
              formatter: row => {
                if (row.oneSupplyTem != null && row.oneSupplyTem.value) {
                  return Number(row.oneSupplyTem.value).toFixed(2)
                } else {
                  return 0
                }
              }
            },
            {
              label: '回温',
              name: 'oneBackTem.value',
              sort: true,
              formatter: row => {
                if (row.oneBackTem != null && row.oneBackTem.value) {
                  return Number(row.oneBackTem.value).toFixed(2)
                } else {
                  return 0
                }
              }
            },
            {
              label: '温差',
              sort: true,
              name: 'oneTemCha',
              formatter: row => {
                if (row.oneSupplyTem != null && row.oneBackTem != null) {
                  return Number(row.oneSupplyTem.value - row.oneBackTem.value).toFixed(2)
                } else {
                  return 0
                }
              }
            },
            {
              label: '供压',
              name: 'oneSupplyPa.value',
              sort: true,
              formatter: row => {
                if (row.oneSupplyPa != null && row.oneSupplyPa.value) {
                  return Number(row.oneSupplyPa.value).toFixed(2)
                } else {
                  return 0
                }
              }
            },
            {
              label: '回压',
              name: 'oneBackPa.value',
              sort: true,
              formatter: row => {
                if (row.oneBackPa != null && row.oneBackPa.value) {
                  return Number(row.oneBackPa.value).toFixed(2)
                } else {
                  return 0
                }
              }
            },
            {
              label: '压差',
              sort: true,
              name: 'twoPaCha',
              formatter: row => {
                if (row.oneSupplyPa != null && row.oneBackPa != null) {
                  return Number(row.oneSupplyPa.value - row.oneBackPa.value).toFixed(2)
                } else {
                  return 0
                }
              }
            }
          ]
        },
        {
          label: '二次',
          name: '',
          children: [
            {
              label: '供温',
              name: 'twoSupplyTem.value',
              sort: true,
              formatter: row => {
                if (row.twoSupplyTem != null && row.twoSupplyTem.value) {
                  return Number(row.twoSupplyTem.value).toFixed(2)
                } else {
                  return 0
                }
              }
            },
            {
              label: '回温',
              name: 'twoBackTem.value',
              sort: true,
              formatter: row => {
                if (row.twoBackTem != null && row.twoBackTem.value) {
                  return Number(row.twoBackTem.value).toFixed(2)
                } else {
                  return 0
                }
              }
            },
            {
              label: '温差',
              sort: true,
              name: 'twoTemCha',
              formatter: row => {
                if (row.twoSupplyTem != null && row.twoBackTem != null) {
                  return Number(row.twoSupplyTem.value - row.twoBackTem.value).toFixed(2)
                } else {
                  return 0
                }
              }
            },
            {
              label: '供压',
              name: 'twoSupplyPa.value',
              sort: true,
              formatter: row => {
                if (row.twoSupplyPa != null && row.twoSupplyPa.value) {
                  return Number(row.twoSupplyPa.value).toFixed(2)
                } else {
                  return 0
                }
              }
            },
            {
              label: '回压',
              name: 'twoBackPa.value',
              sort: true,
              formatter: row => {
                if (row.twoBackPa != null && row.twoBackPa.value) {
                  return Number(row.twoBackPa.value).toFixed(2)
                } else {
                  return 0
                }
              }
            },
            {
              label: '压差',
              name: 'twoPaCha',
              sort: true,
              formatter: row => {
                if (row.twoSupplyPa != null && row.twoBackPa != null) {
                  return Number(row.twoSupplyPa.value - row.twoBackPa.value).toFixed(2)
                } else {
                  return 0
                }
              }
            }
          ]
        },
        {
          label: '热表参数',
          name: '',
          children: [
            {
              label: '瞬时热量',
              name: 'instantHeat.value',
              sort: true,
              formatter: row => {
                if (row.instantHeat != null && row.instantHeat.value) {
                  return Number(row.instantHeat.value).toFixed(2)
                } else {
                  return 0
                }
              }
            },
            {
              label: '瞬时流量',
              name: 'instantFlow.value',
              sort: true,
              formatter: row => {
                if (row.instantFlow != null && row.instantFlow.value) {
                  return Number(row.instantFlow.value).toFixed(2)
                } else {
                  return 0
                }
              }
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    projectVal() {
      this.$refs.cascader.toggleDropDownVisible() // 监听值发生变化就关闭它
    }
  },
  created() {
    this.getTree()
  },
  mounted() {},
  methods: {
    handleExport() {
      var wb = XLSX.utils.table_to_book(document.querySelector('#outTable'))
      /* get binary string as output */
      var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '实时监控.xlsx')
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    },
    getTree() {
      this.$http.post('/S-Base/getCompanyStructureByRoleTreeJson').then(res => {
        if (res.data.success) {
          this.options = res.data.data
          this.projectVal = new Array(this.options[0].id)
          this.$refs.cascader.toggleDropDownVisible()
          this.handleSearch(this.projectVal)
        }
      })
    },
    handleCascaderChange(val) {
      this.projectVal = val
      this.handleSearch(val)
    },
    /**
     * 搜索
     */
    handleSearch(val) {
      val.length == 0 ? (this.formInline.structureId = '') : (this.formInline.structureId = val[val.length - 1])
      this.$http.post('/S-Base/realTimeMonitoring', Qs.stringify(this.formInline)).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data
        }
      })
    }
  }
}
</script>
