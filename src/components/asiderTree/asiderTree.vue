<template>
       <el-col :span="7">
         <div class="grid-content bg-fff">
            <div class="btn-group" v-show="btnIsShow">
                <el-button size="mini" type="primary" v-for="(item,index) in btnText" @click="handelBtnClick(index,item)" :key="index">{{item}}</el-button>
            </div>
            <el-tree
            ref="asideTree"
            :props="props"
            :load="loadNode"
             node-key="id"
            :highlight-current='true'
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
            :append="add"
            :remove='delnode'
            :render-content="renderContent"
            lazy>
            </el-tree>
         </div>
       </el-col>
</template>
<script>
import Qs from 'qs'
export default {
  props: {
    btnIsShow: false, // 控制按钮显示隐藏
    btnText: {
      type: Array
    }
  },
  data () {
    return {
      props: {
        // 配置父子树的属性名
        label: 'name',
        isLeaf: 'isLeaf'
      },
      selectnode: {}
    }
  },
  methods: {
    /**
    懒加载tree结构数据
    */
    loadNode (node, resolve) {
      if (node.level === 0) {
        this.$http.post('/S-Base/getStructureByParentID', Qs.stringify({parentId: 0})
        )
          .then(function (res) {
            if (res.data.success) {
              let items = res.data.data
              let arr = []
              for (let i = 0; i < items.length; i++) {
                let item = items[i]
                item.isLeaf = item.structureTypeName === '项目'
                arr.push(item)
              }
              resolve(arr)
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      } else {
        this.$http.post('/S-Base/getStructureByParentID', Qs.stringify({parentId: node.data.id}))
          .then(function (res) {
            if (res.data.success) {
              let items = res.data.data
              let arr = []
              for (let i = 0; i < items.length; i++) {
                let item = items[i]
                item.isLeaf = item.structureTypeName === '项目'
                arr.push(item)
              }
              resolve(arr)
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      }
    },
    /**
        点击当前节点
         */
    handleNodeClick (data, node, child) {
      this.selectnode = node
      this.$emit('handleClickData', data, node, child)
    },
    /**
     * 不同的按钮添加点击事件
     * index为索引，item为按钮值
     */
    handelBtnClick (index, item) {
      this.$emit('handelBtnClick', index, item)
    },
    /**
     * 内容区渲染函数
     */
    renderContent (h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.data.name}</span>
        </span>)
    },
    add () {
      this.$emit('add', this.selectnode)
      // this.$refs.asideTree.append(this.addnodeData, this.selectnode)
    },
    delnode () {

    }
  }
}
</script>
<style scoped>
.btn-group {
    margin-bottom:10px;
}

</style>
