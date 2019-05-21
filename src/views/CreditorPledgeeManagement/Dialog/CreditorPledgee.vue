<template>
  <div>
    <el-form :model='where' ref="formName" size="small" :rules="rules" class='hongte-query-form' :inline='true' label-position="right" label-width="120px">
      <HtInput class="f-item3" label='客户名称' prop="name" v-model="where.name"></HtInput>
      <HtSelect class="f-item3" label='客户类型' prop="type" type="customer_type" v-model="where.type" @change="resetFields"></HtSelect>
      <HtInput class="f-item3"  v-if="where.type=='1'" label='身份证号码' prop="idCard" v-model="where.idCard" maxlength="18"></HtInput>
      <HtInput class="f-item3" v-if="where.type!='1'" label='统一社会信用代码' prop="unifiedCode" v-model="where.unifiedCode" maxlength="18"></HtInput>
      <HtInput class="f-item3" label='地址' v-model="where.address"></HtInput>
      <HtInput class="f-item3" label='电话号码'  v-model="where.phone" maxlength="11"></HtInput>
      <HtInput class="f-item3" v-if="where.type!='1'" label='法人' prop="legalPerson" v-model="where.legalPerson"></HtInput>
      <HtInput class="f-item3" label='电子邮件' prop="email" v-model="where.email"></HtInput>
      <!-- <HtInput class="f-item3" label='对应团贷网担保公司社会信用代码' prop="tuandaiGuaranteeShxydm" v-model="where.tuandaiGuaranteeShxydm"></HtInput> -->
      <el-form-item label='对应团贷网担保公司名称'  class="f-item3">
        <el-select v-model='where.tuandaiGuaranteeGuid' placeholder='请选择对应团贷网担保公司名称' @change="(val)=>{where.tuandaiGuaranteeCompany = toChange(val)}">
          <el-option v-for="(x,index) in tuandaiGuaranteeGuidList" :key="index" :label='x.label' :value="x.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='是否是抵押权人' prop="isCreaditor" class="f-item3">
        <el-select v-model='where.isCreaditor' placeholder='请选择'>
          <el-option label='是' value="1"></el-option>
          <el-option label='否' value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='是否是债权人' prop="isPledgee" class="f-item3">
        <el-select v-model='where.isPledgee' placeholder='请选择'>
          <el-option label='是' value="1"></el-option>
          <el-option label='否' value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='是否受让人' prop="isAssignee" class="f-item3">
        <el-select v-model='where.isAssignee' placeholder='请选择'>
          <el-option label='是' value="1"></el-option>
          <el-option label='否' value="0"></el-option>
        </el-select>
      </el-form-item>
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
// import SelectOption from '@components/SelectOption';
import { CreditorPledgeeRules } from '@rules';
export default {
  name: 'CreditorPledgee',
  data() {
    return {
      rules: CreditorPledgeeRules,
      where: {},
      tuandaiGuaranteeGuidList: []
    };
  },
  props: ['postData'],
  components: {
    HtInput,
    HtSelect
  },
  watch: {
    postData(val) {
      this.$refs.formName.clearValidate();
      this.getData();
    }
  },
  beforeMount() {
    this.$nextTick(() => {
      this.getData();
    });
  },
  methods: {
    getData() {
      if (this.postData) {
        this.where = Object.assign({}, this.postData);
      } else {
        this.where = {};
      }
      this.$api.getGuaranteeOrganList({}).then(res => {
        if (res.returnCode == '0000') {
          this.tuandaiGuaranteeGuidList = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    toChange(code) {
      let name = '';
      if (this.tuandaiGuaranteeGuidList) {
        this.tuandaiGuaranteeGuidList.forEach(x => {
          if (x.value == code) {
            name = x.label;
          }
        });
      }
      return name;
    },
    close() {
      this.$emit('closeDialog');
    },
    resetFields(){
      this.$refs.formName.clearValidate();
      // let vm = this;
      // setTimeout(function () {
      //   vm.$refs.formName.validate(valid=>{});
      // },10)

    },
    submit() {
      let params = Object.assign({}, this.where);
      if (this.postData.id) {
        this.$refs.formName.validate(valid => {
          if (valid) {
            this.$api.updateCreditorPledgee(params).then(res => {
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
            this.$api.addCreditorPledgee(params).then(res => {
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
  },
  computed: {
    // where() {
    //   if (this.postData) {
    //     return Object.assign({}, this.postData);
    //   } else {
    //     return {};
    //   }
    // }
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


