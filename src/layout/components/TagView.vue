<!--
 * @Author: your name
 * @Date: 2020-02-18 10:17:40
 * @LastEditTime: 2020-02-28 15:28:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-admin-template-master\src\layout\components\tagView.vue
 -->
<template>
  <div
    class="tag"
    style="display:flex;flex-direction: row;background: #F5F7F9;padding: 5px 5px 6px 5px;box-shadow: 0 1px 3px 0 rgba(0,0,0,.05), 0 0 3px 0 rgba(0,0,0,.04);"
  >
    <el-tag
      v-for="( tag,index ) in tagMenu"
      :key="index"
      style="margin-left:5px;display: flex;background:#fff;border-color:#fff;align-items: center;"
      closable
      size="medium"
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      <router-link :to="tag.routerPath" class="tag-el">
        <div class="tag-isactive" />
        {{ tag.chineseName }}
      </router-link>
    </el-tag>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['tagMenu'])
  },
  watch: {
    $route(newValue) {
      // 监听路由动态添加tag标签
      this.setTags(newValue)
    }
  },
  mounted() {},
  methods: {
    setTags(module) {
      if (module.fullPath == '/main') {
        module.meta.title = '主页'
      }
      if (
        JSON.stringify(this.tagMenu).indexOf(
          JSON.stringify({
            chineseName: module.meta.title,
            routerPath: module.fullPath
          })
        ) === -1
      ) {
        this.tagMenu.push({
          chineseName: module.meta.title,
          routerPath: module.fullPath
        })
      }
      this.$store.commit('user/SET_KEEPALIVE', this.tagMenu)
      this.$store.commit('user/SET_TAGMENU', this.tagMenu)
    },
    handleClose(tag) {
      const path = this.$route.path
      const index = this.tagMenu.indexOf(tag)
      if (index === 0) {
        return
      }
      if (path === tag.routerPath) {
        if (index === 1) {
          this.$router.push({ path: '/main' })
        } else {
          const nextRouter = this.tagMenu[index - 1]
          this.$router.push({ path: nextRouter.routerPath })
        }
      }
      this.tagMenu.splice(index, 1)
      this.$store.commit('user/SET_TAGMENU', this.tagMenu)
      this.$store.commit('user/SET_KEEPALIVE', this.tagMenu) // tag缓存
    }
  }
}
</script>
<style lang="scss" scoped>
.tag .router-link-active .tag-isactive {
  background-color: cyan;
}
.tag .router-link-active {
  color: chocolate;
}
.tag-el {
  display: flex;
  align-items: center;
  color: #5e8888;
  justify-content: space-between;
}
/* .tag {

} */

.tag-isactive {
  width: 14px;
  height: 14px;
  margin-right: 8px;
  background-color: #ccc;
  border-radius: 50%;
}
</style>
