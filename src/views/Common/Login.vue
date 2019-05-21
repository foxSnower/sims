<template>
  <div class="login-wrap">
    <!-- <img class="login-bg" src="~@assets/login_bg.png"> -->
    <div class="login-con">
      <img class="ht_logo" src="~@assets/ht_logo.png" alt="ht_logo">
      <p slot="title" class="title">欢迎登录</p>
      <div class="form-con" @keyup.enter="handleSubmit">
        <el-form ref="loginForm" :model="loginForm" :rules="loginFormRule">
          <el-form-item prop="username">
            <el-input type="text" placeholder="请输入用户名" suffix-icon="fa fa-user" v-model.trim="loginForm.username"></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input type="password" placeholder="请输入密码" suffix-icon="fa fa-lock" v-model.trim="loginForm.password"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSubmit">登 录</el-button>
          </el-form-item>
        </el-form>
        <p class="login-tip">输入用户名和密码</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { getLocalStorage } from '@utils';

export default {
  data() {
    return {
      loginForm: {
        username: '', //admin-smis admin-apm
        password: '' //hongte123
      },
      loginFormRule: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    };
  },
  methods: {
    ...mapMutations(['SET_AUTHINFO', 'SET_MENU', 'SET_USERINFO']),
    handleSubmit() {
      this.$refs['loginForm'].validate(valid => {
        if (valid) {
          this.$api
            .login({
              userName: this.loginForm.username,
              password: this.loginForm.password
            })
            .then(result => {
              this.$cookie.set(this.$GLOBAL.APP+'token', result.token, { expires: this.$GLOBAL.TOKENTIME - 2 + 'm' });
              this.$cookie.set(this.$GLOBAL.APP+'refreshToken', result.refreshToken, { expires: this.$GLOBAL.TOKENTIME + 'm' });
              this.getAuth();
            })
        }
      });
    },
    getAuth() {
      // 获取菜单列表
      this.$api.loadMenu({}).then(res => {
        this.initMenu(res);
        this.$router.replace('welcome');
        // this.SET_USERINFO(mock.user);
      });
      //获取用户信息
      this.$api.getLoginInfo({}).then(res => {
        // console.info(res);
        this.SET_USERINFO(res.data);
      });
    },
    //初始化菜单----主要是添加name
    initMenu(res) {
      this.SET_MENU(res);
      //动态添加路由可以用做权限管理。登录后服务器端返回权限菜单，前端动态添加路由,然后在设置菜单
      let menuList = getLocalStorage('menu');
      if (menuList) {
        this.forMenuList(menuList);
        this.$router.addRoutes(this.$router.options.routes); //调用addRoutes添加路
        
      }
    },
    forMenuList(menus) {
      menus.forEach(x => {
        if (x.children.length === 0) {
           let urlArray = x.url.split('/');
           let name = urlArray[urlArray.length-1];
           this.$router.options.routes[0].children.push({
             path:'/'+ x.url,
             name:name,
             meta: { title: x.title },
             component: () => import('@/views/' + x.url + '.vue') //将组件用require引进来
           })
        } else {
          this.forMenuList(x.children)
        }
      });
    }
  }
};
</script>


<style lang="scss" scoped>
.login-wrap {
  background: url('~@assets/login_bg.png') no-repeat;
  background-size: 100% 100%;
  height: 100vh;
  width: 100%;
  color: #fff;
  .login-bg {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .login-con {
    position: absolute;
    right: 160px;
    top: 50%;
    padding: 40px;
    transform: translateY(-60%);
    width: 400px;
    background: rgba(0, 0, 0, 0.5);

    .title {
      margin-bottom: 20px;
    }
  }

  .form-con {
    padding: 10px 0 0;
  }

  .login-tip {
    font-size: 10px;
    text-align: center;
    color: #c3c3c3;
  }
  .ht_logo {
    position: absolute;
    top: -60px;
    width: 200px;
    left: 50%;
    margin-left: -100px;
  }
}
</style>
