<template>
  <div class='apply-box-card'>
    <el-collapse v-model="activeNames">
      <el-collapse-item class="collapse-head" title="企业基本信息" name="1">
        <el-form :disabled="isView" :model='where' ref="baseInfo" size="small" :rules="rules" class='hongte-query-form' :inline='true' label-position="right" label-width="120px">
          <HtInput prop="customerName" class="f-item3" label='客户名称' v-model="where.customerName" ></HtInput>
          <HtSelect class="f-item3" label='企业类型' prop="enterpriseTypeCode" v-model="where.enterpriseTypeCode" :name.sync="where.enterpriseTypeName" type="enterprise_type"></HtSelect>
          <HtSelect class="f-item3" label='所属行业' prop="industryCode" v-model="where.industryCode" :name.sync="where.industryName" type="industry"></HtSelect>
          <HtPicker class="f-item3" type="date" label='成立日期' prop="enterpriseFoundDate" v-model="where.enterpriseFoundDate" format="yyyy-MM-dd"></HtPicker>
          <HtInput class="f-item3" label='注册资本(万元)' prop="enterpriseRegisterCapital" v-model="where.enterpriseRegisterCapital"></HtInput>
          <HtInput class="f-item3" label='统一社会信用代码' @blur.native.capture="checkCard" prop="unifiedSocialCreditCode" v-model="where.unifiedSocialCreditCode"></HtInput>
          <HtInput class="f-item3" label='实际控制人' prop="enterpriseActualController" v-model="where.enterpriseActualController"></HtInput>
          <el-form-item label='注册地址' prop="enterpriseRegisterProvinceCode" class="f-item3">
            <AddressArea :value='workingArea2' @getData="(code,name)=>{ where.enterpriseRegisterProvinceCode=code[0];where.enterpriseRegisterCityCode=code[1];where.enterpriseRegisterCountyCode=code[2];where.enterpriseRegisterProvinceName=name[0];where.enterpriseRegisterCityName=name[1];where.enterpriseRegisterCountyName=name[2];}"></AddressArea>
          </el-form-item>
          <HtInput class="f-item3" label='注册详细地址' prop="enterpriseRegisterAddress" v-model="where.enterpriseRegisterAddress"></HtInput>
          <HtInput class="f-item3" label='开户许可证' prop="enterpriseBankLicense" v-model="where.enterpriseBankLicense"></HtInput>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="企业法人" name="2">
        <el-form :disabled="isView" :model='where' ref="personInfo" size="small" :rules="rules" class='hongte-query-form' :inline='true' label-position="right" label-width="120px">
          <HtInput class="f-item3" label='法人名称' prop="enterpriseLegalPerson" v-model="where.enterpriseLegalPerson"></HtInput>
          <HtSelect  @change="changeCardType" prop="enterpriseLegalCertificateTypeCode" class="f-item3" label='证件类型' type="certificate_type" v-model="where.enterpriseLegalCertificateTypeCode" :name.sync="where.enterpriseLegalCertificateTypeName" ></HtSelect>
          <HtInput v-if="where.enterpriseLegalCertificateTypeCode==='ID_card'||!where.enterpriseLegalCertificateTypeCode" prop="enterpriseLegalCertificateNumber" :rules="rules.ID_card" class="f-item3" label='证件号码' v-model="where.enterpriseLegalCertificateNumber" @blur.native.capture="setSexAndAge"></HtInput>
          <HtInput v-if="where.enterpriseLegalCertificateTypeCode==='home_visit'"  prop="enterpriseLegalCertificateNumber" :rules="rules.home_visit" class="f-item3" label='证件号码' v-model="where.enterpriseLegalCertificateNumber" ></HtInput>
          <HtInput v-if="where.enterpriseLegalCertificateTypeCode==='taiwan_card'" prop="enterpriseLegalCertificateNumber" :rules="rules.taiwan_card" class="f-item3" label='证件号码' v-model="where.enterpriseLegalCertificateNumber" ></HtInput>
          <HtInput class="f-item3" label='曾用名' v-model="where.formerName"></HtInput>
          <HtSelect class="f-item3" label='性别' prop="sex" type="sex" v-model="where.sex"></HtSelect>
          <HtInput class="f-item3" label='年龄' prop="age" v-model.number="where.age" maxlength="2"></HtInput>
          <HtInput class="f-item3" label='手机号码' prop="phone" v-model="where.phone" ></HtInput>
          <HtInput class="f-item3" label='Email' prop="email" v-model="where.email"></HtInput>
          <HtSelect class="f-item3" label='月均收入' prop="monthlyIncomeCode" type="monthly_income" v-model="where.monthlyIncomeCode" :name.sync="where.monthlyIncomeName"></HtSelect>
          <HtSelect class="f-item3" label='住宅情况' prop="houseTypeCode" v-model="where.houseTypeCode" :name.sync="where.houseTypeName" type="house_type"></HtSelect>
          <el-form-item label='住宅地址' prop="liveProvinceCode" class="f-item3">
            <AddressArea :value='liveArea' @getData="(code,name)=>{ where.liveProvinceCode=code[0];where.liveCityCode=code[1];where.liveCountyCode=code[2];where.liveProvinceName=name[0];where.liveCityName=name[1];where.liveCountyName=name[2];}"></AddressArea>
          </el-form-item>
          <HtInput class="f-item3" label='住宅详细地址' prop="liveAddress" v-model="where.liveAddress"></HtInput>
          <HtSelect class="f-item3" label='教育程度' prop="educationCode" v-model="where.educationCode" :name.sync="where.educationName" type="education_code"></HtSelect>
          <el-form-item label='户口所在地' prop="hukouProvinceCode" class="f-item3">
            <AddressArea :value='hukouArea' @getData="(code,name)=>{ where.hukouProvinceCode=code[0];where.hukouCityCode=code[1];where.hukouCountyCode=code[2];where.hukouProvinceName=name[0];where.hukouCityName=name[1];where.hukouCountyName=name[2];}"></AddressArea>
          </el-form-item>
          <HtInput class="f-item3" label='户口详细地址' prop="hukouAddress" v-model="where.hukouAddress"></HtInput>
          <HtSelect class="f-item3" label='婚姻状况' prop="marriageStatusCode" v-model="where.marriageStatusCode" :name.sync="where.marriageStatusName" type="marriage_status"></HtSelect>
          <template v-if="where.marriageStatusCode=='married'||where.marriageStatusCode=='remarriage'">
            <HtInput class="f-item3" label='配偶姓名' prop="spouseName" v-model="where.spouseName"></HtInput>
            <HtInput class="f-item3" label='配偶联系号码' prop="spouseCode" v-model="where.spouseCode"></HtInput>
          </template>
          <HtInput class="f-item3" label='当前负债' prop="currentLiabilities" v-model="where.currentLiabilities"></HtInput>
          <HtSelect class="f-item3" label='在其他网络借贷平台借款情况' prop="platformSituation" v-model="where.platformSituation" :dataSource="platformSituationOptions"></HtSelect>
          <HtSelect class="f-item3" label='截至借款前6个月内借款人征信报告中的逾期情况' prop="overdueCondition" v-model="where.overdueCondition" :dataSource="overdueConditionOptions"></HtSelect>
          <HtSelect class="f-item3" label='涉诉情况' prop="caseSituation" v-model="where.caseSituation" :name.sync="where.caseSituationName" :dataSource="caseSituationOptions"></HtSelect>

          <HtInput v-if="where.caseSituation=='2'||where.caseSituation=='3'||where.caseSituation=='4'" class="f-item3" label='涉案事由' prop="caseReason" :rules="rules.case_reason" v-model="where.caseReason"></HtInput>
          <!--<HtInput v-else class="f-item3" label='涉案事由' prop="caseReason" v-model="where.caseReason"></HtInput>-->

          <HtSelect class="f-item3" label='处罚情况' prop="punishSituation" v-model="where.punishSituation" :name.sync="where.punishSituationName" :dataSource="punishSituationOptions"></HtSelect>
          <HtSelect v-if="where.punishSituation=='2'||where.punishSituation=='3'" class="f-item3" label='处罚种类' prop="punishType" :rules="rules.punish_type" v-model="where.punishType" :name.sync="where.punishTypeName" :dataSource="punishTypeOptions"></HtSelect>
          <!--<HtSelect v-else class="f-item3" label='处罚种类' prop="punishType" v-model="where.punishType" :name.sync="where.punishTypeName" :dataSource="punishTypeOptions"></HtSelect>-->

          <HtInput v-if="where.punishType=='1'||where.punishType=='2'" class="f-item3" label='处罚事由' prop="punishReason" :rules="rules.punish_reason" v-model="where.punishReason"></HtInput>
          <!--<HtInput v-else class="f-item3" label='处罚事由' prop="punishReason" v-model="where.punishReason"></HtInput>-->
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-row class="bottom-btn">
      <el-button type="primary"  @click="submit">提交</el-button>
      <el-button @click="close">关闭</el-button>
    </el-row>
    <!-- </ht-card> -->
  </div>
