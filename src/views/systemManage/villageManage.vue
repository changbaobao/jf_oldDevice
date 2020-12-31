<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <div class="grid-content bg-fff" style="height: calc(100vh - 110px);padding:10px;overflow-y:auto;">
        <el-tree
          ref="treekf"
          :props="props2"
          :load="loadNode"
          node-key="id"
          accordion
          :highlight-current="true"
          :expand-on-click-node="false"
          lazy
          @node-click="handleNodeClick"
        />
      </div>
    </el-col>
    <el-col :span="18">
      <div class="grid-content bg-fff pad10">
        <!-- <div class="kfScreenFull" style="width:100%;height:100%"> -->
        <div class="top-btn clearfix m_b10">
          <span>
            <el-input v-model="inputVal" placeholder="请输入内容" size="small" style="width:220px;" />
            <el-button type="primary" size="mini" :loading="syncLoading" @click="handleSync()">数据同步</el-button>
          </span>
          <el-button type="primary" plain size="mini" @click="addtian('添加')">添加</el-button>
          <span style="display:inline-block;">
            <el-upload
              class="upload-demo"
              action=""
              :headers="upload"
              :http-request="submitUpload"
              multiple
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="fileList"
            >
              <el-button size="mini" type="success" plain>导入</el-button>
            </el-upload>
          </span>
          <!-- <el-button size ="mini" type="danger" plain>导出</el-button> -->
          <el-button type="primary" size="mini" @click="handleDown()">下载模板</el-button>
        </div>
        <div class="table-main">
          <el-table
            :data="tableData"
            :row-key="getRowKeys"
            :expand-row-keys="expands"
            :header-cell-style="{'background-color': '#f6f6f6'}"
            style="width: 100%;"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <div style="width:60%;">
                  <el-button type="primary" size="mini" class="m_b10" @click="handleAddChild('添加',props.row.newTenants._id)">添加</el-button>
                  <el-table :data="props.row.contactlist" :header-cell-style="{'background-color': '#f0f7ff'}" border stripe>
                    <el-table-column
                      prop="phone"
                      width="150"
                      label="联系电话"
                    />
                    <el-table-column
                      prop="relationship"
                      width="120"
                      label="关系"
                    />
                    <el-table-column
                      prop="lastTime"
                      label="最后通讯时间"
                    />
                    <el-table-column
                      label="操作"
                      align="center"
                      width="120"
                    >
                      <template slot-scope="scopeC">
                        <el-button type="text" size="small" @click.native.prevent="handlePhoneEdit(scopeC.$index,scopeC.row)">编辑</el-button>
                        <el-button type="text" size="small" style="color:rgb(245, 108, 108);" @click.native.prevent="handlePhoneDelete(scopeC.$index,props.row.contactlist)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="项目"
              prop="newTenants.structure.name"
            />
            <el-table-column
              label="地址码"
              prop="newTenants.addressCode"
              width="120"
            />
            <el-table-column
              label="业主姓名"
              width="100"
              prop="newTenants.ownersName"
            />
            <el-table-column
              label="楼栋"
              prop="newTenants.building"
              width="80"
            />
            <el-table-column
              label="单元"
              prop="newTenants.unit"
              width="80"
            />
            <el-table-column
              label="门牌号"
              prop="newTenants.room"
              width="80"
            />
            <el-table-column
              label="详细地址"
              prop="newTenants.addressOne"
              width="200"
            />
            <el-table-column
              label="合计面积"
              prop="newTenants.chargeArea"
              width="80"
            />
            <el-table-column
              label="单价"
              prop="newTenants.unitPrice"
              width="100"
            />
            <el-table-column
              label="应收"
              prop="newTenants.receivable"
              width="100"
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="100"
            >
              <template slot-scope="scope">
                <el-button type="text" size="small" @click.native.prevent="editRow(scope.$index,scope.row)">修改</el-button>
                <el-button type="text" size="small" style="color:rgb(245, 108, 108);" @click.native.prevent="handleDelete(scope.$index,tableData)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="page" style="margin-top:10px;">
            <el-pagination
              background
              :current-page.sync="page.currentPage"
              :page-size="page.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next"
              :total="page.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
        <!-- </div> -->
      </div>
    </el-col>
    <!-- 联系电话表添加弹框 -->
    <villageChildDialog v-if="villageChildDialog.childShow" :structure-id="structureId" :new-tenants-id="newTenantsId" :title="villageChildDialog.title" :child-show="villageChildDialog.childShow" :dialog-child-row="villageChildDialog.dialogChildRow" @getVillageChildList="getVillageData" @childCloseDialog="closeDialog('子节点')" />
    <!-- 添加编辑弹框 -->
    <addOrEditDialog v-if="addVillageDialog.show" :structure-id="structureId" :is-show="addVillageDialog.show" :title="addVillageDialog.title" :dialog-row="addVillageDialog.dialogRow" @closeDialog="closeDialog('父节点')" @getVillageList="getVillageData" />
  </el-row>
</template>

