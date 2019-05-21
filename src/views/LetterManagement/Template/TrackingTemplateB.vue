<template>
  <div>
    <el-card class="box-card">
      <div class="hd">
        <h1 :style="{color:themeColor}">
          <i v-if="where.customerType=='PERSON'" class="fa fa-user-o"></i>
          <i v-else class="fa fa-building-o"></i>
          单号：{{where.businessId}}
        </h1>
        <el-row class="buss-btn">
          <el-button size="small" type="primary" @click="$emit('removeCurTag');$router.push({name:$route.query.from});"> 返回列表</el-button>
          <!-- <el-button v-if="DoRevoke" size="small" type="primary" @click="handleDoRevoke()"> 撤回</el-button> -->
          <el-button v-if="DoCancel" size="small" type="primary" @click="handleDoCancel()"> 注销</el-button>
        </el-row>
      </div>
      <div class="f-flex hongte-query-form">
        <div class="f-item">
          <div>
            <label>客户姓名：</label>
            <p>
              <span>{{where.customerName}}</span>
            </p>
          </div>
          <div>
            <label>手机号码：</label>
            <p>
              <span>{{where.phone}}</span>
            </p>
          </div>
          <div>
            <label>证件号码：</label>
            <p>
              <span>{{where.cardNumber}}</span>
            </p>
          </div>
        </div>
        <div class="f-item">
          <div>
            <label>产品类型：</label>
            <p>
              <span>{{where.productTypeName}}</span>
            </p>
          </div>
          <div>
            <label>产品系列：</label>
            <p>
              <span>{{where.productSeriesName}}</span>
            </p>
          </div>
          <div>
            <label>产品：</label>
            <p>
              <span>{{where.productName}}</span>
            </p>
          </div>
        </div>
        <div class="f-item">
          <div>
            <label>受理人：</label>
            <p>
              <span>{{where.createUserName}}</span>
            </p>
          </div>
          <div>
            <label>受理门店：</label>
            <p>
              <span>{{where.createOrgName}}</span>
            </p>
          </div>
          <div>
            <label>受理时间：</label>
            <p>
              <span>{{where.createTime}}</span>
            </p>
          </div>
        </div>

        <div class="f-item">
          <div class="f-item2">
            <div class="label">状态
              <el-popover v-if="where.businessStatusCode=='90'" placement="top" title="拒绝的原因" width="200" trigger="click" :content="where.auditOpinion|filterNull">
                <el-button type="text" size="small" slot="reference" @click="visible = !visible">（拒绝的原因）</el-button>
              </el-popover>
            </div>
            <h1 :style="{color:themeColor}">{{where.businessStatus}}</h1>
          </div>
          <div class="f-item2">
            <div class="label">申请金额</div>
            <h1 :style="{color:themeColor}">{{where.applyMoney?'￥'+ where.applyMoney:'-'}}</h1>
          </div>
        </div>
      </div>
    </el-card>
    <el-tabs type="border-card" style="margin-top:20px;" @tab-click="handleClick">
      <!-- 详情 -->
      <el-tab-pane label="详情">
        <el-card class="box-card">
          <div slot="header" class="is-clear">
            <span class="card-title">流程进度</span>
          </div>
          <ht-steps :active="approveProgressStatus" class="ht-steps">
            <ht-step v-for="(x,index) in progressFlow" :key="index" :title="x.nodeName" :subTitle="x.approveUserName" :dates="x.approvTime"></ht-step>
            <!-- <ht-step title="授信申请" subTitle="区丽丽" dates="2018-07-12 12:00:00" icon="fa fa-pencil-square-o">
                        </ht-step>
                        <ht-step title="风控初审" subTitle="周毛毛" button="催一下" @button-enter="goDing()" icon="fa fa-filter"></ht-step>
                        <ht-step title="风控复审" icon="fa fa-search-minus"></ht-step>
                        <ht-step title="完成" icon="fa fa-stack-overflow"></ht-step> -->
          </ht-steps>
        </el-card>
        <el-card class="box-card" style="margin-top:20px;">
          <!-- 贷款信息 -->
          <div slot="header" class="is-clear">
            <span class="card-title">贷款信息</span>
          </div>
          <div class="f-flex is-clear">
            <div class="f-item3">
              <label>申请金额：</label>
              <p>
                <span>{{where.applyMoney}}</span>
              </p>
            </div>
            <div class="f-item3">
              <label>资金渠道：</label>
              <p>
                <span>{{where.platformCode}}</span>
              </p>
            </div>
            <div class="f-item3">
              <label>还款方式：</label>
              <p>
                <span>{{where.repaymentModeName}}</span>
              </p>
            </div>
            <div class="f-item3">
              <label>期数类型：</label>
              <p>
                <span>{{where.periodsTypeName}}</span>
              </p>
            </div>
            <div class="f-item3">
              <label>申请期数：</label>
              <p>
                <span>{{where.applyLimit}}</span>
              </p>
            </div>
            <!-- <div class="f-item3">
              <label>第一还款来源：</label>
              <p>
                <span>{{where.firstPaymentSourceName}}</span>
              </p>
            </div>
            <div class="f-item3">
              <label>第二还款来源：</label>
              <p>
                <span>{{where.secondPaymentSourceName}}</span>
              </p>
            </div>
            <div class="f-item3">
              <label>借贷用途：</label>
              <p>
                <span>{{where.borrowPurposeName}}</span>
              </p>
            </div>
            <div class="f-item3">
              <label>近半年营业收入：</label>
              <p>
                <span>{{where.incomeHalfYear}}</span>
              </p>
            </div> -->
            <div class="f-item3">
              <label>反担保客户类型：</label>
              <p>
                <span v-if="where.antiGuaranteeCustType=='PERSON'">个人</span>
                <span v-if="where.antiGuaranteeCustType=='ENTERPRISE'">企业</span>
              </p>
            </div>
            <div class="f-item3" v-if="where.antiGuaranteeCustType=='PERSON'">
              <label>反担保人：</label>
              <p>
                <span>{{where.antiGuaranteePersonName}}</span>
              </p>
            </div>
            <div class="f-item3" v-if="where.antiGuaranteeCustType=='PERSON'">
              <label>反担保人证件号：</label>
              <p>
                <span>{{where.antiGuaranteePersonCardNumber}}</span>
              </p>
            </div>
            <div class="f-item3" v-if="where.antiGuaranteeCustType=='ENTERPRISE'">
              <label>反担保公司法人：</label>
              <p>
                <span>{{where.antiGuaranteeLegalName}}</span>
              </p>
            </div>
            <div class="f-item3" v-if="where.antiGuaranteeCustType=='ENTERPRISE'">
              <label>反担保公司名：</label>
              <p>
                <span>{{where.antiGuaranteeComName}}</span>
              </p>
            </div>
            <div class="f-item3" v-if="where.antiGuaranteeCustType=='ENTERPRISE'">
              <label>反担保企业社会信用代码：</label>
              <p>
                <span>{{where.antiGuaranteeComUnifiedCode}}</span>
              </p>
            </div>
          </div>
          <!-- 借款人信息 -->
          <div class="card-define-title">
            <span class="card-title">借款人信息</span>
          </div>
          <el-table border stripe :data="where.issueCustomerTogetherList" ref="addLoader" class="hongte-table" highlight-current-row style="margin:30px 0;">
            <el-table-column fixed type="index" align="center" label="序号" width="50"></el-table-column>
            <el-table-column label="借款人" prop="customerName" min-width="100"></el-table-column>
            <el-table-column label="借款人类型" min-width="100">
              <template slot-scope="scope">
                <p>{{scope.row.customerType|fiterCustomerType}}</p>
              </template>
            </el-table-column>
            <!-- <el-table-column label="可发标额度" prop="canBorrowLimit" min-width="100"></el-table-column> -->
            <el-table-column label="上标金额" min-width="120">
              <template slot-scope="scope">
                <p>{{scope.row.issueAmount}}</p>
              </template>
            </el-table-column>
            <el-table-column label="第一还款来源" min-width="120">
              <template slot-scope="scope">
                <p>{{scope.row.firstPaymentSourceName}}</p>
              </template>
            </el-table-column>
            <el-table-column label="第二还款来源" min-width="120">
              <template slot-scope="scope">
                <p>{{scope.row.secondPaymentSourceName}}</p>
              </template>
            </el-table-column>
            <el-table-column label="借贷用途" min-width="120">
              <template slot-scope="scope">
                <p>{{scope.row.borrowPurposeName}}</p>
              </template>
            </el-table-column>
            <el-table-column label="近半年营业收入" min-width="120">
              <template slot-scope="scope">
                <p>{{scope.row.incomeHalfYear|filterNull}}</p>
              </template>
            </el-table-column>
            <el-table-column label="除工资外的经营所得说明" min-width="120">
              <template slot-scope="scope">
                <p>{{scope.row.exceptWageIncomeExplain|filterNull}}</p>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click.stop="bandCardInfo(scope.row)">银行卡信息</el-button>
                <el-button type="text" size="small" @click.stop="loaderInfo(scope.row)">借款人信息</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 出款信息 -->
          <div class="card-define-title">
            <span class="card-title">出款信息</span>
          </div>
          <div class="card-body">
            <div class="f-flex is-clear">
              <div class="f-item3">
                <label>债权人、借款人：</label>
                <p>
                  <span>{{where.lenderName}}</span>
                </p>
              </div>
              <div class="f-item3">
                <label>所属分公司全称：</label>
                <p>
                  <span>{{where.companyName}}</span>
                </p>
              </div>
              <div class="f-item3">
                <label>分公司地址：</label>
                <p>
                  <span>{{where.companyAddress}}</span>
                </p>
              </div>
              <div class="f-item3">
                <label>法人代表：</label>
                <p>
                  <span>{{where.legalName}}</span>
                </p>
              </div>
              <div class="f-item3">
                <label>联系电话：</label>
                <p>
                  <span>{{where.legalTelephone}}</span>
                </p>
              </div>
            </div>
          </div>
          <el-table v-if="where.houseMortgageList" :data="where.houseMortgageList" :show-header="false" border style="width: 100%">
            <el-table-column fixed type="index" align="center" label="序号" width="50"></el-table-column>
            <el-table-column label="抵押物" min-width="120">
              <template slot-scope="scope">
                <p>{{`抵押物信息 ${scope.row.outputId=scope.$index+1}`}}</p>
                <p class="ht-warning">{{`共 ${where.houseMortgageList.length} 个抵押物`}}</p>
              </template>
            </el-table-column>
            <el-table-column label="抵押物详细信息" min-width="500">
              <template slot-scope="scope">
                <div class="f-flex is-clear" style="border-bottom: 1px solid #ebeef5;padding-bottom: 10px;margin:0;">
                  <div class="f-item">
                    <label>权属人：</label>
                    <p><span>{{scope.row.ownerName|filterNull}}</span></p>
                  </div>
                  <div class="f-item">
                    <label>隐性共有人：</label>
                    <p><span>{{scope.row.hiddenName|filterNull}}</span></p>
                  </div>
                  <div class="f-item">
                    <label>房产地址：</label>
                    <p><span>{{scope.row.houseAddress|filterNull}}</span></p>
                  </div>
                  <div class="f-item">
                    <label>房产证编号：</label>
                    <p><span>{{scope.row.houseId|filterNull}}</span></p>
                  </div>
                </div>
                 <div class="f-flex is-clear" style="padding-bottom: 10px;margin:0;">
                  <div class="f-item1">
                    <label>抵押人信息填写：</label>
                    <p><span>{{scope.row.pledgorInfo|filterPledgor}}</span></p>
                  </div>
                  <div class="f-item1">
                    <label>暂作价填写：</label>
                    <p><span v-if="scope.row.temporarilyPriceInfo!='1'">{{scope.row.temporarilyPriceInfo|temporarilyPrice}}</span>
                    <span v-else>{{scope.row.temporarilyPriceInfo|temporarilyPrice}}{{scope.row.houseProvisionalPrice|filterNull}}</span></p>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 合同信息 -->
          <div class="card-define-title">
            <span class="card-title">合同信息</span>
          </div>
          <div class="card-body">
            <div class="f-flex is-clear">
              <div class="f-item1">
                <label>合同签订日期：</label>
                <p>
                  <span>{{where.signTime}}</span>
                </p>
              </div>
              <div class="f-item3">
                <label>统一社会信用代码：</label>
                <p>
                  <span>{{where.uniteCode}}</span>
                </p>
              </div>
              <div class="f-item3">
                <label>电子签章横向文：</label>
                <p>
                  <span>{{where.horizontalText}}</span>
                </p>
              </div>
              <div class="f-item3">
                <label>电子签章下弦文：</label>
                <p>
                  <span>{{where.cosText}}</span>
                </p>
              </div>
              <div class="f-item3">
                <label>还款账户名：</label>
                <p>
                  <span>{{where.returnAccountName}}</span>
                </p>
              </div>
              <div class="f-item3">
                <label>还款开户支行：</label>
                <p>
                  <span>{{where.returnBankName}}</span>
                </p>
              </div>
              <div class="f-item3">
                <label>还款账号：</label>
                <p>
                  <span>{{where.returnAccountNo}}</span>
                </p>
              </div>
              <div class="f-item3">
                <label>居间费账户名：</label>
                <p>
                  <span>{{where.midAccountName}}</span>
                </p>
              </div>
              <div class="f-item3">
                <label>居间费开户支行：</label>
                <p>
                  <span>{{where.midBankName}}</span>
                </p>
              </div>
              <div class="f-item3">
                <label>居间费账号：</label>
                <p>
                  <span>{{where.midAccountNo}}</span>
                </p>
              </div>

            </div>
          </div>
          <!-- 担保主体信息 -->
          <!-- <div class="card-define-title">
                        <span class="card-title">担保主体信息</span>
                    </div>
                    <div class="card-body">
                        <div class="f-flex is-clear">
                            <div class="f-item3">
                                <div>
                                    <label>联系：</label>
                                    <span>{{grantCustInfo.customerName}}</span>
                                </div>
                                <div>
                                    <label>地址：</label>
                                    <span>{{grantCustInfo.previousName}}</span>
                                </div>
                                <div>
                                    <label>联系号码：</label>
                                    <span>{{grantCustInfo.houseTypeName}}</span>
                                </div>
                                <div>
                                    <label>邮箱：</label>
                                    <span>{{grantCustInfo.educationName}}</span>
                                </div>
                            </div>
                        </div>
                    </div> -->
        </el-card>
      </el-tab-pane>
      <!--费用明细 -->
      <el-tab-pane label="费用明细">
        <Costexpens :postData="postData"></Costexpens>
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

    <!--共借人 -->
    <el-dialog class="hongte-dialog" width="80%" :visible.sync='dialogVisible' :title="dialogTitle">
      <CustomeModifyForPerson v-if="dialogTitle.indexOf('借款人信息')!=-1&&dialogData.customerType=='PERSON'" :is-view="true" :postData="dialogData" @closeDialog="closeDialog"></CustomeModifyForPerson>
      <CustomeModifyForEnterprise v-if="dialogTitle.indexOf('借款人信息')!=-1&&dialogData.customerType!='PERSON'" :is-view="true" :postData="dialogData" @closeDialog="closeDialog"></CustomeModifyForEnterprise>
      <template v-if="dialogTitle.indexOf('银行卡信息')!=-1">
        <div class="bank-list is-clear">
          <div class="box" v-for="(x,index) in filterBankCardInfoList" :key="index">
            <el-card class="box-card">
              <img :src="'https://apimg.alipay.com/combo.png?d=cashier&t='+x.bankCode" width="200px">
              <p class="back-account">
                <span>{{x.bankAccounts|fiterPrivate('bank')}}</span>
              </p>
              <p>
                <span>预留手机号：{{x.phone|fiterPrivate('phone')}}</span>
              </p>
            </el-card>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import HtSteps from "@components/steps/src/steps";
