<template>
  <div>
    <el-form :model='where' size="small" ref="formName" :rules="rules" class='hongte-query-form' :inline='true' label-position="right" label-width="120px">
      <el-form-item label='代扣平台' class="f-item1">
        <el-input v-model='where.platformName' placeholder='请输入' disabled></el-input>
      </el-form-item>
      <el-form-item label='开户银行' class="f-item1">
        <el-input v-model='where.bankName' placeholder='请输入' disabled></el-input>
      </el-form-item>
      <el-form-item label='银行卡号'  class="f-item1">
        <el-input v-model='where.bankAccounts' placeholder='请输入' disabled></el-input>
      </el-form-item>
      <el-form-item label='预留手机号' class="f-item1">
        <el-input v-model='where.phone' placeholder='请输入' disabled>
          <el-button :style="{color:'#fff',backgroundColor:localTheme.themeColor,borderColor:localTheme.themeColor}" slot="append" icon="fa fa-paper-plane-o" @click="sendVerificationCode()"> 发送验证码</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label='短信验证码' prop="validCode" class="f-item1">
        <el-input v-model='where.validCode' placeholder='请输入'></el-input>
      </el-form-item>
    </el-form>
    <el-row class="bottom-btn">
      <el-button type="primary" @click="submit()">提交</el-button>
      <el-button @click="close">关闭</el-button>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { DkBankCardRules } from '@rules';
export default {
  name: 'DkBankCard',
  data() {
    return {
      rules: DkBankCardRules
    };
  },
  props: ['postData'],
  watch: {},
  methods: {
    close() {
      this.$emit('closeDialog');
    },
    submit() {
      let params = Object.assign({}, this.where);
      params.bankAccounts = this.Trim(params.bankAccounts);
      // if (this.postData.title == '代扣绑卡') {
      this.$refs.formName.validate((valid) => {
        if (valid) {
          this.$api.DKconfirmBindCard(params).then(res => {
            if (res.returnCode == '0000') {
              this.$message.success('绑卡成功! ');
              this.$emit('closeDialog');
              this.$emit('getData');
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    //去掉银行卡的空格
    Trim(str, is_global) {
      var result;
      is_global = is_global ? is_global : 'g';
      result = str.replace(/(^\s+)|(\s+$)/g, '');
      if (is_global.toLowerCase() == 'g') {
        result = result.replace(/\s/g, '');
      }
      return result;
    },
    sendVerificationCode() {
      let params = Object.assign({}, this.where);
      params.bankAccounts = this.Trim(params.bankAccounts);
      console.log(params);
      
      this.$refs.formName.validate((valid, obj) => {
        if (!obj.newValue) {
          this.$api.DKbindCardApply(params).then(res => {
            if (res.returnCode == '0000') {
              this.where.requestId = res.data.requestId;
              //代扣块钱需要传token
              if (res.data.token) {
                this.where.token = res.data.token;
              }
              this.$message.success('验证码发送成功！');
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    }
  },
  computed: {
    ...mapGetters(['localTheme']),
    where() {
      let postData = this.postData;
      if (postData) {
        // delete postData.title;
        return postData;
      }
    }
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
