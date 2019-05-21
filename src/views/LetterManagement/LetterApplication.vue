<template>
  <div>
    <!-- <TemplateA v-if="productInfo.useCreditAddTemplate=='credit_loan_add'" :postData="productInfo" @changeMaxLoanAmount="changeMaxLoanAmount"></TemplateA> -->
    <TemplateB v-if="productInfo.useCreditAddTemplate=='credit_loan_add'" :postData="productInfo" @changeMaxLoanAmount="changeMaxLoanAmount"></TemplateB>
    <TemplateC v-if="productInfo.useCreditAddTemplate=='house_loan_add'" :postData="productInfo" @changeMaxLoanAmount="changeMaxLoanAmount"></TemplateC>
  </div>
</template>

<script>
import TemplateA from './Template/TemplateA';
import TemplateB from './Template/TemplateB';
import TemplateC from './Template/TemplateC';

export default {
  name: 'LetterApplication',
  data() {
    return {
      productInfo: {}
    };
  },
  components: {
    TemplateA,
    TemplateB,
    TemplateC
  },
  beforeMount() {
    this.$nextTick(() => {
      this.getData();
    });
  },
  methods: {
    getData() {
      this.$api
        .getNewVerByProductVo({
          productCode: this.$route.query.productCode
        })
        .then(res => {
          this.productInfo = res.data; //产品信息
        });
    },
    //最大金额受授信剩余额度影响---如果授信额度小于最大金额时,最大金额要等于授信额度
    changeMaxLoanAmount(value) {
      this.$set(this.productInfo, 'maxLoanAmount', value);
    }
  }
};
</script>
