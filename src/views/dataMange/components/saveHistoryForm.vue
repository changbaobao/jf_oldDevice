
<template>
  <div class="top-form">
    <div class="tabs clearfix" style="padding:10px;border-bottom: 1px solid #ebeef5;">
      <el-button-group>
        <el-button :type="currentIndex==2?'primary':''" size="mini" @click="handleHistory(2)">历史</el-button>
        <el-button :type="currentIndex==1?'primary':''" size="mini" @click="handleHistory(1)">实时</el-button>
      </el-button-group>
      <span class="fr">
        <el-button type="primary" size="mini" plain style="margin-left:5px;" @click="handleClick('模板')">保存为模板</el-button>
        <el-button type="success" size="mini" @click="handleClick('导出')">导出</el-button>
        <span v-if="currentIndex==2" style="margin-left:10px;">
          <span class="tab-item" :class="{'active':ChartOrTable==0}" @click="handleSwitch(0)">表格</span>|
          <span class="tab-item" :class="{'active':ChartOrTable==1}" @click="handleSwitch(1)">图表</span>
        </span>
      </span>
    </div>
    <div class="history-form" style="margin-top:10px;padding:0 10px;">
      <el-form :model="ruleForm" class="demo-form-inline" size="small" :inline="true">
        <el-form-item>
          <el-cascader
            v-model="projectVal"
            :options="projectList"
            clearable
            filterable
            placeholder="选择项目"
            style="width:100%;"
            :props="{
              label: 'name',
              value: 'id',
              children: 'children'
            }"
            expand-trigger="hover"
            :show-all-levels="false"
            @change="handleItemChange"
          />
        </el-form-item>
        <el-form-item>
          <el-select v-model="ruleForm.systemId" clearable placeholder="选择系统" @change="handleSystemChange">
            <el-option v-for="(item , index ) in systemData" :key="index" :label="item.systemName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="currentIndex==2">
          <el-select v-model="ruleForm.dateRange" placeholder="选择时间段" style="width:120px;" @change="handleChangeDate">
            <el-option v-for="(item , index ) in dateOption" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="currentIndex==2">
          <el-date-picker
            v-model="ruleForm.startTime"
            style="width:100%;"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="开始时间"
          />
        </el-form-item>
        <el-form-item v-if="currentIndex==2">
          <el-date-picker
            v-model="ruleForm.endTime"
            type="datetime"
            style="width:100%;"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="结束时间"
          />
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="ruleForm.dataCode"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请输入数据点"
            :remote-method="remoteMethod"
            :loading="loading"
            @change="handleSelectChange"
          >
            <el-option v-for="(item , index ) in scopeData" :key="index" :label="item.dataName" :value="item._id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="handleSearch()">查询</el-button>
          <el-button type="primary" plain size="mini" @click="handleScopes()">选择数据点</el-button>
          <slot />
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="选择数据点" :visible.sync="dialogVisible" width="30%" @close="cloaseDialog()">
      <el-table
        v-loading="loading"
        :data="scopesArr"
        stripe
        style="width: 100%"
        :header-cell-style="{'background-color': '#fafafa'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="dataName" label="数据点名称" />
      </el-table>
      <div v-if="scopesArr.length>0" style="text-align:center;margin-top:20px;">
        <el-button v-if="!isLoading" type="info" plain size="mini" :loading="loading" @click="handleLoadMore">加载更多</el-button>
        <el-button v-else type="info" plain size="mini">全部加载完成</el-button>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleSubmit()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getTreeDeepArr } from '@/utils/index'
