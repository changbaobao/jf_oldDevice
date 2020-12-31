<template>
     <el-radio-group v-model="radio" @change="changeRadio">
        <el-radio :label="item" v-for="( item , index ) in radioArr" :key="index"></el-radio>
    </el-radio-group>
</template>
<script>
export default {
  props: ['radioArr'],
  data () {
    return {
      radio: '水表'
    }
  },
  mounted () {

  },
  methods: {
    changeRadio (val) {
      this.$emit('changeRadio', val)
    }
  }
}
</script>
<style>

</style>
