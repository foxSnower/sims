import is from 'is-js'
import BIN from 'bankcardinfo';
import router from '../router'
import Vue from 'vue';

// 设置本地址存储
export const setLocalStorage = (name, value) => {
  if (!name || !value) {
    console.log('params is invalid!')
  }
  if (is.object(value)) {
    value = JSON.stringify(value)
  }
  localStorage.setItem(name, value)
}

// 取本地存储
export const getLocalStorage = (name) => {
  if (!name) {
    console.log('param is empty!')
  }
  try {
    return JSON.parse(localStorage.getItem(name))
  } catch (err) {
    return localStorage.getItem(name)
  }
}

// 删除本地存储
export const delLocalStorage = (name) => {
  if (!name) {
    console.log('param is empty!')
  }
  localStorage.removeItem(name)
}

// 循环菜单取子菜单的title
export const getSubMenuArr = (menu, curPathName) => {
  let openedSubMenu = []
  if (!is.array(menu) || !curPathName) {
    console.log('params is error!')
  }
  for (let i = 0; i < menu.length; i++) {
    let item = menu[i];
    if (item.children && item.children.length > 0) {
      item.children.forEach((ele, index) => {
        if (ele.name == curPathName) {
          openedSubMenu.push(item.title)
        }
      });
      getSubMenuArr(item.children, curPathName)
    }
  }
  return openedSubMenu
}

// 数组当中是否存在某个对象
export const oneOf = (ele, targetArr) => {
  if (targetArr.indexOf(ele) >= 0) {
    return true;
  } else {
    return false;
  }
}

// 获取picker的shortcuts的配置
export const shortcuts = [{
  text: '最近一周',
  onClick(picker) {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
    picker.$emit('pick', [start, end]);
  }
}, {
  text: '最近一个月',
  onClick(picker) {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
    picker.$emit('pick', [start, end]);
  }
}, {
  text: '最近三个月',
  onClick(picker) {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
    picker.$emit('pick', [start, end]);
  }
}]

export const shortcutsForOne = [{
  text: '今天',
  onClick(picker) {
    picker.$emit('pick', new Date());
  }
}, {
  text: '昨天',
  onClick(picker) {
    const date = new Date();
    date.setTime(date.getTime() - 3600 * 1000 * 24);
    picker.$emit('pick', date);
  }
}, {
  text: '一周前',
  onClick(picker) {
    const date = new Date();
    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
    picker.$emit('pick', date);
  }
}]


export const moneyFormatter = (num) => {
  num = num.toFixed(2);
  num = parseFloat(num)
  num = num.toLocaleString();
  num = '￥' + num;
  return num;
}


