export default {
  data() {
    return {
      screenHeight: document.body.clientHeight, // 这里是给到了一个默认值 （这个很重要）
      tableHeight: null, // 表格高度
      speceHeight: 152
    }
  },

  watch: {

    // 监听屏幕高度改变表格高度
    screenHeight(val) {
      // 初始化表格高度
      this.tableHeight = val - (this.$refs.header.offsetHeight + this.speceHeight) + 'px'
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler)
  },
  deactivated() {
    window.removeEventListener('resize', this.resizeHandler)
  },
  mounted() {
    // 监听屏幕高度
    let heigh = this.spcTableH
    heigh !== undefined ? this.speceHeight = heigh : this.speceHeight = 152

    this.tableHeight = this.screenHeight - (this.$refs.header.offsetHeight + this.speceHeight) + 'px'

    window.addEventListener('resize', this.resizeHandler)
  },
  methods: {
    resizeHandler() {
      window.screenHeight = document.body.clientHeight
      this.screenHeight = window.screenHeight
    }
  }

}
