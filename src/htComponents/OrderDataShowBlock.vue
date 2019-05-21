<template>
  <div class="is-clear">
      <div class="box">
        <el-card class="box-card">
          <p>今日提交</p>
          <h1>
            <span :style="{color:localTheme.themeColor}">{{order.todayTotal}}</span> 个订单</h1>
        </el-card>
      </div>
      <div class="box">
        <el-card class="box-card">
          <p>待审</p>
          <h1>
            <span :style="{color:localTheme.themeColor}">{{order.allReviewTotal}}</span> 个订单</h1>
        </el-card>
      </div>
      <div class="box">
        <el-card class="box-card">
          <p>本月完成</p>
          <h1>
            <span :style="{color:localTheme.themeColor}">{{order.monthFinishTotal}}</span> 个订单</h1>
        </el-card>
      </div>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
  name:'OrderDataShowBlock',
  props:['order'],
  computed:{
    ...mapGetters(['localTheme']),
  }
}
</script>

<style lang="scss" scoped>
 .box {
    float: left;
    width: 33.3%;
    // margin-bottom: 20px;
    .box-card {
      margin: 0 8px;
      text-align: center;
      line-height: 1.8;
      p {
        color: #888;
      }
      h1 {
        font-size: 24px;
      }
    }
  }
</style>

