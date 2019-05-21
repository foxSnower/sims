<template>
  <div>
    <el-card class="box-card">
      <div class="hd">
        <h1 :style="{color:themeColor}" v-if="$route.query.customerType=='PERSON'">
          <i class="customer-type fa fa-user-o"></i>
          {{$route.query.customerName}}
        </h1>
        <h1 :style="{color:themeColor}" v-if="$route.query.customerType=='ENTERPRISE'||$route.query.customerType=='OTHER_ORG'">
          <i class="customer-type fa fa-building-o"></i>
          {{$route.query.customerName}}
        </h1>
      </div>
      <el-row>
        <el-tag> 全部银行卡 {{total}}</el-tag>
        <el-tag> 代扣银行卡 {{dkTotal}}</el-tag>
        <el-tag> 存管银行卡 {{cgTotal}}</el-tag>
        <el-button class="btn-right" size="small" type="primary" @click="openDKLimitTable('代扣限额表')"> 代扣限额表</el-button>
      </el-row>
    </el-card>
    <div class="bank-list is-clear">
      <div class="box f-item" v-for="(x,index) in bankCardInfoList" :key="index">
        <el-card class="box-card">
          <img :src="'https://apimg.alipay.com/combo.png?d=cashier&t='+x.bankCode" width="200px">
          <p class="back-account">
            <span>{{x.bankAccounts|fiterPrivate('bank')}}</span>
          </p>
          <p>
            <span>预留手机号：{{x.phone|fiterPrivate('phone')}}</span>
          </p>
          <el-tabs stretch v-model="x.activeName">
            <el-tab-pane label="代扣" name="dk" v-if="x.withholdingList&&x.withholdingList.length>0">
              <div class="ht-list" v-for="(y,indexY) in x.withholdingList" :key="indexY">
                <img v-if="y.platformType=='YeePay'" src="~@assets/ybzf.png" width="100px" height="30px">
                <img v-else-if="y.platformType=='Kuaiqian'" src="~@assets/kq.png" width="100px" height="30px">
                <span v-else-if="y.platformType=='XieYi'" style="width:100px;">{{y.platformName}}</span>
                <span v-else style="width:100px;">{{y.platformName}}</span>
                <span v-if="y.status=='10'">已绑定</span>
                <span v-else-if="y.status=='20'">未绑定</span>
                <span v-else>绑定中</span>
                <span v-if="y.status=='10'" :style="{color:themeColor}" class="ht-link" @click="handleCommand('代扣解绑',x,y)">解绑</span>
                <span v-else-if="y.status=='20'" :style="{color:themeColor}" class="ht-link" @click="handleCommand('代扣绑卡',x, y)">绑定</span>
              </div>
            </el-tab-pane>
            <el-tab-pane label="存管" name="cg" v-if="x.depositList&&x.depositList.length>0">
              <div class="ht-list" v-for="(y,indexY) in x.depositList" :key="indexY">
                <img v-if="y.platformType=='tuandai'" src="~@assets/tdw.png" width="100px" height="30px">
                <img v-else-if="y.platformType=='niiwoo'" src="~@assets/nwjr.png" width="100px" height="30px">
                <span style="width:100px;" v-else>{{y.platformName}}</span>
                <span>{{y.status|bankCardCGStatus('status')}}</span>
                <span class="ht-link" :style="{color:themeColor}" @click="CGActive(x,y)">{{y.status|bankCardCGStatus('active',$route.query.customerType)}}</span>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
        <span v-if="isCanDelete(x.withholdingList,x.depositList)" class="ht-close el-icon-error" @click.stop="deleteBankCard(x)"></span>
      </div>
      <div class="box f-item" @click="addBankCard('新增银行卡')">
        <el-card class="box-card">
          <div class="add-btn">
            <p :style="{color:themeColor}">
              <i class="el-icon-plus"></i>
            </p>
            <p :style="{color:themeColor}"> 新增银行卡</p>
          </div>
        </el-card>
      </div>
    </div>
    <!-- 弹出框 -->
    <el-dialog class="hongte-dialog" width="1000px" ref="dialog" :visible.sync='dialog.visible' :title='dialog.title' v-if="dialog.visible">
      <DkBankCard v-if="dialog.title == '代扣绑卡'" :postData="dialog.postData" @closeDialog="closeDialog" @getData="getData"></DkBankCard>
      <!-- <DkBankCard v-if="dialog.title == '代扣解绑'" :postData="dialog.postData" @closeDialog="closeDialog"></DkBankCard>
      <CgBankCard v-if="dialog.title == '注销存管'" :postData="dialog.postData" @closeDialog="closeDialog"></CgBankCard> -->
      <CgBankCard v-if="dialog.title == '注册存管'" :postData="dialog.postData" @closeDialog="closeDialog" @getData="getData"></CgBankCard>
      <CgBankCardUpLoad v-if="dialog.title == '上传资料'||dialog.title == '解绑存管'||dialog.title=='解绑审批失败,需重新上传资料'" :postData="dialog.postData" @closeDialog="closeDialog" @getData="getData" :isBind="isBind"></CgBankCardUpLoad>
      <AddBankCard v-if="dialog.title == '新增银行卡'" :postData="dialog.postData" @closeDialog="closeDialog" @getData="getData"></AddBankCard>
      <DKLimitTable v-if="dialog.title == '代扣限额表'" @closeDialog="closeDialog"></DKLimitTable>
    </el-dialog>
  </div>
