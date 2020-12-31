<!--
 * @Author: your name
 * @Date: 2020-02-18 11:24:19
 * @LastEditTime: 2020-02-18 19:55:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-admin-template-master\src\layout\components\Navbar\changePassword.vue
 -->
<template>
  <el-dialog
    :close-on-click-modal="false"
    title="修改密码"
    :visible.sync="dialogVisible"
    width="30%"
    @close="closeDialog"
  >
    <el-form
      ref="passwordForm"
      :model="passwordForm"
      status-icon
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="旧密码" prop="password">
        <el-input
          v-model="passwordForm.password"
          type="text"
          autocomplete="new-password"
        />
      </el-form-item>
      <el-form-item label="新密码" prop="NewOriginal">
        <el-input
          v-model="passwordForm.NewOriginal"
          type="password"
          autocomplete="new-password"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="Original">
        <el-input
          v-model="passwordForm.Original"
          type="password"
          autocomplete="new-password"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('passwordForm')"
          >确定</el-button
        >
        <el-button @click="resetForm('passwordForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import Qs from "qs";
export default {
  props: {
    dialogShow: Boolean
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.passwordForm.Original !== "") {
          this.$refs.passwordForm.validateField("Original");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passwordForm.NewOriginal) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: this.dialogShow,
      passwordForm: {
        password: "",
        NewOriginal: "",
        Original: ""
      },
      rules: {
        NewOriginal: [{ validator: validatePass, trigger: "blur" }],
        Original: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.passwordForm.resetFields();
    });
  },
  methods: {
    closeDialog() {
      this.$refs.passwordForm.resetFields();
      this.$emit("closeDialog");
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http
            .post("/S-Base/updateByPassword", Qs.stringify(this.passwordForm))
            .then(res => {
              if (res.data.success) {
                this.$notify({
                  title: "成功",
                  message: "修改成功",
                  type: "success"
                });
                this.dialogVisible = false;
                this.$refs.passwordForm.resetFields();
              } else {
                this.$notify.error({
                  title: "错误",
                  message: res.data.msg
                });
                this.dialogVisible = false;
                this.$refs.passwordForm.resetFields();
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
