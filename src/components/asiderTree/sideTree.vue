<template>
         <div class="sideTree">
            <el-tree
            class="tree-node"
            ref="asideTree"
            :props="props"
            :load="loadNode"
             node-key="id"
            :highlight-current='true'
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
            :render-content="renderContent"
            lazy>
            </el-tree>
        </div>
</template>
<script>
import Qs from 'qs'
export default {
  props: {

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
        this.getTreeData(0, resolve)
      } else {
        this.getTreeData(node.data.id, resolve)
      }
    },
    getTreeData (id, resolve) {
      this.$http.post('/S-Base/getStructureByParentID', Qs.stringify({parentId: id})
      ).then(res => {
        if (res.data.success) {
          for (let i = 0; i < res.data.data.length; i++) {
            let flag = res.data.data[i].structureTypeName === '项目'
            this.$set(res.data.data[i], 'isLeaf', flag)
          }
          resolve(res.data.data)
        }
      })
        .catch(function (err) {
          console.log(err)
        })
    },
    /**
        点击当前节点
         */
    handleNodeClick (data, node, child) {
      this.selectnode = node
      this.$emit('handleClickData', data, node, child)
    },
    /**
     * 内容区渲染函数
     */
    renderContent (h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.data.name}</span>
        </span>)
    }
  }
}
</script>
<style scoped>
.tree-node {
  background:none;
  color:#97E3FF;
  font-size:16px;
}

</style>
