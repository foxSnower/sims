<template>
  <div>
    <!--附件 -->
    <!-- <el-tab-pane label="附件"> -->
    <el-table border :data='fileTypeData' class='hongte-table' highlight-current-row>
      <el-table-column fixed prop="name" align="right" label="附件描述" width="200"></el-table-column>
      <el-table-column label="附件详情">
        <template slot-scope="scope">
          <div class="uplaod-img">
            <span class="img-box" v-for="(item ,index ) in fileInfoData" :key="index" v-if="item.fileType==scope.row.fileTypeCode" :title="item.fileName">
              <img v-if="isImage(item)" :src="item.fileUrl">
              <img v-else :src="imgShow(item)" onerror="javascript:this.src='/images/default.png'">
              <span class="img-action">
                <p class="img-icon">
                  <i class="el-icon-search" v-if="isImage(item)" @click="handelImg(item)"></i>
                  <i class="el-icon-search" v-else @click="handleDialog(item)"></i>
                  <a :href="item.fileUrl"><i class="el-icon-download"></i></a>
                </p>
              </span>
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 图片预览 -->
    <ImgPreview :show="dialogVisible" :dialogItem="dialogItem" :filterFileInfoData="filterFileInfoData" @closeImgPreview="closeDialog"></ImgPreview>
    <vueshowpdf @closepdf="closepdf" v-model="isshowpdf" :pdfurl="pdfurls" @pdferr="pdferr" :maxscale='4' :minscale='0.6' :scale='1.1'></vueshowpdf>

  </div>

</template>

<script>
import vueshowpdf from 'vueshowpdf';
import ImgPreview from '@htComponents/UploadFile/ImgPreview';
export default {
  name: 'ViewsFile',
  data() {
    return {
      dialogVisible: false,
      dialogFileTypeCode: '',
      dialogItem: {}, //当前点击的图片

      fullscreen: false,
      //控制图片的样式
      img: {},

      pdfurls: '',
      isshowpdf: false,
      fileTypeData: [],
      fileInfoData: []
    };
  },

  components: {
    vueshowpdf,
    ImgPreview
  },
  props: ['postData'],
  watch: {
    postData(val) {
      this.getData();
    },
    dialogVisible(newVal) {
      if (newVal) {
        console.log();
      }
    }
  },
  // mounted() {
  //   this.getData();
  // },
  methods: {
    imgShow(item){
      let fileStyle = item.fileStyle.toLowerCase();
      let imgurl = '';
      if(fileStyle!='doc'&&fileStyle!='doc'&&fileStyle!='docx'&&fileStyle!='ppt'&&fileStyle!='pdf'&&fileStyle!='pptx'&&fileStyle!='rar'&&fileStyle!='txt'&&fileStyle!='xls'&&fileStyle!='xlsx'&&fileStyle!='zip'){
        imgurl = require('@assets/default.png');
      }else{
        imgurl = require('@assets/' + item.fileStyle.toLowerCase() + '.png');
      }
      return imgurl
    },
    getData() {
      let fileTypeCode = '';
      if (this.$route.query.from == 'LetterList') {
        fileTypeCode = this.postData.productCode + 'USE_CREDIT_FLOW' + this.postData.customerType;
      } else {
        fileTypeCode = this.postData.productCode + 'ACCREDIT_CREDIT_FLOW' + this.postData.customerType;
      }
      //获取附件
      let getAllChildFileType = () => {
        this.$api
          .getAllChildFileType({
            fileTypeCode: fileTypeCode //'XYD'
          })
          .then(res => {
            if (res && res.length > 0) {
              res.shift();
              this.fileTypeData = res;
            }
            getFileInfoByBusinessId();
          });
      };
      let getFileInfoByBusinessId = () => {
        this.$api
          .getFileInfoByBusinessId({
            businessId: this.postData.businessId, //'TDXQS201807190002', //this.postData.businessId, //'TDXQS201807190002',
            fileType: fileTypeCode //'XYD' //this.grantCustInfo.productCode //'XYD'
          })
          .then(res => {
            this.fileInfoData = res.data;
            // this.initFileData(res.data);
          });
      };
      getAllChildFileType();
    },
    //弹出层
    handleDialog(item) {
      this.openpdf(item.filePreviewUrl.indexOf('null') >= 0 ? item.fileUrl : item.filePreviewUrl);
    },
    openpdf(url) {
      this.pdfurls = url;
      this.isshowpdf = true;
    },
    //预览文件
    closepdf() {
      this.isshowpdf = false;
    },
    pdferr(errurl) {
      this.$message.error('该文件不支持预览!');
      this.isshowpdf = false;
    },
    //预览图片与预览pdf文件等
    handelImg(item) {
      this.dialogItem = item;
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    //判断是否为图片类型
    isImage(item) {
      return item.fileStyle.toLowerCase() == 'png' || item.fileStyle.toLowerCase() == 'jpg' || item.fileStyle.toLowerCase() == 'jpeg';
    }
  },
  computed: {
    //获取最新点击行的所有可预览的图片
    filterFileInfoData() {
      let fileInfoData = this.fileInfoData;
      let dialogItem = this.dialogItem;
      let newArray = [];
      if (fileInfoData) {
        fileInfoData.forEach((x, index) => {
          let fileType = x.fileType;
          let fileStyle = x.fileStyle.toLowerCase();
          if (fileType == dialogItem.fileType && (fileStyle == 'png' || fileStyle == 'jpg' || fileStyle == 'jpeg')) {
            newArray.push(x);
          }
        });
      }
      return newArray;
    },
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
      for (let i in filterFileInfoData) {
        if (filterFileInfoData[i].fileCode == dialogItem.fileCode) {
          curIndex = i;
        }
      }
      return parseFloat(curIndex);
    }
  }
};
</script>

<style lang="scss" scoped>
.hongte-dialog {
  p {
    line-height: 2;
  }
}
.uplaod-img {
  display: inline-block;
  position: relative;
  height: 100%;
  text-align: left;
  .img-box {
    position: relative;
    display: inline-block;
    width: 100px;
    height: 100px;
    margin-right: 20px;
    .img-action {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, 0.5);
      transition: opacity 0.3s;
      .img-icon {
        position: absolute;
        color: #fff;
        width: 100px;
        height: 20px;
        top: 50%;
        left: 50%;
        margin-top: -10px;
        margin-left: -50px;
      }
    }

    &:hover {
      .img-action {
        opacity: 1;
      }
    }
  }
  img {
    width: 100px;
    height: 100px;
    cursor: pointer;
    display: inline-block;
  }
  p {
    display: inline-block;
  }
  a {
    color: #fff;
  }
}
.view-img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
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
</style>

