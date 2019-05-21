import {
  validator
} from '@utils';

export const rules = {};
//授信申请验证规则
export const Steps1Rules = {
  customer_type: [{
    required: true,
    name: '客户类型',
    validator: validator.normal,
    trigger: ['blur']
  }],
  customer_name: [{
    required: true,
    name: '客户名称',
    validator: validator.normal,
    trigger: ['blur']
  }],
  phone: [{
    required: true,
    name: '手机号码',
    validator: validator.phone,
    trigger: ['blur']
  }],
  card_type: [{
    required: true,
    name: '证件类型',
    validator: validator.normal,
    trigger: ['blur', 'change']
  }],
  ID_card: [{
    required: true,
    name: '身份证号',
    validator: validator.identity,
    trigger: ['blur']
  }],
  home_visit: [{
    required: true,
    name: '回乡证号',
    validator: validator.homeCard,
    trigger: ['blur']
  }],
  taiwan_card: [{
    required: true,
    name: '台胞证号',
    validator: validator.taiwan,
    trigger: ['blur']
  }],
  unified_code: [{
    required: true,
    name: '统一社会信用代码',
    validator: validator.unifiedCode,
    trigger: ['blur']
  }],
  company_legal_person: [{
    required: true,
    name: '企业法人',
    validator: validator.normal,
    trigger: ['blur']
  }],
  product_type_code: [{
    required: true,
    name: '产品类型',
    validator: validator.normal,
    trigger: ['blur', 'change']
  }],
  product_series_code: [{
    required: true,
    name: '产品系列',
    validator: validator.normal,
    trigger: ['blur', 'change']
  }],
  product_code: [{
    required: true,
    name: '产品',
    validator: validator.normal,
    trigger: ['blur', 'change']
  }],
  original_id: [{
    required: true,
    name: '业务获取人',
    validator: validator.normal,
    trigger: ['blur', 'change']
  }],
}
//鸿保贷验证规则
export const HtApplicationRules = {
  customerType: [{
    required: true,
    name: '客户类型',
    validator: validator.normal,
    trigger: ['blur']
  }],
  customerName: [{
    required: true,
    name: '客户名称',
    validator: validator.normal,
    trigger: ['blur']
  }],
  phone: [{
    required: true,
    name: '手机号码',
    validator: validator.phone,
    trigger: ['blur']
  }],
  cardType: [{
    required: true,
    name: '证件类型',
    validator: validator.normal,
    trigger: ['blur', 'change']
  }],
  ID_card: [{
    required: true,
    name: '身份证号',
    validator: validator.identity,
    trigger: ['blur']
  }],
  home_visit: [{
    required: true,
    name: '回乡证号',
    validator: validator.homeCard,
    trigger: ['blur']
  }],
  taiwan_card: [{
    required: true,
    name: '台胞证号',
    validator: validator.taiwan,
    trigger: ['blur']
  }],

  productCode: [{
    required: true,
    name: '产品类型',
    validator: validator.normal,
    trigger: ['blur', 'change']
  }],
  productSeriesCode: [{
    required: true,
    name: '产品系列',
    validator: validator.normal,
    trigger: ['blur', 'change']
  }],
  productTypeCode: [{
    required: true,
    name: '产品',
    validator: validator.normal,
    trigger: ['blur', 'change']
  }],
}

