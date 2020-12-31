<!--
 * @Author: your name
 * @Date: 2019-05-16 09:50:57
 * @LastEditTime: 2019-12-16 17:32:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MicroUI-use\src\components\base\t-select.vue
 -->
<template>
    <el-select clearable v-model="value" :placeholder="placeholder" @change="handleSelect" size="small" :style="{width:width +'px'}">
        <el-option
        v-for="item in data"
        :key="item.value"
        :label="item.label"
        :value="item.value">
        </el-option>
    </el-select>
</template>
<script>
export default {
  props: ['placeholder', 'data', 'width', 'selectVal'],
  data () {
    return {
      value: this.selectVal
    }
  },
  watch: {
    selectVal (val) {
      this.selectVal = val
    }
  },
  methods: {
    handleSelect (val) {
      this.$emit('handleSelect', val)
    }
  }
}
</script>
<style scoped>

</style>
