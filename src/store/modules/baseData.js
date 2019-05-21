//基础数据
const baseData = {
  state: {
    //证件类型
    certificate_type: [],
    //住房性质
    house_type: [],
    //省
    provinceCode: [],
    //市
    cityCode: [],
    //区
    countyCode: [],
    //月收入
    monthly_income: [],
    sex: [{
        code: 0,
        name: '男'
      },
      {
        code: 1,
        name: '女'
      }
    ],
    is_data: [{
        code: true,
        name: '是'
      },
      {
        code: false,
        name: '否'
      }
    ],
    //客户类型
    customer_type: [{
        code: '1',
        name: '个人客户'
      },
      {
        code: '2',
        name: '企业客户'
      }
    ],

    //学历
    education_code: [],
    //婚姻状态
    marriage_status: [],
    //职业性质
    professional_nature: [],
    //单位性质
    unit_properties: [],
    //所属行业
    industry: [],
    //职务
    position: [],
    //工资发放形式
    wage_pay_type: [],
    //组织形式
    organization_type: [],
    //企业类型
    enterprise_type: [],
    //开户行
    niwoo_bank_list: [],
    td_person_bank_list: [],
    //民族
    nation: [],


    //产品类型
    product_type: [],
    //产品系列类型
    product_series: [],
    //产品列表
    product_list: [],
    sales_person: [],
    addressTree: [],
    //银行
    bank: [],
    //第一还款来源
    first_payment_source: [],
    //第二还款来源
    second_payment_source: [],
    //借贷用途
    borrow_purpose: [],
  },
  getters: {
    certificate_type: state => state.certificate_type,
    house_type: state => state.house_type,
    provinceCode: state => state.provinceCode,
    cityCode: state => state.cityCode,
    countyCode: state => state.countyCode,
    monthly_income: state => state.monthly_income,
    education_code: state => state.education_code,
    marriage_status: state => state.marriage_status,
    professional_nature: state => state.professional_nature,
    unit_properties: state => state.unit_properties,
    industry: state => state.industry,
    position: state => state.position,
    wage_pay_type: state => state.wage_pay_type,
    organization_type: state => state.organization_type,
    enterprise_type: state => state.enterprise_type,
    niwoo_bank_list: state => state.niwoo_bank_list,
    td_person_bank_list: state => state.td_person_bank_list,
    nation: state => state.nation,
    product_type: state => state.product_type,
    product_series: state => state.product_series,
    product_list: state => state.product_list,
    sales_person: state => state.sales_person,
    addressTree: state => state.addressTree,
    bank: state => state.bank,
    borrow_purpose: state => state.borrow_purpose,
    first_payment_source: state => state.first_payment_source,
    second_payment_source: state => state.second_payment_source,
  },
  mutations: {
    certificate_type(state, payload) {
      state.certificate_type = payload
    },
    house_type(state, payload) {
      state.house_type = payload
    },
    provinceCode(state, payload) {
      state.provinceCode = payload
    },
    cityCode(state, payload) {
      state.cityCode = payload
    },
    countyCode(state, payload) {
      state.countyCode = payload
    },
    monthly_income(state, payload) {
      state.monthly_income = payload
    },
    education_code(state, payload) {
      state.education_code = payload
    },
    marriage_status(state, payload) {
      state.marriage_status = payload
    },
    professional_nature(state, payload) {
      state.professional_nature = payload
    },
    unit_properties(state, payload) {
      state.unit_properties = payload
    },
    industry(state, payload) {
      state.industry = payload
    },
    position(state, payload) {
      state.position = payload
    },
    wage_pay_type(state, payload) {
      state.wage_pay_type = payload
    },
    organization_type(state, payload) {
      state.organization_type = payload
    },
    enterprise_type(state, payload) {
      state.enterprise_type = payload
    },
    niwoo_bank_list(state, payload) {
      state.niwoo_bank_list = payload
    },
    td_person_bank_list(state, payload) {
      state.td_person_bank_list = payload
    },
    nation(state, payload) {
      state.nation = payload
    },
    product_type(state, payload) {
      state.product_type = payload
    },
    product_series(state, payload) {
      state.product_series = payload
    },
    product_list(state, payload) {
      state.product_list = payload
    },
    sales_person(state, payload) {
      state.sales_person = payload
    },
    addressTree(state, payload) {
      state.addressTree = payload
    },
    bank(state, payload) {
      state.bank = payload
    },
    borrow_purpose(state, payload) {
      state.borrow_purpose = payload
    },
    first_payment_source(state, payload) {
      state.first_payment_source = payload
    },
    second_payment_source(state, payload) {
      state.second_payment_source = payload
    },
  }
}


/**
 * 声明vuex中的几个模块，保证其可以全局使用
 */
export default baseData
