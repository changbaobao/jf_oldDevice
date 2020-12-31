<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      :header-cell-style="{
        'background-color': '#fafafa'}"
      tooltip-effect="dark"
      style="width: 100%"
      :row-class-name="tableRowClassName"
      :max-height="tableHeight"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-row>
              <el-col :span="6">
                <el-form-item label="简称:">
                  <span>{{ props.row.dataName }}</span>
                </el-form-item>
                <el-form-item label="底限:">
                  <span>{{ props.row.lowestLimit }}</span>
                </el-form-item>
                <el-form-item label="高限:">
                  <span>{{ props.row.highLimit }}</span>
                </el-form-item>
                <el-form-item label="读写:">
                  <span>{{ props.row.readWrite }}</span>
                </el-form-item>
                <el-form-item label="存历史:">
                  <span>{{ props.row.saveHistory }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="自定义json:">
                  <span>{{ props.row.customJson }}</span>
                </el-form-item>
                <el-form-item label="自定义1:">
                  <span>{{ props.row.custom1 }}</span>
                </el-form-item>
                <el-form-item label="自定义2:">
                  <span>{{ props.row.custom2 }}</span>
                </el-form-item>
                <el-form-item label="自定义3:">
                  <span>{{ props.row.custom3 }}</span>
                </el-form-item>
                <el-form-item label="自定义4:">
                  <span>{{ props.row.custom4 }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-button type="primary" size="mini" plain @click="showAddEnumsView('添加枚举',props.$index,props.row)">添加枚举</el-button>
                <el-button v-if="props.row.enums.length!==0" type="success" size="mini" plain @click="EnumsBind('批量关联',props.$index,props.row)">批量关联</el-button>
                <el-table
                  style="margin-top:10px;"
                  tooltip-effect="dark"
                  :header-cell-style="{
                    'background-color': '#fafafa'}"
                  :data="props.row.enums"
                  width="100%"
                >
                  <el-table-column
                    prop="value"
                    label="枚举值"
                    width="150"
                  />
                  <el-table-column
                    prop="name"
                    label="枚举内容"
                    width="120"
                  />
                  <el-table-column label="操作" align="center">
                    <template slot-scope="scopew">
                      <el-button type="primary" size="mini" @click="handleEnumsEdit('编辑枚举',scopew.$index,scopew.row)">编辑</el-button>
                      <el-button type="danger" size="mini" @click="handleEnumsDelete(scopew.$index,props.row.enums)">删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        type="selection"
        width="30"
      />
      <el-table-column
        label="名称"
        width="150"
        prop="dataName"
      />
      <el-table-column
        prop="calUnit"
        label="单位"
      />
      <el-table-column
        prop="value"
        label="值"
      />
      <el-table-column
        prop="companyStructure.name"
        label="所属项目"
      />
      <el-table-column
        prop="warning"
        label="报警"
      />
      <el-table-column
        width="160"
        label="时间"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.date|dateformat }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
                prop="readWrite"
                width="100"
                label="读写">
            </el-table-column>
            <el-table-column
            prop="saveHistory"
            width="100"
            label="存历史"> -->
      </el-table-column>
      <el-table-column
        prop="grouping"
        align="center"
        width="120"
        label="分组"
      />
      <el-table-column label="操作" align="center" width="120" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleEdit(scope.$index,scope.row)" />
          <el-button type="text" style="color:#f56c6c;" icon="el-icon-delete" @click="handleDelete(scope.$index,tableData)" />
        </template>
      </el-table-column>
    </el-table>
    <div class="page" style="margin-top:20px;text-align:right;">
      <el-pagination
        background
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    tableData: Array,
    page: {
      type: Object,
      default() {
        return {}
      }
    },
    tableHeight: [String, Number]
  },
  data() {
    return {
    }
  },
  computed: {
    currentPage() {
      return this.page.currentPage
    },
    pageSize() {
      return this.page.pageSize
    },
    total() {
      return Number(this.page.total)
    }
  },
  methods: {
    /**
       * 编辑
       */
    handleEdit(index, row) {
      this.$emit('handleEdit', index, row)
    },
    /**
     * 删除
     */
    handleDelete(index, data) {
      this.$emit('handleDelete', index, data)
    },
    /** 清空选中值 */
    clearSelect(mgs) {
      this.$refs.multipleTable.clearSelection()
    },
    /** 表格行颜色 */
    tableRowClassName({ row, rowIndex }) {
      if (row.warning === '是') {
        return 'warning-row'
      }
    },
    /* 获取表格选中的值 */
    handleSelectionChange(val) {
      this.$emit('handleSelectionChange', val)
    },
    /** 添加枚举 */
    showAddEnumsView(name, row, enums) {
      this.$emit('showAddEnumsView', name, row, enums)
    },
    /** 批量绑定 */
    EnumsBind(name, row, enums) {
      this.$emit('EnumsBind', name, row, enums)
    },
    /** 编辑枚举 */
    handleEnumsEdit(name, index, row) {
      this.$emit('handleEnumsEdit', name, index, row)
    },
    handleEnumsDelete(index, data) {
      this.$emit('handleEnumsDelete', index, data)
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
