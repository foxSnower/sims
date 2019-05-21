<template>
  <div class='apply-box-card'>
    <el-collapse v-model="activeNames">
      <el-collapse-item class="collapse-head" title="个人基本信息" name="1">
        <el-form :disabled="isView" :model='where' ref="personInfo" size="small" :rules="rules" class='hongte-query-form' :inline='true' label-position="right" label-width="120px">
          <HtInput prop="customerName" class="f-item3" label='客户名称' v-model="where.customerName" ></HtInput>
          <HtSelect prop="certificateTypeCode" class="f-item3" @change="changeCardType" label='证件类型' type="certificate_type" v-model="where.certificateTypeCode" :name.sync="where.certificateTypeName" ></HtSelect>
          <HtInput v-if="where.certificateTypeCode==='ID_card'||!where.certificateTypeCode" prop="certificateNumber" :rules="rules.ID_card" class="f-item3" label='证件号码' v-model="where.certificateNumber" @blur.native.capture="checkCard"></HtInput>
          <HtInput v-if="where.certificateTypeCode==='home_visit'"  prop="certificateNumber" :rules="rules.home_visit" class="f-item3" label='证件号码' v-model="where.certificateNumber" @blur.native.capture="checkCard"></HtInput>
          <HtInput v-if="where.certificateTypeCode==='taiwan_card'" prop="certificateNumber" :rules="rules.taiwan_card" class="f-item3" label='证件号码' v-model="where.certificateNumber" @blur.native.capture="checkCard"></HtInput>
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
          <HtInput class="f-item3" label='房产价值' prop="houseValue" v-model="where.houseValue"></HtInput>
          <HtInput class="f-item3" label='车辆价值' prop="carValue" v-model="where.carValue"></HtInput>
          <HtInput class="f-item3" label='当前负债' prop="currentLiabilities" v-model="where.currentLiabilities"></HtInput>
          <HtSelect class="f-item3" label='在其他网络借贷平台借款情况' prop="platformSituation" v-model="where.platformSituation" :dataSource="platformSituationOptions"></HtSelect>
          <HtSelect class="f-item3" label='截至借款前6个月内借款人征信报告中的逾期情况' prop="overdueCondition" v-model="where.overdueCondition" :dataSource="overdueConditionOptions"></HtSelect>

          <HtSelect class="f-item3" label='涉诉情况' prop="caseSituation" v-model="where.caseSituation" :name.sync="where.caseSituationName" :dataSource="caseSituationOptions"></HtSelect>

          <HtInput v-if="where.caseSituation=='2'||where.caseSituation=='3'||where.caseSituation=='4'" class="f-item3" label='涉案事由' prop="caseReason" :rules="rules.case_reason" v-model="where.caseReason"></HtInput>
          <!--<HtInput v-else class="f-item3" label='涉案事由' prop="caseReason" v-model="where.caseReason"></HtInput>-->

          <HtSelect class="f-item3" label='处罚情况' v-model="where.punishSituation" :name.sync="where.punishSituationName" :dataSource="punishSituationOptions"></HtSelect>
          <HtSelect v-if="where.punishSituation=='2'||where.punishSituation=='3'" class="f-item3" label='处罚种类' prop="punishType" :rules="rules.punish_type" v-model="where.punishType" :name.sync="where.punishTypeName" :dataSource="punishTypeOptions"></HtSelect>
          <!--<HtSelect v-else class="f-item3" label='处罚种类' prop="punishType" v-model="where.punishType" :name.sync="where.punishTypeName" :dataSource="punishTypeOptions"></HtSelect>-->

          <HtInput v-if="where.punishType=='1'||where.punishType=='2'" class="f-item3" label='处罚事由' prop="punishReason" :rules="rules.punish_reason" v-model="where.punishReason"></HtInput>
          <!--<HtInput v-else class="f-item3" label='处罚事由' prop="punishReason" v-model="where.punishReason"></HtInput>-->
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="其它信息" name="2">
        <el-form :disabled="isView" :model='where' ref="otherInfo" size="small" :rules="rules" class='hongte-query-form' :inline='true' label-position="right" label-width="120px">
          <HtRadio class="f-item1" label='职业类型' prop="professionalNatureCode" type="professional_nature" v-model="where.professionalNatureCode" :name.sync="where.professionalNatureName"></HtRadio>
          <!-- <HtInput v-if="where.professionalNatureCode!='1'" class="f-item3" label='单位全称' v-model="where.companyName"></HtInput> -->
          <HtInput v-show="where.professionalNatureCode!='1'" class="f-item3" label='单位全称' v-model="where.companyName"></HtInput>

          <HtInput v-show="where.professionalNatureCode=='1'" class="f-item3" label='单位全称' prop="companyName" v-model="where.companyName"></HtInput>
          <HtSelect class="f-item3" label='单位性质' prop="unitPropertiesCode" v-model="where.unitPropertiesCode" :name.sync="where.unitPropertiesName" type="unit_properties"></HtSelect>
          <HtSelect class="f-item3" label='所属行业' prop="industryCode" v-model="where.industryCode" :name.sync="where.industryName" type="industry"></HtSelect>
          <HtSelect v-if="where.professionalNatureCode=='1'" class="f-item3" label='单位职务' prop="positionCode" v-model="where.positionCode" :name.sync="where.positionName" type="position"></HtSelect>
          <HtPicker v-if="where.professionalNatureCode=='1'" class="f-item3" type="date" label='入职时间' prop="entryTime" v-model="where.entryTime" format="yyyy-MM-dd"></HtPicker>
          <HtSelect v-if="where.professionalNatureCode=='1'" class="f-item3" label='工资发放形式' prop="wagePayTypeCode" type="wage_pay_type" v-model="where.wagePayTypeCode" :name.sync="where.wagePayTypeName"></HtSelect>
          <el-form-item label='单位地址' prop="workingProvinceCode" class="f-item3">
            <AddressArea :value='workingArea' @getData="(code,name)=>{ where.workingProvinceCode=code[0];where.workingCityCode=code[1];where.workingCountyCode=code[2];where.workingProvinceName=name[0];where.workingCityName=name[1];where.workingCountyName=name[2];}"></AddressArea>
          </el-form-item>
          <HtInput class="f-item3" label='单位详细地址' prop="workingAddress" v-model="where.workingAddress"></HtInput>
          <HtSelect v-if="where.professionalNatureCode!='1'" class="f-item3" label='组织形式' prop="organizationTypeCode" v-model="where.organizationTypeCode" :name.sync="where.organizationTypeName" type="organization_type"></HtSelect>
          <HtInput v-if="where.professionalNatureCode!='1'" class="f-item3" label='股份占比(%)' prop="organizationShare" v-model="where.organizationShare"></HtInput>
          <HtInput v-if="where.professionalNatureCode!='1'" class="f-item1" type="textarea" rows=3 label='经营范围' prop="businessRange" v-model="where.businessRange"></HtInput>
          <HtInput v-if="where.professionalNatureCode!='1'" class="f-item1" type="textarea" rows=3 label='其他股东占股情况' prop="otherPartner" v-model="where.otherPartner"></HtInput>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-row class="bottom-btn">
      <el-button type="primary"  @click="submit">提交</el-button>
      <el-button @click="close">关闭</el-button>
    </el-row>
  </div>
