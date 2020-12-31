<template>
  <div class="waterBalance">
    <div ref="header">
      <searchForm
        :search-data="formInline"
        :search-form="searchForm"
        :search-handle="searchHandle"
      >
        <slot>
          <el-form-item>
            <el-select
              v-model="controlModel"
              placeholder="修改控制模型"
              size="small"
              :disabled="selectedList.length==0"
              style="width:150px;"
            >
              <el-option
                v-for="item in controlModelOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </slot>
      </searchForm>
    </div>
    <div class="table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        stripe
        :header-cell-style="{'background-color': '#fafafa'}"
        style="width:100%;"
        :max-height="this.tableHeight"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="50"
        ></el-table-column>
        <el-table-column
          label="供热系统"
          prop="systemName"
        >
        </el-table-column>
        <el-table-column
          prop="structureName"
          label="换热站"
        ></el-table-column>
        <el-table-column
          prop="oneSupplyTem.value"
          label="一次供温（℃）"
          sortable
        ></el-table-column>
        <el-table-column
          prop="oneBackTem.value"
          label="一次回温（℃）"
          sortable
        ></el-table-column>
        <el-table-column
          prop="twoSupplyTem.value"
          label="二次供温（℃）"
          sortable
        ></el-table-column>
        <el-table-column
          prop="twoBackTem.value"
          label="二次回温（℃）"
          sortable
        ></el-table-column>
        <el-table-column
          label="一次回温目标温度（℃）"
          prop="targetTem.value"
        ></el-table-column>
      </el-table>
    </div>
    <!-- 下发弹框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      @close="dialogVisible=false"
    >
      <el-form
        :inline="true"
        ref="xiaFaForm"
        :model="xiaFaForm"
        class="demo-form-inline"
        size="small"
      >
        <el-form-item
          label="选中供暖位置的目标温度修改为:"
          prop="value"
          :rules="{required: true, message: '值不能为空', trigger: 'blur'}"
        >
          <el-input
            v-model.number="xiaFaForm.value"
            placeholder="值"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit('xiaFaForm')"
          >确定</el-button>
        </el-form-item>
      </el-form>
      <div
        class="tipLoad"
        v-if="loading"
      >{{loadingText}}</div>
    </el-dialog>
  </div>
</template>
<script>
import searchForm from "@/components/searchForm";
import Qs from "qs";
import { averageValue } from "@/utils/index";
import publicMinxin from "@/utils/tableHeight.mixin";
export default {
  mixins: [publicMinxin],
  name: "waterBalance",
  components: { searchForm },
  data() {
    return {
      formInline: {
        parentId: "",
        structureId: ""
      },
      controlModel: "",
      controlModelOptions: [], // 控制模型
      searchForm: [
        {
          type: "Select",
          options: [
            { label: "鹤煤电厂", value: "b495de8042b641ab96232680e162e74c" },
            { label: "鹤淇电厂", value: "314b4afddf924cd8ab0bb03227d3a20e" },
            { label: "同力电厂", value: "3cd3543f738e4a5c904c34ac48f3cc30" }
          ],
          prop: "parentId",
          placeholder: "选择",
          change: row => {
            this.formInline.parentId = row;
            this.getSystemData();
          }
        },
        {
          type: "Select",
          prop: "structureId",
          options: [],
          placeholder: "请选择",
          change: row => {}
        }
      ],
      searchHandle: [
        {
          label: "搜索",
          type: "primary",
          handle: () => {
            this.handleSearch();
          }
        },
        {
          label: "一键平衡",
          type: "primary",
          disabled: true,
          plain: true,
          handle: () => {
            this.handleOneBalance();
          }
        }
      ],
      tableData: [],
      selectedList: [], // 选中的
      xiaFaForm: { value: 0 },
      dialogVisible: false,
      loading: false
    };
  },
  created() {},
  methods: {
    /** 根据项目查询名称 */
    getSystemData() {
      const { parentId } = this.formInline;
      this.$http
        .post(
          "/S-Base/getStructureByParentID",
          Qs.stringify({
            parentId: parentId
          })
        )
        .then(res => {
          if (res.data.success) {
            let data = res.data.data;
            let arr = data.map(item => {
              return { label: item.name, value: item.id };
            });
            this.searchForm[1].options = arr;
          }
        });
    },
    /** 获取勾选的数据 */
    handleSelectionChange(val) {
      this.selectedList = val;
      let isStop = this.selectedList.some(
        item => item.controlModel.value === 1
      );
      if (val.length !== 0) {
        if (isStop == true) {
          this.searchHandle[1].disabled = true;
        } else {
          this.searchHandle[1].disabled = false;
        }
        this.controlModelOptions = val[0].controlModel.enums;
      } else {
        this.controlModelOptions = [];
        this.searchHandle[1].disabled = true;
      }
    },
    handleSearch() {
      const { structureId, parentId } = this.formInline;
      if (parentId === "") {
        return this.$message({
          message: "项目不能为空",
          type: "warning"
        });
      }
      let strId = structureId == "" ? parentId : structureId;
      this.$http
        .post(
          "/S-Base/realTimeMonitoring",
          Qs.stringify({ structureId: strId })
        )
        .then(res => {
          if (res.data.success) {
            const list = res.data.data;
            let arr = list.map(item => {
              item.targetTem == null
                ? (item.targetTem = { value: 45 })
                : item.targetTem;
              item.controlModel == null
                ? (item.controlModel = { value: "" })
                : item.controlModel;
              item.targetTem.isEdit = false;
              return item;
            });
            this.tableData = arr;
          }
        });
    },
    /**
     * 点击一键平衡按钮
     */
    handleOneBalance() {
      this.xiaFaForm.value = 0;
      this.dialogVisible = true;
      let arr = [];
      this.selectedList.map(item => {
        arr.push(item.backTem.value);
      });
      this.xiaFaForm.value = averageValue(arr);
    },
    /** 下发确定 */
    async onSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.$confirm("确认要下发吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.$message({
              message: "下发受限，请咨询",
              type: "warning"
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }

    /**
     * 控制模型发生改变
     */
    // async controlChange(val) {
    //   for (let i = 0; i < this.selectedList.length; i++) {
    //     let item = this.selectedList[i];
    //     let { _id } = item.controlModel;
    //     const loading = this.$loading({
    //       lock: true,
    //       text: `正在下发...`,
    //       spinner: "el-icon-loading",
    //       background: "rgba(0, 0, 0, 0.7)"
    //     });
    //     let newText = `正在下发...${item.ringName}`;
    //     loading.setText(newText);
    //     // let dataCode = '43797bfaa74d4b3fb8cf50f21732470a'
    //     await this.$http
    //       .post(
    //         "/S-RealData/senDataById",
    //         Qs.stringify({ id: _id, value: val })
    //       )
    //       .then(res => {
    //         if (res.data.success) {
    //           setTimeout(() => {
    //             let loadText = `${item.ringName}下发完成`;
    //             loading.setText(loadText);
    //             this.$message({
    //               message: res.data.msg,
    //               type: "success",
    //               duration: 1000
    //             });
    //             if (i == this.selectedList.length - 1) {
    //               loading.close();
    //             }
    //           }, i * 1000);
    //         } else {
    //           this.$message.error(res.data.Msg);
    //         }
    //       });
    //   }
    // }
  }
};
</script>
<style scoped>
.tipLoad {
  width: 100%;
  min-height: 100px;
  position: absolute;
  top: 40px;
  left: 0;
  text-align: center;
  color: #333;
  line-height: 100px;
  font-size: 16px;
  background: #fff;
  z-index: 2000;
}
</style>
