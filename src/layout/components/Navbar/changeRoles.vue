<!--
 * @Author: your name
 * @Date: 2020-02-18 13:26:27
 * @LastEditTime: 2020-02-18 20:08:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-admin-template-master\src\layout\components\Navbar\changeRoles.vue
 -->
<template>
  <el-dialog
    :close-on-click-modal="false"
    title="切换角色"
    :visible.sync="dialogVisible"
    width="40%"
    @close="handleClose"
  >
    <div class="role"><span v-for="t in currentRole" :key="t.id" class="role">当前角色为{{ t.role_name }}</span><el-button type="text" @click="setRole(t.id)">设置当前角色为默认</el-button></div>
    <div style="margin-top:30px">
      <el-button-group>
        <el-button v-for="t in roles" :key="t.id" style="matgin-top:6px" plain @click="changerole(t.id)">{{ t.role_name }}</el-button>
      </el-button-group>
    </div>
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import { getRoles, setRoles, changeRoles } from '@/api/user'
export default {
  props: { dialogShow: Boolean },
  data() {
    return {
      dialogVisible: this.dialogShow,
      roles: []
    }
  },
  computed: {
    ...mapGetters([
      'roleId',
      'userId'
    ]),
    currentRole() {
      return this.roles.filter(t => (t.id === this.roleId))
    }
  },
  created() {
    this.getRole()
  },
  methods: {
    getRole() {
      getRoles({ id: this.userId }).then(res => {
        this.roles = res.data.data
      })
    },
    /**
     * 设置默认角色
     */
    setRole(id) {
      setRoles({ roleId: id, userId: this.userId }).then(res => {
        if (res.data.success) {
          this.$notify({
            title: '成功',
            message: res.data.msg,
            type: 'success'
          })
          this.dialogVisible = false
        }
      })
    },
    /**
     * 切换角色
     */
    changerole(roleId) {
      changeRoles({ roleId: roleId }).then(res => {
        if (res.data.success) {
          const { token } = res.data.data
          this.$store.commit('user/SET_TOKEN', token)
          this.$store.dispatch('user/GenerateRoutes')
          //   this.$store.commit('user/', res.data.data)
        }
      })
    },
    /**
     * 关闭弹框
     */
    handleClose() {
      this.$emit('handleClose')
    }
  }
}
</script>