<script>
import Qs from 'qs'
import addOrEditDialog from './component/villageAddDialog'
import villageChildDialog from './component/villageChildManage'
export default {
  name: 'VillageManage',
  components: {
    addOrEditDialog,
    villageChildDialog
  },
  data() {
    return {
      syncLoading: false,
      fileList: [],
      addVillageDialog: {
        show: false, // 弹框显示隐藏
        title: '添加',
        dialogRow: {}
      },
      villageChildDialog: {
        childShow: false,
        title: '添加',
        dialogChildRow: {}
      },
      tableData: [],
      inputVal: '', // 搜索关键字
      props2: {
        // 配置父子树的属性名
        label: 'name',
        isLeaf: 'isLeaf'
      },
      structureId: '', // 项目id
      newTenantsId: '', // 住户标识
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      getRowKeys(row) {
        return row.newTenants._id
      },
      // 要展开的行，数值的元素是row的key值
      expands: []
    }
  },
  computed: {
    upload() {
      return { token: this.$store.state.token }
    }
  },
  created: function() {
  },
  methods: {
    /**
     * 点击同步
     */
    handleSync() {
      this.syncLoading = true
      this.$http.post('/S-House/NewSynchronousHouseData', Qs.stringify({ guanDuan: this.inputVal })).then(res => {
        if (res.data.routeSuccess) {
          this.syncLoading = false
          this.$notify({
            title: '成功',
            message: '同步成功',
            type: 'success'
          })
        } else {
          this.$notify.error({
            title: res.data.msg,
            message: '失败'
          })
          this.syncLoading = false
        }
      })
    },
    /** 编辑 */
    editRow(index, rows) {
      this.addVillageDialog.dialogRow = { ...rows }
      this.addtian('编辑')
    },
    /** 添加 */
    addtian(type) {
      this.addVillageDialog.title = type
      this.addVillageDialog.show = true
    },
    /** 删除 */
    handleDelete(index, rows) {
      this.$confirm('此操作将彻底删除[' + rows[index].newTenants.addressCode + ']地址码, 继续吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('/S-House/delNewTenants', {
          params: {
            id: rows[index].newTenants._id
          }
        }).then(response => {
          if (response.data.success) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            })
            this.getVillageData(this.structureId)
          }
        })
      })
    },
    /**
     * 关闭弹框
     */
    closeDialog(type) {
      type === '父节点' ? this.addVillageDialog.show = false : this.villageChildDialog.childShow = false
    },
    /**
     * 添加联系电话表
     */
    handleAddChild(val, id) {
      this.newTenantsId = id
      this.villageChildDialog.title = val
      this.villageChildDialog.childShow = true
    },
    /**
     *联系电话表编辑
     */
    handlePhoneEdit(index, row) {
      this.villageChildDialog.dialogChildRow = { ...row }
      this.handleAddChild('编辑', this.newTenantsId)
    },
    /** 联系电话表删除 */
    handlePhoneDelete(index, rows) {
      this.$confirm('此操作将彻底删除[' + rows[index].phone + ']地址码, 继续吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('/S-House/delContactList', {
          params: {
            id: rows[index]._id
          }
        }).then(response => {
          if (response.data.success) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            })
            this.getVillageData(this.structureId)
          }
        })
      })
    },
    download(data, fileName) {
      if (!data) { return }
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
    },

    /**
     * 下载模板
     */
    handleDown() {
      this.$http({
        method: 'post',
        url: 'S-House/downHouse',
        responseType: 'blob'
      }).then(response => {
        this.download(response.data, '住户电话导入模版.xls')
      }).then(res => {
      })
    },

    /**
     * 导入
     */
    submitUpload(item) {
      const formData = new FormData()
      formData.append('excelFile', item.file)
      this.$http({
        method: 'post',
        url: 'S-House/getImportNewTenantsConList?excelFile',
        data: formData,
        responseType: 'blob'
      }).then(response => {
        this.download(response.data, '住户电话导入.xls')
      }).then(res => {
        this.$notify({
          title: '成功',
          message: '上传成功',
          type: 'success'
        })
      })
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    /**
     * 点击树节点
     */
    handleNodeClick(data, node, child) {
      if (data.structureTypeName === '项目') {
        this.structureId = data.id
        this.getVillageData(this.structureId)
      }
    },
    /** 查询表格数据 */
    getVillageData(structureId) {
      this.$http.post('/S-House/getNewTenantsByStructureId', Qs.stringify({ structureId: structureId, pageNo: this.page.currentPage, pageSize: this.page.pageSize }))
        .then(reponse => {
          const { listMaps, totalPage } = reponse.data.data
          this.tableData = listMaps
          this.page.total = totalPage
          if (this.newTenantsId !== '') {
            this.expands.push(this.newTenantsId)
          }
        }).catch(err => {
          console.log(err)
        })
    },

    handleSizeChange(val) {
      this.page.currentPage = 1
      this.page.pageSize = val
      this.getVillageData(this.structureId)
    },
    handleCurrentChange(val) {
      this.page.currentPage = val
      this.getVillageData(this.structureId)
    },
    /**
      懒加载tree结构数据
     */
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.getTreeData(0, resolve)
      } else {
        this.getTreeData(node.data.id, resolve)
      }
    },
    getTreeData(id, resolve) {
      this.$http.post('/S-Base/getStructureByParentID', Qs.stringify({ parentId: id })
      ).then(res => {
        if (res.data.success) {
          for (let i = 0; i < res.data.data.length; i++) {
            const flag = res.data.data[i].structureTypeName === '项目'
            this.$set(res.data.data[i], 'isLeaf', flag)
          }
          resolve(res.data.data)
        }
      }).catch(function(err) {
        console.log(err)
      })
    }
  }
}
</script>
<style scoped>
.top-btn {
  padding:10px 0px;
}
</style>
