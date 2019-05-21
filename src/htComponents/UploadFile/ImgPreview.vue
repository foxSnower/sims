<template>
  <el-dialog :modal="filterModal" :visible.sync="dialogVisible" :fullscreen="fullscreen" :lock-scroll="false">
    <el-row class="top-btn">
      <el-button icon="el-icon-zoom-in" circle title="放大" @click="changeImage('放大')"></el-button>
      <el-button icon="el-icon-refresh" circle title="还原" @click="changeImage('还原')"></el-button>
      <el-button icon="el-icon-zoom-out" circle title="缩小" @click="changeImage('缩小')"></el-button>
      <el-button icon="fa fa-repeat" circle title="旋转" @click="changeImage('旋转')"></el-button>
      <a :href="dialogItem.fileUrl">
        <el-button icon="el-icon-download" circle title="下载"></el-button>
      </a>
      <i class="fa fa-window-maximize" circle title="全屏" v-if="!fullscreen" @click="changeImage('全屏')"></i>
      <i class="fa fa-window-restore" circle title="中屏" v-else @click="changeImage('中屏')"></i>
    </el-row>
    <el-carousel ref="elCarousel" :initial-index="computedIndex" :autoplay="false" indicator-position="none" :height="computedHeight" @change="handelChange">
      <el-carousel-item v-for="(item ,index ) in filterFileInfoData" :key="index">
        <div class="view-img">
          <img v-drag :width="img.imgWidth" :height="img.imgHeight" :style="{transform: 'translate(-50%, -50%) rotate('+img.transform+'deg)'}" :src="item.fileUrl">
        </div>
      </el-carousel-item>
    </el-carousel>
  </el-dialog>
</template>

<script>
export default {
  name: 'ImgPreview',
  data() {
    return {
      fullscreen: false,
      //控制图片的样式
      img: {},
      dialogVisible: false
    };
  },
  props: ['filterFileInfoData', 'show', 'dialogItem', 'modal'],
  watch: {
    show: function(val) {
      if (val) {
        this.dialogVisible = true;
      }
    },
    dialogVisible: function(val) {
      if (!val) {
        this.$emit('closeImgPreview');
      }
    },
    computedIndex: function(val) {
      let item = this.filterFileInfoData[val];
      this.setImgStyle(item);
      if (this.$refs.elCarousel) {
        this.$refs.elCarousel.setActiveItem(val);
      }
    }
  },
  methods: {
    //切换幻灯片时
    handelChange(curIndex, oldIndex) {
      let item = this.filterFileInfoData[curIndex];
      this.setImgStyle(item);
    },
    //图片操作
    changeImage(type) {
      let imgWidth = this.img.imgWidth ? this.img.imgWidth : this.dialogItem.imgWidth;
      let imgHeight = this.img.imgHeight ? this.img.imgHeight : this.dialogItem.imgHeight;
      let transform = this.img.transform ? this.img.transform : this.dialogItem.transform;
      if (type == '放大') {
        this.$set(this.img, 'imgWidth', imgWidth + 0.2 * imgWidth);
        this.$set(this.img, 'imgHeight', imgHeight + 0.2 * imgHeight);
      } else if (type == '缩小') {
        this.$set(this.img, 'imgWidth', imgWidth - 0.2 * imgWidth);
        this.$set(this.img, 'imgHeight', imgHeight - 0.2 * imgHeight);
      } else if (type == '还原') {
        this.$set(this.img, 'imgWidth', '');
        this.$set(this.img, 'imgHeight', '');
        this.$set(this.img, 'transform', 0);
      } else if (type == '旋转') {
        this.$set(this.img, 'transform', transform + 90);
      } else if (type == '全屏') {
        this.fullscreen = true;
      } else if (type == '中屏') {
        this.fullscreen = false;
      }
    },
    //获取图片的信息
    setImgStyle(item) {
      // 图片地址 后面加时间戳是为了避免缓存
      let img_url = item.fileUrl + '?' + Date.parse(new Date());
      // 创建对象
      let img = new Image();
      // 改变图片的src
      img.src = img_url;
      // 加载完成执行
      let _vm = this;

      img.onload = function() {
        _vm.$set(_vm.dialogItem, 'imgWidth', img.width);
        _vm.$set(_vm.dialogItem, 'imgHeight', img.height);
        _vm.$set(_vm.dialogItem, 'transform', 0);
        _vm.$set(_vm.img, 'imgWidth', '');
        _vm.$set(_vm.img, 'imgHeight', '');
        _vm.$set(_vm.img, 'transform', 0);
      };
    }
  },
  computed: {
    //计算全屏/中屏的高度
    computedHeight() {
      if (this.fullscreen) {
        return 'calc(100vh - 100px)';
      } else {
        return '600px';
      }
    },
    //计算图片的索引
    computedIndex() {
      let curIndex = 0;
      let dialogItem = this.dialogItem;
      let filterFileInfoData = this.filterFileInfoData;
      if (filterFileInfoData) {
        filterFileInfoData.forEach((x, index) => {
          if ((x.fileCode = dialogItem.fileCode)) {
            curIndex = index;
          }
        });
      }
      return parseFloat(curIndex);
    },
    filterModal() {
      if (this.modal != null) {
        return this.modal;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.top-btn {
  position: absolute;
  top: 10px;
  right: 50px;
  i {
    margin-left: 20px;
    top: -2px;
    position: relative;
  }
}
.view-img {
  // overflow: auto;
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>


