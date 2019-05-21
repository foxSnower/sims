// 跳转UC修改密码的地址：
// Dev：
// http://172.16.200.110:30131/html/user/changePwdOther.html
// Sit
// http://172.16.200.112:30131/html/user/changePwdOther.html
// UAT：
// http://120.79.154.198:30131/html/user/changePwdOther.html
// PRD：
// http://120.79.162.165:30131/html/user/changePwdOther.html

import Vue from 'vue'

const DEV = 'http://172.16.200.110:30111';
// const DEV = 'http://172.16.200.112:30111';
// const UAT = 'http://47.106.46.65:30111';
// const PRD = 'http://120.78.25.128:30111';



// let URL = eval(process.env.GATEWAY_URL);

console.log("-----当前环境-------：" + process.env.GATEWAY_URL);

// const URL = (process.env.GATEWAY_URL && process.env.GATEWAY_URL !== 'undefined' ? process.env.GATEWAY_URL : DEV)

const URL = DEV;
//默认进件管理系统
const global_ = {
  BASE_URL: URL,
  APP: 'SIMS',
  SYSTEM_NAME: '进件管理系统',
  SYSTEM_SHORT_NAME: 'SIMS',
  TOKENTIME:'120',
  //修改密码的地址
  CHANGE_PASSWORD_URL: URL.substr(0, URL.lastIndexOf(":")) + ':30131/html/user/changePwdOther.html?token='
}

Vue.prototype.$GLOBAL = global_;


export default global_
