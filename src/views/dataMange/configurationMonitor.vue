<template>
  <el-container class="container">
    <el-header style="height: 40px;padding-top: 5px;">
      <el-form :inline="true" class="demo-form-inline">
        <el-cascader
          ref="cascader"
          v-model="projectVal"
          style="width: 300px;"
          :options="options.projectList"
          size="small"
          clearable
          filterable
          :props="props"
          @change="handleProjectChange"
        />
        <!-- <el-cascader size="small" :options="options.projectList" @change="handleProjectChange" v-model="projectVal" :props="projectProps" placeholder="请选择项目" style="width: 350px;" change-on-select expand-trigger="hover"> </el-cascader> -->
        <el-select
          v-model="chartId"
          size="small"
          filterable
          placeholder="请选择项目下的图表"
          style="width: 200px;"
          clearable
          @change="changeChart"
          @clear="clearChart"
        >
          <el-option
            v-for="item in options.chartList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-tooltip
          class="item"
          effect="dark"
          content="返回"
          placement="bottom"
        >
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-back"
            @click="backtrackFn"
          />
        </el-tooltip>
        <el-tooltip
          v-show="DShow"
          class="item"
          effect="dark"
          content="3D插件"
          placement="bottom"
        >
          <el-button size="mini" type="primary" @click="goDown"
            >3D插件</el-button
          >
        </el-tooltip>
        <el-tooltip
          v-show="DShow"
          class="item"
          effect="dark"
          content="3D"
          placement="bottom"
        >
          <el-button size="mini" type="success" @click="go3D">3D</el-button>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="数据查询"
          placement="bottom"
        >
          <el-button size="mini" type="danger" @click="goSearch"
            >数据查询</el-button
          >
        </el-tooltip>
        <!-- <el-tooltip class="item" effect="dark" content="能耗" placement="bottom">
          <el-button size="mini" type="success" @click="goEnergy">能耗</el-button>
        </el-tooltip> -->
      </el-form>
      <!-- <el-dialog :title='"指令下发—"+form.title'  :visible.sync="dialogFormVisible">
          <el-form ref="form" :model="form" label-width="80px" >
            <el-form-item label="设定数值" v-if="form.dataType==='text'">
              <el-input v-model="form.value" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="设定数值" v-if="form.dataType==='list'">
              <el-select v-model="form.value" filterable placeholder="请选择">
                <el-option v-for="item in enumsOptions" :key="item.value" :label="item.name" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveSetDataFn">确 定</el-button>
          </div>
        </el-dialog> -->
    </el-header>
    <el-main id="myDiagramDiv" ref="container-Bg" style="margin-top: 10px;"
      >main</el-main
    >
  </el-container>
