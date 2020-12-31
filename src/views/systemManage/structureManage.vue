<template>
  <el-row :gutter="20">
    <el-col :span="7">
      <div class="grid-content bg-fff" style="height:calc(100vh - 120px);overflow-y:auto;padding:10px;">
        <div class="top-btn m_b10" style="display:flex;justify-content: space-around;">
          <el-button type="primary" @click="changemodule('添加架构')">添加架构</el-button>
          <el-button type="primary" @click="changemodule('编辑架构')">编辑架构</el-button>
          <el-button type="primary" @click="dialogVisible3 = true">删除架构</el-button>
        </div>
        <el-tree
          ref="treekf"
          :props="props2"
          :load="loadNode"
          node-key="id"
          :append="add"
          :highlight-current="true"
          :remove="delnode"
          :render-content="renderContent"
          :expand-on-click-node="false"
          lazy
          @node-click="handleNodeClick"
        />
        <el-dialog
          title="提示"
          :close-on-click-modal="notClose"
          close-on-click-modal:false
          :visible.sync="dialogVisible3"
          width="30%"
        >
          <span>是否删除{{ formInline.name }}</span>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogVisible3 = false">取 消</el-button>
            <el-button type="primary" size="small" @click="delModule()">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          :close-on-click-modal="notClose"
          :title="titleName"
          :visible.sync="dialogVisible"
          width="50%"
        >
          <div>
            <el-form ref="lonAndlat" :model="formInline" class="demo-form-inline" size="small" label-width="100px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="名称">
                    <el-input v-model="formInline.name" placeholder="必填" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="别名1">
                    <el-input v-model="formInline.byname1" placeholder="别名1" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="别名2">
                    <el-input v-model="formInline.byname2" placeholder="别名1" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="别名3">
                    <el-input v-model="formInline.byname3" placeholder="别名1" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="排序">
                    <el-input v-model="formInline.sort" placeholder=" 请输入数字" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="类型">
                    <el-select v-model="formInline.structureTypeName" placeholder="请选择" style="width:100%;">
                      <el-option v-for="( t, index ) in selectType" :key="index" :label="t.name" :value="t.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="经纬度"
                    prop="lon"
                  >
                    <el-input v-model="formInline.lonLat" placeholder="非必填，例如：116.564800,39.154873" auto-complete="off" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="3D地址"
                    prop="threeDUrl"
                  >
                    <el-input v-model="formInline.threeDUrl" placeholder="请输入3D地址" auto-complete="off" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="NC组织机构"
                    prop="ncOrg"
                  >
                    <el-input v-model="formInline.ncOrg" placeholder="请填写组织机构" auto-complete="off" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="NC项目"
                    prop="ncProject"
                  >
                    <el-input v-model="formInline.ncProject" placeholder="请填写NC项目" auto-complete="off" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="NC项目仓库"
                    prop="ncWarehouse"
                  >
                    <el-input v-model="formInline.ncWarehouse" placeholder="请填写项目仓库" auto-complete="off" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="货位"
                    prop="ncStorageroom"
                  >
                    <el-input v-model="formInline.ncStorageroom" placeholder="请填写货位" auto-complete="off" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="地图级数"
                    prop="gdZoomlevel"
                  >
                    <el-input v-model="formInline.gdZoomlevel" placeholder="请填写...." auto-complete="off" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="备注"
                    prop="remark"
                  >
                    <el-input v-model="formInline.remark" type="textarea" placeholder="请填写备注" auto-complete="off" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align:center;">
              <el-button type="primary" size="small" @click="sunbmitStructure()">确 定</el-button>
              <el-button size="small" @click="closeStructure()">取 消</el-button>
            </div>
          </div>
        </el-dialog>
      </div>
    </el-col>
    <el-col :span="17">
      <div class="grid-content bg-fff pad10">
        <el-button type="success" class="m_b10" icon="el-icon-circle-plus-outline" @click="changeVillage('添加小区')">新增小区</el-button>
        <el-dialog
          :close-on-click-modal="notClose"
          :title="villagetitle"
          :visible.sync="dialogVisiblea"
          width="30%"
        >
          <el-form ref="village" label-width="80px" class="demo-formInline">
            <el-form-item label="名称" prop="name">
              <el-input v-model="village.name" />
            </el-form-item>
            <el-form-item label="锅炉房">
              <el-select v-model="village.boilerRoomId" placeholder="请选择" style="width:100%;">
                <el-option
                  v-for="item in boilerRoomData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="village.remark" type="textarea" />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogVisiblea = false">取 消</el-button>
            <el-button type="primary" size="small" @click="submitVillage()">确 定</el-button>
          </span>
        </el-dialog>
        <div class="kfScreenFull" style="width:100%;height:100%">
          <el-table
            ref="multipleTable"
            :data="tableData3"
            :header-cell-style="{'background-color': '#fafafa'}"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column
              prop="name"
              label="名称"
              width="120"
            />
            <el-table-column
              prop="remark"
              label="描述"
              show-overflow-tooltip
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="150"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="handleEdit('编辑小区', scope.row)"
                >编辑</el-button>
                <el-button
                  class="del"
                  style="color:red;"
                  type="text"
                  size="mini"
                  @click.native.prevent="deleteRow(scope.$index,tableData3)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import Qs from 'qs'
