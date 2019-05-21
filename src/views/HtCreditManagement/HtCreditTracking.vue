<template>
  <div>
    <el-card class="box-card">
      <div class="hd">
        <h1 :style="{color:themeColor}">
          <i class="fa fa-user-o"></i>
          单号：{{myData.businessId}}

        </h1>
        <el-row class="buss-btn">
          <el-button size="small" type="primary" @click="$emit('removeCurTag');$router.push('HtCreditList')"> 返回列表</el-button>
          <!-- <el-button v-if="DoRevoke" size="small" type="primary" @click="handleDoRevoke()"> 撤回</el-button> -->
          <el-button v-if="DoCancel" size="small" type="primary" @click="handleCancel()"> 注销</el-button>
        </el-row>
      </div>
      <div class="f-flex hongte-query-form">
        <div class="f-item">
          <div>
            <label>客户姓名：</label>
            <span>{{myData.customerName}}</span>
          </div>
          <div>
            <label>手机号码：</label>
            <span>{{myData.phone}}</span>
          </div>
          <div>
            <label>证件号码：</label>
            <span>{{myData.cardNumber}}</span>
          </div>
        </div>
        <div class="f-item">
          <div>
            <label>产品类型：</label>
            <span>{{myData.productTypeName}}</span>
          </div>
          <div>
            <label>产品系列：</label>
            <span>{{myData.productSeriesName}}</span>
          </div>
          <div>
            <label>产品：</label>
            <span>{{myData.productName}}</span>
          </div>
        </div>
        <!-- <div class="f-item">
          <div>
            <label>受理人：</label>
            <span>{{myData.create_user_name}}</span>
          </div>
          <div>
            <label>受理门店：</label>
            <span>{{myData.create_org_name}}</span>
          </div>
          <div>
            <label>受理时间：</label>
            <span>{{myData.create_datetime|filtersFormatTime}}</span>
          </div>
        </div> -->

        <div class="f-item">
          <div class="f-item2">
            <div class="label">状态<el-popover v-if="myData.businessStatus=='90'" placement="top" title="拒绝的原因" width="200" trigger="click" :content="myData.auditOpinion|filterNull">
                <el-button type="text" size="small" slot="reference" @click="visible = !visible">（拒绝的原因）</el-button>
              </el-popover>
            </div>
            <h1 :style="{color:themeColor}">{{myData.businessStatus|businessStatusName}}</h1>
          </div>
          <!-- <div class="f-item2">
            <div class="label">授信额度</div>
            <h1 :style="{color:themeColor}">{{myData.credit_quota|filtersMoney}}</h1>
          </div> -->
        </div>
      </div>
    </el-card>
    <el-tabs type="border-card" style="margin-top:20px;" @tab-click="handleClick">
      <!-- 详情 -->
      <el-tab-pane label="详情">
        <el-card class="box-card" v-if="myData.approveNo&&progressFlow">
          <div slot="header" class="is-clear">
            <span class="card-title">流程进度</span>
          </div>
          <ht-steps :active="approveProgressStatus" class="ht-steps">
            <ht-step v-for="(x,index) in progressFlow" :key="index" :title="x.nodeName" :subTitle="x.approveUserName" :dates="x.approvTime"></ht-step>
          </ht-steps>
        </el-card>
      </el-tab-pane>
      <!--附件 -->
      <el-tab-pane label="附件">
        <ViewsFile :postData="postData"></ViewsFile>
      </el-tab-pane>
      <!-- 操作记录 -->
      <el-tab-pane label="操作记录">
        <operateTable :postData="postData"></operateTable>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import HtSteps from '@components/steps/src/steps';
