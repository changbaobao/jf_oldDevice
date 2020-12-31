<template>
  <div>
    <el-table
      :data="data"
      :header-cell-style="{
        'background-color': '#fafafa'}"
      :max-height="maxHeight"
      size="small"
      style="width: 100%"
      @expand-change="hangClick"
    >
      <el-table-column type="expand" prop="children">
        <template slot-scope="props">
          <el-table :data="props.row.children" border stripe style="width: 100%">
            <el-table-column prop="paramName" label="参数名称" />
            <el-table-column prop="realDataObj.value" label="值" />
            <el-table-column prop="realDataObj.date" :formatter="filterDate" label="时间" />
            <el-table-column label="操作">
              <template slot-scope="scopew">
                <el-button size="mini" type="primary" @click="handleExpandEdit(scopew.$index, scopew.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column v-for="(item,index) in tableTitleName" v-if="item.name" :key="index" :prop="item.name" :label="item.data" :width="item.width" />
      <el-table-column v-for="(item,index) in tableTitleName" v-if="item.butname" :key="index" :label="item.data" align="center" :width="item.width">
        <template slot-scope="scope">
          <el-button
            v-for="(i,index) in item.butname"
            :key="index"
            :type="i.btnType"
            size="mini"
            @click="handleClick(scope.$index,scope.row,data,i.name)"
          >{{ i.name }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page" style="margin-top:10px;text-align:right;">
      <el-pagination
        background
        :current-page.sync="page.currentPage"
        :page-size="page.pageSize"
        layout="total, prev, pager, next"
        :total="page.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { parseTime } from '@/utils/index'
export default {
  props: ['data', 'tableTitleName', 'page', 'maxHeight'],
  data() {
    return {}
  },
  methods: {
    filterDate(row) {
      if (row.realDataObj != null && row.realDataObj.date) {
        return parseTime(row.realDataObj.date, '{y}-{m}-{d} {h}:{i}:{s}')
      } else {
        return ''
      }
    },
    hangClick(row, expandedRows) {
      this.$emit('handleRowClick', row, expandedRows)
    },
    handleClick(index, row, data, name) {
      this.$emit('handleEditOrDel', index, row, data, name)
    },
    handleExpandEdit(index, row) {
      this.$emit('handleExpandEdit', index, row)
    },
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val)
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val)
    }
  }
}
</script>
<style scoped>
</style>
