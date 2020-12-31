<template>
     <el-cascader
        :options="options"
        v-model="projectVal"
        size="small"
        clearable
        :show-all-levels="false"
        :props="props"
        @change="handleCascaderChange">
</el-cascader>
</template>
<script>
import Qs from 'qs'
import util from '../../util/util'
export default {
  props: ['options'],
  data () {
    return {
      projectVal: [],
      props: {
        label: 'name',
        value: 'id',
        children: 'children'
      }
    }
  },
  watch: {
    projectVal (val) {
      console.log(val, 'hhahah')
      this.projectVal = val
    }
  },
  created () {
  },
  methods: {
    // getNode () {
    //   this.$http.post('/S-Base/getCompanyStructureByRole', Qs.stringify({type: 1}))
    //     .then(res => {
    //       if (res.data.success) {
    //         let treeData = util.creatTree(res.data.data)
    //         this.options = this.IterationDelateMenuChildren(treeData)
    //       }
    //     })
    // },
    // IterationDelateMenuChildren (arr) {
    //   if (arr.length) {
    //     for (let i in arr) {
    //       if (arr[i].children.length) {
    //         this.IterationDelateMenuChildren(arr[i].children)
    //       } else {
    //         delete arr[i].children
    //       }
    //     }
    //   }
    //   return arr
    // },
    getCascaderObj (val, opt) {
      return val.map(function (value, index, array) {
        for (var itm of opt) {
          if (itm.id === value) { opt = itm.children; return itm }
        }
        return null
      })
    },
    handleCascaderChange (val) {
      // let item = this.getCascaderObj(val, this.options)
      this.$emit('handleCascaderChange', val)
    }
  }
}
</script>
<style>

</style>
