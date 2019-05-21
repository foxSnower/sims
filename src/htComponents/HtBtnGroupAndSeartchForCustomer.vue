<template>
  <div class="aside-btn is-clear">
    <el-row class="buss-btn" v-if="rightBtnText">
      <el-button size="small" type="primary" @click="$emit('rightBtn')" :icon="`fa `+rightIcon"> {{rightBtnText}}</el-button>
    </el-row>
    <el-button-group class="selec-btn">
      <el-button :disabled="type==null"  size="small" type="primary" icon="fa fa-check" @click="changeType(null)"> 全部</el-button>
      <el-button :disabled="type=='PERSON'"  size="small" type="primary" icon="fa fa-user" @click="changeType('PERSON')"> 个人客户</el-button>
      <el-button :disabled="type=='ENTERPRISE'"  size="small" type="primary" icon="fa fa-users" @click="changeType('ENTERPRISE')"> 企业客户</el-button>
      <el-button :disabled="type=='OTHER_ORG'"  size="small" type="primary" icon="fa fa-user-circle-o" @click="changeType('OTHER_ORG')"> 其他组织</el-button>
      <el-input size="small" class="search-input" v-model.trim="keyword" :placeholder="placeholder" @keyup.enter.native="changeType(null)">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </el-button-group>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'HtBtnGroupAndSeartchForCustomer',
  data() {
    return {
      keyword: '',
      type: null
    };
  },
  props: ['rightBtnText', 'rightIcon', 'placeholder'],
  methods: {
    changeType(type) {
      this.type = type;
      this.$emit('update:filterTable', { keyword: this.keyword, query: { customerType: type } });
      this.$emit('update:currentPage',1);
    }
  },
  computed: {
    title() {
      if (this.placeholder) {
        return '请输入' + this.placeholder;
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.aside-btn {
  margin: 10px 0;
  margin-top: 20px;
  // overflow: hidden;
  .buss-btn {
    float: left;
  }
  .selec-btn {
    float: right;
  }
  .search-input {
    width: 200px;
    margin-left: 20px;
  }
}
</style>