export default {
  name: 'StructureManage',
  data() {
    return {
      notClose: false,
      selectnode: {},
      titleName: '',
      boilerRoomData: [], // 锅炉房
      formInline: {
        id: '',
        name: '',
        byname1: '',
        byname2: '',
        byname3: '',
        sort: '',
        structureTypeName: '',
        parentId: '',
        parentName: '无父级',
        user: '',
        region: '',
        lat: '',
        lon: '',
        lonLat: '',
        threeDUrl: '', // 3d地址
        ncOrg: '北京金房暖通节能技术股份有限公司', // 组织机构
        ncProject: '', // Nc项目
        ncWarehouse: '项目库', // 项目仓库
        ncStorageroom: '', // 货位
        remark: '', // 备注
        gdZoomlevel: ''// 地图缩放级数
      },
      selectType: [{ name: '子公司', id: '子公司' }, { name: '分组', id: '分组' }, { name: '项目', id: '项目' }],
      modules: [],
      props2: {
        // 配置父子树的属性名
        label: 'name',
        isLeaf: 'isLeaf'
        // children: 'structureTypeName'
      },
      tableData3: [],
      village: {
        structureId: '',
        boilerRoomId: '',
        name: '',
        remark: ''
      },
      dialogVisiblea: false,
      dialogVisible: false,
      dialogVisible3: false,
      multipleSelection: [],
      modulechangetype: '',
      villagetitle: '',
      selectRow: '',
      addnodeData: {},
      clickId: '',
      node: {},
      resolve: '',
      isFirst: true
    }
  },
  computed: {
    dianame() {
      return this.$store.state.dialogname.toString()
    },
    tableData() {
      return this.tableData3
    }
  },
  created: function() {
  },
  methods: {
    getBoilerRoom(id) {
      this.$http.post('/S-Base/selectByBoilerRoom', Qs.stringify({ structureId: id })).then(res => {
        if (res.data.success) {
          const data = res.data.data
          const arr = []
          for (const i in data) {
            const obj = { label: data[i].name, value: data[i].id }
            arr.push(obj)
          }
          this.boilerRoomData = arr
        }
      })
    },
    closeStructure() {
      this.dialogVisible = false
      this.$refs.lonAndlat.resetFields()
    },
    add() {
      this.$refs.treekf.append(this.addnodeData, this.selectnode)
    },
    deleteRow(index, rows) {
      this.$http.post('/S-Base/deleteCommunity', Qs.stringify({ id: rows[index].id })).then(res => {
        if (res.data.success) {
          rows.splice(index, 1)
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success' })
        } else {
          this.$notify.error({
            title: '错误',
            message: res.data.msg
          })
        }
      })
    },
    changeVillage(type) {
      if (typeof (this.selectnode.data) === 'undefined') {
        this.$notify.error({
          title: '错误',
          message: '请选择一个项目节点！'
        })
        return
      }
      if (this.selectnode.data.structureTypeName !== '项目') {
        this.$notify.error({
          title: '错误',
          message: '请选择一个项目节点！'
        })
        return
      }
      this.village.name = ''
      this.village.remark = ''
      this.village.boilerRoomId = ''
      this.dialogVisiblea = true
      this.villagetitle = type
    },
    handleEdit(type, row) {
      this.dialogVisiblea = true
      this.selectRow = row
      this.village.name = row.name
      this.village.remark = row.remark
      this.village.boilerRoomId = row.boilerRoomId
      this.villagetitle = type
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          <span>{node.data.name}</span>
        </span>)
    },
    submitVillage() {
      const village = {}
      village.structureId = this.village.structureId
      village.name = this.village.name
      village.boilerRoomId = this.village.boilerRoomId
      village.remark = this.village.remark
      let url = ''
      if (this.villagetitle === '添加小区') {
        url = '/S-Base/addCommunity'
      } else {
        village.id = this.selectRow.id
        url = '/S-Base/updateCommunity'
      }
      this.$http.post(url, Qs.stringify(village)).then(res => {
        if (res.data.success) {
          if (this.villagetitle === '添加小区') {
            this.tableData3.push(res.data.data)
          } else {
            this.selectRow.name = this.village.name
            this.selectRow.boilerRoomId = this.village.boilerRoomId
            this.selectRow.remark = this.village.remark
          }
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: res.data.msg
          })
        }
      }).catch(function(err) {
        console.log(err)
      })
      this.dialogVisiblea = false
    },
    delnode() {
      this.$refs.treekf.remove(this.selectnode)
    },
    changemodule(type) {
      if (typeof (this.selectnode.data) === 'undefined') {
        if (type === '编辑架构') {
          this.$notify.error({
            title: '错误',
            message: '请选择一个节点！'
          })
          return
        }
      }
      this.dialogVisible = true
      this.modulechangetype = type
      this.titleName = type
      if (type === '编辑架构') {
        this.getEditorData()
      }
      if (type === '添加架构') {
        this.formInline = {
          name: '',
          byname1: '',
          byname2: '',
          byname3: '',
          sort: '',
          structureTypeName: '',
          user: '',
          region: '',
          lat: '',
          lon: '',
          lonLat: '',
          threeDUrl: '', // 3d地址
          ncOrg: '北京金房暖通节能技术股份有限公司', // 组织机构
          ncProject: '', // Nc项目
          ncWarehouse: '项目库', // 项目仓库
          ncStorageroom: '', // 货位
          remark: '', // 备注
          gdZoomlevel: ''// 地图缩放级数
        }
      }
    },
    test(view) {
      this.formInline.viewtype = view.id
    },
    test2(modeltype) {
      this.formInline.moduletype = modeltype.id
    },
    handleNodeClick(data, node, child) {
      this.clickId = data.id
      this.getEditorData()
      this.getBoilerRoom(data.id)
      this.selectnode = node
      if (data.structureTypeName === '项目') {
        this.village.structureId = data.id
        this.$http.post('/S-Base/getCommunityByStructureId', Qs.stringify({ structureId: data.id })).then(res => {
          this.tableData3 = res.data.data
        })
      } else {
        this.tableData3 = []
      }
    },
    /**
     * 编辑查询
     */
    getEditorData() {
      const id = this.clickId
      this.$http.post(`S-Base/getCompanyStructureById?id=${id}`, Qs.stringify(id)).then(res => {
        if (res.data.success) {
          this.formInline.name = res.data.data.name
          this.formInline.byname1 = res.data.data.beforeNameOne
          this.formInline.byname2 = res.data.data.beforeNameTwo
          this.formInline.byname3 = res.data.data.beforeNameThree
          this.formInline.sort = res.data.data.orderBy
          this.formInline.structureTypeName = res.data.data.structureTypeName
          this.formInline.ncOrg = res.data.data.ncOrg
          this.formInline.ncWarehouse = res.data.data.ncWarehouse
          this.formInline.ncStorageroom = res.data.data.ncStorageroom
          this.formInline.ncProject = res.data.data.ncProject
          this.formInline.lon = res.data.data.lon
          this.formInline.lat = res.data.data.lat
          this.formInline.threeDUrl = res.data.data.threeDUrl
          this.formInline.gdZoomlevel = res.data.data.gdZoomlevel
          this.formInline.remark = res.data.data.remark
          if (res.data.data.lon !== null) {
            this.formInline.lonLat = res.data.data.lon + ',' + res.data.data.lat
          }
        }
      }).catch(function(err) {
        console.log(err)
      })
    },
    /**
     * 点击确定
     */
    sunbmitStructure() {
      if (typeof (this.selectnode.data) === 'undefined') {
        const structure = {}
        structure.name = this.formInline.name
        structure.beforeNameOne = this.formInline.byname1
        structure.beforeNameTwo = this.formInline.byname2
        structure.beforeNameThree = this.formInline.byname3
        structure.orderBy = this.formInline.sort
        structure.structureTypeName = this.formInline.structureTypeName
        structure.shortName = ''
        structure.parentId = 0
        var result = this.formInline.lonLat.split(',')
        structure.lat = result[1]
        structure.lon = result[0]
        structure.ncOrg = this.formInline.ncOrg
        structure.ncWarehouse = this.formInline.ncWarehouse
        structure.ncStorageroom = this.formInline.ncStorageroom
        structure.ncProject = this.formInline.ncProject
        structure.threeDUrl = this.formInline.threeDUrl
        structure.gdZoomlevel = this.formInline.gdZoomlevel
        structure.remark = this.formInline.remark
        let url = ''
        if (this.modulechangetype === '添加架构') {
          url = '/S-Base/addCompanyStructure'
        }
        this.$http.post(url, Qs.stringify(structure)).then(res => {
          if (res.data.success) {
            this.addnodeData = res.data.data
            this.add()
            this.node.childNodes = []
            this.loadNode(this.node, this.resolve)
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success'
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: res.data.msg
            })
          }
        }).catch(function(err) {
          console.log(err)
        })
      } else {
        if (this.modulechangetype === '添加架构' && this.selectnode.data.structureTypeName === '项目') {
          this.$notify.error({
            title: '错误',
            message: '不能在类型【项目】下添加'
          })
        }
        const structure = {}
        structure.name = this.formInline.name
        structure.beforeNameOne = this.formInline.byname1
        structure.beforeNameTwo = this.formInline.byname2
        structure.beforeNameThree = this.formInline.byname3
        structure.orderBy = this.formInline.sort
        structure.structureTypeName = this.formInline.structureTypeName
        var result1 = this.formInline.lonLat.split(',')
        structure.lat = result1[1]
        structure.shortName = 22
        structure.lon = result1[0]
        structure.ncOrg = this.formInline.ncOrg
        structure.ncProject = this.formInline.ncProject
        structure.ncWarehouse = this.formInline.ncWarehouse
        structure.ncStorageroom = this.formInline.ncStorageroom
        structure.threeDUrl = this.formInline.threeDUrl
        structure.gdZoomlevel = this.formInline.gdZoomlevel
        structure.remark = this.formInline.remark
        let url = ''
        if (this.modulechangetype === '添加架构') {
          url = '/S-Base/addCompanyStructure'
          if (this.selectnode === '') { structure.parentId = 0 } else { structure.parentId = this.selectnode.data.id }
        } else { // 编辑架构
          url = '/S-Base/updateCompanyStructure'
          structure.id = this.selectnode.data.id
        }
        this.$http.post(url, Qs.stringify(structure)).then(res => {
          if (res.data.success) {
            this.addnodeData = res.data.data
            if (this.modulechangetype === '添加架构') {
              this.add()
            }
            if (this.modulechangetype === '编辑架构') {
              this.selectnode.data.name = res.data.data.name
              this.getEditorData()
            }
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success'
            })
            this.node.childNodes = []
            this.loadNode(this.node, this.resolve)
          } else {
            this.$notify.error({
              title: '错误',
              message: res.data.msg
            })
          }
        }).catch(function(err) {
          console.log(err)
        })
      }
      this.addnodeData = {}
      this.formInline.byname1 = ''
      this.formInline.byname2 = ''
      this.formInline.byname3 = ''
      this.formInline.sort = ''
      this.formInline.name = ''
      this.formInline.structureTypeName = ''
      this.formInline.lat = ''
      this.formInline.lon = ''
      this.formInline.lonLat = ''
      this.formInline.ncStorageroom = ''
      this.formInline.threeDUrl = ''
      this.formInline.gdZoomlevel = ''
      this.formInline.ncProject = ''
      this.formInline.remark = ''
      this.dialogVisible = false
    },
    delModule() {
      if (this.selectnode.childNodes.length !== 0) {
        this.$notify.error({
          title: '错误',
          message: '请先删除子节点' })
      } else {
        this.$http.post('/S-Base/deleteCompanyStructure', Qs.stringify({ id: this.selectnode.data.id })).then(res => {
          if (res.data.success) {
            this.delnode()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: res.data.msg
            })
          }
        }).catch(function(err) {
          console.log(err)
        })
      }
      this.dialogVisible3 = false
    },
    structureTypeName(data, node) {
      if (data.structureTypeName === 0) {
        node.isLeaf(true, node)
      } else {
        node.isLeaf(false, node)
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    // handleSelectionChange (val) {
    //   this.multipleSelection = val
    // },
    changedialogVisible(name) {
      this.$store.commit('changedialog')
      this.$store.commit('changediaName', name)
    },
    handleClose3(done) {
      done()
    },
    loadNode(node, resolve) {
      if (this.isFirst) {
        this.node = node
        this.resolve = resolve
        this.isFirst = false
      }
      if (node.level === 0) {
        this.getTreeData(0, resolve)
      } else {
        this.getTreeData(node.data.id, resolve)
      }
    },
    getTreeData(id, resolve) {
      this.$http.post('/S-Base/getStructureByParentID', Qs.stringify({ parentId: id })).then(res => {
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
.wrap {
  min-height:810px;
  height: 100%;
  display: flex;
  padding: 5px 0;
  background-color: #e9eef3;;
  justify-content: space-around;
}
.el-button-group {
  margin: 20px 8px
}

</style>