</template>

<script>
import DkBankCard from './BankCard/DkBankCard.vue'; //代扣绑卡
import CgBankCard from './BankCard/CgBankCard.vue'; //代扣绑卡
import AddBankCard from './BankCard/AddBankCard.vue'; //新增银行卡
import DKLimitTable from './BankCard/DKLimitTable.vue'; //代扣限额表
import CgBankCardUpLoad from './BankCard/CgBankCardUpLoad.vue'; //代扣限额表
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'BankCardManagement',
  data() {
    return {
      myData: null,
      // deleteBankCard:false,
      //弹出层
      dialog: {
        visible: false,
        title: '',
        // 编辑的列表
        postData: {}
      },
      //是注册存管还是解绑存管
      isBind: true
    };
  },
  components: {
    DkBankCard,
    CgBankCard,
    AddBankCard,
    DKLimitTable,
    CgBankCardUpLoad
  },
  mounted() {
    this.$nextTick(() => {
      this.getData();
    });
  },
  methods: {
    getData() {
      this.$api
        .getBankCardInfoList({
          customerCode: this.$route.query.customerCode
        })
        .then(res => {
          if (res.returnCode == '0000') {
            this.myData = res.data;
            // this.initData();
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    //新增银行卡
    addBankCard(title) {
      console.log(title);
      this.dialog.visible = true;
      this.dialog.title = title;
      this.dialog.postData = {
        customerCode: this.$route.query.customerCode
      };
    },
    //删除银行卡
    deleteBankCard(x) {
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.$api
            .delBankCardInfo({
              bankAccounts: x.bankAccounts,
              customerCode: this.$route.query.customerCode
            })
            .then(res => {
              if (res.returnCode == '0000') {
                this.$message.success('删除成功');
                this.getData();
              } else {
                this.$message.error(res.msg);
              }
            });
        })
        .catch(() => {});
    },
    //判断代扣和存管都未绑定或激活则可删除
    isCanDelete(withholdingList, depositList) {
      let isCanDelete = false;
      if (withholdingList) {
        isCanDelete = withholdingList.every(x => {
          return x.status == '20';
        });
      }
      if (depositList) {
        isCanDelete = depositList.every(x => {
          return x.status == '20';
        });
      }
      return isCanDelete;
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
    //代扣限额表
    openDKLimitTable(title) {
      this.dialog.visible = true;
      this.dialog.title = title;
    },
    //存管操作
    CGActive(rowX, rowY) {
      let customerType = this.$route.query.customerType;
      let cardType = this.$route.query.cardType;
      console.log(customerType, cardType);

      switch (rowY.status) {
        case '20':
        case '30':
          this.dialog.postData = {
            customerCode: this.$route.query.customerCode,
            bankName: rowX.bankName,
            bankAccounts: this.Trim(rowX.bankAccounts),
            phone: rowX.phone,
            platformName: rowY.platformName,
            platformType: rowY.platformType
          };
          this.dialog.visible = true;
          this.dialog.title = '注册存管';
          break;
        case '40':
        case '42':
          this.dialog.postData = {
            customerCode: this.$route.query.customerCode,
            bankName: rowX.bankName,
            bankAccounts: this.Trim(rowX.bankAccounts),
            phone: rowX.phone,
            platformName: rowY.platformName,
            platformType: rowY.platformType,
            requestId: rowY.requestId,
            fileType: customerType == 'PERSON' ? 'TD_PERSON_FDLJ_CGZC' : 'TD_ENTERPRISE_CGZC'
          };
          this.isBind = true;
          this.dialog.visible = true;
          this.dialog.title = '上传资料';
          break;
        case '10':
        case '51':
          this.dialog.postData = {
            customerCode: this.$route.query.customerCode,
            bankName: rowX.bankName,
            bankAccounts: this.Trim(rowX.bankAccounts),
            phone: rowX.phone,
            platformName: rowY.platformName,
            platformType: rowY.platformType,
            requestId: rowY.requestId,
            fileType: cardType == 'ID_card' ? 'TD_PERSON_DLJ_CGJB' : 'TD_PERSON_FDLJ_CGJB'
          };

          this.isBind = false;
          this.dialog.visible = true;
          if (rowY.status == '51') {
            this.dialog.title = '解绑审批失败,需重新上传资料';
          } else {
            this.dialog.title = '解绑存管';
          }
          break;
        default:
          break;
      }
    },
    //操作
    handleCommand(title, rowX, rowY) {
      if (title == '代扣解绑') {
        let params = {
          bankAccounts: this.Trim(rowX.bankAccounts),
          customerCode: this.$route.query.customerCode,
          platformType: rowY.platformType,
          requestId: rowY.requestId
        };
        this.$confirm('确定解绑？', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$api.DKunBindCard(params).then(res => {
            if (res.returnCode == '0000') {
              this.$message.success('解绑成功! ');
              this.getData();
            } else {
              this.$message.error(res.msg);
            }
          });
        });
      } else {
        this.dialog.postData = {
          customerCode: this.$route.query.customerCode,
          bankCode: rowX.bankCode,
          bankName: rowX.bankName,
          bankAccounts: this.Trim(rowX.bankAccounts),
          phone: rowX.phone,
          platformName: rowY.platformName,
          platformType: rowY.platformType
        };
        this.dialog.visible = true;
        this.dialog.title = title;
      }
    },
    closeDialog() {
      this.dialog.visible = false;
    }
  },
  computed: {
    ...mapGetters(['localTheme', 'bank']),
    themeColor() {
      return this.localTheme.themeColor;
    },
    total() {
      if (this.myData) {
        return this.myData.total;
      }
    },
    dkTotal() {
      if (this.myData) {
        return this.myData.dkTotal;
      }
    },
    cgTotal() {
      if (this.myData) {
        return this.myData.cgTotal;
      }
    },
    bankCardInfoList() {
      if (this.myData) {
        //默认tabs显示代扣
        if (this.myData.list) {
          this.myData.list.forEach(x => {
            x.activeName = 'dk';
          });
          return this.myData.list;
        }
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.box-card {
  .hd {
    overflow: hidden;
  }
  h1 {
    float: left;
    font-size: 24px;
  }
  .el-row {
    margin-top: 25px;
    .el-button {
      // margin-right: 40px;
    }
  }
}
.bank-list {
  .box {
    float: left;
    width: 350px;
    margin-top: 20px;
    position: relative;
    .box-card {
      margin: 0 10px;
      line-height: 1.8;
      min-height: 336px;
      position: relative;
      p {
        color: #888;
        text-align: center;
        &.back-account {
          font-size: 24px;
          color: #333;
        }
      }
      h1 {
        font-size: 24px;
      }
      .add-btn {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        line-height: 2;
        font-size: 18px;
        .el-icon-plus {
          font-size: 30px;
        }
      }
    }
    .ht-close {
      position: absolute;
      top: -5px;
      right: 5px;
    }
  }
}
.ht-list {
  height: 60px;
  line-height: 60px;
  img {
    margin-top: 15px;
  }
  + .ht-list {
    border-top: 1px solid #f2f2f2;
  }
  span {
    display: inline-block;
    vertical-align: top;
    padding-left: 20px;
  }
  .ht-link {
    cursor: pointer;
    float: right;
  }
}
.btn-right {
  float: right;
}
</style>