//用信申请验证规则 -templateA
export const LetterApplicationRules = {
  antiGuaranteeCustType: [{
    required: true,
    name: '反担保客户类型',
    validator: validator.normal,
    trigger: ['blur', 'change']
  }],
  antiGuaranteePersonName: [{
    required: true,
    name: '反担保人',
    validator: validator.normal,
    trigger: ['blur']
  }],
  antiGuaranteePersonCardNumber: [{
    required: true,
    name: '反担保人证件号',
    validator: validator.identity,
    trigger: ['blur']
  }],
  antiGuaranteeLegalName: [{
    required: true,
    name: '反担保公司法人',
    validator: validator.normal,
    trigger: ['blur']
  }],
  antiGuaranteeComName: [{
    required: true,
    name: '反担保公司名',
    validator: validator.normal,
    trigger: ['blur']
  }],
  antiGuaranteeComUnifiedCode: [{
    required: true,
    name: '反担保企业社会信用代码',
    validator: validator.unifiedCode,
    trigger: ['blur']
  }],
  applyMoney: [{
    required: true,
    name: '申请金额',
    validator: validator.normal,
    trigger: ['blur']
  }],
  'issueBusinessReqVos[0].firstPaymentSource': [{
    required: true,
    name: '第一还款来源',
    validator: validator.normal,
    trigger: ['blur', 'change']
  }],
  'issueBusinessReqVos[0].secondPaymentSource': [{
    required: true,
    name: '第二还款来源',
    validator: validator.normal,
    trigger: ['blur', 'change']
  }],
  'issueBusinessReqVos[0].exceptWageIncomeExplain': [{
    required: true,
    name: '除工资外的经营所得说明',
    validator: validator.normal,
    trigger: ['blur']
  }],
  'issueBusinessReqVos[0].incomeHalfYear': [{
    required: true,
    name: '近半年营业收入',
    validator: validator.money,
    trigger: ['blur']
  }],
  platformCode: [{
    required: true,
    name: '资金渠道',
    validator: validator.normal,
    trigger: ['blur', 'change']
  }],
  repaymentModeCode: [{
    required: true,
    name: '还款方式',
    validator: validator.normal,
    trigger: ['blur', 'change']
  }],
  periodsType: [{
    required: true,
    name: '期数类型',
    validator: validator.normal,
    trigger: ['blur', 'change']
  }],
  applyLimit: [{
    required: true,
    name: '申请期数',
    validator: validator.normal,
    trigger: ['blur', 'change']
  }],
  'issueBusinessReqVos[0].borrowPurposeCode': [{
    required: true,
    name: '借贷用途',
    validator: validator.normal,
    trigger: ['blur', 'change']
  }],
  lenderId: [{
    required: true,
    name: '债权人、借款人',
    validator: validator.normal,
    trigger: ['blur', 'change']
  }],
  signTime: [{
    required: true,
    name: '合同签订日期',
    validator: validator.normal,
    trigger: ['blur']
  }],
  pledgeType: [{
    required: true,
    name: '抵押物抵押方式',
    validator: validator.normal,
    trigger: ['change']
  }],
}

