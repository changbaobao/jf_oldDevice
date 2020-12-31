<template>
  <div>
    <el-form :size="size" inline :label-width="labelWidth" label-position="labelPosition">
      <el-form-item v-for="item in searchForm" :key="item.prop" :label="item.label">
        <!-- 级联选择器 -->
        <el-cascader
          ref="eCascader"
          v-if="item.type==='Cascader'"
          v-model="searchData[item.prop]"
          :options="item.cascaderOptions"
          :props="item.props"
          clearable
          :placeholder="item.placeholder"
          :style="{width:item.width+'px'}"
          @change="item.change(searchData[item.prop])"
        />
        <!-- 下拉框 -->
        <el-select
          v-if="item.type==='Select'"
          :multiple="item.multiple"
          v-model="searchData[item.prop]"
          :style="{width:item.width+'px'}"
          :placeholder="item.placeholder"
          :clearable="true"
          @change="item.change(searchData[item.prop])"
        >
          <el-option v-for="op in item.options" :key="op.id" :label="op.label" :value="op.value" />
        </el-select>
        <!-- 单选 -->
        <el-radio-group v-if="item.type==='Radio'" v-model="searchData[item.prop]">
          <el-radio v-for="ra in item.radios" :key="ra.value" :label="ra.value">{{ ra.label }}</el-radio>
        </el-radio-group>
        <!-- 单选按钮 -->
        <el-radio-group v-if="item.type==='RadioButton'" v-model="searchData[item.prop]" @change="item.change && item.change(searchData[item.prop])">
          <el-radio-button v-for="ra in item.radios" :key="ra.value" :label="ra.value">{{ ra.label }}</el-radio-button>
        </el-radio-group>
        <!-- 复选框 -->
        <el-checkbox-group v-if="item.type==='Checkbox'" v-model="searchData[item.prop]">
          <el-checkbox v-for="ch in item.checkboxs" :key="ch.value" :label="ch.value">{{ ch.label }}</el-checkbox>
        </el-checkbox-group>
        <!-- 日期 -->
        <el-date-picker
          v-if="item.type==='Date'"
          v-model="searchData[item.prop]"
          type="date"
          value-format="yyyy-MM-dd"
          :placeholder="item.placeholder"
          :style="{width:item.width+'px'}"
        />

        <!-- 日期范围 -->
        <el-date-picker
          v-if="item.type==='DateRange'"
          v-model="searchData[item.prop]"
          :style="{width:item.width+'px'}"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <!-- 时间 -->
        <el-time-select v-if="item.type==='Time'" v-model="searchData[item.prop]" type />
        <!-- 日期时间 -->
        <el-date-picker
          v-if="item.type==='DateTime'"
          v-model="searchData[item.prop]"
          type="datetime"
          :disabled="item.disable && item.disable(searchData[item.prop])"
        />
        <!-- 输入框 -->
        <el-input v-if="item.type==='Input'" v-model="searchData[item.prop]" :placeholder="item.placeholder" :style="{width:item.width+'px'}" />
        <!-- 开关 -->
        <el-switch v-if="item.type==='Switch'" v-model="searchData[item.prop]" />
      </el-form-item>
      <div v-if="isHandle" style="display: inline-block">
        <el-form-item v-for="item in searchHandle" :key="item.label">
          <el-button :disabled="item.disabled" :type="item.type" :size="item.size || size" :plain="item.plain" @click="item.handle()">{{ item.label }}</el-button>
        </el-form-item>
      </div>
      <slot />
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    isHandle: {
      type: Boolean,
      default: true
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    size: {
      type: String,
      default: 'small'
    },
    searchForm: {
      type: Array,
      default: () => []
    },
    searchHandle: {
      type: Array,
      default: () => []
    },
    searchData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  }
  // watch: {
  //   structure: {
  //     handler(newValue, oldValue) {
  //       if (this.$refs.eCascader) {
  //         console.error(this.$refs.eCascader, 12131)
  //         this.$refs.eCascader.toggleDropDownVisible()
  //       }
  //     }
  //   }
  // }
}
</script>