import { getBeforeDate } from '../components/historyOption'
import Qs from 'qs'
export default {
  components: {},
  props: {
    structureId: String,
    tabIndex: Number,
    tags: Array
  },
  data() {
    return {
      currentIndex: this.tabIndex,
      projectList: [], // 项目
      projectVal: [], // 项目选择值
      ruleForm: {
        systemId: '', // 系统
        dataCode: '',
        dateRange: 3, // 时间范围
        startTime: getBeforeDate(3), // 开始时间
        endTime: getBeforeDate(0) // 结束时间
      },
      systemData: [],
      loading: false,
      ChartOrTable: 1,
      scopeData: [],
      dateOption: [
        { id: 1, name: '24小时' },
        { id: 3, name: '最近3天' },
        { id: 7, name: '最近7天' },
        { id: 30, name: '30天' }
      ],
      dialogVisible: false,
      scopesArr: [],
      multipleSelection: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      isLoading: false
    }
  },
  watch: {
    structureId(newValue, oldValue) {
      this.getNode()
    },
    tabIndex(val) {
      this.currentIndex = val
    },
    tags(val) {
      if (val.length == 0) this.ruleForm.dataCode = ''
      this.tags = val
    }
  },
  created() {
    this.getNode()
  },
  mounted() {},
  methods: {
    handleScopes() {
      if (this.projectVal.length == 0) {
        return this.$message({
          message: '警告,选择项目',
          type: 'warning'
        })
      }
      this.dialogVisible = true
      this.getScopeData()
    },
    getScopeData() {
      const id = this.projectVal[this.projectVal.length - 1]
      const { pageNo, pageSize } = this.page
      this.$http.post('/S-RealData/getRealByDataNameAndSid', Qs.stringify({ companyStructureId: id, pageNo, pageSize })).then(res => {
        if (res.data.success) {
          this.loading = false
          const { data, total } = res.data.data
          const arr = data
          if (arr.length < pageSize) {
            this.isLoading = true
          } else {
            this.isLoading = false
          }
          this.scopesArr = [...this.scopesArr, ...arr]
          this.page.total = Number(total)
        }
      })
    },
    /**
     * 点击加载更多
     */
    handleLoadMore() {
      this.loading = true
      this.page.pageNo++
      this.getScopeData()
    },
    cloaseDialog() {
      this.scopesArr = []
      this.dialogVisible = false
    },
    /**
     * 选中数据
     */
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /** 确定 */
    handleSubmit() {
      if (this.multipleSelection.length > 20) {
        return this.$message({
          message: '警告,选择数据点不能超出20个',
          type: 'warning'
        })
      }
      this.$emit('handleSystemChange', this.multipleSelection)
      this.dialogVisible = false
    },
    /**
     * 实时历史切换
     */
    handleHistory(index) {
      this.currentIndex = index
      this.$emit('handleHistory', this.currentIndex)
    },
    /**
     * 表格图表
     */
    handleSwitch(val) {
      this.ChartOrTable = val
      this.$emit('handleSwitch', val)
    },
    /**
     * 获取项目
     */
    getNode() {
      this.$http.post('/S-Base/getCompanyStructureByRoleTreeJson').then(res => {
        if (res.data.success) {
          this.projectList = res.data.data
          if (this.structureId !== undefined) {
            this.projectVal = getTreeDeepArr(this.structureId, this.projectList)
          }
        }
      })
    },
    /**
     * 获取项目id
     */
    handleItemChange(ids) {
      this.projectVal = ids
      this.getSystemData(this.projectVal[this.projectVal.length - 1])
    },
    /** 根据项目获取系统 */
    getSystemData(id) {
      this.$http.post('S-Base/getByHeatSystem', Qs.stringify({ structureId: id, pageNo: 1, pageSize: 1000 })).then(res => {
        if (res.data.success) {
          this.systemData = res.data.data.list
        }
      })
    },
    handleChangeDate(val) {
      if (val == 1) {
        this.ruleForm.startTime = getBeforeDate(1)
      } else if (val == 3) {
        this.ruleForm.startTime = getBeforeDate(3)
      } else if (val == 7) {
        this.ruleForm.startTime = getBeforeDate(7)
      } else if (val == 30) {
        this.ruleForm.startTime = getBeforeDate(30)
      }
    },

    /**
     * 远程搜索查询数据点
     */
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          let param = {}
          if (this.projectVal.length === 0) {
            param = { dataName: query }
          } else {
            const id = this.projectVal[this.projectVal.length - 1]
            param = { companyStructureId: id, dataName: query }
          }
          this.$http
            .post('/S-RealData/getRealByDataNameAndSid', Qs.stringify(param))
            .then(res => {
              if (res.data.success) {
                const { data } = res.data.data
                this.scopeData = data
                this.loading = false
              }
            })
            .catch(function(err) {
              console.log(err)
            })
        }, 300)
      } else {
        this.scopeData = []
      }
    },
    /**
     * 数据点选中值
     */
    handleSelectChange(val) {
      const item = this.scopeData.find(item => {
        // 这里的scopeData就是上面遍历的数据源
        return item._id === val // 筛选出匹配数据
      })
      this.$emit('handleSelectChange', val, item)
    },
    /**
     * 选择系统
     */
    handleSystemChange(val) {
      const obj = this.systemData.find(item => {
        // 这里的scopeData就是上面遍历的数据源
        return item.id === val // 筛选出匹配数据
      })
      const { twoSupplyTem, twoBackTem, targetTem, outdoorTem, realValue } = obj
      const arr = [twoSupplyTem, twoBackTem, targetTem, outdoorTem]
      var newArr = arr.filter(item => item) // 过滤null undefined
      if (realValue && realValue.length !== 0) {
        var resultArr = []
        newArr.map(item => {
          const obj = realValue.find(v => {
            return v._id == item
          })
          resultArr.push(obj)
        })
      }
      this.$emit('handleSystemChange', resultArr)
    },
    /**
     * 点击查询
     */
    handleSearch() {
      if (this.currentIndex == 1) {
        this.$emit('handleSearch', this.currentIndex)
      } else {
        this.$emit('handleSearch', this.currentIndex, this.ruleForm)
      }
    },
    handleClick(type) {
      this.$emit('handleBtnClick', type)
    }
  }
}
</script>
<style scoped>
.tab-item {
  cursor: pointer;
  display: inline-block;
  padding: 0 10px;
}
.tab-item.active {
  color: #66b1ff;
}
</style>
