<template>
  <div style="margin-bottom: 30px;">
    <el-collapse-item class="collapse-head" title="出款信息" name="3">
      <el-form :model='where' ref="formName2" size="small" :rules="rules" class='hongte-query-form f-flex is-clear' :inline='true' label-position="right" label-width="120px" :disabled="isDisabled">
        <el-form-item label='债权人、借款人' prop="lenderId" class="f-item">
          <el-select v-model='where.lenderId' placeholder='请选择' @change="where.lenderName = changeCodeName(where.lenderId,['value','label'],getNodeListCreditorPledgee)">
            <el-option v-for="(x,index) in getNodeListCreditorPledgee" :key="index" :label='x.label' :value='x.value'></el-option>
          </el-select>
        </el-form-item>
        <div class="f-item">
          <label>所属分公司全称：</label>
          <p><span>{{where.companyName}}</span></p>
        </div>
        <div class="f-item">
          <label>分公司地址：</label>
          <p><span>{{where.companyAddress}}</span></p>
        </div>
        <div class="f-item">
          <label>法人代表：</label>
          <p><span>{{where.legalName}}</span></p>
        </div>
        <div class="f-item">
          <label>联系电话：</label>
          <p><span>{{where.legalTelephone}}</span></p>
        </div>
      </el-form>
    </el-collapse-item>
    <el-collapse-item class="collapse-head" title="合同信息" name="4" style="padding-bottom: 20px;">
      <el-form :model='where' ref="formName3" size="small" :rules="rules" class='hongte-query-form f-flex is-clear' :inline='true' label-position="right" label-width="120px" :disabled="isDisabled">
        <el-form-item label='合同签订日期' prop="signTime" class="f-item1">
          <el-date-picker style="width:250px;" :editable="false" value-format="yyyy-MM-dd" v-model="where.signTime" type="date" placeholder="请选择">
          </el-date-picker>
        </el-form-item>
        <div class="f-item">
          <label>统一社会信用代码：</label>
          <p><span>{{where.uniteCode}}</span></p>
        </div>
        <div class="f-item">
          <label>电子签章横向文：</label>
          <p><span>{{where.horizontalText}}</span></p>
        </div>
        <div class="f-item">
          <label>电子签章下弦文：</label>
          <p><span>{{where.cosText}}</span></p>
        </div>
         <div class="f-item">
          <label>还款账户名：</label>
          <p><span>{{where.returnAccountName}}</span></p>
        </div>
         <div class="f-item">
          <label>还款开户支行：</label>
          <p><span>{{where.returnBankName}}</span></p>
        </div>
         <div class="f-item">
          <label>还款账号：</label>
          <p><span>{{where.returnAccountNo}}</span></p>
        </div>
         <div class="f-item">
          <label>居间费账户名：</label>
          <p><span>{{where.midAccountName}}</span></p>
        </div>
         <div class="f-item">
          <label>居间费开户支行：</label>
          <p><span>{{where.midBankName}}</span></p>
        </div>
         <div class="f-item">
          <label>居间费账号：</label>
          <p><span>{{where.midAccountNo}}</span></p>
        </div>
      </el-form>
    </el-collapse-item>
  </div>
</template>

<script>
import { validScrollTop, changeCodeName } from '@utils';
export default {
  name: 'InfoForContractAndOutMoney',
  data() {
    return {
      //债权人、借款人
      getNodeListCreditorPledgee: [] 
    };
  },
  watch: {
    where: function(newVal) {
      this.$emit('input', newVal);
    }
  },
  props: ['where', 'rules', 'isSub'],
  mounted() {
    this.$nextTick(() => {
      this.getCompanyInfo();
      this.getNodeList();
    });
  },
  methods: {
    //用信申请--通过userId查询分公司及其账户详情
    getCompanyInfo() {
      this.$api.getCompanyInfoDetailByUserId({}).then(res => {
        if (res.returnCode == '0000') {
          let companyInfo = res.data.companyInfo;
          let companyAccount = res.data.companyAccount;
          this.$set(this.where, 'companyName', companyInfo.companyNameContract); //所属分公司全称
          this.$set(this.where, 'companyAddress', companyInfo.companyAddressContract); //分公司地址
          this.$set(this.where, 'legalName', companyInfo.legalPerson); //法人代表
          this.$set(this.where, 'legalTelephone', companyInfo.companyPhone); //联系电话
          this.$set(this.where, 'uniteCode', companyInfo.unifiedSocialCreditCode); //统一社会信用代码
          this.$set(this.where, 'horizontalText', companyInfo.horizontalText); //电子签章横向文
          this.$set(this.where, 'cosText', companyInfo.thirdQuarterText); //电子签章下弦文
          if (companyAccount.length !== 0) {
            companyAccount.forEach(x => {
              if (x.retuenAccount) {
                this.$set(this.where, 'returnAccountName', x.accountName); //还款账户名
                this.$set(this.where, 'returnBankName', x.openName); //还款开户支行
                this.$set(this.where, 'returnAccountNo', x.bankCard); //还款账号
              }
              if (x.intermediaryAccount) {
                this.$set(this.where, 'midAccountName', x.accountName); //居间费账户名
                this.$set(this.where, 'midBankName', x.openName); //居间费开户支行
                this.$set(this.where, 'midAccountNo', x.bankCard); //居间费账号
              }
            });
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //债权人、借款人
    getNodeList() {
      this.$api.getNodeListCreditorPledgee({}).then(res => {
        if (res.returnCode == '0000') {
          this.getNodeListCreditorPledgee = res.data;
        } else {
          this.$message.error(re.msg);
        }
      });
    },
    //验证表单
    validateForm() {
      let isValid = true;
      for (let i = 2; i < 4; i++) {
        this.$refs['formName' + i].validate((valid, obj) => {
          if (valid) {
          } else {
            validScrollTop(obj);
            isValid = false;
            return false;
          }
        });
      }
      return isValid;
    }
  },
  computed: {
    changeCodeName() {
      return changeCodeName;
    },
    isDisabled(){
      return this.isSub
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
</style>


