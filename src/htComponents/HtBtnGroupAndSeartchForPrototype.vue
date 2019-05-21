<template>
  <div class="aside-btn is-clear">
    <el-row class="buss-btn" v-if="rightBtnText">
      <el-button size="small" type="primary" @click="$emit('rightBtn')" :icon="`fa `+rightIcon"> {{rightBtnText}}</el-button>
    </el-row>
    <el-button-group class="selec-btn">
      <el-button :disabled="type==null" size="small" type="primary" icon="fa fa-check" @click="changeType(null)"> 全部</el-button>
      <el-button :disabled="type=='-2'" size="small" type="primary" icon="fa fa-arrow-circle-o-right" @click="changeType('-2')"> 已拒绝</el-button>
      <el-button :disabled="type=='-1'" size="small" type="primary" icon="fa fa-arrow-circle-o-left" @click="changeType('-1')"> 已取消</el-button>
      <el-button :disabled="type=='0'" size="small" type="primary" icon="fa fa-arrow-circle-o-left" @click="changeType('0')"> 待处理</el-button>
      <el-button :disabled="type=='1'" size="small" type="primary" icon="fa fa-arrow-circle-o-left" @click="changeType('1')"> 已转业务</el-button>
      <el-input size="small" class="search-input" v-model.trim="keyword" :placeholder="placeholder" @keyup.enter.native="changeType(null)">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </el-button-group>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'HtBtnGroupAndSeartchForPrototype',
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
      this.$emit('update:filterTable', { keyword: this.keyword, query: { status: type } });
      this.$emit('update:currentPage',1);
    }
  },
  computed: {
    title() {
      if (this.placeholder) {
        return '请输入' + this.placeholder;
      }
    }
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

