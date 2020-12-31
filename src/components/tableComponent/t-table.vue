<!--
 * @Author: your name
 * @Date: 2019-05-16 09:50:57
 * @LastEditTime: 2020-02-20 19:34:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MicroUI-use\src\components\tableComponent\t-table.vue
 -->
<template>
  <div class="table">
    <el-table
      size="small"
      :data="tableData1.slice((currpage - 1) * pagesize, currpage * pagesize)"
      :header-cell-style="{
        'background-color': '#fafafa'}"
      style="width: 100%"
    >
      <el-table-column
        prop="dt"
        :formatter="filterDate"
        label="日期"
      />
      <el-table-column
        v-for="(item,index) in tableName"
        :key="index"
        align="center"
        :prop="item.dataCode"
        :label="item.dataName"
      />
    </el-table>
    <div class="page" style="margin:10px 20px 0 0;text-align:right;">
      <el-pagination
        background
        layout="total, sizes,prev, pager, next, jumper "
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pagesize"
        :total="tableData1.length"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>
<script>
import { parseTime } from '@/utils/index'
export default {
  props: {
    tableData: {
      type: Array
    },
    tableName: {
      type: Array
    }
  },
  data() {
    return {
      tableData1: this.tableData,
      currpage: 1,
      pagesize: 10
    }
  },
  watch: {
    tableData(val) {
      this.tableData1 = val
    }
  },
  methods: {
    filterDate(row) {
      return parseTime(row.dt, '{y}-{m}-{d} {h}:{i}')
    },
    /**
     * 当前页发生改变
     */
    handleCurrentChange(val) {
      this.currpage = val
    },
    handleSizeChange(psize) {
      this.pagesize = psize
    }
  }
}
</script>
<style scoped>

</style>
