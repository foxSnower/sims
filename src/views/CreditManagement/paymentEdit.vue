<template>
  <div>
    <TemplateC v-if="productInfo.useCreditAddTemplate=='house_loan_add'" :postData="productInfo" @changeMaxLoanAmount="changeMaxLoanAmount"></TemplateC>
  </div>
</template>

<script>
import TemplateC from './CommonTemplate/TemplateC';

export default {
  name: 'paymentEdit',
  data() {
    return {
      productInfo: {}
    };
  },
  components: {
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
