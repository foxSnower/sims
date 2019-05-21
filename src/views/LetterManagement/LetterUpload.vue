<template>
  <div class="ht-form-right">
    <!-- 菜单 -->
    <div class="fixed-menu">
      <div v-for="(x,index) in fileTypeData" :key="index" @click="handleSelect(x.name)">
        <span>{{x.name}}</span>
        <el-badge :value="x.length=computedLength(x,fileInfoData)" class="ht-badge" />
      </div>
    </div>
    <el-switch v-model="GPOpen"></el-switch>
    <span> 高拍仪</span>
    <template v-if="GPOpen">
      <span class="ht-tipes">
        <i class="el-icon-info ht-warning"></i> 请不要同时多个浏览器窗口开启高拍仪</span>
    </template>
    <el-table border :data='fileTypeData' class='hongte-table' ref="myTable" highlight-current-row>
      <el-table-column fixed align="right" label="附件描述" width="200" key="title">
        <template slot-scope="scope">
          <span class="ht-warning" v-if="scope.row.attrRequire==='Y'">*</span>
          <span class="ht-title">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="附件详情" key="name">
        <template slot-scope="scope">
          <UploadFile :fileInfoData="fileInfoData" :row="scope.row" :businessId="$route.query.businessId" :GPOpen="GPOpen" @handelImg="handelImg" @handleDialog="handleDialog" @GaoPaiYi="GaoPaiYi"></UploadFile>
        </template>
      </el-table-column>
    </el-table>
    <!-- 图片预览 -->
    <ImgPreview :show="dialogVisible" :dialogItem="dialogItem" :filterFileInfoData="filterFileInfoData" @closeImgPreview="closeDialog"></ImgPreview>
    <!-- 预览 -->
    <vueshowpdf @closepdf="closepdf" v-model="isshowpdf" :pdfurl="pdfurls" @pdferr="pdferr" :maxscale='4' :minscale='0.6' :scale='1.1'></vueshowpdf>

    <el-dialog :visible.sync="dialogGaoPiyi" width="50%" title="高拍仪拍照">
      <GPUploadFile @closeDialog="closeDialog" :postData="ProductData"></GPUploadFile>
    </el-dialog>
    <HtFixedBtn :percentage="percentage()" :btnText="[
        {click:()=>{$router.back(-1);$emit('removeCurTag')},text:'返回列表'},
        ]"></HtFixedBtn>
  </div>
</template>


<script>
import vueshowpdf from 'vueshowpdf';
import GPUploadFile from '@htComponents/UploadFile/GPUploadFile';
import UploadFile from '@htComponents/UploadFile/UploadFile';
import ImgPreview from '@htComponents/UploadFile/ImgPreview';
import HtFixedBtn from '@components/HtFixedBtn';

