<template>
  <div class="ht-form-right">
    <!-- 菜单 -->
    <div class="fixed-menu">
      <div class="menu" v-for="(x,index) in fileTypeData" :key="index" @click="handleSelect(x.name)">
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
          <UploadFile :fileInfoData="fileInfoData" :row="scope.row" :businessId="business_id" :GPOpen="GPOpen" @handelImg="handelImg" @handleDialog="handleDialog" @GaoPaiYi="GaoPaiYi"></UploadFile>
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
    <HtFixedBtn v-if="!($route.query.active==2)&&!($route.query.from=='LetterList')" :percentage="percentage()" :btnText="[
        {click:()=>{$emit('preTo',1)},text:'上一步'},
        {click:()=>{submit()},loading:btnLoading,text:'提交'},
        {click:()=>{$router.back(-1);$emit('removeCurTag')},text:'返回列表'},
        ]"></HtFixedBtn>
    <HtFixedBtn v-else :percentage="percentage()" :btnText="[
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
  name: 'Steps3',
  data() {
    return {
      btnLoading: false,

      pdfurls: '',
      isshowpdf: false,

      // sim_business_info: {},
      // sim_customer: {},
      business_id: '',
      product_code: '',
      customer_type: '',
      uploadType: 'ACCREDIT_CREDIT_FLOW',
      //需要获取附件信息与提交的id
      id: '',
      GPOpen: false,
      //高拍仪的dialog信息
      dialogGaoPiyi: false,
      ProductData: {},

      // myData: [],

      fileTypeData: [],
      fileInfoData: [],

      dialogVisible: false,
      dialogFileTypeCode: '',
      dialogItem: {} //当前点击的图片
    };
  },
  props: ['productInfo'],
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
      // console.log(this.businessId);
      let local = getLocalStorage('step1');
      let query = this.$route.query;
      if (local) {
        this.product_code = local.product_code;
        this.customer_type = local.customer_type;
        this.business_id = local.business_id ? local.business_id : this.productInfo.sim_business_info.business_id;
      } else {
        this.product_code = query.productCode;
        this.customer_type = query.customerType;
        this.business_id = query.businessId;
      }
      this.id = query.id ? query.id : this.productInfo.sim_business_info.id;
      this.getData();
    });
  },
  methods: {
    getData() {
      let getAllChildFileType = () => {
        this.$api
          .getAllChildFileType({
            fileTypeCode: this.product_code + this.uploadType + this.customer_type //'XYD'
          })
          .then(res => {
            // this.myData = res;
            // this.myData.splice(0, 1);
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
            businessId: this.business_id, //'TDXQS201807190002',
            fileType: this.product_code + this.uploadType + this.customer_type //'XYD'
          })
          .then(res => {
            this.fileInfoData = res.data;
            // this.initData(res.data);
          });
      };
      getAllChildFileType();
    },
    //打开高拍仪
    GaoPaiYi(row) {
      this.dialogGaoPiyi = true;
      this.ProductData = row;
      console.log(row);
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
    submit() {
      let fileInfoData = this.fileInfoData;
      let fileTypeData = this.fileTypeData;
      //判断必填的附件是否都有上传
      let isUpload = true;
      try {
        fileTypeData.forEach(x => {
          if (x.attrRequire === 'Y') {
            let fileTypeCode = x.fileTypeCode;
            let flag = fileInfoData.every(y => {
              return fileTypeCode != y.fileType;
            });
            //flag=true时表示有此必传项没有上传附件
            if (flag) {
              isUpload = false;
              throw isUpload; //中断循环
            } else {
              isUpload = true;
            }
          }
        });
      } catch (error) {}
      // 必填的附件已上传
      if (isUpload) {
        this.btnLoading = true;
        this.$api
          .creditCommit({
            id: this.id
          })
          .then(res => {
            this.btnLoading = false;
            if (res.returnCode == '0000') {
              this.$emit('nextTo', 3, res.data);
              this.$message.success('提交成功! ');
            } else {
              this.$message.error(res.msg);
            }
          });
      } else {
        this.$message.error('请先上传必传附件!');
      }
    },
    closeDialog() {
      this.dialogVisible = false;
      this.dialogGaoPiyi = false;
    },
    //弹出层
    handleDialog(item) {
      console.log(item);

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
  top: 15%;
  .menu {
    position: relative;
    padding-right: 35px;
  }
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
  margin-left: 5px;
  position: absolute;
  top: 4px;
  right: 5px;
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

.hongte-dialog {
  p {
    line-height: 2;
  }
}
</style>
