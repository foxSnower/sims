<template>
    <div class='ht-card'>
        <el-card class='hongte-query-card' shadow='always'>
            <!-- 卡片头部 -->
            <div slot='header'>
                <slot name='header'></slot>
                <div class='hongte-card-switch' @click='formShow = !formShow'>
                    <template v-if='formShow'>
                        <i class='fa fa-angle-double-up'></i>
                        <span>收起</span>
                    </template>
                    <template v-else>
                        <i class='fa fa-angle-double-down'></i>
                        <span>展开</span>
                    </template>
                </div>
            </div>

            <!-- 收缩展开的动画 -->
            <el-collapse-transition>
                <slot v-if='formShow'></slot>
            </el-collapse-transition>

            <!-- 收缩展开按钮 -->

        </el-card>
    </div>
</template>

<script>
export default {
  name: 'ht-card',
  data() {
    return {
      // 搜索条件是否隐藏
      formShow: true
    };
  },
  methods: {
    go() {
      console.log('go');
    }
  },
  components: {},
  beforeMount() {
    console.log('ht-card');
  }
};
</script>

<style lang='scss' scoped>
.hongte-card-switch {
    position: absolute;
    right: 25px;
    top: 0;
    text-align: right;
    color: #999;
    cursor: pointer;
    line-height: 35px;
    width: 300px;
  &:hover {
    color: #409eff;

    span,
    i {
      opacity: 1;
      left: 0;
    }
  }

  span {
    opacity: 0;
  }

  span,
  i {
    padding-left: 10px;
    position: relative;
    left: 38px;
    font-size: 12px;
    transition: all 0.3s;
  }
}
</style>