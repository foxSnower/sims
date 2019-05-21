import Vue from 'vue'
import store from '../store'
import {
  codeToName
} from '@utils';

//0.初始状态, 1.已保存未提交,2.风控智审 3.审批中, 4.已完结, 5.注销,6.拒绝
Vue.filter('businessStatusName', function (value) {
  switch (value) {
    case '0':
    case '10':
      return '草稿';
      break;
    case '20':
      return '风控智审';
      break;
    case '30':
      return '审批中';
      break;
    case '40':
      return '出款申请';
      break;
    case '31':
      return '审批驳回';
      break;
    case '100':
      return '已完结';
      break;
    case '99':
      return '注销';
      break;
    case '90':
      return '拒绝';
      break;
    default:
      break;
  }
});
let businessStatusName = Vue.filter("businessStatusName");


Vue.filter('filterNull', function (value) {
  if (value == null) {
    return '-'
  } else {
    return value
  }
});
let filterNull = Vue.filter("filterNull");

Vue.filter('positiveNumber', function (value) {
  if (parseFloat(value) < 0) {
    return -value
  } else {
    return value
  }
});
let positiveNumber = Vue.filter("positiveNumber");


Vue.filter('filtersBankAccount', function (value) {
  let bankCard = value
    .replace(/\s/g, '')
    .replace(/[^\d]/g, '')
    .replace(/(\d{4})(?=\d)/g, '$1 ');
  return bankCard;
});
let filtersBankAccount = Vue.filter("filtersBankAccount");


//格式化日期
Vue.filter('filtersFormatTime', function (value, dateType) {
  if (Object.prototype.toString.call(value) === '[object Number]') {
    //dateType==''yyyy-MM-dd HH:mm:ss'
    dateType = dateType ? dateType : 'yyyy-MM-dd';
    return format(value, dateType)
  } else {
    return value
  }
});
let filtersFormatTime = Vue.filter("filtersFormatTime");

//格式化金钱
Vue.filter('filtersMoney', function (value) {
  if (value) {
    return '￥' + value;
  } else {
    return '-'
  }


});
let filtersMoney = Vue.filter("filtersMoney");


//格式化路由
Vue.filter('filterRouterName', function (name) {
  if (name.indexOf('?') >= 0) {
    return name.substr(0, name.indexOf('?'));
  } else {
    return name
  }


});
let filterRouterName = Vue.filter("filterRouterName");


//格式化客户类型
Vue.filter('fiterCustomerType', function (value) {
  if (value === 'PERSON') {
    return '个人客户'
  } else {
    return '企业客户'
  }
});
let fiterCustomerType = Vue.filter("fiterCustomerType");

//格式化证件类型
Vue.filter('fiterCardType', function (value) {
  if (value === 'ID_card') {
    return '身份证'
  } else if (value == 'home_visit') {
    return '回乡证'
  } else if (value == 'taiwan_card') {
    return '台胞证'
  } else {
    return value
  }
});
let fiterCardType = Vue.filter("fiterCardType");


//格式化性别
Vue.filter('filterSex', function (value) {
  if (parseFloat(value) === 1) {
    return '男'
  } else {
    return '女'
  }
});
let filterSex = Vue.filter("filterSex");

//格式化毫秒数值装yyyy-MM-dd
Vue.filter('filterMs', function (value) {
  if (Object.prototype.toString.call(value) === '[object Number]') {
    let d = new Date(value)
    return d.getFullYear() + '-' + d.getMonth() + 1 + '-' + d.getDate();
  } else {
    return value
  }
});
let filterMs = Vue.filter("filterMs");

//格式化性别
Vue.filter('filterBoolean', function (value) {
  if (value == true || value == 1 || value == '1') {
    return '是'
  } else {
    return '否'
  }
});
let filterBoolean = Vue.filter("filterBoolean");

