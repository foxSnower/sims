<template>
  <div>
    <el-form :model='where' size="small" ref="formName" :rules="rules" class='hongte-query-form' :inline='true' label-position="right" label-width="120px">
      <el-form-item label='客户名称' class="f-item1">
        <el-input v-model='where.customerName' placeholder='请输入' disabled></el-input>
      </el-form-item>
      <el-form-item label='原手机号' class="f-item1">
        <el-input v-model='where.phone' placeholder='请输入' disabled>
        </el-input>
      </el-form-item>
      <el-form-item label='新手机号' prop="newValue" class="f-item1">
        <el-input v-model='where.newValue' placeholder='请输入'>
          <el-button :style="{color:'#fff',backgroundColor:localTheme.themeColor,borderColor:localTheme.themeColor}" slot="append" icon="fa fa-paper-plane-o" @click="sendVerificationCode()"> 发送验证码</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label='短信验证码' prop="verificationCode" class="f-item1">
        <el-input v-model='where.verificationCode' placeholder='请输入'></el-input>
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
import { CustomeModifyForCustomerPhoneRules } from '@rules';
import { validator } from '@utils';
export default {
  name: 'CustomeModifyForCustomerPhone',
  data() {
    return {
      where: {},
      rules: CustomeModifyForCustomerPhoneRules
    };
  },
  props: ['postData'],
  watch: {
    postData(nVal) {
      if (nVal) {
        this.getData();
      }
    }
  },
  beforeMount() {
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
            this.where = res.data.customer;
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    close() {
      this.$emit('closeDialog');
    },
    submit() {
      this.$refs.formName.validate(valid => {
        if (valid) {
          this.$api
            .changeSensitiveInfo({
              customerCode: this.where.customerCode,
              msgRequestId: this.where.sendRequestId,
              newValue: this.where.newValue,
              verificationCode: this.where.verificationCode,
              type: '2' //1:变更客户名称, 2:变更客户手机号码, 3:更改法人手机号码 4:变更证件信息
            })
            .then(res => {
              if (res.returnCode == '0000') {
                this.$emit('closeDialog');
                this.$emit('getData');
                this.$message.success('提交成功');
              } else {
                this.$message.error(res.msg);
              }
            });
        } else {
          return false;
        }
      });
    },
    sendVerificationCode() {
      let valid = false;
      this.$refs.formName.validateField('newValue', errorMessage => {
        console.log(errorMessage);
        if (errorMessage) {
          valid = false;
        } else {
          valid = true;
        }
      });
      if (valid) {
        this.$api
          .sendMsg({
            phone: this.where.phone,
            type: '2' //1:变更客户名称, 2:变更客户手机号码, 3:更改法人手机号码 4:变更证件信息
          })
          .then(res => {
            if (res.returnCode == '0000') {
              this.where.sendRequestId = res.data.sendRequestId;
              this.$message.success('验证码发送成功！');
            } else {
              this.$message.error(res.msg);
            }
          });
      }
    }
  },
  computed: {
    ...mapGetters(['localTheme'])
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