import { setLocalStorage, getLocalStorage, delLocalStorage, changeCodeName } from '@utils';
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'LetterUpload',
  data() {
    return {
      btnLoading: false,

      pdfurls: '',
      isshowpdf: false,

      // sim_business_info: {},
      // sim_customer: {},

      uploadType: 'USE_CREDIT_FLOW',
      //需要获取附件信息与提交的id
      id: '',
      GPOpen: false, //高拍仪开关
      //弹出层
      // diaglog: {
      //   visible: false,
      //   info: ''
      // },
      //高拍仪的dialog信息
      dialogGaoPiyi: false,
      ProductData: {},

      fileTypeData: [],
      fileInfoData: [],

      dialogVisible: false,
      dialogFileTypeCode: '',
      dialogItem: {} //当前点击的图片
    };
  },
  // props: ['businessId'],
  watch: {
    GPOpen(val) {
      this.getData();
    }
  },
  components: {
    GPUploadFile,
    UploadFile,
    ImgPreview,
    HtFixedBtn,
    vueshowpdf
  },
  mounted() {
    this.$nextTick(() => {
      this.getData();
    });
  },
  methods: {
    getData() {
      let query = this.$route.query;
      let getAllChildFileType = query => {
        this.$api
          .getAllChildFileType({
            fileTypeCode: query.productCode + this.uploadType + query.customerType //'XYD'
          })
          .then(res => {
            if (res && res.length > 0) {
              res.shift();
              this.fileTypeData = res;
            }
            getFileInfoByBusinessId(query);
          });
      };
      let getFileInfoByBusinessId = query => {
        this.$api
          .getFileInfoByBusinessId({
            businessId: query.businessId, //'TDXQS201807190002',
            fileType: query.productCode + this.uploadType + query.customerType //'XYD'
          })
          .then(res => {
            this.fileInfoData = res.data;
            // this.initData(res.data);
          });
      };
      getAllChildFileType(query);
    },
    handleSelect(menu) {
      //自制锚点
      let htTitle = document.querySelectorAll('.ht-title');
      htTitle.forEach(x => {
        if (x.innerText === menu) {
          let scrollTopDom = document.querySelector('.el-main');
          scrollTopDom.scrollTop = x.offsetParent.offsetTop;
        }
      });
    },
    //打开高拍仪
    GaoPaiYi(row) {
      this.dialogGaoPiyi = true;
      this.ProductData = row;
      console.log(row);
    },
    closeDialog() {
      this.dialogVisible = false;
      this.dialogGaoPiyi = false;
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
    percentage() {
      let percentage = 0;
      if (this.fileTypeData) {
        let length = 0;
        let finishLength = 0;
        this.fileTypeData.forEach(x => {
          length++;
          if (x.length > 0) {
            finishLength++;
          }
        });
        percentage = (finishLength / length) * 100;
        percentage = parseFloat(percentage.toFixed(0));
        percentage = isNaN(percentage) ? 0 : percentage;
      }
      return percentage;
    },
    //预览图片与预览pdf文件等
    handelImg(item) {
      this.dialogItem = item;
      this.dialogVisible = true;
    },
    //计算图片的数量
    computedLength(x, fileInfoData) {
      let length = 0;
      for (let i in fileInfoData) {
        if (fileInfoData[i].fileType == x.fileTypeCode) {
          length++;
        }
      }
      return length;
    }
  },
  computed: {
    //获取最新点击行的所有可预览的图片
    filterFileInfoData() {
      let fileInfoData = this.fileInfoData;
      let dialogItem = this.dialogItem;
      let newArray = [];
      // for (let i in fileInfoData) {
      for (let i = 0; i < fileInfoData.length; i++) {
        let fileType = fileInfoData[i].fileType;
        let fileStyle = fileInfoData[i].fileStyle.toLowerCase();
        if (fileType == dialogItem.fileType && (fileStyle == 'png' || fileStyle == 'jpg' || fileStyle == 'jpeg')) {
          newArray.push(fileInfoData[i]);
        }
      }
      return newArray;
    }
  }
};
</script>

<style lang="scss" scoped>
.ht-form-right {
  padding: 20px;
  margin-right: 100px !important;
  margin-bottom: 60px !important;
}
.fixed-menu {
  line-height: 3;
  padding: 20px;
  padding-top: 10px;
  position: fixed;
  right: 10px;
  background: #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
  z-index: 9;
  cursor: pointer;
  overflow-y: auto;
  max-height: 65%;
}
.fixed-btn {
  position: fixed;
  height: 80px;
  bottom: 0px;
  width: calc(100% - 380px);
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

.ht-badge {
  float: right;
  margin-left: 5px;
  position: relative;
  top: 4px;
}
.ht-tipes {
  color: #999;
  margin-left: 50px;
}
.ht-gopaiyi {
  display: inline-block;
  float: left;
  width: 148px;
  height: 148px;
  margin: 0 8px 8px 0;
  position: relative;
  border: 1px dashed #c0ccda;
}
.el-icon-plus {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 28px;
  color: #8c939d;
  &:before {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
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