import HtStep from '@components/steps/src/step';
import ViewsFile from '@htComponents/UploadFile/ViewsFile';
import operateTable from '@htComponents/operateTable';
import { mapGetters, mapMutations } from 'vuex';
import { setLocalStorage, getLocalStorage, codeToName } from '@utils';
export default {
  name: 'HtCreditTracking',
  components: {
    HtSteps,
    HtStep,
    ViewsFile,
    operateTable
  },
  data() {
    return {
      // 撤回
      DoRevoke: false,
      //注销
      DoCancel: false,
      progressFlow: {},
      //个人信息
      // sim_customer: {},
      // //产品信息
      // sim_business_info: {},
      // //授信额度
      // sim_credit_result: {},
      // configData: {},
      myData: {},
      //   grantCustInfo: {},
      //   eventSurvey: {},
      //   businessInterestSettlement: {},
      //   businessCreditInfoList: [],
      //   businessBankFlowList: [],
      //   businesPropertyList: [],
      //查看附件需要的数据
      postData: {},
      //   myFileData: [],
      //操作记录
      operateData: [],
      approveProgressStatus: 0
    };
  },
  beforeMount() {
    this.$nextTick(() => {
      this.getData();
    });
  },
  methods: {
    getData() {
      this.$api.preContractInfoTrack({ id: this.$route.query.id }).then(res => {
        if (res.returnCode == '0000') {
          let result = res.data;
          this.myData = res.data;
          this.initPermission(res.data);
          this.initData(res.data);
          //传入附件的数据
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    initData(result) {
      //获取流程----
      let approveNo = result.approveNo;
      if (approveNo) {
        this.$api
          .creditQueryApproveProgress({
            approveNo
          })
          .then(res => {
            if (res.returnCode == '0000') {
              this.progressFlow = res.data;
              for (let i = 0; i < res.data.length; i++) {
                let row = res.data[i];
                if (!row.approvTime) {
                  this.approveProgressStatus = i;
                  return false;
                } else {
                  this.approveProgressStatus = res.data.length;
                }
              }
            } else {
              this.$message.error(res.msg);
            }
          });
      }
      //判断该单号的流程进度---进行按钮配置
      this.initPermission(result);
    },
    // 进行按钮配置
    initPermission(result) {
      // 审核进度大于0后不能撤回只能注销
      if (result) {
        let businessStatusCode = result.businessStatus;
        let auditPercent = parseFloat(result.auditPercent);
        switch (businessStatusCode) {
          case '0':
          case '10':
            break;
          case '20':
          case '30':
            if (auditPercent > 0) {
              this.DoRevoke = false;
              this.DoCancel = true;
            } else {
              this.DoRevoke = true;
              this.DoCancel = true;
            }
            break;
          case '100':
          case '90':
          case '99':
          case '31':
            this.DoCancel = false;
            this.DoRevoke = false;
            break;
          default:
            break;
        }
      }
    },
    handleClick(tab, event) {
      this.$set(this.postData, 'productCode', this.myData.productCode);
      this.$set(this.postData, 'businessId', this.myData.businessId);
      this.$set(this.postData, 'customerType', this.myData.customerType);
    },
    //发送钉钉消息
    goDing() {
      this.$message({
        type: 'success',
        message: '已发送成功！'
      });
    },
    //撤回
    handleDoRevoke() {
      this.$confirm('确定执行撤回操作？', '提示', {
        distinguishCancelAndClose: true,
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$api
          .creditDoRevoke({
            id: this.$route.query.id
          })
          .then(res => {
            if (res.returnCode == '0000') {
              this.isDoRevoke = true;
              this.getData();
              this.$message.success('撤回成功!');
            } else {
              this.$message.error(res.msg);
            }
          });
      });
    },
    //注销
    handleCancel() {
      this.$confirm('确定执行注销操作？', '提示', {
        distinguishCancelAndClose: true,
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$api
          .preContractInfoCancelProcess({
            id: this.$route.query.id
          })
          .then(res => {
            if (res.returnCode == '0000') {
              this.getData();
              this.$message.success('注销成功!');
            } else {
              this.$message.error(res.msg);
            }
          });
      });
    }
  },
  computed: {
    ...mapGetters(['localTheme']),
    themeColor() {
      return this.localTheme.themeColor;
    },
    computedMyData() {
      if (this.myData) {
        return this.myData;
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
    float: right;
  }
  .f-flex {
    margin-top: 15px;
    width: 100%;
    overflow: hidden;
    line-height: 2;
    .f-item,
    .f-item1,
    .f-item2,
    .f-item3 {
      overflow: hidden;
      float: left;
      text-indent: 10px;
      span {
        color: #888;
      }
    }
    .f-item1 {
      float: left;
      width: 100%;
    }
    .f-item3 {
      float: left;
      width: 33.3%;
    }
    .f-item2 {
      float: left;
      width: 50%;
      h1 {
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
      }
    }
  }
  .ht-steps {
    margin: 10px 30px;
  }
  .card-define-title {
    padding: 18px 0;
    padding-top: 30px;
    border-bottom: 1px solid #ebeef5;
    box-sizing: border-box;
    width: calc(100% + 40px);
    margin-left: -20px;
    text-indent: 20px;
  }
  .card-title {
    font-weight: 700;
    font-size: 15px;
  }
  .card-body {
    padding: 20px 0;
    // text-align: justify;
    word-wrap: break-word;
    text-align: left;
  }
  .item-title {
    color: #666;
    font-size: 16px;
    font-weight: 700;
  }
}
</style>
