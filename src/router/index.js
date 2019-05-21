import Vue from 'vue'
import Router from 'vue-router'
import { setLocalStorage, getLocalStorage, delLocalStorage} from '@utils';
import store from '../store'
Vue.use(Router)

const router = new Router({
  mode: 'hash', // Demo is living in GitHub.io, so required! 
  routes: [
    {
      path: '/', component: () => import('@/views/Admin'), redirect: { name: 'login'},children:[
        {path: 'welcome', meta: { title: '欢迎页' }, name: 'welcome',component: resolve => require(['@/views/Common/Welcome.vue'], resolve)},
        //授信管理
        { path: '/CreditManagement/CreditTracking', meta: { title: '授信跟踪' }, name: 'CreditTracking', component: resolve => require(['@/views/CreditManagement/CreditTracking.vue'], resolve) },
        { path: '/CreditManagement/Steps3', meta: { title: '上传附件' }, name: 'Steps3', component: resolve => require(['@/views/CreditManagement/CreditApplicationSteps1/Steps3.vue'], resolve) },
        //出款编辑
        { path: '/CreditManagement/paymentEdit', meta: { title: '出款申请' }, name: 'paymentEdit', component: resolve => require(['@/views/CreditManagement/paymentEdit.vue'], resolve) },
        //出款详情
        { path: '/CreditManagement/CommonTemplate/PaymentTracking', meta: { title: '出款详情' }, name: 'PaymentTracking', component: resolve => require(['@/views/CreditManagement/CommonTemplate/PaymentTracking.vue'], resolve) },
        { path: '/LetterManagement/LetterUpload', meta: { title: '上传附件' }, name: 'LetterUpload', component: resolve => require(['@/views/LetterManagement/LetterUpload.vue'], resolve) },
        //用信管理
        { path: '/LetterManagement/LetterTracking', meta: { title: '用信跟踪' }, name: 'LetterTracking', component: resolve => require(['@/views/LetterManagement/LetterTracking.vue'], resolve) },
        //用信申请
        { path: '/LetterManagement/LetterApplication', meta: { title: '用信申请' }, name: 'LetterApplication', component: resolve => require(['@/views/LetterManagement/LetterApplication.vue'], resolve) },
        //管理银行卡
        { path: '/CustomeManagement/BankCardManagement', meta: { title: '管理银行卡' }, name: 'BankCardManagement', component: resolve => require(['@/views/CustomeManagement/BankCardManagement.vue'], resolve) },
        //鸿保贷
        { path: '/HtCreditManagement/HtCreditTracking', meta: { title: '鸿保跟踪' }, name: 'HtCreditTracking', component: resolve => require(['@/views/HtCreditManagement/HtCreditTracking.vue'], resolve) },
        ...generateRoutesFromMenu(getLocalStorage('menu')),
       
      ]
    },
    { path: '/login', meta: { title: '登录' }, name: 'login', component: resolve => require(['@/views/Common/Login.vue'], resolve) },
    { path: '/Iframe/:url', meta: { title: 'Iframe' }, name: 'Iframe', component: resolve => require(['@/views/Common/Iframe.vue'], resolve) },
    { path: '/Success', meta: { title: 'Success' }, name: 'Success', component: resolve => require(['@/views/Common/Success.vue'], resolve) },
  ]
})

// Menu should have 2 levels. 
function generateRoutesFromMenu(menuList = [], routes = []) {
  if(menuList){
    function forMenuList(menus) {
      menus.forEach(x => {
        if (x.children.length === 0) {
           let urlArray = x.url.split('/');
           let name = urlArray[urlArray.length-1];
           routes.push({
             path:'/'+ x.url,
             name:name,
             meta: { title: x.title },
             component: resolve => require(['@/views/' + x.url + '.vue'], resolve)
           })
        } else {
          forMenuList(x.children)
        }
      });
    }
    forMenuList(menuList);
  }
  return routes
}

// 全局前置守卫
// const whiteList = ['/login', ];
router.beforeEach((to, from, next) => {
   delLocalStorage('step1');
  if (to.path === '/login') {
    Vue.cookie.delete('token');
    Vue.cookie.delete('refreshToken');
    //删除缓存
    delLocalStorage('menu');
    delLocalStorage('userInfo');
    delLocalStorage('showTabsArray');
    // this.$store.commit('product_type', res.data);
    store.commit('SET_TABS_ARRAY',[{
      name: '/welcome',
      title: '欢迎页',
      url:'Common/Welcome',
      curTab: 0
    }])
    store.commit('SET_MENU',[])
    next()
  }else if (to.path === '/welcome') {
    store.commit('SET_TABS_ARRAY',[{
      name: '/welcome',
      title: '欢迎页',
      url:'Common/Welcome',
      curTab: 1
    }]);
    next()
  }else{
    next()
  }
})
 

// 全局后置钩子
router.afterEach((to, from) => {

})
export default router
