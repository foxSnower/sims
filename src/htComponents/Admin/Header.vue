<template>
  <div>
    <div class="hongte-main-header">
      <div class="dropdown-menu lm-item">
        <el-dropdown trigger="click" @command="changeTheme">
          <span class="el-dropdown-link">
            <i class="fa fa-coffee"></i> 更换主题
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="#56C499" style="color:#56C499">绿野中林</el-dropdown-item>
            <el-dropdown-item command="#F3ACAC" style="color:#F3ACAC">Hello Kitty</el-dropdown-item>
            <el-dropdown-item command="#409eff" style="color:#409eff">浅海湾</el-dropdown-item>
            <el-dropdown-item command="#B994DD" style="color:#B994DD">浪漫色彩</el-dropdown-item>
            <el-dropdown-item command="#81B0F1" style="color:#81B0F1">蓝色天空</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="dropdown-menu lm-item">
        <el-dropdown trigger="click" @command="changeUser">
          <span class="el-dropdown-link">
            <i class="fa fa-user-o" aria-hidden="true"></i> {{userName}}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="修改密码">修改密码</el-dropdown-item>
            <el-dropdown-item command="退出登录">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { rules } from '@rules';
import { setLocalStorage, getLocalStorage, delLocalStorage } from '@utils';
export default {
  data() {
    return {
      dialogVisible: false,
      where: {},
      rules: rules,
      message: [
        {
          id: '1',
          title: '这是一段内容',
          body: '这是一段内容,这是一段内容,这是一段内容,这是一段内容。',
          time: '2018/05/15 09:28:30'
        },
        {
          id: '2',
          title: '这是一段内容',
          body: '这是一段内容,这是一段内容,这是一段内容,这是一段内容。',
          time: '2018/05/15 09:28:30'
        },
        {
          id: '3',
          title: '这是一段内容',
          body: '这是一段内容,这是一段内容,这是一段内容,这是一段内容。',
          time: '2018/05/15 09:28:30'
        }
      ],
      popover: false,
      CHANGE_PASSWORD_URL: this.$GLOBAL.CHANGE_PASSWORD_URL
    };
  },
  methods: {
    ...mapMutations({
      setThemeColor: 'LOCAL_THEME'
    }),
    goTo() {
      //window.open(this.$GLOBAL.CHANGE_PASSWORD_URL + this.$cookie.get(this.$GLOBAL.APP+'token'));
      //打开一个空白窗口
      let CHANGE_PASSWORD_URL = this.CHANGE_PASSWORD_URL;
      if (CHANGE_PASSWORD_URL.indexOf('127.0.0.1') == -1) {
        window.open(this.CHANGE_PASSWORD_URL + this.$cookie.get(this.$GLOBAL.APP + 'token'));
      } else {
        let tempwindow = window.open();
        this.$api.gateway({}).then(res => {
          let URL= res.data;
          this.CHANGE_PASSWORD_URL = URL.substr(0, URL.lastIndexOf(':')) + ':30131/html/user/changePwdOther.html?token=';
          tempwindow.location = this.CHANGE_PASSWORD_URL + this.$cookie.get(this.$GLOBAL.APP + 'token');
        });
      }
    },
    signOut() {
      this.$router.push('/login');
    },
    showpopover(e) {
      this.popover = !this.popover;
      var closePopover = event => {
        if (!this.$refs.popover.contains(event.target)) {
          this.popover = false;
          document.body.removeEventListener('mouseup', closePopover);
        }
      };
      document.body.addEventListener('mouseup', closePopover);
    },
    changeTheme(theme) {
      let themeColorDeep = '#' + (parseInt(theme.split('#')[1], 16) - 1450031).toString(16); //16进制与10进制之间的切换，颜色加深算法，这可是我研究好久才知道的
      this.changeClass(document.body, 'custom-' + theme.split('#')[1]);
      // 放入store和本地缓存
      this.setThemeColor({ themeColor: theme, themeColorDeep: themeColorDeep });
      setLocalStorage('localTheme', {
        themeColor: theme,
        themeColorDeep: themeColorDeep
      });
    },
    changeUser(title) {
      switch (title) {
        case '修改密码':
          this.goTo();
          break;
        case '退出登录':
          this.signOut();
          break;
        default:
          break;
      }
    },
    changeClass(element, className) {
      if (!element || !className) return;
      element.className = className;
    }
  },
  watch: {
    popover() {
      console.log(123);
    }
  },
  beforeMount() {
    let theme = getLocalStorage('localTheme');
    theme = theme ? theme.themeColor : '#81B0F1';
    let themeColorDeep = '#' + (parseInt(theme.split('#')[1], 16) - 1450031).toString(16); //16进制与10进制之间的切换，颜色加深算法，这可是我研究好久才知道的
    this.changeClass(document.body, 'custom-' + theme.split('#')[1]);
    // 放入store和本地缓存
    this.setThemeColor({ themeColor: theme, themeColorDeep: themeColorDeep });
    setLocalStorage('localTheme', {
      themeColor: theme,
      themeColorDeep: themeColorDeep
    });
  },
  computed: {
    ...mapGetters(['userInfo']),
    userName() {
      // console.log(this.userInfo);
      let userName = '';
      if (this.userInfo) {
        userName = this.userInfo.userName;
      } else if (getLocalStorage('userInfo')) {
        userName = getLocalStorage('userInfo').userName;
      }
      return userName;
    }
  }
};
</script>

<style lang='scss'>
.hongte-main-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .lm-item {
    margin: auto 15px;
    cursor: pointer;
    // color: #fff;
    position: relative;
    .el-badge__content.is-fixed {
      top: 30%;
    }
  }
  .el-dropdown-link {
    color: #fff;
  }
}

.hongte-message-popover {
  width: 300px;
  background-color: #ffffff;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.1));
  border: 1px solid #f2f2f2;
  min-width: 150px;
  position: absolute;
  border-radius: 4px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;

  .popover__title {
    color: #303133;
    font-size: 16px;
    margin-bottom: 12px;
    margin: 0 18px;
    line-height: 58px;
    border-bottom: 1px solid #eee;
    text-align: left;
  }

  .popover__body {
    overflow-y: auto;
    height: 300px;
  }

  &:before {
    content: '';
    top: -9px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 10px solid #fff;
    z-index: 1;
  }

  &:after {
    content: '';
    position: absolute;
    top: -11px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 10px solid #eee;
  }

  .hongte-message-list {
    height: 300px;
    margin: 0;
    padding: 0;

    .list__item {
      position: relative;
      padding: 10px 18px;
      cursor: pointer;
      list-style: none;
      text-align: left;
      overflow: hidden;
      line-height: normal;
    }

    .list__item + .list__item::after {
      content: '';
      position: absolute;
      top: 0;
      width: 90%;
      height: 1px;
      background-color: #eee;
      left: 50%;
      transform: translateX(-50%);
    }

    .list__item:hover {
      background: #f2f2f2;
    }

    .item__title {
      font-size: 16px;
      color: #444;
      margin: 0;
    }

    .item__body {
      font-size: 12px;
      margin: 8px 0;
      color: #888;
    }

    .item__time {
      font-size: 12px;
    }
  }
}
</style>
