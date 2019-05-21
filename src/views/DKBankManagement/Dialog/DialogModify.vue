<template>
  <div>
    <el-form :model='where' ref="formName" size="small" :rules="rules" class='hongte-query-form' :inline='true' label-position="right" label-width="120px">
      <HtInput class="f-item3" label='代扣类型' prop="type" v-model="where.type"></HtInput>
      <HtInput class="f-item3" label='代扣渠道' prop="channel" v-model="where.channel"></HtInput>
      <HtInput class="f-item3" label='支持银行' prop="bankName" v-model="where.bankName"></HtInput>
      <HtInput class="f-item3" label='单日限额(元)' prop="dailyLimit" v-model="where.dailyLimit"></HtInput>
      <HtInput class="f-item3" label='单笔限额(元)' prop="singleLimit" v-model="where.singleLimit"></HtInput>
    </el-form>
    <el-row class="bottom-btn">
      <el-button type="primary" @click="submit">提交</el-button>
      <el-button @click="close">关闭</el-button>
    </el-row>
  </div>

</template>

<script>
import HtInput from '@components/HtInput';
import HtSelect from '@components/HtSelect';
import { DkBankRules } from '@rules';
export default {
  name: 'DialogModify',
  data() {
    return {
      rules: DkBankRules,
      where: {},
    };
  },
  props: ['postData'],
  components: {
    HtInput,
    HtSelect
  },
  watch: {
    postData(val) {
      this.resetFields();
      this.getData();
    }
  },
  beforeMount() {
    this.$nextTick(() => {
      this.getData();
      console.log(111);
      
    });
  },
  methods: {
    getData() {
      if (this.postData) {
        this.where = Object.assign({}, this.postData);
      } else {
        this.where = {};
      }
    },
    close() {
      this.$emit('closeDialog');
    },
    resetFields(){
      this.$refs.formName.clearValidate();
    },
    submit() {
      let params = Object.assign({}, this.where);
      if (this.postData.id) {
        this.$refs.formName.validate(valid => {
          if (valid) {
            this.$api.withholdingLimitUpdate(params).then(res => {
              if (res.returnCode == '0000') {
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
      } else {
        this.$refs.formName.validate(valid => {
          if (valid) {
            this.$api.withholdingLimitAdd(params).then(res => {
              if (res.returnCode == '0000') {
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
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.bottom-btn {
  width: 100%;
  text-align: center;
  padding-top: 20px;
}
</style>


