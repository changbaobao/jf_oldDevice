<template>
  <div style="width:100%;height:100%;">
    <!-- <el-button
      type="primary"
      size="mini"
      @click="ExportSavePdf('供暖报告', '2020')"
    >下载</el-button> -->
    <div id="pdfCentent">
      <h1>{{ reportTitle }}供暖报告</h1>
      <p>
        经气象预报查询，室外平均温度在{{ formalTime }}至{{ forecastTime }}
        </br>
        连续{{ dayNum }}天<span v-if="reportTitle=='提前'" style="font-size:28px;">低于</span><span v-else style="font-size:28px;">高于</span>5℃，{{ reportTitle }}供暖时间的概率为{{ value }}%。
        </br>
        预测{{reportTitle}}供暖需增加能耗{{standardCoal}}吨标准煤，增加支出{{expenditure}}万元
      </p>

    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      forecastTime: '',
      formalTime: '',
      value: null,
      reportTitle: '延长',
      dayNum:0,
      standardCoal:0,
      expenditure:0
    }
  },
  computed: {},
  mounted() {
    this.forecastTime = this.$route.query.forecastTime
    this.formalTime = this.$route.query.formalTime
    const year = this.forecastTime.substring(0,4)
    let dates = `${year}-03-31`;
    let dates2 = `${year}-12-01`;
    if (this.formalTime > dates && this.formalTime < dates2) {
      this.reportTitle = '提前'
      this.forecastTime = this.$route.query.formalTime
      this.formalTime = this.$route.query.forecastTime
    } else {
      this.reportTitle = '延长'
      this.forecastTime = this.$route.query.forecastTime
      this.formalTime = this.$route.query.formalTime
    }
    this.getHeating()
  },
  methods: {
    getHeating(){
      this.$http
        .post("S-Energy-Task/getAdvanceOrExtendProbability")
        .then(res => {
          if (res.data.success) {
            const { value ,days,standardCoal,expenditure} = res.data.data;
            if (value.indexOf('供暖') != -1) {
              this.value = 0
            }else {
              this.value=value
            }
            this.dayNum=days
            this.standardCoal=standardCoal
            this.expenditure=expenditure
          }
        });
    }
  },
}
</script>
<style lang="scss">
#pdfCentent {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 35px);
  h1 {
    font-size: 42px;
    color: red;
  }
  p {
    font-size: 28px;
    margin-top: 80px;
    line-height: 60px;
  }
}
</style>
