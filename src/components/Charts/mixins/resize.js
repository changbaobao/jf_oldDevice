/*
 * @Author: your name
 * @Date: 2020-02-19 09:36:51
 * @LastEditTime: 2020-02-21 14:39:29
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \vue-admin-template-master\src\components\Charts\mixins\resize.js
 */
import { debounce } from '@/utils/index'

export default {
    data() {
        return {
            $_sidebarElm: null,
            $_resizeHandler: null
        }
    },
    mounted() {
        this.initListener()
    },
    activated() {
        if (!this.$_resizeHandler) {
            // avoid duplication init
            this.initListener()
        }

        // when keep-alive chart activated, auto resize
        this.resize()
    },
    beforeDestroy() {
        this.destroyListener()
    },
    deactivated() {
        this.destroyListener()
    },
    methods: {
        // use $_ for mixins properties
        // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
        $_sidebarResizeHandler(e) {
            if (e.propertyName === 'width') {
                this.$_resizeHandler()
            }
        },
        initListener() {
            this.$_resizeHandler = debounce(() => {
                this.resize()
            }, 100)
            window.addEventListener('resize', this.$_resizeHandler)

            this.$_sidebarElm = document.getElementsByClassName('sidebar-container')[0]
            this.$_sidebarElm && this.$_sidebarElm.addEventListener('transitionend', this.$_sidebarResizeHandler)
        },
        destroyListener() {
            window.removeEventListener('resize', this.$_resizeHandler)
            this.$_resizeHandler = null

            this.$_sidebarElm && this.$_sidebarElm.removeEventListener('transitionend', this.$_sidebarResizeHandler)
        },
        resize() {
            const { chart } = this
            chart && chart.resize()
        }
    }
}