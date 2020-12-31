<template>
    <span>
        <el-date-picker
            style="width:220px;"
            size="small"
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="handleDate"
            >
        </el-date-picker>
    </span>
</template>
<script>
export default {
  data () {
    return {
      time: ''
    }
  },
  methods: {
    handleDate (val) {
      this.$emit('handleDateChange', val)
    }
  }
}
</script>
<style>

</style>
