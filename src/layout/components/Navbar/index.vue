<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />
    <!-- <div ></div> -->
    <div class="right-menu">
      <i class="el-icon-rank FullScreen" @click="clickFullScreen()" />
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          {{ name }}
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="dialogPassShow=true">修改密码</el-dropdown-item>
          <el-dropdown-item @click.native="rolesDialogShow=true">切换角色</el-dropdown-item>
          <!-- <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">锁定</span>
          </el-dropdown-item> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 修改密码弹框 -->
    <change-password v-if="dialogPassShow" :dialog-show="dialogPassShow" @closeDialog="dialogPassShow=false" />
    <!-- 切换角色弹框 -->
    <change-roles v-if="rolesDialogShow" :dialog-show="rolesDialogShow" @handleClose="rolesDialogShow=false" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import changePassword from './changePassword'
import changeRoles from './changeRoles'
import screenfull from 'screenfull'
export default {
  components: {
    Hamburger,
    Breadcrumb,
    changePassword,
    changeRoles
  },
  data() {
    return {
      dialogPassShow: false,
      rolesDialogShow: false,
      isFullscreen: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')
    },
    clickFullScreen() {
      if (!screenfull.isEnabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle(document.querySelector('.kfScreenFull'))
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background:#017ed2;
  color:#fff;
  // background: #fff;
  border-bottom: 1px solid #f6f6f6;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    .FullScreen {
      font-size:24px;
      transform: rotate(45deg);
      cursor: pointer;
      color:#fff;
      margin-right:10px;
      vertical-align: middle;
    }

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color:#fff;
      // color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;
        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;
        color:#fff;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          // color:#444;
          color:#fff;
          position: absolute;
          right: -20px;
          top: 15px;
          font-size: 15px;
        }
      }
    }
  }
}
</style>
