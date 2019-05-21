<template>
  <div>
    <el-form :model='where' size="small" ref="formName" :rules="rules" class='hongte-query-form' :inline='true' label-position="right" label-width="120px">
      <el-form-item label='银行卡号' prop="bankAccounts" class="f-item1">
        <el-input v-model.trim='where.bankAccounts' placeholder='请输入' @change="getBankBin(where.bankAccounts)" @input="where.bankAccounts = validateNum(where.bankAccounts)" maxlength=23></el-input>
      </el-form-item>
      <HtSelect filterable class="f-item1" label='开户银行' prop="bankCode" type="bank" v-model="where.bankCode" :name.sync="where.bankName"></HtSelect>
      <el-form-item label='所属省市' prop="bankProvinceCode" class="f-item1">
        <AddressArea :showCity=true :value='liveArea' @getData="(code,name)=>{ where.bankProvinceCode=code[0];where.bankCityCode=code[1];where.bankProvinceName=name[0];where.bankCityName=name[1]}"></AddressArea>
        <!-- <el-input v-model='where.bankName' placeholder='请输入'></el-input> -->
      </el-form-item>
      <el-form-item label='支行名称' prop="branchBankName" class="f-item1">
        <el-input v-model='where.branchBankName' placeholder='请输入'></el-input>
      </el-form-item>
      <el-form-item label='转账类型' prop="transferType" class="f-item1">
        <el-radio v-model="where.transferType" label=1>对公</el-radio>
        <el-radio v-model="where.transferType" label=2>对私</el-radio>
      </el-form-item>
      <el-form-item label='预留手机号' prop="phone" class="f-item1">
        <el-input v-model='where.phone' placeholder='请输入' maxlength="11"></el-input>
      </el-form-item>
    </el-form>
    <el-row class="bottom-btn">
      <el-button type="primary" @click="submit()">提交</el-button>
      <el-button @click="close">关闭</el-button>
    </el-row>
  </div>
</template>

<script>
import AddressArea from '@components/AddressArea';
import BIN from 'bankcardinfo';
import HtRadio from '@components/HtRadio';
import HtInput from '@components/HtInput';
import HtSelect from '@components/HtSelect';
import { mapGetters, mapMutations } from 'vuex';
import { AddBankCardRules } from '@rules';
export default {
  name: 'AddBankCard',
  data() {
    return {
      where: {
        bankAccounts: '',
        bankCityCode: '',
        bankCityName: '',
        bankCode: '',
        bankName: '',
        bankProvinceCode: '',
        bankProvinceName: '',
        branchBankName: '',
        customerCode: '',
        phone: '',
        transferType: '1' //转账类型（1：对公；2：对私；）
      },
      liveArea: [],
      rules: AddBankCardRules
    };
  },
  components: { AddressArea, HtSelect },
  props: ['postData'],
  mounted() {
    this.$nextTick(() => {
      this.getData();
    });
  },
  methods: {
    getData() {
      this.$api
        .getCustomerDetail({
          customerCode: this.postData.customerCode
        })
        .then(res => {
          if (res.returnCode == '0000') {
            this.$set(this.where, 'phone', res.data.customer.phone);
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    //格式化银行号码
    validateNum(bankCard) {
      bankCard = bankCard
        .replace(/\s/g, '')
        .replace(/[^\d]/g, '')
        .replace(/(\d{4})(?=\d)/g, '$1 ');
      return bankCard;
    },
    close() {
      this.$emit('closeDialog');
    },
    getBankBin(bankAccounts) {
      // debugger;
      let _vm = this;
      bankAccounts = this.Trim(bankAccounts);
      console.log(bankAccounts);
      BIN.getBankBin(bankAccounts, function(err, data) {
        _vm.$set(_vm.where, 'bankName', data.bankName);
        _vm.$set(_vm.where, 'bankCode', data.bankCode);
      });
    },
    Trim(str, is_global) {
      var result;
      is_global = is_global ? is_global : 'g';
      result = str.replace(/(^\s+)|(\s+$)/g, '');
      if (is_global.toLowerCase() == 'g') {
        result = result.replace(/\s/g, '');
      }
      return result;
    },
    submit() {
      this.where.bankAccounts = this.Trim(this.where.bankAccounts, 'g');
      this.$set(this.where, 'customerCode', this.postData.customerCode);
      let params = Object.assign({}, this.where);
      this.$refs.formName.validate(valid => {
        console.log(valid);
        if (valid) {
          this.$api.addBankCardInfo(params).then(res => {
            if (res.returnCode == '0000') {
              this.$message.success('新增成功! ');
              this.$emit('getData');
              this.$emit('closeDialog');
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          return false;
        }
      });
    }
  },
  computed: {
    ...mapGetters(['localTheme', 'bank'])
  }
};
</script>


<style lang='scss' scoped>
.hongte-query-form {
  width: 500px;
  margin: 0 auto;
}
.bottom-btn {
  width: 100%;
  text-align: center;
  padding-top: 20px;
}
</style>
