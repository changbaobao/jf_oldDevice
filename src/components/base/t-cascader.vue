<template>
     <el-cascader
        :options="options"
        v-model="projectVal"
        size="small"
        clearable
        placeholder="选择项目"
        filterable
        :props="props"
        :show-all-levels="false"
        @change="handleCascaderChange">
   </el-cascader>
</template>
<script>
export default {
  data () {
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
  created () {
    this.getNode()
  },
  methods: {
    getNode () {
      this.$http.post('/S-Base/getCompanyStructureByRoleTreeJson')
        .then(res => {
          if (res.data.success) {
            this.options = res.data.data
          }
        })
    },
    getCascaderObj (val, opt) {
      return val.map(function (value, index, array) {
        for (var itm of opt) {
          if (itm.id === value) { opt = itm.children; return itm }
        }
        return null
      })
    },
    handleCascaderChange (val) {
      let item = this.getCascaderObj(val, this.options)
      this.$emit('handleItemChange', val[val.length - 1], item[item.length - 1])
    }
  }
}
</script>
<style>

</style>