</template>

<script>
// import Address from '@components/Address';
import AddressArea from '@components/AddressArea';
// import SelectOption from '@components/SelectOption';
import HtSelect from '@components/HtSelect';
import HtInput from '@components/HtInput';
import HtPicker from '@components/HtPicker';
import { CustomerRules } from '@rules';
import { codeToName, getLocalStorage,GetAge, validateIdCard } from '@utils';
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'CustomeAddForEnterprise',
  data() {
    return {
      caseSituationOptions:"[{\"code\":\"1\",\"name\":\"无涉诉\"},{\"code\":\"2\",\"name\":\"有涉诉，已结案\"},{\"code\":\"3\",\"name\":\"有涉诉，未结案，借款人为原告\"},{\"code\":\"4\",\"name\":\"有涉诉，未结案，借款人为被告或涉诉第三人\"}]",
      punishSituationOptions:"[{\"code\":\"1\",\"name\":\"暂无\"},{\"code\":\"2\",\"name\":\"曾受到行政处罚，已处理完毕\"},{\"code\":\"3\",\"name\":\"受到行政处罚，尚未处理完\"}]",
      punishTypeOptions:"[{\"code\":\"1\",\"name\":\"警告\"},{\"code\":\"2\",\"name\":\"罚款\"},{\"code\":\"3\",\"name\":\"没收违法所得、没收非法财物\"},{\"code\":\"4\",\"name\":\"责令停产停业\"},{\"code\":\"5\",\"name\":\"暂扣或者吊销许可证，暂扣或者吊销执照\"},{\"code\":\"6\",\"name\":\"行政拘留\"},{\"code\":\"7\",\"name\":\"法律、行政法规规定的其他行政处罚\"}]",
      platformSituationOptions:"[{\"name\":\"无借款\",\"code\":\"无借款\"},{\"name\":\"有借款，已结清\",\"code\":\"有借款，已结清\"},{\"name\":\"有借款，待结清\",\"code\":\"有借款，待结清\"}]",
      overdueConditionOptions:"[{\"name\":\"无逾期\",\"code\":\"无逾期\"},{\"name\":\"有逾期，已还清\",\"code\":\"有逾期，已还清\"},{\"name\":\"有逾期，未还清\",\"code\":\"有逾期，未还清\"}]",
      activeNames: ['1', '2'],
      //用户信息
      where: {},
      //表单规则
      rules: CustomerRules,
      workingArea2: ['', '', ''],
      liveArea: ['', '', ''],
      hukouArea: ['', '', '']
    };
  },
  props: ['postData','isView'],
  watch: {
    postData(nVal) {
      if (nVal) {
        this.where={}
        this.where.customerType = this.postData.customerType
      }
    },
    // 'where.enterpriseLegalCertificateTypeCode':function(curVal){
    //   this.changeCardType();
    // }
  },
  components: {
    AddressArea,
    HtSelect,
    HtInput,
    HtPicker
  },
  mounted() {
    this.$nextTick(() => {
      // this.getData();
      this.where={}
      this.where.customerType = this.postData.customerType
    });
  },
  methods: {
    setSexAndAge() {
      if(this.where.enterpriseLegalCertificateTypeCode=='ID_card') {
        let strSex=validateIdCard(this.where.enterpriseLegalCertificateNumber, true).sex;
        this.$set(this.where, 'sex', (strSex && strSex!='male') ? parseInt(strSex):null);
        this.$set(this.where, 'age', GetAge(this.where.enterpriseLegalCertificateNumber));
      }
    },
    //重置校验规则
    changeCardType() {
      this.$nextTick(() => {
        this.$refs.personInfo.validateField('enterpriseLegalCertificateNumber');
      });
    },
    checkCard(){
      this.$api
        .getCustomerByTypeAndNumber({
          "customerType": this.postData.customerType
          ,"certificateNumber": this.where.unifiedSocialCreditCode
        })
        .then(res => {
          if (res.returnCode == '0000') {
            if(res.data&&res.data.customer){
              this.$emit('changeView')
              this.$set(this,'where',res.data.customer);
            }
          }
        });
    },
    initData() {
      //获取当前住宅信息并填充至表单中
      this.liveArea = [this.where.liveProvinceCode, this.where.liveCityCode, this.where.liveCountyCode];
      this.hukouArea = [this.where.hukouProvinceCode, this.where.hukouCityCode, this.where.hukouCountyCode];
      this.workingArea2 = [this.where.enterpriseRegisterProvinceCode, this.where.enterpriseRegisterCityCode, this.where.enterpriseRegisterCountyCode];
    },
    close() {
      this.$emit('closeDialog');
    },
    submit() {
      //先验证是否已填完
      this.$refs.baseInfo.validate(valid => {
        if (valid) {
          this.$refs.personInfo.validate(validX => {
            if (validX) {
              this.submitData();
            } else {
               this.validActiveNames('2');
              return false;
            }
          });
        } else {
           this.validActiveNames('1');
          return false;
        }
      });
    },
    submitData() {
      var userInfo = getLocalStorage('userInfo');
      this.where.userId = userInfo.userId;
      this.where.userName = userInfo.userName;
      //提交表单
        this.$api.saveCustomerTogether(
          {"customerCode": this.postData.customerCode,"customer": this.where}
        ).then(res => {
          if(res.returnCode== '0000'){
            this.$message.success('提交成功！');
            this.$emit('getData');
            this.$emit('closeDialog');
          }else{
            this.$message.error(res.msg);
          }
        })
    },
     validActiveNames(name) {
      let activeNames = this.activeNames;
      let noHave = activeNames.every(x => {
        return x !== name;
      });
      if (noHave) {
        this.activeNames.push(name);
      } else {
        return;
      }
    },
  },
  computed: {
    ...mapGetters([
      'certificate_type',
      'house_type',
      'province',
      'city',
      'county',
      'monthly_income',
      'education',
      'marriage_status',
      'professional_nature',
      'unit_properties',
      'industry',
      'position',
      'wage_pay_type',
      'organization_type',
      'enterprise_type'
    ])
  }
};
</script>

<style lang='scss'>
.bottom-btn {
  width: 100%;
  text-align: center;
  padding-top: 20px;
}
</style>