//客户信息验证规则
export const CustomerRules = {
  customerName: [{
    required: true,
    name: '客户名称',
    validator: validator.normal,
    trigger: ['blur']
  }],
  enterpriseLegalCertificateTypeCode: [{
    required: true,
    name: '证件类型',
    validator: validator.normal,
    trigger: ['blur']
  }],
  certificateTypeCode: [{
    required: true,
    name: '证件类型',
    validator: validator.normal,
    trigger: ['blur']
  }],
  ID_card: [{
    required: true,
    name: '身份证号',
    validator: validator.identity,
    trigger: ['blur']
  }],
  home_visit: [{
    required: true,
    name: '回乡证号',
    validator: validator.homeCard,
    trigger: ['blur']
  }],
  taiwan_card: [{
    required: true,
    name: '台胞证号',
    validator: validator.taiwan,
    trigger: ['blur']
  }],
  certificateNumber: [{
    required: true,
    name: '证件号码',
    validator: validator.identity,
    trigger: ['blur']
  }],
  enterpriseLegalCertificateNumber: [{
    required: true,
    name: '证件号码',
    validator: validator.identity,
    trigger: ['blur']
  }],
  educationCode: [{
    required: true,
    name: '教育程度',
    validator: validator.normal,
    trigger: ['blur']
  }],
  currentLiabilities: [{
    required: true,
    name: '当前负债',
    validator: validator.curLiabilities,
    trigger: ['blur']
  }],
  overdueCondition: [{
    required: true,
    name: '截至借款前6个月内借款人征信报告中的逾期情况',
    validator: validator.normal,
    trigger: ['blur']
  }],
  platformSituation: [{
    required: true,
    name: '在其他网络借贷平台借款情况',
    validator: validator.normal,
    trigger: ['blur']
  }],
  caseSituation: [{
    required: true,
    name: '涉诉情况',
    validator: validator.normal,
    trigger: ['blur']
  }],
  case_reason: [{
    required: true,
    name: '涉案事由',
    validator: validator.normal,
    trigger: ['blur', 'change']
  }],
  punish_type: [{
    required: true,
    name: '处罚种类',
    validator: validator.normal,
    trigger: ['blur', 'change']
  }],
  punish_reason: [{
    required: true,
    name: '处罚事由',
    validator: validator.normal,
    trigger: ['blur', 'change']
  }],
  punishSituation:[{
    required: true,
    name: '处罚情况',
    validator: validator.normal,
    trigger: ['blur']
  }],
  sex: [{
    required: true,
    name: '性别',
    validator: validator.normal,
    trigger: ['blur']
  }],
  age: [{
    required: true,
    name: '年龄',
    validator: validator.age,
    trigger: ['blur']
  }],
  phone: [{
    required: true,
    name: '手机号码',
    validator: validator.phone,
    trigger: ['blur']
  }],
  email: [{
    required: true,
    name: 'Email',
    validator: validator.email,
    trigger: ['blur']
  }],
  monthlyIncomeCode: [{
    required: true,
    name: '月均收入',
    validator: validator.normal,
    trigger: ['blur']
  }],
  houseTypeCode: [{
    required: true,
    name: '住宅情况',
    validator: validator.normal,
    trigger: ['blur']
  }],
  liveProvinceCode: [{
    required: true,
    name: '住宅地址',
    validator: validator.normal,
    trigger: ['blur']
  }],
  liveAddress: [{
    required: true,
    name: '住宅详细地址',
    validator: validator.normal,
    trigger: ['blur']
  }],
  marriageStatusCode: [{
    required: true,
    name: '婚姻状况',
    validator: validator.normal,
    trigger: ['blur']
  }],
  professionalNatureCode: [{
    required: true,
    name: '职业类型',
    validator: validator.normal,
    trigger: ['blur']
  }],
  companyName: [{
    required: true,
    name: '单位全称',
    validator: validator.normal,
    trigger: ['blur']
  }],
  enterpriseTypeCode: [{
    required: true,
    name: '企业类型',
    validator: validator.normal,
    trigger: ['blur']
  }],
  industryCode: [{
    required: true,
    name: '所属行业',
    validator: validator.normal,
    trigger: ['blur']
  }],
  enterpriseFoundDate: [{
    required: true,
    name: '成立日期',
    validator: validator.normal,
    trigger: ['blur']
  }],
  enterpriseRegisterCapital: [{
    required: true,
    name: '注册资本(万元)',
    validator: validator.normal,
    trigger: ['blur']
  }],
  unifiedSocialCreditCode: [{
    required: true,
    name: '统一社会信用代码',
    validator: validator.unifiedCode,
    trigger: ['blur']
  }],
  enterpriseActualController: [{
    required: true,
    name: '实际控制人',
    validator: validator.normal,
    trigger: ['blur']
  }],
  enterpriseRegisterProvinceCode: [{
    required: true,
    name: '注册地址',
    validator: validator.normal,
    trigger: ['blur']
  }],
  enterpriseRegisterAddress: [{
    required: true,
    name: '注册详细地址',
    validator: validator.normal,
    trigger: ['blur']
  }],
  enterpriseLegalPerson: [{
    required: true,
    name: '法人名称',
    validator: validator.normal,
    trigger: ['blur']
  }],
  enterpriseBankLicense: [{
    required: true,
    name: '开户许可证',
    validator: validator.normal,
    trigger: ['blur']
  }],
  houseValue: [{
    required: false,
    name: '房产价值',
    validator: validator.worth,
    trigger: ['blur']
  }],
  carValue: [{
    required: false,
    name: '车辆价值',
    validator: validator.worth,
    trigger: ['blur']
  }],
  
}
//修改客户名称验证规则
export const CustomeModifyForCustomerNameRules = {
  newValue: [{
    required: true,
    name: '新客户名称',
    validator: validator.normal,
    trigger: ['blur']
  }],
  verificationCode: [{
    required: true,
    name: '短信验证码',
    validator: validator.normal,
    trigger: ['blur']
  }],
}
//修改客户证件号码验证规则
export const CustomeModifyForCustomerNumberRules = {
  newValue: [{
    required: true,
    name: '新证件号码',
    validator: validator.identity,
    trigger: ['blur']
  }],
  verificationCode: [{
    required: true,
    name: '短信验证码',
    validator: validator.normal,
    trigger: ['blur']
  }],
}
//修改客户手机号验证规则
export const CustomeModifyForCustomerPhoneRules = {
  newValue: [{
    required: true,
    name: '新手机号',
    validator: validator.phone,
    trigger: ['blur']
  }],
  verificationCode: [{
    required: true,
    name: '短信验证码',
    validator: validator.normal,
    trigger: ['blur']
  }],
}
//修改法人手机号验证规则
export const CustomeModifyForLegalPhoneRules = {
  newValue: [{
    required: true,
    name: '法人新手机号',
    validator: validator.phone,
    trigger: ['blur']
  }],
  verificationCode: [{
    required: true,
    name: '短信验证码',
    validator: validator.normal,
    trigger: ['blur']
  }],
}
//新增银行卡验证规则
export const AddBankCardRules = {
  bankAccounts: [{
    required: true,
    name: '银行卡号',
    validator: validator.normal,
    trigger: ['blur']
  }],
  bankCode: [{
    required: true,
    name: '开户银行',
    validator: validator.normal,
    trigger: ['blur', 'change']
  }],
  bankProvinceCode: [{
    required: true,
    name: '所属省市',
    validator: validator.normal,
    trigger: ['blur']
  }],
  branchBankName: [{
    required: true,
    name: '支行名称',
    validator: validator.normal,
    trigger: ['blur']
  }],
  transferType: [{
    required: true,
    name: '转账类型',
    validator: validator.normal,
    trigger: ['blur']
  }],
  phone: [{
    required: true,
    name: '预留手机号',
    validator: validator.phone,
    trigger: ['blur']
  }],
}
//代扣
export const DkBankCardRules = {
  validCode: [{
    required: true,
    name: '短信验证码',
    validator: validator.normal,
    trigger: ['blur']
  }],
}
//代扣限额维护
export const DkBankRules = {
  type: [{
    required: true,
    name: '代扣类型',
    validator: validator.normal,
    trigger: ['blur']
  }],
  channel: [{
    required: true,
    name: '代扣渠道',
    validator: validator.normal,
    trigger: ['blur']
  }],
  bankName: [{
    required: true,
    name: '支持银行',
    validator: validator.normal,
    trigger: ['blur']
  }],
  dailyLimit: [{
    required: true,
    name: '单日限额(元)',
    validator: validator.normal,
    trigger: ['blur']
  }],
  singleLimit: [{
    required: true,
    name: '单笔限额(元)',
    validator: validator.normal,
    trigger: ['blur']
  }],
}
//修改分公司信息的验证规则
export const companyRules = {
  companyName: [{
    required: true,
    name: '分公司名称',
    validator: validator.normal,
    trigger: ['blur']
  }],
  companyAddress: [{
    required: true,
    name: '分公司地址',
    validator: validator.normal,
    trigger: ['blur']
  }],
  legalPerson: [{
    required: true,
    name: '法人代表',
    validator: validator.normal,
    trigger: ['blur']
  }],
  companyPhone: [{
    required: true,
    name: '分公司电话',
    validator: validator.normal,
    trigger: ['blur']
  }],
  unifiedSocialCreditCode: [{
    required: true,
    name: '统一社会信用代码',
    validator: validator.unifiedCode,
    trigger: ['blur']
  }],
  businessPhone: [{
    required: true,
    name: '业务专用客服电话',
    validator: validator.normal,
    trigger: ['blur']
  }],
  highestDebtRatio: [{
    required: true,
    name: '分公司所在地标准件房产最高负债率',
    validator: validator.normal,
    trigger: ['blur']
  }],
  companyNameContract: [{
    required: true,
    name: '分公司名称(合同)',
    validator: validator.normal,
    trigger: ['blur']
  }],
  companyAddressContract: [{
    required: true,
    name: '分公司地址(合同)',
    validator: validator.normal,
    trigger: ['blur']
  }],
  companyPhoneContract: [{
    required: true,
    name: '分公司电话(合同)',
    validator: validator.normal,
    trigger: ['blur']
  }],
  companyPledgeEmailContract: [{
    required: true,
    name: '分公司抵押权人电子邮件地址(合同)',
    validator: validator.email,
    trigger: ['blur']
  }],

}
//修改分公司信息银行卡的验证规则
export const CompanyAccountListRules = {
  accountName: [{
    required: true,
    name: '用户名称',
    validator: validator.normal,
    trigger: ['blur']
  }],
  bankCard: [{
    required: true,
    name: '银行卡号码',
    validator: validator.bank,
    trigger: ['blur']
  }],
  bankCode: [{
    required: true,
    name: '开户银行',
    validator: validator.normal,
    trigger: ['blur', 'change']
  }],
  openName: [{
    required: true,
    name: '开户银行支行',
    validator: validator.normal,
    trigger: ['blur']
  }],
  intermediaryAccount: [{
    required: true,
    name: '是否是还款账户',
    validator: validator.is,
    trigger: ['blur']
  }],
  retuenAccount: [{
    required: true,
    name: '是否是居间费账户',
    validator: validator.is,
    trigger: ['blur']
  }]
}

