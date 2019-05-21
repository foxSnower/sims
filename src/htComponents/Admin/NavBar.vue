<template>
  <div class="hongte-nav-bar">
    <!--左侧菜单组件-->
    <el-menu router default-active="onRoutes"  background-color="#545c64" text-color="#bbc0c6" active-text-color="activeColor" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
      <NavItem :navList="navList"></NavItem>
    </el-menu>
  </div>
</template>

<script>
import NavItem from './NavItem';
import { mapGetters, mapMutations } from 'vuex';
export default {
  watch: {
    isCollapse(nval) {
      if (nval) this.ASIDE_WIDTH('56px');
      else this.ASIDE_WIDTH('250px');
    },
  },
  components: {
    NavItem
  },
  props: ['navList','isCollapse'],
  mounted() {
    
  },
  methods: {
    ...mapMutations(['ASIDE_WIDTH']),
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
  },
  computed: {
    ...mapGetters({
      localTheme: 'localTheme'
    }),
    // 首次进入页面时展开当前页面所属的菜单
    onRoutes() {
      return this.$route.name;
    },
    activeColor() {
      return this.localTheme.themeColor ? this.localTheme.themeColor : '#56C499';
    }
  }
};
</script>

<style lang="scss">
@import '~@/sass/theme';
.hongte-nav-bar {
  
  .el-menu {
    border: 0;
  }

  .el-menu-item.is-active {
    /**
       * 样式是style，所以为了覆盖只能使用!important
       */
    background-color: #434a50 !important;
    border-left: 3px solid #000;
  }

  .el-menu-item i,
  .el-submenu__title i {
    margin-right: 5px;
  }
}
</style>
