<!--
 * @Author: your name
 * @Date: 2019-12-17 13:56:18
 * @LastEditTime : 2020-01-08 10:40:05
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MicroUI-use\src\components\searchSelect\index.vue
 -->
<template>
  <el-select
    v-model="value"
    filterable
    remote
    clearable
    reserve-keyword
    style="width:100%;"
    placeholder="请输入..."
    :remote-method="remoteMethod"
    :loading="loading"
    @change="handleChange"
  >
    <el-option v-for="(item , index ) in scopeData" :key="index" :label="item.dataName" :value="item._id" />
  </el-select>
</template>
<script>
import Qs from 'qs'
export default {
  props: {
    index: Number,
    selectVal: String,
    data: Array,
    name: String
  },
  data() {
    return {
      value: this.selectVal,
      loading: false,
      scopeData: this.data
    }
  },
  watch: {
    selectVal(val) {
      this.value = val
    },
    data(val) {
      this.remoteMethod(this.selectVal)
      this.scopeData = val
    }
  },
  mounted() {},
  methods: {
    /**
     * 远程搜索查询数据点
     */
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.$http
            .post('/S-RealData/getRealByDataNameAndSid', Qs.stringify({ dataName: query }))
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
    handleChange(val) {
      this.value = val
      this.$emit('handleChange', val, this.name)
    }
  }
}
</script>
