<template>
    <span class="fr">
     <el-input
          :placeholder=placeholder
          size="small"
          v-model="keywords" :style="{ width: width + 'px' }">
      </el-input>
      <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
    </span>
</template>
<script>
export default {
  props: ['placeholder', 'width'],
  data () {
    return {
      keywords: ''
    }
  },
  methods: {
    /**
       * 模糊搜索
       */
    handleSearch () {
      this.$emit('handleSearch', this.keywords)
    }
  }
}
</script>
<style>

</style>
