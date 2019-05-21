<template>
  <el-collapse-item class="collapse-head" name="2">
    <template slot="title">
      <span>费用明细</span>
      <el-button style="float: right; padding: 17px 10px" type="text" @click.stop="getPayPlanData">预览还款计划</el-button>
    </template>
    <el-table border stripe :data="curIssueApplyOutputList" class="hongte-table" highlight-current-row>
      <el-table-column fixed type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column label="费用名称" prop="feeItemName" min-width="150"></el-table-column>
      <el-table-column label="收取时机" prop="isOneTimeChargeName" min-width="150">
      </el-table-column>
      <el-table-column label="是否线上收取" prop="isOnlineCharge" min-width="150">
        <template slot-scope="scope">
          <p v-if="scope.row.isOnlineCharge=='Y'">是</p>
          <p v-else>否</p>
        </template>
      </el-table-column>
      <el-table-column label="收取方式" min-width="150">
        <template slot-scope="scope">
          <p v-for="(x,index) in scope.row.issueBusinessApplyoutputDetailList" :key="index">{{x.feeChargingTypeName}}</p>
        </template>
      </el-table-column>
      <el-table-column label="费率/金额" min-width="150">
        <template slot-scope="scope">
          <p v-for="(x,index) in scope.row.issueBusinessApplyoutputDetailList" :key="index">{{x.feeRate}}</p>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="费用（元）" min-width="150">
        <template slot-scope="scope">
          <p v-for="(x,index) in scope.row.issueBusinessApplyoutputDetailList" :key="index">{{x.feeValue.toFixed(2)}}</p>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="hongte-dialog" width="800px" :visible.sync='dialogVisible' title='预览还款计划'>
      <el-table border stripe :data="payPlanData.dataMap" class="hongte-table" highlight-current-row>
        <el-table-column fixed type="index" align="center" label="序号" width="50"></el-table-column>
        <template v-for="(v,k) in payPlanData.titleMap">
          <el-table-column :label="v" :prop="k" min-width="100" :key="v"></el-table-column>
        </template>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </el-collapse-item>
</template>

<script>
export default {
  name: 'InfoForCost',
  data() {
    return {
      //预览还款计划
      payPlanData: { dataMap: [], titleMap: {} },
      dialogVisible: false
    };
  },
  props: ['where', 'curCustomerCode', 'IssueApplyOutputList'],
  methods: {
    //预览还款计划
    getPayPlanData() {
      let applyLimit = this.where.applyLimit; //申请期数
      let productCode = this.where.productCode; //产品code
      let productVersion = this.where.productVersion; //产品版本
      let repaymentModeCode = this.where.repaymentModeCode; //还款code
      let curCustomerCode = this.curCustomerCode; //客户编码
      let issueBusinessReqVos = this.where.issueBusinessReqVos; //借款人数据
      let issueAmount = '';
      
      // 是否为汇总
      if (this.IssueApplyOutputList) {
        issueAmount = this.where.applyMoney;
      } else {
        issueBusinessReqVos.forEach((x, index) => {
          if (curCustomerCode == x.customerCode) {
            issueAmount = x.issueAmount;
          }
        });
      }

      if (issueAmount && applyLimit && productCode && productVersion && repaymentModeCode) {
        let params = {
          amount: issueAmount,
          periods: applyLimit,
          productCode: productCode,
          productVersion: productVersion,
          repaymentModeCode: repaymentModeCode
        };
        this.$api.queryCostPlan(params).then(res => {
          if (res.returnCode == '0000') {
            this.payPlanData = res.data;
            this.dialogVisible = true;
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        if (issueAmount == '') {
          this.$message.error('请先填写申请金额');
          return false;
        }
        if (repaymentModeCode == '') {
          this.$message.error('请先选择还款方式');
          return false;
        }
        if (applyLimit == '') {
          this.$message.error('请先选择申请期数');
          return false;
        }
      }
    },
    // 生成费用明细
    createCostPlan(params, customerCode) {
      this.$api.createCostPlan(params).then(res => {
        if (res.returnCode == '0000') {
          // =============费用明细传出参数与传入参数不同一 ,痛苦转换中
          this.dealWithIssueApplyOutputList(res.data, customerCode);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //处理费用明细
    dealWithIssueApplyOutputList(_list, customerCode) {
      let issueApplyOutputList = [];
      if (_list.length !== 0) {
        _list.forEach(x => {
          let Obj = {};
          Obj.feeItemId = x.costCode;
          Obj.feeItemName = x.costName;
          Obj.feeTypeId = x.costTypeCode;
          Obj.feeTypeName = x.costTypeName;
          Obj.isOneTimeCharge = x.chargeChance; //收取时机
          Obj.isOneTimeChargeName = x.chargeChanceName; //收取时机名称
          Obj.isOnlineCharge = x.isOnlineCharge ? 'Y' : 'N'; //是否线上收取
          Obj.isTermRange = x.isDeadlineRange ? '1' : '0';
          let issueBusinessApplyoutputDetailList = [];
          x.costPlan.forEach(y => {
            let objChild = {};
            objChild.feeTermRangeMin = y.startPeriods;
            objChild.feeTermRangeMax = y.endPeriods;
            objChild.feeValue = y.amount;
            objChild.feeRate = y.rateAmount;
            objChild.feeChargingType = y.chargeMode; //收取方式
            objChild.feeChargingTypeName = y.chargeModeName; //收取方式名称
            objChild.feeId = x.costCode;
            objChild.feeName = x.costName;
            issueBusinessApplyoutputDetailList.push(objChild);
          });
          Obj.issueBusinessApplyoutputDetailList = issueBusinessApplyoutputDetailList;
          issueApplyOutputList.push(Obj);
        });
        this.setCreateCostPlanData(issueApplyOutputList, customerCode);
      } else {
        this.setCreateCostPlanData([], customerCode);
      }
    },
    //计算费用明细的总额
    computedTotleCreateCostPlan(data) {
      let total = 0;
      if (data) {
        data.forEach(x => {
          //期初收取||一次性收取&& 是否线上收取
          if ((x.isOneTimeCharge == 'MONTH_BEGIN_CHARGE' || x.isOneTimeCharge == 'SINGLE_USE_CHARGE') && x.isOnlineCharge == 'Y') {
            if (x.issueBusinessApplyoutputDetailList) {
              x.issueBusinessApplyoutputDetailList.forEach(y => {
                total += y.feeValue;
              });
            }
          }
        });
      }
      return total;
    },
    setCreateCostPlanData(_list, customerCode) {
      let issueBusinessReqVos = this.where.issueBusinessReqVos;
      let total = 0;
      issueBusinessReqVos.forEach((x, index) => {
        if (customerCode == x.customerCode) {
          this.$set(this.where.issueBusinessReqVos[index], 'issueApplyOutputList', _list);
        }
        total += this.computedTotleCreateCostPlan(x.issueApplyOutputList);
      });
      this.$emit('update:total', total.toFixed(2));
    }
  },
  computed: {
    curIssueApplyOutputList() {
      let issueApplyOutputList = [];
      if (this.IssueApplyOutputList) {
        issueApplyOutputList = this.IssueApplyOutputList;
      } else {
        let curCustomerCode = this.curCustomerCode;
        let issueBusinessReqVos = this.where.issueBusinessReqVos;
        issueBusinessReqVos.forEach((x, index) => {
          if (curCustomerCode == x.customerCode) {
            issueApplyOutputList = x.issueApplyOutputList;
          }
        });
      }
      return issueApplyOutputList;
    }
  }
};
</script>