//修改抵押权人和债权人配置验证规则
export const CreditorPledgeeRules = {
  name: [{
    required: true,
    name: '客户名称',
    validator: validator.normal,
    trigger: ['blur']
  }],
  type: [{
    required: true,
    name: '客户类型',
    validator: validator.normal,
    trigger: ['blur']
  }],
  idCard: [{
    required: true,
    name: '身份证号码',
    validator: validator.identity,
    trigger: ['blur']
  }],
  unifiedCode: [{
    required: true,
    name: '统一社会信用代码',
    validator: validator.unifiedCode,
    trigger: ['blur']
  }],
  address: [{
    required: true,
    name: '地址',
    validator: validator.normal,
    trigger: ['blur']
  }],
  phone: [{
    required: true,
    name: '电话号码',
    validator: validator.phone,
    trigger: ['blur']
  }],
  legalPerson: [{
    required: true,
    name: '法人',
    validator: validator.normal,
    trigger: ['blur']
  }],
  email: [{
    required: true,
    name: '电子邮件',
    validator: validator.email,
    trigger: ['blur']
  }],
  tuandaiGuaranteeGuid: [{
    required: true,
    name: '对应团贷网担保公司名称',
    validator: validator.normal,
    trigger: ['blur']
  }],
  isCreaditor: [{
    required: true,
    name: '是否是抵押权人',
    validator: validator.normal,
    trigger: ['blur']
  }],
  isAssignee: [{
    required: true,
    name: '是否受让人',
    validator: validator.normal,
    trigger: ['blur']
  }],
  isCreaditor: [{
    required: true,
    name: '是否是债权人',
    validator: validator.normal,
    trigger: ['blur']
  }],
}