</template>
<script>
import gojsConfig from "../../components/configManage/gojsConfigMonitor";
import { getTreeDeepArr } from "@/utils/index";
import Qs from "qs";
export default {
  name: "ConfigurationMonitor",
  data() {
    return {
      historyPages: [],
      gridVisible: false,
      selectProjectItemInfo: null,
      addChartForm: {
        name: null,
        remark: null,
        backgroundColor: "#e9eef3",
        offlineColor: "#666666",
        alarmColor: "#ff0000"
      },
      selectListInfo: null,
      projectVal: [],
      selectProject: null,
      chartId: null,
      options: {
        projectList: [],
        chartList: []
      },
      props: {
        expandTrigger: "hover",
        checkStrictly: true,
        label: "name",
        value: "id",
        children: "children"
      },
      selectedProject2: null,
      optionsProject: [],
      form: {
        value: "",
        vname: "",
        nodeId: "",
        dataType: null
      },
      enumsOptions: [],
      DShow: false,
      threeDUrl: "",
      proId: ""
    };
  },
  watch: {
    $route(to, from) {
      // 监听路由是否变化
      if (to.params.structureId !== from.params.structureId) {
        this.proId = to.params.structureId;
        this.getNode();
      }
    },
    projectVal: {
      handler(newVal, oldVal) {
        if (this.$refs.cascader) {
          this.$refs.cascader.dropDownVisible = false;
        }
      }
    }
  },
  created() {
    this.projectVal = [];
    this.proId = this.$route.params.structureId;
    // this.proId = this.$route.query.projectId
    this.getNode(); // 项目
  },
  mounted() {
    gojsConfig.setVm(this);
    gojsConfig.GOJSInit("myDiagramDiv");
  },
  methods: {
    getNode() {
      this.$http.post("/S-Base/getCompanyStructureByRoleTreeJson").then(res => {
        if (res.data.success) {
          this.options.projectList = res.data.data;
          if (this.proId !== undefined) {
            this.projectVal = getTreeDeepArr(
              this.proId,
              this.options.projectList
            );
            this.getConfigurationByStructureId();
          }
        }
      });
    },
    getCascaderObj(val, opt) {
      return val.map(function(value, index, array) {
        for (var itm of opt) {
          if (itm.id === value) {
            opt = itm.children;
            return itm;
          }
        }
        return null;
      });
    },
    /**
     * 复制
     */
    handleCopy() {
      this.$http
        .post(
          "/S-Base/updateByConfiguration",
          Qs.stringify({ ConfigurationId: this.chartId })
        )
        .then(res => {
          if (res.data.success) {
            this.chartId = res.data.data.id;
            this.getConfigurationByStructureId();
            this.changeChart();
          }
        });
    },
    /**
     * 替换
     */
    handleReplace() {
      this.formInline = {};
      this.dialogReplaceVisible = true;
    },
    /**
     * 替换确定
     */
    handleReplaceSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.formInline.ConfigurationId = this.chartId;
          this.$http
            .post(
              "/S-Base/getByConfigurationRealData",
              Qs.stringify(this.formInline)
            )
            .then(res => {
              if (res.data.success) {
                gojsConfig.GOSJLoad(res.data.data.content, true);
                if (res.data.data.dataName.length !== 0) {
                  this.innerVisible = true;
                  this.noReplaceData = res.data.data.dataName;
                } else {
                  this.dialogReplaceVisible = false;
                }
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * 查询跳转
     */
    goSearch() {
      if (this.projectVal.length === 0) {
        this.$message({
          message: "项目不能为空",
          type: "error"
        });
      } else {
        const val = this.projectVal[this.projectVal.length - 1];
        this.$router.push({
          name: "saveHistoryManage",
          params: { structId: val }
        });
      }
    },
    /**
     * 能耗分析跳转
     */
    goEnergy() {
      if (this.projectVal.length === 0) {
        this.$message({
          message: "项目不能为空",
          type: "error"
        });
      } else {
        const val = this.projectVal[this.projectVal.length - 1];
        if (this.projectVal.length === 3) {
          this.parentId = this.projectVal[1];
          this.grandId = this.projectVal[0];
        } else {
          this.parentId = this.projectVal[0];
          this.grandId = undefined;
        }

        // sessionStorage.setItem('routeProName', JSON.stringify(this.proName))
        this.$router.push({
          name: "heatEnergyDisplay",
          params: {
            structId: val,
            parent: this.parentId,
            grandId: this.grandId
          }
        });
      }
    },
    /**
     * 3d跳转
     */
    go3D() {
      // window.open(`http:/${this.threeDUrl}`)
      window.open(this.threeDUrl);
    },
    goDown() {
      let url = "https://www.comelogin.com/unity/UnityWebPlayerFull.exe";
      window.open(url);
    },
    innerSubmit() {
      this.innerVisible = false;
      this.dialogReplaceVisible = false;
    },
    backtrackFn() {
      const vm = this;
      if (vm.historyPages.length === 0) {
        return false;
      }
      const historyObj = this.historyPages[this.historyPages.length - 1];
      vm.projectVal = historyObj.projectVal;
      vm.$http
        .post(
          "/S-Base/getConfigurationByStructureId",
          Qs.stringify({
            StructureId: historyObj.projectVal[historyObj.projectVal.length - 1]
          })
        )
        .then(res => {
          if (res.data.success) {
            vm.options.chartList = res.data.data.map(item => ({
              value: item.id,
              label: item.name
            }));
            vm.chartId = historyObj.chartId;
            vm.$http
              .post(
                "/S-Base/getConfigurationById",
                Qs.stringify({ id: historyObj.chartId })
              )
              .then(res => {
                if (res.data.success) {
                  vm.historyPages.pop();
                  let backgroundColor = res.data.data[0].backgroundColor;
                  backgroundColor = backgroundColor || "#e9eef3";
                  vm.$refs[
                    "container-Bg"
                  ].$el.style.backgroundColor = backgroundColor;

                  gojsConfig.GOSJLoad(res.data.data[0].content, true);
                  vm.addChartForm.backgroundColor =
                    res.data.data[0].backgroundColor;
                } else {
                  vm.$message.error(res.data.msg);
                }
              });
          } else {
            vm.$message.error(res.data.msg);
          }
        });
    },
    // 根据项目id 获取所有组态
    getConfigurationByStructureId() {
      const val = this.projectVal[this.projectVal.length - 1];
      this.$http
        .post(
          "/S-Base/getConfigurationByStructureId",
          Qs.stringify({ StructureId: val })
        )
        .then(res => {
          if (res.data.success) {
            this.options.chartList = res.data.data.map(item => ({
              value: item.id,
              label: item.name
            }));
            if (
              this.proId !== undefined &&
              this.options.chartList.length !== 0
            ) {
              this.chartId = this.options.chartList[0].value;
              this.changeChart();
            }
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    // 选择项目 改变时
    handleProjectChange(val, value) {
      this.proId = undefined;
      const item = this.getCascaderObj(val, this.options.projectList);
      if (item.length !== 0) {
        if (item[item.length - 1].threeDUrl) {
          this.threeDUrl = item[item.length - 1].threeDUrl;
          this.DShow = true;
        } else {
          this.DShow = false;
        }
      }
      // 通过项目id 获取所有组态
      this.getConfigurationByStructureId();
      this.chartId = "";
    },
    // 选择项目节点 改变时
    // handleProjectItemChange (val) {
    //   val = val[val.length - 1]
    //   this.$emit('handleItemChange', val)
    //   this.$http.post('/S-Base/getStructureByParentID', Qs.stringify({parentId: val})).then(res => {
    //     if (res.data.success) {
    //       let data = res.data.data
    //       this.getNode(val)
    //       let list = this.selectProjectItemInfo
    //       let arr = []
    //       data.forEach((item, index) => {
    //         this.$http.post('/S-Base/getStructureByParentID', Qs.stringify({parentId: item.id})).then(res => {
    //           if (res.data.data.length > 0) {
    //             item.children = []
    //           }
    //           arr.push(item)
    //         })
    //       })
    //       list.children = arr
    //       this.selectListInfo = list
    //     } else {
    //       this.$message.error(res.data.msg)
    //     }
    //   })
    // },
    // getNode (val) {
    //   for (let item of this.options.projectList) {
    //     if (item.id === val) {
    //       this.selectProjectItemInfo = item
    //     } else if (item.children) {
    //       this.getChildrenNode(item.children, val)
    //     }
    //   }
    // },
    // getChildrenNode (childrenItem, val) {
    //   for (let item of childrenItem) {
    //     if (item.id === val) {
    //       this.selectProjectItemInfo = item
    //     } else if (item.children) {
    //       this.getChildrenNode(item.children, val)
    //     }
    //   }
    // },
    clearChart() {
      gojsConfig.GOSJLoad({}, true);
    },
    changeChart() {
      if (!this.chartId) {
        return false;
      }
      const that = this;
      this.$http
        .post(
          "/S-Base/getConfigurationById",
          Qs.stringify({ id: this.chartId })
        )
        .then(res => {
          if (res.data.success) {
            that.addChartForm.offlineColor =
              res.data.data[0].offlineColor || "#666666"; // 在线颜色
            that.addChartForm.alarmColor =
              res.data.data[0].alarmColor || "#ff0000"; // 报警颜色
            gojsConfig.GOSJLoad(res.data.data[0].content, true);
            const color = res.data.data[0].backgroundColor
              ? res.data.data[0].backgroundColor
              : "#e9eef3";
            that.$refs["container-Bg"].$el.style.backgroundColor = color;
          } else {
            that.$message.error(res.data.msg);
          }
        });
    }
  }
};
</script>
<style scoped>
.container {
  height: calc(100vh - 150px);
}
.el-main /deep/ {
  padding: 0;
}
.el-select /deep/ {
  width: 100%;
}
.el-button + .el-button /deep/ {
  margin-left: 0px;
}
</style>
