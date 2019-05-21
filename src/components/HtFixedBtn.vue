<template>
  <el-row class="fixed-btn" :style="{width:fixedBtnWidth}">
    <div class="left">
      <span>信息完善度</span>
      <el-progress :percentage="percentage" class="progress" type="circle" :stroke-width="3" :width="60" :color="localTheme.themeColor"></el-progress>
    </div>
    <el-button v-if="isShow(item)" v-for="(item,index) in btnText" :key="index" size="small" type="primary" @click="item.click" :loading="item.loading" :disabled="item.disabled">{{item.text}}</el-button>
  </el-row>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'HtFixedBtn',
  props: ['percentage', 'btnText'],
  methods: {
    isShow(item) {
      if (item.text != '返回列表') {
        return true;
      } else {
        if (!this.$route.query.id) {
          return false;
        } else {
          return true;
        }
      }
    }
  },
  computed: {
    ...mapGetters(['localTheme', 'asideWidth']),
    fixedBtnWidth() {
      let width = '';
      if (this.asideWidth != '250px') {
        width = 'calc(100% - 95px)';
      } else {
        width = 'calc(100% - 290px)';
      }
      return width;
    }
  }
};
</script>

<style lang="scss" scoped>
.fixed-btn {
  position: fixed;
  height: 80px;
  bottom: 0px;
  width: calc(100% - 290px);
  margin-left: -20px;
  text-align: right;
  background-color: #fff;
  border-top: 1px solid #f2f2f2;
  line-height: 80px;
  padding: 0 40px;
  z-index: 9;
  .left {
    position: absolute;
    .progress {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      margin-left: 20px;
    }
  }
}
</style>


