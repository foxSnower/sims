<template>
  <div class="tags-outer-scroll-con">
    <div class="tags-inner-scroll-body">
      <el-tabs v-model="curTabName" type="card" @tab-remove="removeTab" class="ht-tab">
        <el-tab-pane v-for="item in showTabsArray" :key="item.name" :closable="item.name === '/welcome' ? false : true" :label="item.title" :name="item.name">
          <span slot="label" v-if="item.title==='欢迎页'">
            <i class="fa fa-home"></i> 欢迎页</span>
        </el-tab-pane>
      </el-tabs>
      <!-- 路由我其实只要一个就够了 -->
      <!-- <router-view class="hongte-view" /> -->
    </div>
    <div class="dropdown-menu">
      <el-dropdown class="ht-dropdown" trigger="click" @command="handleCommand">
        <span class="ht-dropdown-link"> 操作
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <!-- <el-dropdown-item command="refresh">刷新当前选项卡</el-dropdown-item> -->
          <el-dropdown-item command="closeCur">关闭当前选项卡</el-dropdown-item>
          <el-dropdown-item command="closeOth">关闭其他选项卡</el-dropdown-item>
          <el-dropdown-item divided command="closeAll">关闭所有选项卡</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'PageTags',
  data() {
    return {
      curTabName: '/welcome'
    };
  },
  props: {
    pageTagsList: Array
  },
  watch: {
    $route(to) {
      //记录进入的页面---并且去重
      let showTabsArray = this.showTabsArray;
      let isRepeat = false;
      showTabsArray.forEach(x => {
        let name = this.substrUrlName(x.name);
        if (name == to.path) {
          //有重复
          x.curTab = 1;
          isRepeat = true;
        } else {
          x.curTab = 0;
        }
      });
      if (!isRepeat) {
        showTabsArray.push({
          name: to.fullPath,
          title: to.meta.title,
          curTab: 1
        });
        this.setTabsArray(showTabsArray);
      } else {
        for (let i in showTabsArray) {
          let name = this.substrUrlName(showTabsArray[i].name);
          if (name == to.path) {
            showTabsArray[i].name = to.fullPath;
            showTabsArray[i].title = to.meta.title;
            showTabsArray[i].curTab = 1;
          }
        }
        this.setTabsArray(showTabsArray);
      }
    },
    //点击当前页修改相应路由
    curTabName(nVal) {
      let showTabsArray = this.showTabsArray;
      this.$router.push(nVal);
      showTabsArray.forEach((x, index) => {
        let name = this.substrUrlName(x.name);
        if (name == nVal) {
          x.curTab = 1;
        } else {
          x.curTab = 0;
        }
      });
      //存入本地缓存
      this.setTabsArray(showTabsArray);
    },
    showTabsArray(nVal) {
      nVal.forEach((x, index) => {
        if (x.curTab == 1) this.curTabName = x.name;
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.refreshPage();
    });
  },
  computed: {
    ...mapGetters({
      showTabsArray: 'showTabsArray'
    })
  },
  methods: {
    ...mapMutations({
      setTabsArray: 'SET_TABS_ARRAY'
    }),
    refreshPage() {
      this.showTabsArray.forEach((x, index) => {
        if (this.$route.fullPath == x.name) {
          this.curTab = 1;
          this.curTabName = x.name;
        }
      });
    },
    //获取不带链接参数的name
    substrUrlName(name) {
      if (name.indexOf('?') >= 0) {
        return name.substr(0, name.indexOf('?'));
      } else {
        return name;
      }
    },
    // 删除单个页签
    removeTab(name) {
      let showTabsArray = this.showTabsArray;
      let delIndex = -1;
      showTabsArray.forEach((x, index) => {
        let xName = this.substrUrlName(x.name);
        let curName = this.substrUrlName(name);
        // console.log(xName,curName);
        if (xName == curName) {
          delIndex = index;
        }
      });
      if (delIndex >= 1 && delIndex - 1 >= 0) {
        showTabsArray[delIndex - 1].curTab = 1;
      }
      if (delIndex < 1 && delIndex + 1 < showTabsArray.length) {
        showTabsArray[delIndex + 1].curTab = 1;
      }
      if (delIndex > 0) showTabsArray.splice(delIndex, 1); //防止删除欢迎页
      // console.log(22222222, showTabsArray);

      this.setTabsArray(showTabsArray);
    },
    // 删除当前以外的页签
    removeOtherTabs(name) {
      let showTabsArray = this.showTabsArray;
      let newArray = [];
      showTabsArray.forEach((x, index) => {
        let xName = this.substrUrlName(x.name);
        if (xName == name || index == 0) {
          newArray.push(x);
        }
      });
      showTabsArray = newArray;
      this.setTabsArray(showTabsArray);
    },
    //删除所有页签
    removeAllTabs() {
      let showTabsArray = this.showTabsArray;
      let newArray = [];
      showTabsArray.forEach((x, index) => {
        if (index == 0) {
          x.curTab = 1;
          newArray.push(x);
        }
      });
      showTabsArray = newArray;
      this.setTabsArray(showTabsArray);
    },
    //操作
    handleCommand(command) {
      if (command == 'refresh') {
        this.$router.push(this.curTabName);
      }
      if (command == 'closeCur') {
        this.removeTab(this.curTabName);
      }
      if (command == 'closeOth') {
        this.removeOtherTabs(this.curTabName);
      }
      if (command == 'closeAll') {
        this.removeAllTabs();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tags-outer-scroll-con {
  position: relative;
  padding-top: 5px;
  // z-index: 9;
  .tags-inner-scroll-body {
    width: 100%;
    width: calc(100% - 100px);
    white-space: nowrap;
    // .el-tabs__header {
    //   margin-right: 100px;
    // }
  }

  .dropdown-menu {
    width: 100px;
    height: 100%;
    text-align: right;
    position: absolute;
    top: 0;
    right: 0;
    border-bottom: 1px solid #e4e7ed;
    z-index: 1;
    .ht-dropdown {
      position: absolute;
      width: 100%;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .el-tabs__item {
    background: #f2f2f2 !important;
  }

  // .el-tabs__item.is-active {
  //   background: #fff;
  // }

  .ht-dropdown-link {
    cursor: pointer;
  }
}
</style>
