<template>
<div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      size="small"
       :header-cell-style="{
        'background-color': '#fafafa'}"
      :row-class-name="getRowClass"
      :max-height="maxHeight"
      @expand-change="hangClick"
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column type="expand" prop="children">
        <template slot-scope="props">
          <el-table
              :data="props.row.children"
              border stripe
              style="width: 100%">
                  <el-table-column
                  prop="paramName"
                  label="参数名称">
              </el-table-column>
              <el-table-column
                  prop="realDataObj.value"
                  label="值">
              </el-table-column>
              <el-table-column
                  label="时间">
                  <template slot-scope="scopew">
                      <span v-if="scopew.row.realDataDate!==null"> {{scopew.row.realDataDate|dateformat}}</span>
                  </template>
              </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        type="selection"
        width="50">
      </el-table-column>
      <el-table-column :prop="item.name" :label="item.data" v-for="(item,index) in tableTitleName" :key="index" v-if="item.name" :width="item.width">
      </el-table-column>
      <el-table-column label="查看">
          <template slot-scope="scope">
              <el-button v-if="scope.row.kfDevId" size="mini" type="text" @click="handleReadHistory(scope.$index,scope.row)">查看历史</el-button>
          </template>
      </el-table-column>
      <!-- 编辑删除 -->
      <el-table-column :label="item.data" align="center" v-for="(item,index) in tableTitleName" v-if="item.butname" :key="index" :width="item.width">
                  <template slot-scope="scope">
                      <el-button v-for="(i,index) in item.butname" :type="i.btnType" :key="index" size="mini" @click="handleBtnClick(scope.$index,scope.row,tableData,i.name)">{{i.name}}</el-button>
                  </template>
      </el-table-column>
      <!-- 解绑绑定 -->
      <el-table-column label="解除绑定" width="180">
          <template slot-scope="scope">
              <el-button v-if="!scope.row.kfDevId" type="primary" size="mini" @click="handleBindClick(scope.$index,scope.row)">绑定</el-button>
              <el-button v-if="scope.row.kfDevId" type="danger" size="mini" @click="handleDelBind(scope.$index,scope.row)">解除</el-button>
          </template>
      </el-table-column>
    </el-table>
    <div class="page" style="margin-top:10px;text-align:right;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page.currentPage"
            :page-size="page.pageSize"
            layout="total, prev, pager, next"
            :total="page.total">
          </el-pagination>
    </div>
</div>
</template>
<script>
// import moment from 'moment'
export default {
  props: ['tableData', 'tableTitleName', 'page', 'maxHeight'],
  data () {
    return {
    }
  },
  methods: {
    getRowClass (row, rowIndex) {
      let rowI = row.row
      if (rowI.kfDevId === '' || !rowI.kfDevId) {
        return 'row-expand-cover'
      }
    },
    hangClick (row) {
      this.$emit('handleRowClick', row)
    },
    handleSelectionChange (val) {
      this.$emit('handleSelectionChange', val)
    },
    handleCurrentChange (val) {
      this.$emit('handleCurrentChange', val)
    },
    handleSizeChange (val) {
      this.$emit('handleSizeChange', val)
    },
    handleBtnClick (index, row, data, name) {
      this.$emit('handleBtnClick', index, row, data, name)
    },
    handleBindClick (index, row) {
      this.$emit('handleBindClick', index, row)
    },
    handleDelBind (index, row, data) {
      this.$emit('handleDelBind', index, row)
    },
    handleReadHistory (index, row) {
      this.$emit('handleReadHistory', index, row)
    }
  }
}
</script>
<style>
.row-expand-cover td:first-child .el-icon-arrow-right{
  visibility: hidden;
}
</style>
