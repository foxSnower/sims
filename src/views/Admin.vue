<template>
  <el-container class="hongte-main-container" v-if="!inIframe">
    <!-- 左侧边栏 -->
    <el-aside :width="asideWidth">
      <!-- LOGO -->
      <div v-if="parseFloat(asideWidth)<100" class="logo" :style="{backgroundColor:localTheme.themeColorDeep}">
        <img width="25px" style="margin: 12px;" src="~@assets/logo2.png" alt="logo缩略图">
      </div>
      <div v-else class="logo" :style="{backgroundColor:localTheme.themeColorDeep}">
        <img height="25px" style="margin: 12px;" src="~@assets/ht_logo2.png" alt="ht_logo">
      </div>
      <nav-bar v-model="isCollapse" :isCollapse="isCollapse" :navList="menuList"></nav-bar>
    </el-aside>

    <!-- 右侧边栏 -->
    <el-container>
      <!-- 头部 -->
      <el-header :height="'50px'" :style="{backgroundColor:localTheme.themeColor}">
        <div class="ht-change-bar">
          <div :class="{'is-collapse':isCollapse}" @click="handleMenu()">
            <i class="fa fa-bars"></i>
          </div>
          <div>{{$GLOBAL.SYSTEM_NAME}}</div>
        </div>
        <v-header></v-header>

      </el-header>
      <page-tags ref="tags"></page-tags>
      <!-- 主体 -->
      <el-main>
        <!-- 内容页 -->
        <!-- <keep-alive> -->
          <router-view class="hongte-view" @removeCurTag="removeCurTag" :key="key"/>
        <!-- </keep-alive> -->
        <transition name="el-zoom-in-top">
          <div v-show="backTop" class="page-component-up" :style="{boxShadow: boxShadow}" @click="toBackTop">
            <i class="el-icon-caret-top" :style="{color:localTheme.themeColor}"></i>
          </div>
        </transition>
      </el-main>
    </el-container>
  </el-container>

  <router-view v-else />
</template>


<script>
import vHeader from '@htComponents/Admin/Header';
import vFooter from '@htComponents/Admin/Footer';
import NavBar from '@htComponents/Admin/NavBar';
import PageTags from '@htComponents/Admin/TagsPage';
import { mapGetters, mapMutations } from 'vuex';
import P404 from '@views/Common/404';

export default {
  data() {
    return {
      backTop: false,
      fullWidth: document.documentElement.clientWidth,
      //菜单是否收缩
      isCollapse: false
      // asideWidth:'300px'
    };
  },
  watch: {
    fullWidth(val) {
      this.fullWidth = val;
      if (this.fullWidth <= 1000) {
        this.isCollapse = true;
      }
      // else {
      //   this.isCollapse = false;
      // }
    }
  },
  computed: {
    ...mapGetters(['menuList', 'userInfo', 'asideWidth', 'localTheme', 'provinceCode', 'cityCode', 'countyCode']),
    inIframe() {
      return self != top;
    },
    boxShadow() {
      return '0 0 6px ' + this.localTheme.themeColor;
    },
    key(){
      return this.$route.fullPath
    }
  },
  methods: {
    ...mapMutations(['SET_MENU', 'SET_USERINFO']),
    // 返回顶部
    toBackTop() {
      let scrollObj = document.querySelector('.el-main');
      scrollObj.scrollTop = 0;
      console.log(1);
    },
    removeCurTag() {
      this.$refs.tags.handleCommand('closeCur');
    },
    handleMenu() {
      // console.log(arguments)
      this.isCollapse = !this.isCollapse;
    }
  },
  components: {
    vHeader,
    vFooter,
    NavBar,
    PageTags,
    P404
  },
  mounted() {
    let scrollObj = document.querySelector('.el-main');
    let scrollTop = 0;
    scrollObj.addEventListener('scroll', () => {
      scrollTop = scrollObj.scrollTop;
      if (scrollTop >= 800) {
        this.backTop = true;
      } else {
        this.backTop = false;
      }
    });
    const that = this;
    //获得窗口尺寸
    window.onresize = () => {
      return (() => {
        window.fullWidth = document.documentElement.clientWidth;
        that.fullWidth = window.fullWidth;
      })();
    };
    // console.log(this.navList);
  }
};
</script>

<style lang="scss" scoped>
@import '~@/sass/theme';
.hongte-main-container {
  height: 100vh;

  .logo {
    // background-color: #56c499;
    text-align: center;
    font-size: 18px;
    color: #ffffff;
    height: 50px;
    line-height: 50px;
    overflow: hidden;
  }

  .el-header {
    // background:$theme-color;
    // color:#333;
    text-align: center;
    line-height: 50px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  }

  .el-aside {
    background-color: #545c64;
    transition: width 0.3s;
  }
}

.honte-user {
  padding: 20px 10px 10px;

  .honte-user__head img {
    width: 45px;
    height: 45px;
  }

  .honte-user__info {
    padding: 5px 5px 5px 15px;
    width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .honte-user__name {
    margin-bottom: 9px;
    color: #fff;
    font-size: 16px;
  }

  .honte-user__occupation {
    color: #a7a9ac;
    font-size: 14px;
  }
}

.search {
  position: relative;
  margin: 10px 10px 25px;

  .search__input {
    background-color: #374850;
    color: #666;
    border-radius: 3px;
    height: 35px;
    border: 0;
    padding: 6px 12px;
    width: 100%;

    &:focus {
      background-color: #fff;
    }
  }

  .fa-search {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 10px;
    color: #999;
  }
}
.page-component-up {
  background-color: #fff;
  position: fixed;
  right: 100px;
  bottom: 150px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.3s;
  // border:1px solid green;
  box-shadow: 0 0 6px green;
  z-index: 99;
  i {
    display: block;
    line-height: 40px;
    text-align: center;
    font-size: 18px;
  }
}
.ht-change-bar {
  position: absolute;
  color: #fff;
  text-align: center;
  font-size: 16px;
  & > div {
    float: left;
    padding: 0 10px;
  }
  i {
    transition: all 0.3s;
  }
  span {
    transition: all 0.3s;
    opacity: 0;
  }
  .is-collapse {
    i {
      transform: rotate(-90deg);
    }
  }
  &:hover {
    span {
      opacity: 1;
    }
  }
}
</style>
