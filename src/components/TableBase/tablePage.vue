<template>
  <div class="table">
      <el-table
      ref="table"
      :row-class-name="tableRowClassName"
      :data="tableData"
       key="tablekey"
       size="small"
      :highlight-current-row = "true"
      :max-height="tableHeight"
      row-key="id"
      :header-cell-style="{'background-color': '#fafafa'}"
      stripe  show-overflow-tooltip
      :style="{width:width}"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick">
        <el-table-column  type="selection" width="40" v-if="selectShow">
        </el-table-column>
        <el-table-column :prop="item.name" align="center" :label="item.data" v-for="(item,index) in tableTitleName" :key="index" v-if="item.name" :width="item.width" :formatter="tableFormatter" :sortable="item.sort">
        </el-table-column>
        <el-table-column :label="item.data" align="center" :width="item.width" v-for="(item,index) in tableTitleName" v-if="item.switch" :key="index">
            <template slot-scope="scope">
              <div @click.stop>
                  <el-switch
                  v-model="scope.row.startUp"
                  active-color="#ff4949"
                  inactive-color="#13ce66"
                  @change="handleSwitch($event,scope.row)"
                  :active-value="0"
                  :inactive-value="1">
                </el-switch>
              </div>
            </template>
        </el-table-column>

        <el-table-column :label="item.data" align="center" :width="item.width" v-for="(item,index) in tableTitleName" v-if="item.butname" :key="item.data">
            <template slot-scope="scope">
                <el-button :type="i.btnType" v-for="(i,index) in item.butname" :icon="i.icon" size="mini" :key="index" @click.stop="handleClick(scope.$index,scope.row,tableData,i.name,i.icon)">{{i.name}}</el-button>
            </template>
        </el-table-column>
	  </el-table>
    <div :class="{'hidden':hidden}" class="pagination-container">
        <el-pagination
          :background="background"
          :current-page.sync="currentPage"
          :page-size.sync="pageSize"
          :layout="layout"
          :page-sizes="pageSizes"
          :total="total"
          v-bind="$attrs"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
        <slot name="handleColumn"></slot>
    </div>
  </div>
</template>
<script>
// import moment from 'moment'
import {parseTime} from '@/utils/index'
export default {
  props: {
    width: {
      type: String,
      default: '100%'
    },
    tableData: {
      type: Array
    },
    tableTitleName: {
      type: Array
    },
    tableHeight: {
      type: Number,
      default: 220
    },
    selectShow: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default () {
        return [10, 20, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: false
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get () {
        return this.page
      },
      set (val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get () {
        return this.limit
      },
      set (val) {
        this.$emit('update:limit', val)
      }
    }
  },
  data () {
    return {
      plistData: [] // 表格属性
    }
  },
  mounted () {

  },
  methods: {
    tableFormatter (row, column, cellValue) {
      if (column.property === 'useDate') {
        return parseTime(cellValue,'{y}-{m}-{d}')
      } else if (column.property === 'beginTime') {
        return parseTime(cellValue,'{y}-{m}-{d}')
      } else if (column.property === 'endTime') {
        return parseTime(cellValue,'{y}-{m}-{d}')
      } else if (column.property === 'startUp') {
        if (cellValue == 1) {
          return '启动'
        } else {
          return '暂停'
        }
      } else {
        return cellValue
      }
    },
    tableRowClassName ({row, rowIndex}) {
      // 把每一行的索引放进row
      row.index = rowIndex
    },
    handleSwitch (val, row) {
      this.$emit('handleSwitch', val, row)
    },
    handleRowClick (row, event, column) {
      this.$emit('handleRowClick', row, event, column)
    },
    handleClick (index, row, data, name, icon) {
      this.$emit('handleClick', index, row, data, name, icon)
    },
    handleSelectionChange (val) {
      this.$emit('handleSelectionChange', val)
    },
    handleSizeChange (val) {
      // this.$emit('pagination', { page: this.currentPage, limit: val })
      this.$emit('handleSizeChange', val)
    },
    /**
     当前页发生改变
    */
    handleCurrentChange (val) {
      console.log(val, '123')
      // this.$emit('pagination', { page: this.currentPage, limit: val })
      this.$emit('handleCurrentChange', val)
    }
  }
}
</script>
<style scoped>
.table {
  width:100%;
}
.pagination-container {
  /* background: #fff; */
  padding: 10px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>
