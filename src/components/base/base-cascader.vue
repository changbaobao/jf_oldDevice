<template>
     <el-cascader
        :options="options"
        v-model="projectVal"
        size="small"
        clearable
        :show-all-levels="false"
        @change="handleCascaderChange"
        @active-item-change="handleItemChange"
        :props="{
              label: 'name',
              value: 'id',
              children: 'cities'
            }">
</el-cascader>
</template>
<script>
import Qs from 'qs'
export default {
  data () {
    return {
      projectVal: [],
      options: []
    }
  },
  created () {
    this.getNode()
  },
  methods: {
    getNode (val) {
      let idArea
      let sizeArea
      if (!val) {
        idArea = 0
        sizeArea = 0
      } else if (val.length === 1) {
        idArea = val[0]
        sizeArea = val.length
      } else if (val.length === 2) {
        idArea = val[1]
        sizeArea = val.length
      }
      this.$http.post('/S-Base/getStructureByParentID', Qs.stringify({parentId: idArea})).then(res => {
        if (res.data.success) {
          let data = res.data.data
          if (sizeArea === 0) {
            this.options = data.map((value, i) => {
              return {
                id: value.id,
                name: value.name,
                cities: []
              }
            })
          } else if (sizeArea === 1) {
            this.options.map((value, i) => {
              if (value.id === val[0]) {
                if (!value.cities.length) {
                  value.cities = data.map((value, i) => {
                    return {
                      id: value.id,
                      name: value.name,
                      cities: []
                    }
                  })
                }
              }
            })
          } else if (sizeArea === 2) {
            this.options.map((value, i) => {
              if (value.id === val[0]) {
                value.cities.map((value, i) => {
                  if (value.id === val[1]) {
                    if (!value.cities.length) {
                      value.cities = data.map((value, i) => {
                        return {
                          id: value.id,
                          name: value.name
                        }
                      })
                    }
                  }
                })
              }
            })
          }
        }
      })
    },
    handleItemChange (val) {
      this.getNode(val)
    },
    handleCascaderChange (val) {
      // console.log(getCascaderObj(this.projectVal, this.options))
      this.$emit('handleCascaderChange', val, val[val.length - 1])
    }
  }
}
</script>
<style>

</style>