import HtStep from "@components/steps/src/step";
import ViewsFile from "@htComponents/UploadFile/ViewsFile";
import operateTable from "@htComponents/operateTable";
import CustomeModifyForPerson from "@views/CustomeManagement/CustomeModify/CustomeModifyForPerson.vue"; //个人信息
import CustomeModifyForEnterprise from "@views/CustomeManagement/CustomeModify/CustomeModifyForEnterprise.vue"; //企业信息
import { mapGetters, mapMutations } from "vuex";
import Costexpens from '@htComponents/Costexpens';
export default {
  name: "TrackingTemplateA",
  components: {
    HtSteps,
    HtStep,
    ViewsFile,
    operateTable,
    CustomeModifyForPerson,
    CustomeModifyForEnterprise,
    Costexpens
  },
  data() {
    return {
      //共借人
      dialogVisible: false,
      dialogTitle: "",
      bankCardInfoList: [],
      dialogData: {},
      // 撤回
      DoRevoke: false,
      //注销
      DoCancel: false,
      //主要数据
      where: {},
      //查看附件需要的数据
      postData: {},
      progressFlow: {},
      outplanData: [],
      approveProgressStatus: 0
    };
  },
  beforeMount() {
    this.$nextTick(() => {
      this.getData();
    });
  },
  methods: {
    // getIssueCostDetailByBizId(bizId) {
    //   this.$api.getIssueCostDetailByBizId({ businessId: bizId }).then(res => {
    //     if (res.returnCode == "0000") {
    //       // for (let k in res.data) {
    //       try {
    //         for (let k = 0; k < res.data.length; k++) {
    //           let d = res.data[k];
    //           let allTotal = d.allTotal;
    //           let customerCode = d.customerCode;
    //           let customerName = d.customerName;
    //           let issueCost = d.issueCost;
    //           let rowspanData = {};
    //           let outplanData = [];
    //           for (let i = 0; i < issueCost.length; i++) {
    //             let rowData = issueCost[i];
    //             if (rowData.issueBusinessApplyoutputDetailList) {
    //               let startIndex = outplanData.length;

    //               let childData = rowData.issueBusinessApplyoutputDetailList;

    //               for (let j = 0; j < childData.length; j++) {
    //                 let rowData2 = childData[j];
    //                 outplanData.push({
    //                   name1: rowData.feeTypeName,
    //                   name2: rowData2.feeName,
    //                   amount: rowData2.feeValue,
    //                   chargingTypeName: rowData2.feeChargingTypeName,
    //                   timeChargeName: rowData.isOneTimeChargeName
    //                 });
    //               }
    //               outplanData.push({
    //                 name1: rowData.feeTypeName,
    //                 name2: "合计（元）：",
    //                 amount: rowData.total
    //               });
    //               rowspanData["idx" + startIndex] = {
    //                 rowspan: outplanData.length - startIndex,
    //                 colspan: 1
    //               };
    //             }
    //           }
    //           rowspanData["idx" + outplanData.length] = {
    //             rowspan: 1,
    //             colspan: 1
    //           };
    //           outplanData.push({
    //             name1: "合计（元）：",
    //             name2: "",
    //             amount: allTotal,
    //             chargingTypeName: "",
    //             timeChargeName: ""
    //           });
    //           this.outplanData.push({
    //             customerCode: customerCode,
    //             customerName: customerName,
    //             rowspanData: rowspanData,
    //             outplanData: outplanData,
    //             objectSpanMethod: function({
    //               row,
    //               column,
    //               rowIndex,
    //               columnIndex
    //             }) {
    //               if (columnIndex === 0) {
    //                 if (rowspanData["idx" + rowIndex]) {
    //                   return rowspanData["idx" + rowIndex];
    //                 } else {
    //                   return {
    //                     rowspan: 0,
    //                     colspan: 0
    //                   };
    //                 }
    //               }
    //             }
    //           });
    //         }
    //       } catch (error) {}
    //     } else {
    //       // this.$message.error(res.msg);
    //     }
    //   });
    // },
    getData() {
      this.$api.yongxinDetail({ id: this.$route.query.id }).then(res => {
        if (res.returnCode == "0000") {
          this.where = res.data;
          this.initData();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    initData() {
      //获取流程----
      if (this.where.approveNo) {
        this.$api
          .creditQueryApproveProgress({
            approveNo: this.where.approveNo //'test201807200022'
          })
          .then(res => {
            if (res.returnCode == "0000") {
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
      this.initPermission();
    },
    // 进行按钮配置
    initPermission() {
      // 审核进度大于0后不能撤回只能注销
      if (this.where) {
        let businessStatusCode = this.where.businessStatusCode;
        let auditPercent = parseFloat(this.where.auditPercent);
        switch (businessStatusCode) {
          case "0":
          case "10":
            break;
          case "20":
          case "30":
            if (auditPercent > 0) {
              this.DoRevoke = false;
              this.DoCancel = true;
            } else {
              this.DoRevoke = true;
              this.DoCancel = true;
            }
            break;
          case "100":
          case "90":
          case "99":
          case "31":
            this.DoCancel = false;
            this.DoRevoke = false;
            break;
          default:
            break;
        }
      }
    },
    //发送钉钉消息
    goDing() {
      this.$message({
        type: "success",
        message: "已发送成功！"
      });
    },
    handleClick(tab, event) {
      this.$set(this.postData, "productCode", this.where.productCode);
      this.$set(this.postData, "businessId", this.where.businessId);
      this.$set(this.postData, "customerType", this.where.customerType);
    },
    //撤回
    handleDoRevoke() {
      this.$confirm("确定执行撤回操作？", "提示", {
        distinguishCancelAndClose: true,
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        this.$api
          .yongxinDoRevoke({
            businessId: this.where.businessId
          })
          .then(res => {
            if (res.returnCode == "0000") {
              this.getData();
              this.$message.success("撤回成功!");
            } else {
              this.$message.error(res.msg);
            }
          });
      });
    },
    //注销
    handleDoCancel() {
      this.$confirm("确定执行注销操作？", "提示", {
        distinguishCancelAndClose: true,
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        this.$api
          .yongxinDoCancel({
            id: this.$route.query.id
          })
          .then(res => {
            if (res.returnCode == "0000") {
              this.getData();
              this.$message.success("注销成功!");
            } else {
              this.$message.error(res.msg);
            }
          });
      });
    },
    //查看银行卡信息
    bandCardInfo(row) {
      this.getBankCardInfoList(row);
      this.dialogVisible = true;
      this.dialogTitle = row.customerName + "的银行卡信息";
    },
    //获取银行卡信息
    getBankCardInfoList(row) {
      this.$api
        .getBankCardInfoList({
          customerCode: row.customerCode
        })
        .then(res => {
          if (res.returnCode == "0000") {
            if (res.data) {
              this.bankCardInfoList = res.data.list;
            }
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    loaderInfo(row) {
      this.dialogData = {
        customerCode: row.customerCode,
        customerType: row.customerType
      };
      this.dialogVisible = true;
      this.dialogTitle = "借款人信息";
    },
    closeDialog() {
      this.dialogVisible = false;
    }
  },
  computed: {
    ...mapGetters(["localTheme"]),
    themeColor() {
      return this.localTheme.themeColor;
    },
    computedMyData() {
      if (this.myData) {
        return this.myData;
      }
    },
    //过滤银行卡信息
    filterBankCardInfoList() {
      let bankCardInfoList = this.bankCardInfoList;
      let newArray = [];
      try {
        bankCardInfoList.forEach(x => {
          if (x.depositList.length) {
            if (x.depositList[0].platformType == "tuandai") {
              newArray.push(x);
            }
            return false;
          }
        });
      } catch (error) {}
      return newArray;
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
      div {
        overflow: hidden;
      }

      // float: left;
      // text-indent: 10px;
      label {
        display: inline-block;
        // width: 250px;
        text-align: right;
        text-align: right;
        float: left;
        font-size: 14px;
        color: #606266;
        line-height: 40px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        line-height: 1.2;
        padding-top: 9px;
      }
      p {
        display: -webkit-box;
        box-sizing: border-box;
        line-height: 1.2;
        padding-top: 9px;
        word-break: break-all;
        margin-right: 20px;
        text-align: justify;
      }
      span {
        color: #888;
      }
    }
    .f-item{
      float: left;
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
    text-align: justify;
  }
  .item-title {
    color: #666;
    font-size: 16px;
    font-weight: 700;
  }
}

.bank-list {
  .box {
    width: 350px;
    margin: 20px auto;
    position: relative;
    .box-card {
      margin: 0 auto;
      line-height: 1.8;
      position: relative;
      p {
        color: #888;
        text-align: center;
        &.back-account {
          font-size: 24px;
          color: #333;
        }
      }
    }
  }
}
</style>
