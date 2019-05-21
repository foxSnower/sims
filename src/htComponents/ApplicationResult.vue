<template>
  <div>
    <div class="ht-status">
      <p>
        <i :style="{color:localTheme.themeColor}" class="status el-icon-success"></i>
      </p>
      <p class="status-title">提交成功</p>
      <p class="status-order">
        订单编号：{{postData.businessId}}
      </p>
      <p class="status-info">
        <span>产品：{{postData.productName}}</span>
        <span>客户：{{postData.customerName}}</span>
      </p>
    </div>
    <ht-steps :active="approveProgressStatus" class="ht-steps">
      <ht-step v-for="(x,index) in progressFlow" :key="index" :title="x.nodeName" :subTitle="x.approveUserName" :dates="x.approvTime"></ht-step>
      <!-- <ht-step title="授信申请" subTitle="区丽丽" dates="2018-07-12 12:00:00" icon="fa fa-pencil-square-o">
        </ht-step>
        <ht-step title="风控初审" subTitle="周毛毛" button="催一下" @button-enter="goDing()" icon="fa fa-filter"></ht-step>
        <ht-step title="风控复审" icon="fa fa-search-minus"></ht-step>
        <ht-step title="完成" icon="fa fa-stack-overflow"></ht-step> -->
    </ht-steps>
    <el-row style="text-align:center;">
      <el-button @click="goTo(goBack+'List')">返回列表</el-button>
      <el-button type="primary" @click="goTo(goBack+'Tracking',postData)">查看订单</el-button>
    </el-row>
  </div>
</template>

<script>
import HtSteps from '@components/steps/src/steps';
import HtStep from '@components/steps/src/step';
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'ApplicationResult',
  data() {
    return {
      progressFlow: {},
      approveProgressStatus:0

    };
  },
  props: ['postData', 'goBack'],
  components: {
    HtSteps,
    HtStep
  },
  beforeMount() {
    this.$nextTick(() => {
      if (this.postData.approveNo) {
        this.$api
          .creditQueryApproveProgress({
            approveNo: this.postData.approveNo // 'test201807200022' //this.postData.approveNo
          })
          .then(res => {
            if (res.returnCode == '0000') {
              this.progressFlow = res.data;
              for(let i=0;i<res.data.length ;i++){
                let row = res.data[i];
                if(!row.approvTime){
                  this.approveProgressStatus = i;
                  return false;
                }else{
                   this.approveProgressStatus = res.data.length;
                }
              }
            } else {
              this.$message.error(res.msg);
            }
          });
      }
    });
  },
  methods: {
    //跳转
    goTo(name, query) {
      console.log(name, query);
      if(query){
        this.$router.push({ name: name, query: { id: query.id,productCode: query.productCode } });
      }else{
        this.$router.push({ name: name });
      }
    }
  },
  computed: {
    ...mapGetters(['localTheme'])
  }
};
</script>

<style lang="scss" scoped>
.ht-steps {
  margin: 30px 100px;
}
.ht-status {
  text-align: center;
  line-height: 2;
  .status {
    font-size: 80px;
  }
  .status-title {
    font-size: 24px;
  }
  .status-order {
    text-align: left;
    font-size: 16px;
    font-weight: 700;
    margin-left: 100px;
  }
  .status-info {
    text-align: left;
    margin-left: 100px;
    span {
      padding-right: 30px;
    }
  }
}
</style>
