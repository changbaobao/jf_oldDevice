<!--
 * @Author: your name
 * @Date: 2020-02-19 13:17:31
 * @LastEditTime: 2020-02-20 22:26:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-admin-template-master\src\components\base\sync-cascader.vue
 -->
<template>
  <el-cascader
    v-model="projectVal"
    :options="options"
    size="small"
    clearable
    placeholder="选择项目"
    :show-all-levels="false"
    :props="props"
    @change="handleCascaderChange"
  />
</template>
<script>
import Qs from 'qs'
import utils from '@/utils/creatTree'
export default {
  data() {
    return {
      projectVal: [],
      options: [],
      props: {
        label: 'name',
        value: 'id',
        children: 'children'
      }
    }
  },
  created() {
    this.getNode()
  },
  methods: {
    getNode() {
      this.$http.post('/S-Base/getCompanyStructureByRole', Qs.stringify({ type: 1 }))
        .then(res => {
          if (res.data.success) {
            const treeData = utils.creatTree(res.data.data)
            this.options = this.IterationDelateMenuChildren(treeData)
          }
        })
    },
    IterationDelateMenuChildren(arr) {
      if (arr.length) {
        for (const i in arr) {
          if (arr[i].children.length) {
            this.IterationDelateMenuChildren(arr[i].children)
          } else {
            delete arr[i].children
          }
        }
      }
      return arr
    },
    getCascaderObj(val, opt) {
      return val.map(function(value, index, array) {
        for (var itm of opt) {
          if (itm.id === value) { opt = itm.children; return itm }
        }
        return null
      })
    },
    handleCascaderChange(val) {
      const item = this.getCascaderObj(val, this.options)
      this.$emit('handleCascaderChange', val, item)
    }
  }
}
</script>
<style>

</style>