</template>

<script>
import AddressArea from '@components/AddressArea';
import HtRadio from '@components/HtRadio';
import HtSelect from '@components/HtSelect';
import HtInput from '@components/HtInput';
import HtPicker from '@components/HtPicker';
import { CustomerRules } from '@rules';
import { codeToName, getLocalStorage,GetAge, validateIdCard } from '@utils';
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'CustomeAddForPerson',
  data() {
    return {
      caseSituationOptions:"[{\"code\":\"1\",\"name\":\"无涉诉\"},{\"code\":\"2\",\"name\":\"有涉诉，已结案\"},{\"code\":\"3\",\"name\":\"有涉诉，未结案，借款人为原告\"},{\"code\":\"4\",\"name\":\"有涉诉，未结案，借款人为被告或涉诉第三人\"}]",
      punishSituationOptions:"[{\"code\":\"1\",\"name\":\"暂无\"},{\"code\":\"2\",\"name\":\"曾受到行政处罚，已处理完毕\"},{\"code\":\"3\",\"name\":\"受到行政处罚，尚未处理完\"}]",
      punishTypeOptions:"[{\"code\":\"1\",\"name\":\"警告\"},{\"code\":\"2\",\"name\":\"罚款\"},{\"code\":\"3\",\"name\":\"没收违法所得、没收非法财物\"},{\"code\":\"4\",\"name\":\"责令停产停业\"},{\"code\":\"5\",\"name\":\"暂扣或者吊销许可证，暂扣或者吊销执照\"},{\"code\":\"6\",\"name\":\"行政拘留\"},{\"code\":\"7\",\"name\":\"法律、行政法规规定的其他行政处罚\"}]",
      platformSituationOptions:"[{\"name\":\"无借款\",\"code\":\"无借款\"},{\"name\":\"有借款，已结清\",\"code\":\"有借款，已结清\"},{\"name\":\"有借款，待结清\",\"code\":\"有借款，待结清\"}]",
      overdueConditionOptions:"[{\"name\":\"无逾期\",\"code\":\"无逾期\"},{\"name\":\"有逾期，已还清\",\"code\":\"有逾期，已还清\"},{\"name\":\"有逾期，未还清\",\"code\":\"有逾期，未还清\"}]",
      activeNames: ['1', '2'],
      liveArea: ['', '', ''],
      hukouArea: ['', '', ''],
      workingArea: ['', '', ''],
      //用户信息
      where: {},
      //表单规则
      rules: CustomerRules
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
    'where.certificateTypeCode':function(curVal){
      this.changeCardType();
    }
  },
  components: {
    AddressArea,
    HtRadio,
    HtSelect,
    HtInput,
    HtPicker
  },
  created: function () {
    console.log('created')
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
      let strSex=validateIdCard(this.where.certificateNumber, true).sex;
      this.$set(this.where, 'sex', (strSex && strSex!='male') ? parseInt(strSex):null);
      this.$set(this.where, 'age', GetAge(this.where.certificateNumber));
    },
    //重置校验规则
    changeCardType() {
      this.$nextTick(() => {
        this.$refs.personInfo.validateField('certificateNumber');
      });
    },
    checkCard(){
      if(this.where.certificateTypeCode=='ID_card'){
        this.setSexAndAge()
      }
      this.$api
        .getCustomerByTypeAndNumber({
          "customerType": this.postData.customerType
          ,"certificateNumber": this.where.certificateNumber
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
      this.liveArea = [this.where.liveProvinceCode, this.where.liveCityCode, this.where.liveCountyCode];
      this.hukouArea = [this.where.hukouProvinceCode, this.where.hukouCityCode, this.where.hukouCountyCode];
      this.workingArea = [this.where.workingProvinceCode, this.where.workingCityCode, this.where.workingCountyCode];
    },
    close() {
      this.$emit('closeDialog');
    },
    submit() {
      //先验证是否已填完
      this.$refs.personInfo.validate(valid => {
        if (valid) {
          this.$refs.otherInfo.validate(validX => {
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
    }
  }
};
</script>

<style lang='scss'>
.modify {
  margin-top: 30px;
}
.bottom-btn {
  width: 100%;
  text-align: center;
  padding-top: 20px;
}
</style>
