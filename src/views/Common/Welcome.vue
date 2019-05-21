<template>
  <div>
    欢迎来到进件管理系统 !
    <!-- <template v-if="$GLOBAL.APP=='SIMS'">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>授信管理</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="goTo('CreditList')">查看详情</el-button>
        </div>
        <CreditList></CreditList>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>用信管理</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="goTo('LetterList')">查看详情</el-button>
        </div>
        <LetterList></LetterList>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>授信结果</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="goTo('CreditResult')">查看详情</el-button>
        </div>
        <CreditResult></CreditResult>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>客户管理</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="goTo('CustomeList')">查看详情</el-button>
        </div>
        <CustomeList></CustomeList>
      </el-card>
    </template> -->
  </div>
</template>

<script>
// import AddressArea from '@components/AddressArea';
import CreditList from '@views/CreditManagement/CreditList';
import CreditResult from '@views/CreditManagement/CreditResult';
import LetterList from '@views/LetterManagement/LetterList';
import CustomeList from '@views/CustomeManagement/CustomeList';
export default {
  name: 'HelloWorld',
  components: {
    CreditList,
    CreditResult,
    LetterList,
    CustomeList
  },
  methods: {
    goTo(url) {
      this.$router.push(url);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 18px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 48%;
  float: left;
  margin: 1%;
}
</style>
