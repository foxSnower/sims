<!--信用贷用信-->
<template>
  <el-card class="apply-box-card">
    <template v-if="!result">
      <el-collapse v-model="activeNames">
        <el-collapse-item class="collapse-head" title="贷款信息" name="1">
          <div class="f-flex hongte-query-form is-clear">
            <div class="f-item">
              <label>产品：</label>
              <p><span>{{where.productName}}</span></p>
            </div>
            <div class="f-item">
              <label>授信剩余额度：</label>
              <p><span>{{where.creditQuota|filtersMoney}}</span></p>
            </div>
            <div class="f-item">
              <label>额度有效期：</label>
              <p><span>{{where.quotaExpireTime}}</span></p>
            </div>
            <div class="f-item">
              <label>最小金额：</label>
              <p><span>{{filterProductInfo.minLoanAmount|filtersMoney}}</span></p>
            </div>
            <div class="f-item">
              <label>最大金额：</label>
              <p><span>{{filterProductInfo.maxLoanAmount|filtersMoney}}</span></p>
            </div>
            <div class="f-item">
              <label>单份金额：</label>
              <p><span>{{filterProductInfo.minLoanUnit|filtersMoney}}</span></p>
            </div>
          </div>
          <el-form :model='where' ref="formName1" size="small" :rules="rules" class='hongte-query-form is-clea' :inline='true' label-position="right" label-width="120px">
            <el-form-item :rules="[{ required: true, validator:validatorApplyMoney}]" label='申请金额' prop="applyMoney" class="f-item">
              <el-input type="number" v-model.number='where.applyMoney' placeholder='请输入' @blur="getOtherInfo('申请金额')">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label='资金渠道' prop="platformCode" class="f-item">
              <el-select v-model='where.platformCode' placeholder='请选择' @change="where.platformCodeName = changeCodeName(where.platformCode,['fundChannelCode','fundChannelName'],getFundChannelList);getOtherInfo('资金渠道')">
                <!-- 这是传出的参数和需要传入的参数不一致的尴尬啊~~~~~~~~ -->
                <el-option v-for="(x,index) in getFundChannelList" :key="index" :label='x.fundChannelName' :value='x.fundChannelCode'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='还款方式' prop="repaymentModeCode" class="f-item">
              <el-select v-model='where.repaymentModeCode' placeholder='请选择' @change="where.repaymentModeName = changeCodeName(where.repaymentModeCode,['repaymentModeCode','repaymentModeName'],getPaymentModeList);where.repaymentModeVersion = changeCodeName(where.repaymentModeCode,['repaymentModeCode','repaymentVersion'],getPaymentModeList);getOtherInfo('还款方式')" :disabled="where.platformCode==''?true:false">
                <el-option v-for="(x,index) in getPaymentModeList" :key="index" :label='x.repaymentModeName' :value='x.repaymentModeCode'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='期数类型' prop="periodsType" class="f-item">
              <el-input v-model='where.periodsTypeName' placeholder='请输入' disabled>
              </el-input>
            </el-form-item>
            <el-form-item label='申请期数' prop="applyLimit" class="f-item">
              <el-select v-model='where.applyLimit' placeholder='请选择' @change="getOtherInfo('申请期数')" :disabled="where.repaymentModeCode==''?true:false">
                <el-option v-for="(x,index) in getPeriodsList" :key="index" :label='x' :value='x'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='第一还款来源' prop="issueBusinessReqVos[0].firstPaymentSource" class="f-item">
              <el-select v-model='where.issueBusinessReqVos[0].firstPaymentSource' placeholder='请选择' @change="where.issueBusinessReqVos[0].firstPaymentSourceName = changeCodeName(where.issueBusinessReqVos[0].firstPaymentSource,['code','name'],filterFirstSource);where.issueBusinessReqVos[0].borrowPurposeCode='';where.issueBusinessReqVos[0].borrowPurposeName='';">
                <el-option v-for="(x,index) in filterFirstSource" :key="index" :label='x.name' :value='x.code'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='第二还款来源' prop="issueBusinessReqVos[0].secondPaymentSource" class="f-item">
              <el-select v-model='where.issueBusinessReqVos[0].secondPaymentSource' placeholder='请选择' @change="where.issueBusinessReqVos[0].secondPaymentSourceName = changeCodeName(where.issueBusinessReqVos[0].secondPaymentSource,['code','name'],filterSecondSource);">
                <el-option v-for="(x,index) in filterSecondSource" :key="index" :label='x.name' :value='x.code'></el-option>
              </el-select>
            </el-form-item>
            <HtInput type="textarea" class="f-item" v-if="where.issueBusinessReqVos[0].firstPaymentSource=='3'" label='除工资外的经营所得说明' v-model='where.issueBusinessReqVos[0].exceptWageIncomeExplain' prop="issueBusinessReqVos[0].exceptWageIncomeExplain"></HtInput>
            <el-form-item label='借贷用途' prop="issueBusinessReqVos[0].borrowPurposeCode" class="f-item">
              <el-select v-model='where.issueBusinessReqVos[0].borrowPurposeCode' placeholder='请选择' @change="where.issueBusinessReqVos[0].borrowPurposeName = changeCodeName(where.issueBusinessReqVos[0].borrowPurposeCode,['code','name'],filterBorrowPurpose);" :disabled="where.issueBusinessReqVos[0].firstPaymentSource==''?true:false">
                <el-option v-for="(x,index) in filterBorrowPurpose" :key="index" :label='x.name' :value='x.code'></el-option>
              </el-select>
            </el-form-item>
            <HtInput v-if="where.customerType==='PERSON'" class="f-item" label='近半年营业收入' v-model='where.issueBusinessReqVos[0].incomeHalfYear'></HtInput>
            <HtInput v-if="where.customerType!=='PERSON'" class="f-item" label='近半年营业收入' v-model='where.issueBusinessReqVos[0].incomeHalfYear' prop="issueBusinessReqVos[0].incomeHalfYear"></HtInput>
            <el-form-item label='反担保客户类型' prop="antiGuaranteeCustType" class="f-item">
              <el-select v-model='where.antiGuaranteeCustType' placeholder='请选择' @change="changeAntiGuaranteeCustType">
                <el-option v-for="(x,index) in antiGuaranteeCustTypeList" :key="index" :label='x.name' :value='x.code'></el-option>
              </el-select>
            </el-form-item>
            <template v-if="where.antiGuaranteeCustType==='PERSON'">
              <HtInput class="f-item" label='反担保人' v-model='where.antiGuaranteePersonName' prop="antiGuaranteePersonName"></HtInput>
              <HtInput class="f-item" label='反担保人证件号' v-model='where.antiGuaranteePersonCardNumber' prop="antiGuaranteePersonCardNumber"></HtInput>
            </template>
            <template v-else>
              <HtInput class="f-item" label='反担保公司法人' v-model='where.antiGuaranteeLegalName' prop="antiGuaranteeLegalName"></HtInput>
              <HtInput class="f-item" label='反担保公司名' v-model='where.antiGuaranteeComName' prop="antiGuaranteeComName"></HtInput>
              <HtInput class="f-item" label='反担保企业社会信用代码' v-model='where.antiGuaranteeComUnifiedCode' prop="antiGuaranteeComUnifiedCode"></HtInput>
            </template>
          </el-form>
        </el-collapse-item>
        <!-- 费用明细 -->
        <InfoForCost ref="InfoForCost" v-model="where" :where="where" :curCustomerCode="where.issueBusinessReqVos[0].customerCode" :total.sync="total"></InfoForCost>
        <!-- 出款信息/合同信息 -->
        <InfoForContractAndOutMoney :rules="rules" ref="InfoForContractAndOutMoney" v-model="where" :where="where"></InfoForContractAndOutMoney>
      </el-collapse>
      <el-row class="fixed-btn" :style="{width:fixedBtnWidth}">
        <div class="left">
          <span>基本信息完善度</span>
          <el-progress :percentage="percentage" class="progress" type="circle" :stroke-width="3" :width="60" :color="localTheme.themeColor"></el-progress>
          <span style="padding-left:120px;">费用合计</span>
          <el-popover placement="top-start" title="" trigger="hover" content="期末收取费用及返点不包含在期初收取的费用中">
            <el-button slot="reference" type="text" icon="el-icon-info"></el-button>
          </el-popover>
          <span class="red">￥{{total}}</span>
        </div>
        <el-button size="small" type="primary" @click="saveAndSubmit()" :loading="submitLoading">保存并提交</el-button>
        <el-button size="small" @click="$emit('removeCurTag');$router.back(-1)">返回</el-button>
      </el-row>
    </template>
    <template v-else>
      <ApplicationResult :postData="resultInfo" goBack="Letter" @removeCurTag="$emit('removeCurTag')"></ApplicationResult>
    </template>
  </el-card>
