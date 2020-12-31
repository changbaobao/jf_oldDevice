<!--
 * @Author: your name
 * @Date: 2020-02-19 13:17:31
 * @LastEditTime: 2020-02-19 15:48:03
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \vue-admin-template-master\src\components\base\g-table.vue
 -->
<template>
  <div class="table">
    <el-table
      ref="multipleTable"
      stripe
      :data="tableData"
      :max-height="maxHeight"
      :header-cell-style="{
        'background-color': '#fafafa'}"
      style="width: 100%"
      size="small"
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="isSelect" type="selection" width="50" />
      <el-table-column v-for="(item,index) in tableTitleName" v-if="item.name" :key="index" :prop="item.name" align="center" :label="item.data" :width="item.width" :formatter="item.formatter" />
      <el-table-column v-for="(item,index) in tableTitleName" v-if="item.format" :key="index" :prop="item.format" align="center" :label="item.data" :width="item.width" :formatter="formatter" />
      <el-table-column v-for="(item,index) in tableTitleName" v-if="item.butname" :key="index" :label="item.data" align="center" :width="item.width">
        <template slot-scope="scope">
          <el-button v-for="(i,index) in item.butname" :key="index" :type="i.btnType" size="mini" @click="handleClick(scope.$index,scope.row,tableData,i.name)">{{ i.name }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 不显示总条数分页 -->
    <div v-if="pageShow" class="page" style="margin-top:10px;text-align:right;">
      <el-pagination :current-page="currentPage" :page-size="pageSize" layout="prev, pager, next" @prev-click="prevClick" @next-click="nextClick" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    currentPage: Number,
    pageSize: Number,
    isSelect: Boolean,
    tableData: {
      type: Array
    },
    tableTitleName: {
      type: Array
    },
    pageShow: {
      type: Boolean,
      default: true
    },
    maxHeight: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {

    }
  },

  methods: {
    chilFn(msg) {
      this.$refs.multipleTable.clearSelection()
    },
    formatter(row, column) {
      if (row.houseTemId === null || row.houseTemId === undefined || row.houseTemId === '') {
        return '否'
      } else {
        return '是'
      }
    },
    handleSelectionChange(val) {
      this.$emit('handleSelectionChange', val)
    },
    handleClick(index, row, data, name) {
      this.$emit('handleBtnClick', index, row, data, name)
    },
    prevClick(val) {
      this.$emit('prevClick', val)
    },
    nextClick(val) {
      this.$emit('nextClick', val)
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val)
    },
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val)
    }
  }
}
</script>
<style scoped>

</style>