// 验证规则
export const validator = {
  normal: (rule, value, callback) => {
    if (!value && value !== 0) {
      return callback(new Error(rule.name + '不能为空!'));
    } else {
      callback();
    }
  },
  money:(rule, value, callback) => {
    if (!value) {
      return callback(new Error(rule.name + '不能为空!'));
    }
    let regex = new RegExp(/^[1-9]\d*\.\d*|0\.\d*[1-9]\d*|^[1-9]\d*|0$/);
    if (regex.test(value)) {
      callback();
    } else {
      callback(new Error('请输入正确的格式,例:10000' + rule.name));
    }
  },
  phone: (rule, value, callback) => {
    if (!value) {
      return callback(new Error(rule.name + '不能为空!'));
    }
    let regex = new RegExp(/^1[34578]\d{9}$/);
    if (regex.test(value)) {
      callback();
    } else {
      callback(new Error('请输入正确的' + rule.name));
    }
  },
  phone2: (rule, value, callback) => {
    if (!value) {
      return callback();
    }
    let regex = new RegExp(/^1\d{10}$/);
    if (regex.test(value)) {
      callback();
    } else {
      callback(new Error('请输入正确的' + rule.name));
    }
  },
  email: (rule, value, callback) => {
    if (!value) {
      return callback(new Error(rule.name + '不能为空!'));
    }
    let regex = new RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
    if (regex.test(value)) {
      callback();
    } else {
      callback(new Error('请输入正确的' + rule.name));
    }
  },
  url: (rule, value, callback) => {
    if (!value && value !== 0) {
      return callback(new Error(rule.name + '不能为空!'));
    }
    let regex = new RegExp(/(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/);
    if (regex.test(value)) {
      callback();
    } else {
      callback(new Error('请输入正确的' + rule.name));
    }
  },
  number: (rule, value, callback) => {
    if (!value && value !== 0) {
      return callback(new Error(rule.name + '不能为空!'));
    }
    if (isNaN(value)) {
      return callback(new Error('请输入数值'));
    } else {
      callback();
    }
  },
  age: (rule, value, callback) => {
    if (!value && value !== 0) {
      return callback(new Error(rule.name + '不能为空!'));
    }
    if (isNaN(value)) {
      return callback(new Error('请输入数值!'));
    } else if (value < 18 || value > 80) {
      return callback(new Error('请输入18以上80以下的数值!'));
    } else {
      callback();
    }
  },
  is: (rule, value, callback) => {
    if (value === '' || value === null) {
      return callback(new Error(rule.name + '不能为空!'));
    } else {
      callback();
    }
  },
  //银行卡
  bank: (rule, value, callback) => { ///^([1-9]{1})(\d{14}|\d{18})$/
    if (!value && value !== 0) {
      return callback(new Error(rule.name + '不能为空!'));
    } else {
      let filterVal = value.replace(/(^\s+)|(\s+$)/g, '');
      filterVal = filterVal.replace(/\s/g, '');
      console.log(filterVal);

      BIN.getBankBin(filterVal)
        .then(function (data) {
          callback();
        })
        .catch(function (err) {
          return callback(new Error('该银行卡不存在!'));
        });
    }
  },
  date: (rule, value, callback) => {
    if (!value) {
      return callback(new Error('请输入日期'));
    }
    let regex = new RegExp(/^(\d{4})[-\/](\d{1}|0\d{1}|1[0-2])([-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/);
    if (regex.test(value)) {
      callback();
    } else {
      callback(new Error('请输入正确的日期格式'));
    }
  },

  /**
   * 台胞证
   * https://www.jb51.net/article/73496.htm
   */
  taiwan: (rule, value, callback) => {
    if (!value && value !== 0) {
      return callback(new Error(rule.name + '不能为空!'));
    }
    var re1 = new RegExp(/^[0-9]{8}$/);
    var re2 = new RegExp(/^[0-9]{10}$/);
    if (re1.test(value) || re2.test(value)) {
      callback();
    } else {
      callback(new Error('请输入正确的' + rule.name));
    }
  },
  homeCard: (rule, value, callback) => {
    if (!value && value !== 0) {
      return callback(new Error(rule.name + '不能为空!'));
    }
    var re1 = new RegExp(/^[a-zA-Z]\d{8}$/);
    if (re1.test(value)) {
      callback();
    } else {
      callback(new Error('请输入正确的' + rule.name));
    }
  },
  /**
   * 护照
   * https://www.jb51.net/article/73496.htm
   */
  passport: (rule, value, callback) => {
    if (!value && value !== 0) {
      return callback(new Error(rule.name + '不能为空!'));
    }
    var re1 = new RegExp(/^[a-zA-Z]{5,17}$/);
    var re2 = new RegExp(/^[a-zA-Z0-9]{5,17}$/);
    if (re1.test(value) || re2.test(value)) {
      callback();
    } else {
      callback(new Error('请输入正确的' + rule.name));
    }
  },
  /**
   * 身份证
   * https://www.jb51.net/article/73496.htm
   */
  identity: (rule, value, callback) => {
    if (!value && value !== 0) {
      return callback(new Error(rule.name + '不能为空!'));
    }
    // let regex = new RegExp(/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/);
    let isRight = validateIdCard(value);
    if (isRight) {
      callback();
    } else {
      callback(new Error('请输入正确的' + rule.name));
    }
  },
  //统一社会信用代码
  unifiedCode: (rule, value, callback) => {
    if (!value && value !== 0) {
      return callback(new Error(rule.name + '不能为空!'));
    }
    let isRight = CheckSocialCreditCode(value);
    if (isRight) {
      callback();
    } else {
      callback(new Error('不是有效的统一社会信用编码!'));
    }
  },
  curLiabilities: (rule, value, callback) => {
    if (!value && value !== 0) {
      return callback(new Error(rule.name + '不能为空!'));
    }
    if (isNaN(value)) {
      return callback(new Error('请输入数值'));
    } else if (value < 0) {
      return callback(new Error('当前负债必须大于0'));
    } else {
      callback();
    }
  },
  // /^[1-9]\d*万元$|^无$/
  worth: (rule, value, callback) => {
    if (!value && value !== 0) {
      return callback();
    }
    var re1 = new RegExp(/^[1-9]\d*万元$|^无$/);
    if (re1.test(value)) {
      callback();
    } else {
      callback(new Error('请输入正确的' + rule.name));
    }
  }
}

//基础数据code与name之间的切换
export const codeToName = (code, array) => {
  let name = null;
  if (array && array.length > 0) {
    array.forEach((x) => {
      if (x.code == code) {
        name = x.name
      }
    })
  }
  return name
}


export const changeCodeName = (code, codeName, array) => {
  let name = null;
  if (array && array.length > 0) {
    array.forEach(x => {
      if (x[codeName[0]] == code) {
        name = x[codeName[1]];
      }
    });
  }
  return name;
}





export const GetAge = (identityCard) => {
  var len = (identityCard + "").length;
  if (len == 0) {
    return 0;
  } else {
    if ((len != 15) && (len != 18)) //身份证号码只能为15位或18位其它不合法
    {
      return 0;
    }
  }
  var strBirthday = "";
  if (len == 18) //处理18位的身份证号码从号码中得到生日和性别代码
  {
    strBirthday = identityCard.substr(6, 4) + "/" + identityCard.substr(10, 2) + "/" + identityCard.substr(12, 2);
  }
  if (len == 15) {
    strBirthday = "19" + identityCard.substr(6, 2) + "/" + identityCard.substr(8, 2) + "/" + identityCard.substr(10, 2);
  }
  //时间字符串里，必须是“/”
  var birthDate = new Date(strBirthday);
  var nowDateTime = new Date();
  var age = nowDateTime.getFullYear() - birthDate.getFullYear();
  //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
  if (nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}


export const MsFormatDate = (time, format) => {
  var t = new Date(time);
  var tf = function (i) {
    return (i < 10 ? '0' : '') + i
  };
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
    switch (a) {
      case 'yyyy':
        return tf(t.getFullYear());
        break;
      case 'MM':
        return tf(t.getMonth() + 1);
        break;
      case 'mm':
        return tf(t.getMinutes());
        break;
      case 'dd':
        return tf(t.getDate());
        break;
      case 'HH':
        return tf(t.getHours());
        break;
      case 'ss':
        return tf(t.getSeconds());
        break;
    }
  })
}

//身份证验证 validateIdCard('452428199505020325')=====返回true
//根据身份证判断性别以前出生年月 validateIdCard('452428199505020325',true)=====返回Object
export const validateIdCard = (id, backInfo) => {
  let info = {
      y: "1900",
      m: "01",
      d: "01",
      sex: "male",
      valid: false,
      length: 0
    },
    initDate = function (length) {
      info.length = length;
      let a = length === 15 ? 0 : 2, // 15:18
        temp;
      info.y = (a ? "" : "19") + id.substring(6, 8 + a);
      info.m = id.substring(8 + a, 10 + a);
      info.d = id.substring(10 + a, 12 + a);
      info.sex = id.substring(14, 15 + a) % 2 === 0 ? "1" : "0"; //0男 1女
      temp = new Date(info.y, info.m - 1, info.d);
      return (temp.getFullYear() == info.y * 1) &&
        (temp.getMonth() + 1 == info.m * 1) &&
        (temp.getDate() == info.d * 1);
    },
    back = function () {
      return backInfo ? info : info.valid;
    };
  if (typeof id !== "string") return back();
  // 18
  if (/^\d{17}[0-9x]$/i.test(id)) {
    if (!initDate(18)) return back();
    id = id.toLowerCase().split("");
    let wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
      y = "10x98765432".split(""),
      sum = 0;
    for (let i = 0; i < 17; i++) sum += wi[i] * id[i];
    if (y[sum % 11] === id.pop().toLowerCase()) info.valid = true;
    return back();
  }
  // 15
  else if (/^\d{15}$/.test(id)) {
    if (initDate(15)) info.valid = true;
    return back();
  } else {
    return back();
  }
};

//统一社会信用代码 CheckSocialCreditCode('92330783MA29QJ0F5X')
export const CheckSocialCreditCode = (Code) => {
  var patrn = /^[0-9A-Z]+$/;
  //18位校验及大写校验
  if ((Code.length != 18) || (patrn.test(Code) == false)) {
    // console.info("不是有效的统一社会信用编码！");
    return false;
  } else {
    var Ancode; //统一社会信用代码的每一个值
    var Ancodevalue; //统一社会信用代码每一个值的权重
    var total = 0;
    var weightedfactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28]; //加权因子
    var str = '0123456789ABCDEFGHJKLMNPQRTUWXY';
    //不用I、O、S、V、Z
    for (var i = 0; i < Code.length - 1; i++) {
      Ancode = Code.substring(i, i + 1);
      Ancodevalue = str.indexOf(Ancode);
      total = total + Ancodevalue * weightedfactors[i];
      //权重与加权因子相乘之和
    }
    var logiccheckcode = 31 - total % 31;
    if (logiccheckcode == 31) {
      logiccheckcode = 0;
    }
    var Str = "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y";
    var Array_Str = Str.split(',');
    logiccheckcode = Array_Str[logiccheckcode];


    var checkcode = Code.substring(17, 18);
    if (logiccheckcode != checkcode) {
      // console.info("不是有效的统一社会信用编码！");
      return false;
    } else {
      // console.info("yes");
    }
    return true;
  }
}

//判断对象或数据是否为空
export const isEmpty = (obj) => {
  // 检验 undefined 和 null
  if (obj == null) {
    return true;
  }

  if (Array.prototype.isPrototypeOf(obj) && obj.length === 0) {
    return true;
  }

  if (Object.prototype.isPrototypeOf(obj) && Object.keys(obj).length === 0) {
    return true;
  }
  return false;
}

//滚动条到验证不通过的节点附件
export const validScrollTop = (obj) => {
  for (let j in obj) {
    let form = document.querySelectorAll('.el-form-item label');
    // let _header = document.querySelectorAll('.el-collapse-item__header');
    for (let m in form) {
      let lableName = form[m].getAttribute('for');
      if (lableName === j) {
        let scrollTopDom = document.querySelector('.el-main');
        if (form[m].offsetTop < 150) {
          try {
            scrollTopDom.scrollTop = form[m].offsetParent.offsetParent.offsetParent.offsetTop;
          } catch (error) {}
        } else {
          scrollTopDom.scrollTop = form[m].offsetTop;
        }


        return false;
      }
    }
  }
}

//比较两个日期
export const checkDate = (_data1) => {
  //得到日期值并转化成日期格式，replace(/\-/g, "\/")是根据验证表达式把日期转化成长日期格式，这样
  //再进行判断就好判断了
  if (_data1 == '' || _data1 == null) {
    return false
  }
  var sDate = new Date(_data1.replace(/\-/g, "\/"));
  var eDate = new Date();
  if (sDate > eDate) {
    return true;
  }
  return false;
}