</template>

<script>
import InfoForCost from '../CommonTemplate/InfoForCost';
import InfoForContractAndOutMoney from '../CommonTemplate/InfoForContractAndOutMoney';
import ApplicationResult from '@htComponents/ApplicationResult';
import HtSelect from '@components/HtSelect';
import HtInput from '@components/HtInput';
import { mapGetters, mapMutations } from 'vuex';
import { LetterApplicationRules } from '@rules';
import { validScrollTop, changeCodeName } from '@utils';
export default {
  name: 'TemplateA',
  data() {
    return {
      isSave: false, //是否保存了
      saveLoading: false, //保存中
      result: false, //是否提交了
      submitLoading: false, //提交中
      resultInfo: {}, //提交后的结果
      getFundChannelList: [], //资金渠道
      getPaymentModeList: [], //还款方式
      getPeriodsList: [], //申请期数

      //反担保客户类型
      antiGuaranteeCustTypeList: [
        {
          code: 'PERSON',
          name: '个人'
        },
        {
          code: 'ENTERPRISE',
          name: '企业'
        }
      ],
      //产品信息
      productInfo: {},
      //出款信息
      getCompanyInfoDetailByUserId: {
        companyInfo: {},
        companyAccount: []
      },
      where: {
        // // id: this.$route.query.id,
        // creditResultId: this.$route.query.id,
        customerCode:'',
        productCode: '',
        productName: '',
        productVersion: '',
        applyMoney: '',
        applyLimit: '',
        repaymentModeCode: '',
        repaymentModeName: '',
        repaymentModeVersion: '',

        platformCode: '',
        platformCodeName: '',
        periodsType: '',
        periodsTypeName: '',
        lenderId: '',
        lenderName: '',
        companyName: '',
        companyAddress: '',
        legalName: '',
        legalTelephone: '',
        uniteCode: '',
        horizontalText: '',
        cosText: '',
        returnAccountName: '',
        returnAccountNo: '',
        midAccountName: '',
        midBankName: '',
        midAccountNo: '',
        signTime: '',
        creditQuota: 0,
        issueBusinessReqVos: [
          {
            customerCode: '',
            issueAmount: '',
            firstPaymentSource: '',
            firstPaymentSourceName: '',
            secondPaymentSource: '',
            secondPaymentSourceName: '',
            exceptWageIncomeExplain:null,
            borrowPurposeCode: '',
            borrowPurposeName: '',
            incomeHalfYear: '',
            issueApplyOutputList: []
          }
        ],

        antiGuaranteeCustType: 'PERSON', //反担保客户类型
        antiGuaranteePersonName: '', //反担保人
        antiGuaranteePersonCardNumber: '' //反担保人证件号
        // antiGuaranteeLegalName: '', //反担保公司法人
        // antiGuaranteeComName: '', //反担保公司名
        // antiGuaranteeComUnifiedCode: '' //反担保企业社会信用代码
      },
      rules: LetterApplicationRules,
      activeNames: ['1', '2', '3', '4', '5', '6', '7'],
      total: 0
      // dialogVisible: false,
      // payPlanData: { dataMap: [], titleMap: {} }
      // myData: []
    };
  },
  props: ['postData'],
  components: {
    InfoForCost,
    InfoForContractAndOutMoney,
    ApplicationResult,
    HtSelect,
    HtInput
  },
  beforeMount() {
    this.$nextTick(() => {
      this.getData();
    });
  },
  watch:{
    applyMoney(newVal){
      this.$set(this.where.issueBusinessReqVos[0],'issueAmount',newVal)
    },
  },
  filters: {},
  methods: {
    getData() {
      //若果是继续编辑,那么获取原先的数据填充
      if (this.$route.query.from) {
        // console.log(1111);
        this.$api
          .youxinContinueEdit({
            id: this.$route.query.id
          })
          .then(res => {
            this.where = res.data;
            this.$nextTick(() => {
              this.getOtherInfo('资金渠道');
              this.getOtherInfo('还款方式');
            });
            //获取资金渠道
            this.getFundChannel();
            //获取第一还款来源的数据
            this.getFirstSource();
            //获取第二还款来源的数据
            this.getSecondSource();
            //获取借贷用途
            this.getBorrowPurpose();
          });
      } else {
        //用信 --获取产品编号---
        this.$api
          .youxinInput({
            id: this.$route.query.id
          })
          .then(res => {
            if (res.returnCode == '0000') {
              this.$set(this.where, 'productCode', res.data.productCode);
              this.$set(this.where, 'productName', res.data.productName);
              this.$set(this.where, 'productVersion', res.data.productVersion);
              this.$set(this.where, 'quotaExpireTime', res.data.quotaExpireTime);
              this.$set(this.where, 'creditQuota', res.data.creditQuota);
              if(res.data.creditQuota < this.filterProductInfo.maxLoanAmount){
                this.$emit('changeMaxLoanAmount',res.data.creditQuota)
              }              
              this.$set(this.where, 'customerType', res.data.customerType);
              this.$set(this.where, 'professionalNature', res.data.professionalNature);
              this.$set(this.where, 'professionalNatureName', res.data.professionalNatureName);
              this.$set(this.where.issueBusinessReqVos[0], 'customerCode', res.data.customerCode);
              this.$set(this.where, 'customerCode', res.data.customerCode);
              //获取资金渠道
              this.getFundChannel();
              //获取第一还款来源的数据
              this.getFirstSource();
              //获取第二还款来源的数据
              this.getSecondSource();
              //获取借贷用途
              this.getBorrowPurpose();
            } else {
              this.$message.error(res.msg);
            }
          });
      }
    },
    //获取第一还款来源的数据
    getFirstSource() {
      this.$api
        .getCurrTypeValList({
          typeCode: 'first_payment_source',
          version: 'latest'
        })
        .then(res => {
          if (res.returnCode === '0000') {
            this.$store.commit('first_payment_source', res.data);
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    //获取第二还款来源的数据
    getSecondSource() {
      this.$api
        .getCurrTypeValList({
          typeCode: 'second_payment_source',
          version: 'latest'
        })
        .then(res => {
          if (res.returnCode === '0000') {
            this.$store.commit('second_payment_source', res.data);
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    //获取借贷用途
    getBorrowPurpose() {
      this.$api.getCurrTypeValList({ typeCode: 'borrow_purpose', version: 'latest' }).then(res => {
        if (res.returnCode == '0000') {
          this.$store.commit('borrow_purpose', res.data);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getFundChannel() {
      this.where.productVersion = this.filterProductInfo.version;
      //用信申请--获取资金渠道
      this.$api
        .getFundChannelList({
          productCode: this.where.productCode,
          productVersion: this.where.productVersion
        })
        .then(res => {
          if (res.returnCode == '0000') {
            this.getFundChannelList = res.data;
          } else {
            this.$message.error(res.msg);
          }
        });

      // });
    },
    //更改反担保客户类型
    changeAntiGuaranteeCustType(value) {
      if (value !== 'PERDON') {
        delete this.where.antiGuaranteePersonName;
        delete this.where.antiGuaranteePersonCardNumber;
        this.$set(this.where, 'antiGuaranteeLegalName', '');
        this.$set(this.where, 'antiGuaranteeComName', '');
        this.$set(this.where, 'antiGuaranteeComUnifiedCode', '');
      } else {
        delete this.where.antiGuaranteeLegalName;
        delete this.where.antiGuaranteeComName;
        delete this.where.antiGuaranteeComUnifiedCode;
        this.$set(this.where, 'antiGuaranteePersonName', '');
        this.$set(this.where, 'antiGuaranteePersonCardNumber', '');
      }
      this.$refs.formName1.clearValidate;
    },
    //获取其他信息
    getOtherInfo(type) {
      //用信申请 通过资金渠道--获取还款方式
      let platformCode = this.where.platformCode;//资金渠道
      let productCode = this.where.productCode;//产品code
      let productVersion = this.where.productVersion;//产品版本
      let repaymentModeCode = this.where.repaymentModeCode;//还款code
      let applyMoney = this.where.applyMoney;//申请金额
      let applyLimit = this.where.applyLimit;//申请期数
      let customerCode = this.where.issueBusinessReqVos[0].customerCode;//客户编码
      if (platformCode && type == '资金渠道') {
        this.$api
          .getPaymentModeList({
            fundChannelCode: platformCode, 
            productCode: productCode,
            productVersion:productVersion
          })
          .then(res => {
            if (res.returnCode == '0000') {
              this.getPaymentModeList = res.data;
              if (!this.getPaymentModeList.length) {
                this.$set(this.where, 'repaymentModeCode', '');
              }
            } else {
              this.$message.error(res.msg);
            }
          });
      }
      //用信申请--通过还款方式--获取申请期数
      if (repaymentModeCode && type == '还款方式') {
        this.$api
          .getPeriodsList({
            productCode: productCode, 
            productVersion: productVersion, 
            repaymentModeCode: repaymentModeCode
          })
          .then(res => {
            if (res.returnCode == '0000') {
              this.getPeriodsList = res.data.periods;
              // console.log(res.data.periodsTypeCode);
              //获取期数类型
              this.$set(this.where, 'periodsType', res.data.periodsTypeCode);
              this.$set(this.where, 'periodsTypeName', res.data.periodsTypeName);
              if (!this.getPeriodsList.length) {
                this.$set(this.where, 'periodsType', '');
                this.$set(this.where, 'periodsTypeName', '');
              }
            } else {
              this.$message.error(res.msg);
            }
          });
      }
      //用信申请--费用计划生成--需要贷款金额/产品编号 /产品版本/期数/还款方式编号
      if (applyMoney && applyLimit && productCode && productVersion && repaymentModeCode && (type == '还款方式' || type == '申请期数' || type == '申请金额')) {
         let params = {
          amount:applyMoney,
          periods: applyLimit,
          productCode: productCode,
          productVersion: productVersion,
          repaymentModeCode: repaymentModeCode,
        };
         this.$refs.InfoForCost.createCostPlan(params, customerCode);
      }else{
         this.$refs.InfoForCost.dealWithIssueApplyOutputList([],customerCode)
      }
    },
    //申请金额验证------必须小于授信剩余额度
    validatorApplyMoney(rule, value, callback) {
      let regex = new RegExp('^[0-9]+$');
      let residue = value / parseFloat(this.filterProductInfo.minLoanUnit);
      // console.log(!regex.test(residue));
      if (value === null || value === '') {
        return callback(new Error('申请金额不能为空!'));
      } else if (!regex.test(value)) {
        return callback(new Error('请输入正确的格式!'));
      } else if (value > this.filterProductInfo.maxLoanAmount || value < this.filterProductInfo.minLoanAmount) {
        return callback(new Error('申请金额必须在最小金额和最大金额之间'));
      } else if (!regex.test(residue)) {
        return callback(new Error('申请金额必须是单份金额的倍数'));
      } else {
        callback();
      }
    },
    saveAndSubmit() {
      //数据已整理,提交
      let params = Object.assign({}, this.where);
      //验证必填项-------
      let isValid = true;
      //验证子组件的必填项
      isValid = this.$refs.InfoForContractAndOutMoney.validateForm();
      for (let i = 1; i < 2; i++) {
        this.$refs['formName' + i].validate((valid, obj) => {
          if (valid) {
          } else {
            // this.$message.error('还有未填项,请检查后,再试!');
            this.submitLoading = false;
            validScrollTop(obj);
            isValid = false;
            return false;
          }
        });
      }

      if (isValid) {
        //判断费用计划是否有生成,未生成拒绝提交
        if (!params.issueBusinessReqVos[0].issueApplyOutputList.length) {
          this.$message.error('请先在产品管理中心配置相应的费用信息');
          return false;
        } else {
          this.submitLoading = true;
          if (this.$route.query.from == 'LetterList') {
            params.useCreditId = this.$route.query.useCreditId;
          } else {
            params.creditResultId = this.$route.query.id;
          }
          this.$api.youxinSaveAndCommit(params).then(res => {
            this.submitLoading = false;
            if (res.returnCode == '0000') {
              this.result = true;
              this.resultInfo = res.data;
              this.resultInfo.productCode = params.productCode;
              this.$message.success('提交成功!');
            } else {
              this.$message.error(res.msg);
              //避免重复提交订单
              this.$router.push('LetterList');
              this.$emit('removeCurTag');
            }
          });
        }
      }
    }
  },
  computed: {
    ...mapGetters(['localTheme', 'asideWidth', 'first_payment_source', 'second_payment_source', 'borrow_purpose']),
    fixedBtnWidth() {
      let width = '';
      if (this.asideWidth != '250px') {
        width = 'calc(100% - 95px)';
      } else {
        width = 'calc(100% - 290px)';
      }
      return width;
    },
    percentage() {
      let length = 0;
      let finishLength = 0;
      let params = this.where;
      for (const key in params) {
        length++;
        if (params[key] !== '') {
          finishLength++;
        }
      }
      let percentage = (finishLength / length) * 100;
      percentage = parseFloat(percentage.toFixed(0));
      percentage = isNaN(percentage) ? 0 : percentage;
      return percentage;
    },
    /**
     * 借款用途
     * 个人-1 受雇人士-第一还款来源(1 借款人工资收入)-消费类(1~6/11)
     * 个人-1 受雇人士-第一还款来源(3 工资收入及经营所得)-消费类/经营类(1~11)
     * 个人-2 小微企业老板/3 个体工商户/ 4 自雇人士-第一还款来源(2 经营所得)-消费类/经营类(1~11)
     * 企业-第一还款来源(2 经营所得)-经营类(7~11)
     */
    filterBorrowPurpose() {
      let list = this.borrow_purpose;
      let customerType = this.where.customerType;
      let professionalNature = this.where.professionalNature;
      let firstPaymentSource = this.where.issueBusinessReqVos[0].firstPaymentSource;
      //消费类
      let consumeList = list.filter(item => (parseFloat(item.code) >= 1 && parseFloat(item.code) <= 6) || item.code == '11');
      //经营类
      let managementList = list.filter(item => parseFloat(item.code) >= 7 && parseFloat(item.code) <= 11);
      if (customerType == 'PERSON') {
        if (professionalNature == '1') {
          if (firstPaymentSource == '1') {
            return consumeList;
          }
          if (firstPaymentSource == '3') {
            return list;
          }
        } else {
          return list;
        }
      } else {
        return managementList;
      }
    },
    /**
     * 第一还款来源
     * 个人-1 受雇人士-1 借款人工资收入/3 工资收入及经营所得
     * 个人-2 小微企业老板/3 个体工商户/ 4 自雇人士- 2 经营所得
     * 企业-经营所得
     */
    filterFirstSource() {
      let list = this.first_payment_source;
      let customerType = this.where.customerType;
      let professionalNature = this.where.professionalNature;
      if (customerType == 'PERSON') {
        if (professionalNature == '1') {
          return list.filter(item => item.code == '1' || item.code == '3');
        } else if (professionalNature == '2' || professionalNature == '3' || professionalNature == '4') {
          return list.filter(item => item.code == '2');
        } else {
          return list;
        }
      } else {
        return list.filter(item => item.code == '2');
      }
    },
    /**
     * 第二还款来源
     * 个人--信用标-4第三方担保公司提供连带责任保证担保/5 房产抵押+担保公司担保/ 6 车辆抵押+担保公司担保/ 7第三人担保+担保公司担保
     * 企业- 7第三人担保+担保公司担保
     */
    filterSecondSource() {
      let list = this.second_payment_source;
      let customerType = this.where.customerType;
      let professionalNature = this.where.professionalNature;
      if (customerType == 'PERSON') {
        return list.filter(item => item.code == '4' || item.code == '7');
      } else {
        return list.filter(item => item.code == '7');
      }
    },
    //产品信息
    filterProductInfo() {
      if (this.postData) {
        return this.postData;
      } else {
        return {};
      }
    },
    changeCodeName() {
      return changeCodeName;
    },
    applyMoney(){
      return this.where.applyMoney
    }
  }
};
</script>


<style lang="scss" scoped>
.f-flex {
  margin: 20px;
  .f-item {
    float: left;
    label {
      text-indent: 20px;
      display: inline-block;
      // width: 250px;
      text-align: right;
      float: left;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      line-height: 1.2;
      padding-top: 9px;
    }
    p {
      display: -webkit-box;
      box-sizing: border-box;
      line-height: 1.2;
      padding-top: 9px;
      word-break: break-all;
      margin-right: 20px;
      text-align: justify;
    }
    span {
      color: #888;
    }
  }
}
.fixed-btn {
  position: fixed;
  height: 80px;
  bottom: 0px;
  width: calc(100% - 290px);
  margin-left: -20px;
  text-align: right;
  background-color: #fff;
  border-top: 1px solid #f2f2f2;
  line-height: 80px;
  padding: 0 40px;
  z-index: 9;
  .left {
    position: absolute;
    .progress {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      margin-left: 20px;
    }
  }
}
.red {
  font-size: 24px;
  color: #f56c6c;
}
</style>
