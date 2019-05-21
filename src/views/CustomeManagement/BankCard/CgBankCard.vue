<template>
  <div>
    <el-form v-if="!isUpload" :model='where' size="small" ref="formName" class='hongte-query-form' :inline='true' label-position="right" label-width="120px" style="margin-top:20px;">
      <el-form-item label='资金渠道' class="f-item1">
        <el-input v-model='where.platformName' placeholder='请输入' disabled></el-input>
      </el-form-item>
      <el-form-item label='开户银行' class="f-item1">
        <el-input v-model='where.bankName' placeholder='请输入' disabled></el-input>
      </el-form-item>
      <el-form-item label='银行卡号' class="f-item1">
        <el-input v-model='where.bankAccounts' placeholder='请输入' disabled></el-input>
      </el-form-item>
      <el-form-item label='户主' class="f-item1">
        <el-input v-model='where.customerName' placeholder='请输入' disabled></el-input>
      </el-form-item>
      <el-form-item label='证件号码' class="f-item1">
        <el-input v-model='where.certificateNumber' placeholder='请输入' disabled></el-input>
      </el-form-item>
      <el-form-item label='预留手机号' class="f-item1">
        <el-input v-model='where.phone' placeholder='请输入' disabled>
        </el-input>
      </el-form-item>
    </el-form>
    <el-tabs v-else stretch v-model="active">
      <el-tab-pane label="存管信息" name="0">
        <el-form :model='where' size="small" ref="formName" class='hongte-query-form' :inline='true' label-position="right" label-width="120px" style="margin-top:20px;">
          <el-form-item label='资金渠道' class="f-item1">
            <el-input v-model='where.platformName' placeholder='请输入' disabled></el-input>
          </el-form-item>
          <el-form-item label='开户银行' class="f-item1">
            <el-input v-model='where.bankName' placeholder='请输入' disabled></el-input>
          </el-form-item>
          <el-form-item label='银行卡号' class="f-item1">
            <el-input v-model='where.bankAccounts' placeholder='请输入' disabled></el-input>
          </el-form-item>
          <el-form-item label='户主' class="f-item1">
            <el-input v-model='where.customerName' placeholder='请输入' disabled></el-input>
          </el-form-item>
          <el-form-item v-if="$route.query.customerType=='PERSON'" label='证件号码' class="f-item1">
            <el-input v-model='where.certificateNumber' placeholder='请输入' disabled></el-input>
          </el-form-item>
          <el-form-item v-else label='统一社会信用代码' class="f-item1">
            <el-input v-model='where.unifiedSocialCreditCode' placeholder='请输入' disabled></el-input>
          </el-form-item>
          <el-form-item label='预留手机号' class="f-item1">
            <el-input v-model='where.phone' placeholder='请输入' disabled>
            </el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="附件信息" name="1">
        <el-table border :data='fileTypeData' class='hongte-table' ref="myTable" highlight-current-row style="margin-top:20px;">
          <el-table-column fixed align="right" label="附件描述" width="200" key="title">
            <template slot-scope="scope">
              <span class="ht-warning">*</span>
              <span class="ht-title">{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="附件详情" key="name">
            <template slot-scope="scope">
              <UploadFile :fileInfoData="fileInfoData" :row="scope.row" :businessId="businessId" @handelImg="handelImg" :accept="accept" uploadQty="1"></UploadFile>
            </template>
          </el-table-column>
        </el-table>
        <!-- 图片预览 -->
        <ImgPreview :modal="false" :show="dialogVisible" :dialogItem="dialogItem" :filterFileInfoData="filterFileInfoData" @closeImgPreview="closeDialog"></ImgPreview>
      </el-tab-pane>
    </el-tabs>
    <el-row class="bottom-btn">
      <el-button type="primary" @click="submit()">提交</el-button>
      <el-button @click="close">关闭</el-button>
    </el-row>
  </div>
</template>

<script>
import UploadFile from '@htComponents/UploadFile/UploadFile';
import ImgPreview from '@htComponents/UploadFile/ImgPreview';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'CgBankCard',
  data() {
    return {
      active: '1',
      fileTypeData: [],
      fileInfoData: [],
      // businessId: '',
      dialogVisible: false,
      dialogItem: {},
      customerInfo: {},
      accept: ['jpg', 'png', 'jpeg']
    };
  },
  props: ['postData'],
  components: {
    UploadFile,
    ImgPreview
  },
  watch: {
    fileInfoData: {
      //注意：当观察的数据为对象或数组时，curVal和oldVal是相等的，因为这两个形参指向的是同一个数据对象
      handler(curVal, oldVal) {
        let fileTypeData = this.fileTypeData;
        fileTypeData.forEach((x, index) => {
          x.length = this.computedLength(x, curVal);
        });
      },
      deep: true
    }
  },
  beforeMount() {
    this.$nextTick(() => {
      this.getData();
    });
  },
  methods: {
    getData() {
      this.$api
        .getCustomerDetail({
          customerCode: this.where.customerCode
        })
        .then(res => {
          if (res.returnCode == '0000') {
            this.$set(this.postData, 'customerName', res.data.customer.customerName);
            this.$set(this.postData, 'certificateNumber', res.data.customer.certificateNumber);
            this.$set(this.postData, 'unifiedSocialCreditCode', res.data.customer.unifiedSocialCreditCode);
            this.customerInfo = res.data.customer;
            this.$nextTick(() => {
              if (this.isUpload) {
                this.getAllChildFileType();
              }
            });
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    close() {
      this.$emit('closeDialog');
    },
    //去掉银行卡的空格
    Trim(str, is_global) {
      var result;
      is_global = is_global ? is_global : 'g';
      result = str.replace(/(^\s+)|(\s+$)/g, '');
      if (is_global.toLowerCase() == 'g') {
        result = result.replace(/\s/g, '');
      }
      return result;
    },
    submit() {
      //判断是否未上传附件
      if (this.isUpload) {
        if (this.percentage() < 100) {
          this.$message.error('还有附件未上传,请检查 ');
          return false;
        }
      }
      //打开一个空白窗口
      let tempwindow = window.open();
      //处理参数
      let params = Object.assign({}, this.where);
      params.bankAccounts = this.Trim(params.bankAccounts);
      delete params.customerName;
      delete params.certificateNumber;
      delete params.unifiedSocialCreditCode;
      //调接口
      this.$api.CGregister(params).then(res => {
        if (res.returnCode == '0000') {
          this.$message.success('注册成功');
          this.$emit('getData');
          tempwindow.location = res.data.url; // 后更改页面地址
          //关闭dialog
          this.close();
        } else {
          this.$message.error(res.msg);
          tempwindow.close();
        }
      });
    },
    getAllChildFileType() {
      this.$api
        .getAllChildFileType({
          fileTypeCode: this.fileType
        })
        .then(res => {
          if (res && res.length > 0) {
            res.shift();
            this.fileTypeData = res;
          }
          this.getFileInfoByBusinessId();
        });
    },
    getFileInfoByBusinessId() {
      this.$api
        .getFileInfoByBusinessId({
          businessId: this.businessId, //'TDXQS201807190002',
          fileType: this.fileType
        })
        .then(res => {
          this.fileInfoData = res.data;
          // this.initData(res.data);
        });
    },
    //预览图片与预览pdf文件等
    handelImg(item) {
      this.dialogItem = item;
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
      this.dialogGaoPiyi = false;
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
    ...mapGetters(['localTheme']),
    where() {
      if (this.postData) {
        return this.postData;
      }
    },
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
    businessId() {
      let customerCode = this.customerInfo.customerCode;
      return customerCode;
    },
    fileType() {
      let customerType = this.customerInfo.customerType;
      let fileType = '';
      if (customerType == 'PERSON') {
        fileType = 'TD_PERSON_FDLJ_CGZC';
      } else {
        fileType = 'TD_ENTERPRISE_CGZC';
      }
      return fileType;
    },
    //个人客户 且是非大陆的情况 需要上传附件, 企业客户需要上传附件
    isUpload() {
      let certificateTypeCode = this.customerInfo.certificateTypeCode;
      let customerType = this.customerInfo.customerType;
      let isUpload = false;
      if (customerType == 'PERSON') {
        if (certificateTypeCode != 'ID_card') {
          isUpload = true;
        } else {
          isUpload = false;
        }
      } else {
        isUpload = true;
      }
      return isUpload;
    }
  }
};
</script>


<style lang='scss' scoped>
.hongte-query-form {
  width: 500px;
  margin: 0 auto;
}
.bottom-btn {
  width: 100%;
  text-align: center;
  padding-top: 20px;
}
</style>
