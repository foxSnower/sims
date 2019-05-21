import Vue from 'vue'
import router from '../router'
import axios from 'axios'
import {
  Loading,
  Message
} from 'element-ui'



const http = axios.create({
  timeout: 1000 * 10,
  baseURL: Vue.prototype.$GLOBAL.BASE_URL,
  headers: {
    'app': Vue.prototype.$GLOBAL.APP,
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json; charset=utf-8'
  }
})


/**
 * 清空 cookie
 */
const clearToken = () => {
  Vue.cookie.delete(Vue.prototype.$GLOBAL.APP+'token');
  Vue.cookie.delete(Vue.prototype.$GLOBAL.APP+'refreshToken');
}

/**
 * 获取 refreshToken
 */
const getRefreshToken = () => {
  // 从 cookie 中获取 refreshToken
  var refreshToken = Vue.cookie.get(Vue.prototype.$GLOBAL.APP+'refreshToken')
  // 如果 refreshToken 正常则重置一下过期时间
  if (refreshToken) {
    // 重置为30分钟
    Vue.cookie.set(Vue.prototype.$GLOBAL.APP+'refreshToken', refreshToken, {
      expires: Vue.prototype.$GLOBAL.TOKENTIME + 'm'
    });
    // 否则跳转登录
  } else {
    // 清空cookie
    clearToken()
    // 跳转到登录页
    router.push('/login')
    // 取消请求
    Message.error('登录超时，请重新登录。')
    // throw new Error('登录超时，请重新登录。')
  }
  return refreshToken;
}

/**
 * 获取 token
 */
const getToken = (refreshToken) => {
  // 从cookie中获取token
  var token = Vue.cookie.get(Vue.prototype.$GLOBAL.APP+'token')
  // 如果token失效，则重新获取
  if (!token || token == 'undefined' || token == 'null') {
    return http.get('/uaa/auth/token').then(data => {
      // 获取成功
      if (data.token) {
        // 重置token
        Vue.cookie.set(Vue.prototype.$GLOBAL.APP+'token', data.token, {
          expires: (Vue.prototype.$GLOBAL.TOKENTIME - 2) + 'm'
        });
        // 返回token
        return data.token
      } else {
        // 获取失败
        throw new Error(data.result_msg)
      }
    }).catch(err => {
      // 清空cookie
      clearToken()
      // 跳转到登录页
      router.push('/login')
      Message.error('重新获取token失败，请重新登录 !')
      // throw new Error('重新获取token失败，请重新登录。' + err.message)
    })
  } else {
    return token
  }
}

/**
 * 请求拦截
 */
http.interceptors.request.use(async request => {
  // 如果是登录是不需要任何Authorization的   
  if ('/uaa/auth/login' === request.url) {
    return request

    // 如果是重新获取token，则Authorization需要设置为refreshToken
  } else if ('/uaa/auth/token' === request.url) {
    var refreshToken = getRefreshToken();
    request.headers['Authorization'] = 'Bearer ' + refreshToken
    return request

    // 其余API的Authorization全部使用token
  } else {
    var refreshToken = getRefreshToken();
    var token = await getToken(refreshToken);
    request.headers['Authorization'] = 'Bearer ' + token
    return request;
  }
}, err => {
  return Promise.reject(err)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(res => {
  if (res.data) {
    if (res.data.result_msg && res.data.result_msg !== '' && res.data.status_code !== '200') {
      Message.error(res.data.result_msg)
      router.push('/login');
    }
  }
  return res.data
}, error => {
  console.log(error.response);
  if (error.response) {
    if (error.response.status == 500) {
      Message.error('系统维护中,请稍后在试 !')
    } else {
      Message.error(error.response.data.msg || error.response.data.result_msg)
    }
  } else {
    Message.error('请求超时,请稍后在试 !')
  }
  return Promise.reject(error)
})

export default http
