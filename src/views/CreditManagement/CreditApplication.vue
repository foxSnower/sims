<template>
  <el-card class="apply-box-card">
    <ht-steps :active="active" class="ht-steps" finish-status="success">
      <ht-step title="填写基本信息"></ht-step>
      <ht-step title="补充详细信息"></ht-step>
      <ht-step title="上传附件"></ht-step>
      <ht-step title="完成"></ht-step>
    </ht-steps>
    <template v-if="active===0">
      <Steps1 @nextTo="nextTo" :isPre="isPre" :productInfo="productInfo"></Steps1>
    </template>
    <!-- v-if="where.customerType=='PERSON'" -->
    <template v-if="active===1">
      <Steps2 @nextTo="nextTo" @preTo="preTo" :productInfo="productInfo" @removeCurTag="removeCurTag"></Steps2>
    </template>
    <template v-if="active===2">
      <Steps3 @nextTo="nextTo" @preTo="preTo" :productInfo="productInfo" @removeCurTag="removeCurTag"></Steps3>
    </template>
    <template v-if="active===3">
      <Steps4 :productInfo="productInfo" @removeCurTag="removeCurTag"></Steps4>
    </template>
  </el-card>
</template>

<script>
import HtSteps from '@components/steps/src/steps';
import HtStep from '@components/steps/src/step';
import Steps1 from './CreditApplicationSteps1/Steps1';
import Steps2 from './CreditApplicationSteps1/Steps2';
import Steps3 from './CreditApplicationSteps1/Steps3';
import Steps4 from './CreditApplicationSteps1/Steps4';
import { setLocalStorage, getLocalStorage, delLocalStorage } from '@utils';
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'CreditApplication',
  data() {
    return {
      active: 0,
      productInfo: {},
      isPre: false
      // where: {}
    };
  },
  components: {
    HtSteps,
    HtStep,
    Steps1,
    Steps2,
    Steps3,
    Steps4
  },
  mounted() {
    this.getData();
  },
  methods: {
    removeCurTag() {
      this.$emit('removeCurTag');
    },
    //下一步
    nextTo(active, where) {
      this.active = active;
      this.productInfo = where;
    },
    //上一步
    preTo(active) {
      // console.log(active, 'active');
      this.active = active;
      this.isPre = true;
      // console.log(this.$refs.step.disabledForm);
    },
    getData() {
      //如果是从编辑页面进入
      let id = this.$route.query.id;
      let customerType = this.$route.query.customerType;
      let active = this.$route.query.active;
      let isHt = this.$route.query.isHt;
      if (id && customerType) {
        if (isHt == 'Y') {
          this.active = 0;
        } else {
          active = active != null ? active : 1;
          this.active = parseInt(active);
        }
      }
    }
  },
  computed: {
    ...mapGetters(['localTheme']),
    themeColor() {
      return this.localTheme.themeColor;
    }
  }
};
</script>

<style lang="scss" scoped>
.apply-box-card {
  // margin-right: 100px !important;
}
.ht-steps {
  margin: 30px 100px;
  margin-right: 200px;
}
</style>