//格式化step2动态配置回显设置
Vue.filter('filterFieldName', function (value, row, itemX) {
  if (itemX.format == null || itemX.format == '') {
    return value
  } else {
    let _Array = itemX.format.split(':');
    let _Name = _Array[0];
    let _Rules = _Array[1];
    switch (_Name) {
      case 'codeToName':
        let returnVal = value;
        if (_Rules == 'JSON') {
          let dataSource = JSON.parse(itemX.dataSource);
          let length = dataSource.length;
          for (let i = 0; i < length; i++) {
            if (dataSource[i].code == value) {
              returnVal = dataSource[i].name;
            }
          }
          return returnVal
        } else {
          returnVal = row[_Rules];
          return returnVal
        }
        break;
      case 'specialFormat':
        if (_Rules == 'bankCard' && value) {
          let bankCard = value
            .replace(/\s/g, '')
            .replace(/[^\d]/g, '')
            .replace(/(\d{4})(?=\d)/g, '$1 ');
          return bankCard;
        } else {
          return '-'
        }
        break;
      case 'boolean':
        if (parseFloat(value)) {
          return '是'
        } else if (!parseFloat(value)) {
          return '否'
        } else {
          return '-'
        }
        break;
      case 'codeToAddress':
        let provinceName, cityeName, countyName, showName;
        if (value) {
          let provinceCodeList = store.state.baseData.provinceCode;
          let cityCodeList = store.state.baseData.cityCode;
          let countyCodeList = store.state.baseData.countyCode;
          provinceName = codeToName(value[0], provinceCodeList)
          cityeName = codeToName(value[1], cityCodeList)
          countyName = codeToName(value[2], countyCodeList)
        } else {
          let fieldName = itemX.fieldName;
          let addressKey = fieldName.split('_')[0];
          for (let i in row) {
            let iArray = i.split('_');
            let rowkey = iArray[0];
            let rowValue = iArray[iArray.length - 2];
            let rowName = iArray[iArray.length - 1];
            if (rowkey == addressKey) {
              if (rowValue == 'province' && rowName == 'name') {
                provinceName = row[i];
              }
              if (rowValue == 'city' && rowName == 'name') {
                cityeName = row[i];
              }
              if (rowValue == 'county' && rowName == 'name') {
                countyName = row[i];
              }
            }
          }
        }
        if (provinceName) {
          showName = provinceName;
        }
        if (cityeName) {
          showName += '/' + cityeName;
        }
        if (countyName) {
          showName += '/' + countyName;
        }
        if (showName) {
          return showName
        } else {
          return ''
        }
        break;
      default:
        return value
        break;
    }
  }
});
let filterFieldName = Vue.filter("filterFieldName");


function format(time, format) {
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

Vue.filter('fiterPrivate', function (value, type) {
  if (value) {
    switch (type) {
      case 'phone':
        //隐私电话号码
        if (value.length == '11') {
          return value.substr(0, 3) + ' **** ' + value.substr(7);
        } else {
          return value
        }
        break;
      case 'identify':
      case 'unitCode':
        //隐私证件号码/隐私统一社会信用代码
        return value.substr(0, 6) + ' **** **** *** ' + value.substr(value.length - 1);
        break;
      case 'bank':
        //隐私银行卡号
        return value.substr(0, 6) + ' **** **** ' + value.substr(value.length - 4);
        break;
      default:
        return value
        break;
    }
  } else {
    return value
  }
});


Vue.filter('bankCardCGStatus', function (value, type, customerType) {
  if (value) {
    switch (value) {
      //未注册/未提交/未绑定--//申请提交
      case '20':
      case '30':
        if (type == 'status') {
          return '未注册'
        } else {
          return '注册'
        }
        break;
      case '40':
        if (type == 'status') {
          return '补充资料'
        } else {
          return '上传资料'
        }
        break;
      case '41':
        if (type == 'status') {
          return '审核中'
        } else {
          return ''
        }
        break;
      case '42':
        if (type == 'status') {
          return '审核回退'
        } else {
          return '上传资料'
        }
        break;
      case '50':
        if (type == 'status') {
          return '解绑中'
        } else {
          return ''
        }
        break;
      case '51':
        if (type == 'status') {
          return '解绑审批失败'
        } else {
          return '重新上传资料'
        }
        break;
      case '99':
        if (type == 'status') {
          return '鉴权失败'
        } else {
          return ''
        }
        break;
      case '10':
        if (type == 'status') {
          return '已注册'
        } else {
          if (customerType == 'PERSON') {
            return '解绑'
          } else {
            return ''
          }
        }
        break;
      default:
        return value
        break;
    }
  } else {
    return value
  }
});

Vue.filter('filterPledgor', function (value) {
  if (value == null) {
    return '-'
  } else {
    switch (value) {
      case '0':
        return '房管所有要求只能填写房产证登记的权属人'
        break;
      case '1':
        return '房管所无特殊要求,按公司要求需填写隐性共有人'
        break;
      default:
        break;
    }
  }
});

Vue.filter('filterPledgor', function (value) {
  if (value == null) {
    return '-'
  } else {
    switch (value) {
      case '0':
        return '房管所有要求只能填写房产证登记的权属人'
        break;
      case '1':
        return '房管所无特殊要求,按公司要求需填写隐性共有人'
        break;
      default:
        break;
    }
  }
});


Vue.filter('temporarilyPrice', function (value) {
  if (value == null) {
    return '-'
  } else {
    switch (value) {
      case '0':
        return '房管所有特殊要求,暂不填写,待合同打印后再填写'
        break;
      case '1':
        return '房管所有特殊要求,能确定暂作价为：'
        break;
      case '2':
        return '按(所有抵押顺位的债权金额总和+本次借款金额)*1.2 倍与房产评估总价对比,取较大值填写'
        break;
      default:
        break;
    }
  }
});
