<template>
  <div>
    <!-- <TrackingTemplateA v-if="productInfo.useCreditViewTemplate=='credit_loan_view'" :postData="productInfo"></TrackingTemplateA> -->
    <TrackingTemplateB v-if="productInfo.useCreditViewTemplate=='credit_loan_view'" :postData="productInfo"></TrackingTemplateB>
    <TrackingTemplateB v-if="productInfo.useCreditViewTemplate=='house_loan_view'" :postData="productInfo"></TrackingTemplateB>
  </div>
</template>

<script>
import TrackingTemplateA from "./Template/TrackingTemplateA";
import TrackingTemplateB from "./Template/TrackingTemplateB";
export default {
  name: "LetterTracking",
  components: {
    TrackingTemplateA,
    TrackingTemplateB
  },
  data() {
    return {
      productInfo: {}
    };
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
    }
  }
};
</script>
