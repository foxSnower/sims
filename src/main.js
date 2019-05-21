import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import VueCookie from 'vue-cookie'

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

import global_ from './api/global.js'
import filters from './utils/filters.js'
import api from './api/api.js'


//Vue.use(Viewer) 默认配置写法
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
})

Vue.use(ElementUI)
Vue.use(VueCookie)

//全局指令
Vue.directive('drag', {
  // 指令的定义
  bind: function (el, binding) {
    console.log(binding);

    let oDiv = el; //当前元素
    let self = this; //上下文
    oDiv.onmousedown = function (e) {
      //鼠标按下，计算当前元素距离可视区的距离
      let disX = e.clientX - oDiv.offsetLeft;
      let disY = e.clientY - oDiv.offsetTop;

      document.onmousemove = function (e) {
        //通过事件委托，计算移动的距离
        let l = e.clientX - disX;
        let t = e.clientY - disY;
        //移动当前元素
        oDiv.style.left = l + 'px';
        oDiv.style.top = t + 'px';
      };
      document.onmouseup = function (e) {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }
})

// /**  
// * 得到一个数组不重复的元素集合<br/>  
// * 唯一化一个数组  
// * @returns {Array} 由不重复元素构成的数组  
// */  
// Array.prototype.uniquelize = function(){  
//   var ra = new Array();  
//   for(var i = 0; i < this.length; i ++){  
//       if(!ra.contains(this[i])){  
//          ra.push(this[i]);  
//       }  
//   }  
//   return ra;  
// };

// /**  
// * each是一个集合迭代函数，它接受一个函数作为参数和一组可选的参数  
// * 这个迭代函数依次将集合的每一个元素和可选参数用函数进行计算，并将计算得的结果集返回   
// * @param {Function} fn 进行迭代判定的函数  
// * @param more ... 零个或多个可选的用户自定义参数  
// * @returns {Array} 结果集，如果没有结果，返回空集  
// */  
// Array.prototype.each = function(fn){  
//  fn = fn || Function.K;  
//   var a = [];  
//   var args = Array.prototype.slice.call(arguments, 1);  
//   for(var i = 0; i < this.length; i++){  
//       var res = fn.apply(this,[this[i],i].concat(args));  
//       if(res != null) a.push(res);  
//   }  
//   return a;  
// }; 

// /**
// * 两个集合的差集
// * @param {Array} a 集合A  
// * @param {Array} b 集合B  
// * @returns {Array} 两个集合的差集  
// */  
// Array.minus = function(a, b){  
//   return a.uniquelize().each(function(o){return b.contains(o) ? null : o});  
// };

// /**  
// * 求两个集合的并集   
// * @param {Array} a 集合A  
// * @param {Array} b 集合B  
// * @returns {Array} 两个集合的并集  
// */  
// Array.union = function(a, b){  
//   return a.concat(b).uniquelize();  
// }; 

// /**  
// * 求两个集合的差集  
// * @param {Array} a 集合A  
// * @param {Array} b 集合B  
// * @returns {Array} 两个集合的差集  
// */  
// Array.minus = function(a, b){  
//   return a.uniquelize().each(function(o){return b.contains(o) ? null : o});  
// }; 

// /**  
// * 求两个集合的交集   
// * @param {Array} a 集合A  
// * @param {Array} b 集合B  
// * @returns {Array} 两个集合的交集  
// */  
// Array.intersect = function(a, b){  
//   return a.uniquelize().each(function(o){return b.contains(o) ? o : null});  
// }; 

// /**  
// * 求两个集合的补集   
// * @param {Array} a 集合A  
// * @param {Array} b 集合B  
// * @returns {Array} 两个集合的补集  
// */  
// Array.complement = function(a, b){  
//   return Array.minus(Array.union(a, b),Array.intersect(a, b));  
// };

// /**
// * Array扩展包含函数
// */
// Array.prototype.contains = function (obj) {  
//  var i = this.length;  
//  while (i--) {  
//      if (this[i] === obj) {  
//          return true;  
//      }  
//  }  
//  return false;  
// }

window.Vue = new Vue({
  el: '#web',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
