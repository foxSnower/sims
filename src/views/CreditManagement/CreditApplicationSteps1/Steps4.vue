<template>
  <ApplicationResult :postData="productInfo" goBack="Credit" ></ApplicationResult>
</template>

<script>
import ApplicationResult from '@htComponents/ApplicationResult';
export default {
  name: 'Step4',
  props: ['productInfo'],
  mounted() {
    console.log(this.productInfo);
  },
  components: {
    ApplicationResult
  }
};
</script>
