import Vue from 'vue'
import http from './http.js'
import {
  Message
} from 'element-ui';

const SYSTEM = '/sims-service';
const CUSTOMER = '/crm-api-service';
const UPFILE = '/cmp/fms'; //上传附件
const TEST = 'http://172.16.202.214:33011'

const comAPI = (method, url, params) => {
  switch (method) {
    case 'post':
      return http.post(url, params).then(res => {
        if (res.returnCode == "0000" || res.code == 0 || res.code == "0000") {
          return res
        } else {
          // Message.error(res.codeDesc || res.msg)
          return res
        }
      })
      break;
    case 'get':
      return http.get(url, {
        params
      }).then(res => {
        if (res.returnCode == "0000" || res.code == 0 || res.code == "0000") {
          return res
        } else {
          // Message.error(res.codeDesc || res.msg)
          return res
        }
      })
      break;
    case 'upload':
      let query = '';
      for (const key in params) {
        query += key + '=' + params[key] + '&';
      }
      query = query.substring(0, query.length - 1);
      return http.post(url + '?' + query)
      break;
    default:
      break;
  }

}

const api = {
  //网关
  gateway(params) {
    return comAPI('get', '/gateway/get', params)
  },
  //登陆
  login(params) {
    return comAPI('post', '/uaa/auth/login', params)
  },
  //获取菜单
  loadMenu(params) {
    return comAPI('get', '/uc/auth/loadMenu', params)
  },
  //用户信息
  getLoginInfo(params) {
    return comAPI('get', SYSTEM + '/uc/getLoginInfo', params)
  },
  //获取tocken
  getTocken(params) {
    return comAPI('get', '/uaa/auth/token', params)
  },
  //基础数据
  getCurrTypeValList(params) {
    return comAPI('post', SYSTEM + '/biz/getCurrTypeValList', params)
  },
  //获取下一层级值列表
  getNextChildValList(params) {
    return comAPI('post', SYSTEM + '/biz/getNextChildValList', params)
  },
  //获取业务操作记录列表
  operateDataGetList(params) {
    return comAPI('post', SYSTEM + '/operateData/getList', params)
  },
  //----------------------授信申请---------------------//
  //产品类型
  getProductTypeList(params) {
    return comAPI('post', SYSTEM + '/product/basic/getProductTypeList', params)
  },
  //产品系列类型
  getProductSeriesList(params) {
    return comAPI('post', SYSTEM + '/product/basic/getProductSeriesList', params)
  },
  //产品列表
  getProductList(params) {
    return comAPI('post', SYSTEM + '/product/getProductList', params)
  },
  //用户中心-查询业务员列表
  getUserListByUserId(params) {
    return comAPI('post', SYSTEM + '/uc/getUserListByUserId', params)
  },
  //获取进件要素
  getEntryElementInfoDetai(params) {
    return comAPI('post', SYSTEM + '/product/getEntryElementInfoDetail', params)
  },
  //授信申请流程进度
  creditQueryApproveProgress(params) {
    return comAPI('post', SYSTEM + '/apms/queryApproveProgress', params)
  },
  //授信-出款编辑
  paymentContinueEdit(params) {
    return comAPI('post', SYSTEM + '/paymentEditor/continueEdit', params)
  },
  //授信-出款编辑提交
  paymentEditorCommit(params) {
    return comAPI('post', SYSTEM + '/paymentEditor/commit', params)
  },
  //获取可驳回的节点
  queryRejectApprovedNode(params) {
    return comAPI('get', SYSTEM + '/approved/queryRejectApprovedNode', params)
  },
  //驳回提交
  submitReject(params) {
    return comAPI('post', SYSTEM + '/approved/submitReject', params)
  },
  //获取未上标的数据
  getNonPushIssueData(params) {
    return comAPI('get', SYSTEM + '/multipleIssue/getNonPushIssueData', params)
  },
  //上标提现提交
  multipleIssueCommit(params) {
    return comAPI('post', SYSTEM + '/multipleIssue/commit', params)
  },
  //授信结果
  creditResultGetList(params) {
    return comAPI('post', SYSTEM + '/creditResult/getList', params)
  },
  //获取申请列表
  creditGetList(params) {
    return comAPI('post', SYSTEM + '/accreditCreditManage/getList', params)
  },
  //订单数量统计
  creditOrderStatistics(params) {
    return comAPI('get', SYSTEM + '/accreditCreditManage/orderStatistics', params)
  },
  //注销申请
  creditDoCancel(params) {
    return comAPI('get', SYSTEM + '/accreditCreditManage/doCancel', params)
  },
  //删除申请
  creditDoDelete(params) {
    return comAPI('get', SYSTEM + '/accreditCreditManage/doDelete', params)
  },
  //撤回申请
  creditDoRevoke(params) {
    return comAPI('get', SYSTEM + '/accreditCreditManage/doRevoke', params)
  },
  //授信保存
  // creditSave(params) {
  //   return comAPI('post', SYSTEM + '/grant/save', params)
  // },
  //授信提交
  creditCommit(params) {
    return comAPI('post', SYSTEM + '/grant/commit', params)
  },
  //授信保存并提交
  // creditSaveAndCommit(params) {
  //   return comAPI('post', SYSTEM + '/grant/saveAndCommit', params)
  // },

  // 获取文件类型列表---文件上传
  getAllChildFileType(params) {
    return comAPI('upload', UPFILE + '/outservice/getAllChildFileType', params)
  },
  // 根据产品编号、业务编号获取已上传的附件列表
  getFileInfoByBusinessId(params) {
    return comAPI('post', UPFILE + '/outservice/getFileInfoByBusinessId', params)
  },
  // 文件上传
  uploadFileNew(params) {
    return comAPI('upload', UPFILE + '/fileInfo/uploadFile', params)
  },
  // 文件删除
  fileDel(params) {
    return comAPI('post', UPFILE + '/outservice/fileDel', params)
  },
  //审批催办
  approvalReminder(params) {
    return comAPI('get', UPFILE + '/message/approvalReminder', params)
  },
  // //授信-查询客户正在申请授信业务
  // queryApplyingCredit(params) {
  //   return comAPI('post', SYSTEM + '/grant/queryApplyingCredit', params)
  // },
  //授信-第一步进入第二步 --其包括查询了是否该用户存在申请单,并且如果该用户可以申请单的话会把数据传回
  saveCreditBasicInfo(params) {
    return comAPI('post', SYSTEM + '/creditApplication/saveCreditBasicInfo', params)
  },
  //授信-<动态配置>详情
  detailConfig(params) {
    return comAPI('post', SYSTEM + '/grant/detailConfig', params)
  },
  //授信-<动态配置>保存
  saveConfig(params) {
    return comAPI('post', SYSTEM + '/grant/saveConfig', params)
  },
  //保存授信共借人客户信息
  saveBorrowerCustomer(params) {
    return comAPI('post', SYSTEM + '/customerTogether/save', params)
  },
  //获取授信共借人客户信息
  getCustomerCodeList(params) {
    return comAPI('get', SYSTEM + '/customerTogether/getCustomerCodeList', params)
  },
  //----------------------授信申请---------------------//

  //----------------------用信---------------------//
  //用信-编辑
  youxinInput(params) {
    return comAPI('post', SYSTEM + '/useCredit/input', params)
  },
  //用信-编辑
  youxinContinueEdit(params) {
    return comAPI('post', SYSTEM + '/useCredit/continueEdit', params)
  },
  //用信申请--获取还款方式
  getPaymentModeList(params) {
    return comAPI('post', SYSTEM + '/product/getPaymentModeList', params)
  },
  //用信申请--获取资金渠道
  getFundChannelList(params) {
    return comAPI('post', SYSTEM + '/product/getFundChannelList', params)
  },
  //用信申请--获取期数列表
  getPeriodsList(params) {
    return comAPI('post', SYSTEM + '/product/getPeriodsList', params)
  },
  //用信申请--费用计划生成
  createCostPlan(params) {
    return comAPI('post', SYSTEM + '/product/createCostPlan', params)
  },
  //用信申请--通过产品编号获取最新版本号
  getNewVerByProduct(params) {
    return comAPI('post', SYSTEM + '/product/getNewVerByProduct', params)
  },
  //用信申请--通过产品编号获取最产品信息
  getNewVerByProductVo(params) {
    return comAPI('post', SYSTEM + '/product/getNewVerByProductVo', params)
  },
  //用信申请--通过userId查询分公司及其账户详情
  getCompanyInfoDetailByUserId(params) {
    return comAPI('post', SYSTEM + '/uc/getCompanyInfoDetailByUserId', params)
  },
  //用信申请--通过平台类型，借款人类型(个人:1,企业:2),证件号查询借款额度查询
  queryBorrowLimit(params) {
    return comAPI('post', SYSTEM + '/customer/info/queryBorrowLimit', params)
  },
  //用信-保存
  // youxinSave(params) {
  //   return comAPI('post', SYSTEM + '/useCredit/save', params)
  // },
  //用信-保存并提交
  youxinSaveAndCommit(params) {
    return comAPI('post', SYSTEM + '/useCredit/saveAndCommit', params)
  },
  //用信详情
  yongxinDetail(params) {
    return comAPI('post', SYSTEM + '/useCredit/detail', params)
  },
  //注销申请
  yongxinDoCancel(params) {
    return comAPI('get', SYSTEM + '/useCreditManage/doCancel', params)
  },
  //删除申请
  yongxinDoDelete(params) {
    return comAPI('get', SYSTEM + '/useCreditManage/doDelete', params)
  },
  //撤回申请
  yongxinDoRevoke(params) {
    return comAPI('get', SYSTEM + '/useCreditManage/doRevoke', params)
  },
  //获取用信申请列表
  yongxinGetList(params) {
    return comAPI('post', SYSTEM + '/useCreditManage/getList', params)
  },
  //订单数量统计
  yongxinOrderStatistics(params) {
    return comAPI('get', SYSTEM + '/useCreditManage/orderStatistics', params)
  },
  //用信申请房产抵押物信息--授信单号
  getHouseMortgageList(params) {
    return comAPI('get', SYSTEM + '/useCredit/getHouseMortgageList', params)
  },
  //判断用信用户是否已上标
  checkIsPushProject(params) {
    return comAPI('post', SYSTEM + '/apms/approveSuperscript/checkIsPushProject', params)
  },
  //----------------------用信---------------------//

  //----------------------客户---------------------//
  //获取销售员客户列表
  getCustemerListBySalesperson(params) {
    return comAPI('post', SYSTEM + '/customer/info/getCustemerListBySalesperson', params)
  },
  //获取客户详情
  getCustomerDetail(params) {
    return comAPI('get', SYSTEM + '/customer/info/getCustomerDetail', params)
  },
  // 更新客户信息
  updateCustomer(params) {
    return comAPI('post', SYSTEM + '/customer/info/updateCustomer', params)
  },
  // 变更客户敏感信息
  changeSensitiveInfo(params) {
    return comAPI('post', SYSTEM + '/customer/info/changeSensitiveInfo', params)
  },
  //获取短信验证码
  sendMsg(params) {
    return comAPI('get', SYSTEM + '/customer/info/sendMsg', params)
  },
  //----------------------客户--银行卡-------------------//
  //根据客户编号获取银行卡列表
  getBankCardInfoList(params) {
    return comAPI('get', SYSTEM + '/customer/bank/bankCard/getBankCardInfoList', params)
  },
  //新增客户银行卡基础信息
  addBankCardInfo(params) {
    return comAPI('post', SYSTEM + '/customer/bank/bankCard/addBankCardInfo', params)
  },
  //删除客户银行卡基础信息
  delBankCardInfo(params) {
    return comAPI('post', SYSTEM + '/customer/bank/bankCard/delBankCardInfo', params)
  },
  //代扣绑卡申请
  DKbindCardApply(params) {
    return comAPI('post', SYSTEM + '/customer/bank/bindCard/bindCardApply', params)
  },
  //代扣绑卡确认
  DKconfirmBindCard(params) {
    return comAPI('post', SYSTEM + '/customer/bank/bindCard/confirmBindCard', params)
  },
  //代扣银行卡解绑
  DKunBindCard(params) {
    return comAPI('post', SYSTEM + '/customer/bank/bindCard/unBindCard', params)
  },
  //存管激活
  CGactivate(params) {
    return comAPI('get', SYSTEM + '/customer/bank/deposit/activate', params)
  },
  //存管注册
  CGregister(params) {
    return comAPI('post', SYSTEM + '/customer/bank/deposit/register', params)
  },
  //上传资料提交
  CGregisterUpload(params) {
    return comAPI('post', SYSTEM + '/customer/bank/deposit/uploadFile', params)
  },
  //存管解绑卡
  CGunBindCard(params) {
    return comAPI('post', SYSTEM + '/customer/bank/deposit/unBindCard', params)
  },
  //-----------代扣限额维护--------------//
  //新增代扣限额信息
  withholdingLimitAdd(params) {
    return comAPI('post', SYSTEM + '/withholdingLimit/add', params)
  },
  //删除代扣限额信息
  withholdingLimitDelete(params) {
    return comAPI('get', SYSTEM + '/withholdingLimit/delete', params)
  },
  //获取代扣信息(根据渠道进行分组)
  getGroupByChannel(params) {
    return comAPI('get', SYSTEM + '/withholdingLimit/getGroupByChannel', params)
  },
  //获取代扣限额列表
  withholdingLimitGetList(params) {
    return comAPI('post', SYSTEM + '/withholdingLimit/getList', params)
  },
  //更新代扣限额信息
  withholdingLimitUpdate(params) {
    return comAPI('post', SYSTEM + '/withholdingLimit/update', params)
  },
  //----------------------客户---------------------//
  //----------------------分公司信息管理-------------------//
  //获取分公司信息及其账户详情
  getCompanyDetail(params) {
    return comAPI('get', SYSTEM + '/company/getCompanyDetail', params)
  },
  //删除分公司银行账户
  deleteCompanyAccount(params) {
    return comAPI('get', SYSTEM + '/company/deleteCompanyAccount', params)
  },
  //新增修改分公司银行账户
  addOrModifyCompanyAccount(params) {
    return comAPI('post', SYSTEM + '/company/addOrModifyCompanyAccount', params)
  },
  //修改分公司信息
  updateCompanyInfo(params) {
    return comAPI('post', SYSTEM + '/company/updateCompanyInfo', params)
  },
  //----------------------分公司信息管理---------------------//
  //----------------------抵押权人和债权人配置-------------------//
  //获取抵押人和债权人配置列表
  creditorPledgeeGetList(params) {
    return comAPI('post', SYSTEM + '/creditorPledgeeConfig/getList', params)
  },
  //获取担保机构信息
  getGuaranteeOrganList(params) {
    return comAPI('get', SYSTEM + '/creditorPledgeeConfig/getGuaranteeOrganList', params)
  },
  //删除抵押人和债权人配置
  deleteCreditorPledgee(params) {
    return comAPI('get', SYSTEM + '/creditorPledgeeConfig/delete', params)
  },
  //新增抵押人和债权人配置
  addCreditorPledgee(params) {
    return comAPI('post', SYSTEM + '/creditorPledgeeConfig/add', params)
  },
  //更新抵押人和债权人配置
  updateCreditorPledgee(params) {
    return comAPI('post', SYSTEM + '/creditorPledgeeConfig/update', params)
  },
  //获取抵押人和债权人(树)节点列表
  getNodeListCreditorPledgee(params) {
    return comAPI('get', SYSTEM + '/creditorPledgeeConfig/getNodeList', params)
  },
  //----------------------抵押权人和债权人配置---------------------//


  queryCostPlan(params) {
    return comAPI('post', SYSTEM + '/costPlan/getDetail', params)
  },
  queryPrototypeManage(params) {
    return comAPI('post', SYSTEM + '/prototypeManage/getList', params)
  },
  //获取费用明细
  getIssueCostDetailByBizId(params) {
    return comAPI('get', SYSTEM + '/provider/creditDetail/getIssueCostDetailByBizId', params)
  },
  // /prototypeManage/reject
  prototypeManageReject(params) {
    return comAPI('get', SYSTEM + '/prototypeManage/reject', params)
  },
  //   获取机构集合:
  getBusiOrgList(params) {
    return comAPI('get', SYSTEM + '/organization/getBusiOrgList', params)
  },
  //   根据机构获取用户集合:
  getUserListByBusiOrg(params) {
    return comAPI('get', SYSTEM + '/organization/getUserListByBusiOrg', params)
  },
  prototypeManageDistribution(params) {
    return comAPI('post', SYSTEM + '/prototypeManage/distribution', params)
  },

  //---------------鸿保贷-------------------//
  //删除接洽内容
  preContractInfoDelete(params) {
    return comAPI('get', SYSTEM + '/preContractInfo/delete', params)
  },
  //获取列表
  preContractInfoGetList(params) {
    return comAPI('post', SYSTEM + '/preContractInfo/getList', params)
  },
  //新增接洽
  preContractInfoSave(params) {
    return comAPI('post', SYSTEM + '/preContractInfo/save', params)
  },
  //接洽跟踪
  preContractInfoTrack(params) {
    return comAPI('get', SYSTEM + '/preContractInfo/track', params)
  },
  //更新接洽内容
  preContractInfoUpdate(params) {
    return comAPI('post', SYSTEM + '/preContractInfo/update', params)
  },
  //注销接洽内容
  preContractInfoCancelProcess(params) {
    return comAPI('get', SYSTEM + '/preContractInfo/cancelProcess', params)
  },
  //获取房产编号
  getUniqCode(params) {
    return comAPI('get', SYSTEM + '/tool/getUniqCode', params)
  },
  //查询共借人信息
  queryCustomerTogetherInfo(params) {
    return comAPI('get', SYSTEM + '/customer/info/queryCustomerTogetherInfo', params)
    // return comAPI('post', SYSTEM + '/cutomer/basic/queryCustomerTogetherInfo', params)
  },
  // /customer/info/deleteCustomerTogether
  // 删除共借人关系
  deleteCustomerTogether(params) {
    return comAPI('post', SYSTEM + '/customer/info/deleteCustomerTogether', params)
  },

  // /customer/info/getCustomerByTypeAndNumber
  // 通过客户类型和证件号获取客户详情
  getCustomerByTypeAndNumber(params) {
    return comAPI('get', SYSTEM + '/customer/info/getCustomerByTypeAndNumber', params)
  },
  // /customer/info/saveCustomerTogether
  saveCustomerTogether(params) {
    return comAPI('post', SYSTEM + '/customer/info/saveCustomerTogether', params)
  },
  // /customer/info/addCustomer
  // 新增客户信息
  addCustomer(params) {
    return comAPI('post', SYSTEM + '/customer/info/addCustomer', params)
  },
}

Vue.prototype.$http = http;
Vue.prototype.$api = api;
