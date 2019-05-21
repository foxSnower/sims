<template>
  <el-collapse-item class="collapse-head" title="借款人信息" name="loader">
    <el-button type="primary" size="small" @click="queryCustomerTogetherInfo()">
      <i class="el-icon-plus"></i> 新增共借人</el-button>

    <el-table border stripe :data="where.issueBusinessReqVos" ref="addLoader" class="hongte-table" highlight-current-row @row-click="handlerClickRow">
      <el-table-column fixed type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column label="借款人" prop="customerName" min-width="100"></el-table-column>
      <el-table-column label="借款人类型" min-width="100">
        <template slot-scope="scope">
          <p>{{scope.row.customerType|fiterCustomerType}}</p>
        </template>
      </el-table-column>
      <el-table-column label="可发标额度" prop="canBorrowLimit" min-width="100"></el-table-column>
      <el-table-column label="上标金额" min-width="120">
        <template slot-scope="scope">
          <el-form :model="scope.row" :ref="'issueAmount'+scope.$index" size="small" :disabled="scope.row.isSub">
            <el-form-item prop="issueAmount" label=' ' :rules="[
                { required: true,validator:validatorApplyMoney},
              ]">
              <el-input v-model="scope.row.issueAmount" @blur="getInfoForCost(scope.row)"></el-input>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="第一还款来源" min-width="120">
        <template slot-scope="scope">
          <el-form :model="scope.row" :ref="'firstPaymentSource'+scope.$index" size="small" :disabled="scope.row.isSub">
            <el-form-item prop="firstPaymentSource" label=' ' :rules="[
                { required: true, message: '第一还款来源不能为空',trigger: 'change'},
              ]">
              <el-select v-model='scope.row.firstPaymentSource' placeholder='请选择' @change="scope.row.firstPaymentSourceName = changeCodeName(scope.row.firstPaymentSource,['code','name'],filterFirstSource(scope.row));$set(scope.row,'borrowPurposeCode','');$set(scope.row,'borrowPurposeName','');$set(scope.row,'incomeHalfYear','');$set(scope.row,'exceptWageIncomeExplain','');;">
                <el-option v-for="(x,index) in filterFirstSource(scope.row)" :key="index" :label='x.name' :value='x.code'></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="第二还款来源" min-width="120">
        <template slot-scope="scope">
          <el-form :model="scope.row" size="small" :ref="'secondPaymentSource'+scope.$index" :disabled="scope.row.isSub">
            <el-form-item prop="secondPaymentSource" label=' ' :rules="[
                { required: true, message: '第二还款来源不能为空'},
              ]">
              <el-select v-model='scope.row.secondPaymentSource' placeholder='请选择' @change="scope.row.secondPaymentSourceName = changeCodeName(scope.row.secondPaymentSource,['code','name'],filterSecondSource(scope.row));">
                <el-option v-for="(x,index) in filterSecondSource(scope.row)" :key="index" :label='x.name' :value='x.code'></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="借贷用途" min-width="120">
        <template slot-scope="scope">
          <el-form :model="scope.row" size="small" :ref="'borrowPurposeCode'+scope.$index" :disabled="scope.row.isSub">
            <el-form-item prop="borrowPurposeCode" label=' ' :rules="[
                { required: true, message: '借贷用途不能为空'},
              ]">
              <el-select v-model='scope.row.borrowPurposeCode' placeholder='请选择' @change="scope.row.borrowPurposeName = changeCodeName(scope.row.borrowPurposeCode,['code','name'],filterBorrowPurpose(scope.row));" :disabled="!scope.row.firstPaymentSource?true:false">
                <el-option v-for="(x,index) in filterBorrowPurpose(scope.row)" :key="index" :label='x.name' :value='x.code'></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="近半年营业收入" min-width="100">
        <template slot-scope="scope">
          <el-form v-if="scope.row.customerType!='PERSON'" :model="scope.row" size="small" :ref="'incomeHalfYear'+scope.$index" :disabled="scope.row.isSub">
            <el-form-item prop="incomeHalfYear" label=' ' :rules="[
                { required: true, validator:validatorMoney},

              ]">
              <el-input v-model='scope.row.incomeHalfYear'></el-input>
            </el-form-item>
          </el-form>
          <p v-else>-</p>
        </template>
      </el-table-column>
      <el-table-column label="除工资外的经营所得说明" min-width="120">
        <template slot-scope="scope">
          <el-form v-if="scope.row.firstPaymentSource!='1'" :model="scope.row" size="small" :ref="'exceptWageIncomeExplain'+scope.$index" :disabled="scope.row.isSub">
            <el-form-item prop="exceptWageIncomeExplain" label=' ' :rules="[
                { required: true, message: '除工资外的经营所得说明'},
              ]">
              <el-input type="textarea" rows="3" v-model='scope.row.exceptWageIncomeExplain'></el-input>
            </el-form-item>
          </el-form>
          <p v-else>-</p>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="bandCardInfo(scope.row)">查看银行卡信息</el-button>
          <el-button v-if="isDeleteLoader(scope.$index)" type="text" size="small" @click.stop="deleteLoader(scope.$index)" :disabled="scope.row.isSub">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-tabs v-if="where.issueBusinessReqVos.length!==0" v-model="activeName" type="border-card" style="margin:20px" @tab-click="handelTabClick">
      <el-tab-pane v-for="(item,index) in where.issueBusinessReqVos" :key="index" :label="item.customerName">
        <InfoForCost style="margin:20px" :ref="item.customerCode" v-model="where" :where="where" :curCustomerCode="item.customerCode" :total.sync="filterTotal"></InfoForCost>
      </el-tab-pane>
      <el-tab-pane label="汇总">
        <InfoForCost style="margin:20px" v-model="where" :where="where" :IssueApplyOutputList="filterIssueApplyOutputList"></InfoForCost>
      </el-tab-pane>
    </el-tabs>
    <!-- 新增共借人 -->
    <el-dialog class="hongte-dialog" width="800px" :visible.sync='dialogVisible' :title="dialogTitle">
      <template v-if="dialogTitle=='新增共借人'">
        <Issued ref="Issued" isChecked></Issued>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">关 闭</el-button>
          <el-button type="primary" @click="addLoader">新增共借人</el-button>
        </span>
      </template>
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
  </el-collapse-item>
</template>

<script>
import InfoForCost from '../CommonTemplate/InfoForCost';
import { mapGetters, mapMutations } from 'vuex';
import { validScrollTop, changeCodeName } from '@utils';
import { InfoForBorrowerRules } from '@rules';
export default {
  name: 'InfoForBorrower',
  data() {
    return {
      //新增共借人
      dialogVisible: false,
      dialogTitle: '',
      //共借人信息列表
      queryCustomerTogetherInfoList: [],
      //已选的共借人
      checkedAddLoader: [],
      addAddLoader: [],
      //当前用户银行卡信息
      bankCardInfoList: [],
      //当前用户费用
      activeName: null,
      filterTotal: 0
    };
  },
  props: ['where', 'filterProductInfo', 'type'],
  watch: {
    filterTotal: function(cur) {
      if (cur != '' || cur != null) {
        this.$emit('update:total', cur);
      }
    },
    dialogVisible(cur) {
      //清空选择
      if (cur) {
        try {
          this.$refs.Issued.clearSelection();
        } catch (error) {}
      }
    },
    /**
     *@date 2018-11-20 16:01:01
     *@describe  期限/还款计划监听
     */
    'where.applyLimit': {
      handler(curVal, oldVal) {
        if (curVal != '' && curVal != null) {
          this.$nextTick(() => {
            let issueBusinessReqVos = this.where.issueBusinessReqVos;
            issueBusinessReqVos.forEach(x => {
              this.getInfoForCost(x);
            });
          });
        }
      },
      deep: true
    },
    'where.repaymentModeCode': {
      handler(curVal, oldVal) {
        if (curVal != '' && curVal != null) {
          this.$nextTick(() => {
            let issueBusinessReqVos = this.where.issueBusinessReqVos;
            issueBusinessReqVos.forEach(x => {
              this.getInfoForCost(x);
            });
          });
        }
      },
      deep: true
    }
  },
  components: {
    InfoForCost,
    Issued: () => import('@views/CreditManagement/CommonTemplate/Issued')
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        //判断主借款人是否显示
        let whetherDeleteBorrower = this.where.whetherDeleteBorrower;
        if (whetherDeleteBorrower) {
          this.where.issueBusinessReqVos.splice(0, 1);
        }
        this.getData();
      }, 1000);
    });
  },
  methods: {
    getData() {
      let issueBusinessReqVos = this.where.issueBusinessReqVos;
      issueBusinessReqVos.forEach(x => {
        this.queryBorrowLimit(x);
      });
    },
    //查询借款额度查询
    queryBorrowLimit(row) {
      let params = {};
      if (row.customerType == 'PERSON') {
        params.identityCard = row.cardNumber||row.certificateNumber;
        params.borrowType = '1';
        params.platformType = '1';
      } else {
        params.identityCard = row.unifiedSocialCreditCode;
        params.borrowType = '2';
        params.platformType = '1';
      }
      this.$api.queryBorrowLimit(params).then(res => {
        if (res.returnCode == '0000') {
          if (res.data) {
            let canBorrowLimit = parseFloat(res.data.canBorrowLimit);
            canBorrowLimit = canBorrowLimit.toFixed(2);
            this.$set(row, 'canBorrowLimit', String(canBorrowLimit));
          }
        } else {
          this.message.error(res.msg);
        }
      });
      // return canBorrowLimit;
    },
    //查询共借人信息
    queryCustomerTogetherInfo() {
      this.dialogVisible = true;
      this.dialogTitle = '新增共借人';
      let IssuedObject = {
        customerCode: this.where.customerCode,
        businessId: this.where.businessId
      };
      setTimeout(() => {
        this.$refs.Issued.getCustomerCodeList(IssuedObject);
      }, 1000);
    },
    //点击确定新增共借人
    addLoader() {
      //两个集合的并集
      let issueBusinessReqVos = this.where.issueBusinessReqVos;
      let checkedAddLoader = this.$refs.Issued.checkedAddLoader;
      let addLoader = issueBusinessReqVos;
      //获取共借人的可发标额度
      checkedAddLoader.forEach(x => {
        let customerName = x.customerName;
        let isNew = issueBusinessReqVos.every(y => {
          return y.customerName != customerName;
        });
        if (isNew) {
          addLoader.push(x);
        }
        this.queryBorrowLimit(x);
      });
      this.$set(this.where, 'issueBusinessReqVos', addLoader);
      this.dialogVisible = false;
    },
    //删除共借人
    deleteLoader(id) {
      let issueBusinessReqVos = this.where.issueBusinessReqVos;
      issueBusinessReqVos.splice(id, 1);
      this.$set(this.where, 'issueBusinessReqVos', issueBusinessReqVos);
    },
    /**
     * 第一还款来源
     * 个人-1 受雇人士-1 借款人工资收入/3 工资收入及经营所得
     * 个人-2 小微企业老板/3 个体工商户/ 4 自雇人士- 2 经营所得
     * 企业-经营所得
     */
    filterFirstSource(row) {
      let list = this.first_payment_source;
      let customerType = row.customerType;
      let professionalNature = row.professionalNatureCode;
      if (customerType == 'PERSON') {
        if (professionalNature == '1') {
          return list.filter(item => item.code == '1' || item.code == '3');
        } else if (professionalNature == '2' || professionalNature == '3' || professionalNature == '4') {
          return list.filter(item => item.code == '2');
        } else {
          return list;
        }
      } else {
        return list.filter(item => item.code == '2');
      }
    },
    /**
     * 第二还款来源
     * 4第三方担保公司提供连带责任保证担保/5 房产抵押+担保公司担保/ 6 车辆抵押+担保公司担保/ 7第三人担保+担保公司担保
     * 个人--信用标-4/7
     * 企业- 信用标-7
     *
     * 信用贷主标只能传4 共借人传4/7
     * 抵押贷主标只能传5 共借标只能传7
     */
    filterSecondSource(row) {
      let list = this.second_payment_source;
      let customerType = row.customerType;
      let professionalNature = row.professionalNatureCode;
      let isMainAddLoader = row.isMainAddLoader; //是否是主借款人
      if (this.type == 'credit_loan') {
        if (customerType == 'PERSON') {
          return list.filter(item => item.code == '4' || item.code == '7');
        } else {
          return list.filter(item => item.code == '7');
        }
      } else if (this.type == 'house_loan') {
        if (isMainAddLoader) {
          return list.filter(item => item.code == '5');
        } else {
          return list.filter(item => item.code == '7');
        }
      }
    },
    /**
     * 借款用途
     * 个人-1 受雇人士-第一还款来源(1 借款人工资收入)-消费类(1~6/11)
     * 个人-1 受雇人士-第一还款来源(3 工资收入及经营所得)-消费类/经营类(1~11)
     * 个人-2 小微企业老板/3 个体工商户/ 4 自雇人士-第一还款来源(2 经营所得)-消费类/经营类(1~11)
     * 企业-第一还款来源(2 经营所得)-经营类(7~11)
     */
    filterBorrowPurpose(row) {
      let list = this.borrow_purpose;
      let customerType = row.customerType;
      let professionalNature = row.professionalNatureCode;
      let firstPaymentSource = row.firstPaymentSource;

      if (!firstPaymentSource) {
        return list;
      }

      //消费类
      let consumeList = list.filter(item => (parseFloat(item.code) >= 1 && parseFloat(item.code) <= 6) || item.code == '11');
      //经营类
      let managementList = list.filter(item => parseFloat(item.code) >= 7 && parseFloat(item.code) <= 11);
      if (customerType == 'PERSON') {
        if (professionalNature == '1') {
          if (firstPaymentSource == '1') {
            return consumeList;
          }
          if (firstPaymentSource == '3') {
            return list;
          }
        } else {
          return list;
        }
      } else {
        return managementList;
      }
    },
    /**
     * *@date 2018-11-20 15:59:16
     * *@describe  获取费用计划
     */
    getInfoForCost(row) {
      let isValid = true;
      for (let i = 0; i < length; i++) {
        //验证上标金额

        this.$refs['issueAmount' + i].validate((valid, obj) => {
          if (valid) {
          } else {
            validScrollTop(obj);
            isValid = false;
            return false;
          }
        });
      }
      if (!isValid) {
        return false;
      }
      try {
        let _refs = this.$refs[row.customerCode][0];
        let customerCode = row.customerCode;
        let issueAmount = row.issueAmount;
        let applyLimit = this.where.applyLimit;
        let productCode = this.where.productCode;
        let productVersion = this.where.productVersion;
        let repaymentModeCode = this.where.repaymentModeCode;
        //用信申请--费用计划生成--需要贷款金额/产品编号 /产品版本/期数/还款方式编号
        if (issueAmount && applyLimit && productCode && productVersion && repaymentModeCode) {
          let params = {
            amount: issueAmount,
            periods: applyLimit,
            productCode: productCode,
            productVersion: productVersion,
            repaymentModeCode: repaymentModeCode
          };
          // console.log(params);
          _refs.createCostPlan(params, customerCode);
        } else {
          _refs.dealWithIssueApplyOutputList([], customerCode);
        }
      } catch (error) {}
    },
    handlerClickRow(row) {
      let issueBusinessReqVos = this.where.issueBusinessReqVos;
      let curIndex = '';
      issueBusinessReqVos.forEach((x, index) => {
        if (x.customerName == row.customerName) {
          curIndex = String(index);
        }
      });
      this.activeName = curIndex;
    },
    //点击当前tab,选择当前的table行
    handelTabClick(tab) {
      let issueBusinessReqVos = this.where.issueBusinessReqVos;
      let curRow = {};
      issueBusinessReqVos.forEach((x, index) => {
        if (x.customerName == tab.label && index == tab.index) {
          curRow = x;
        }
      });
      this.$refs.addLoader.setCurrentRow(curRow);
      // console.log(tab);
    },
    //查看银行卡信息
    bandCardInfo(row) {
      this.getBankCardInfoList(row);
      this.dialogVisible = true;
      this.dialogTitle = row.customerName + '的银行卡信息';
    },
    //获取银行卡信息
    getBankCardInfoList(row) {
      this.$api
        .getBankCardInfoList({
          customerCode: row.customerCode
        })
        .then(res => {
          if (res.returnCode == '0000') {
            if (res.data) {
              this.bankCardInfoList = res.data.list;
            }
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    //申请金额验证------必须小于授信剩余额度
    validatorApplyMoney(rule, value, callback) {
      let regex = new RegExp('^[0-9]+$');
      let residue = value / parseFloat(this.filterProductInfo.minLoanUnit);
      if (value === null || value === '') {
        return callback(new Error('申请金额不能为空!'));
      } else if (!regex.test(value)) {
        return callback(new Error('请输入正确的格式!'));
      } else if (value > this.filterProductInfo.maxLoanAmount || value < this.filterProductInfo.minLoanAmount) {
        return callback(new Error('申请金额必须在最小金额和最大金额之间'));
      } else if (!regex.test(residue)) {
        return callback(new Error('申请金额必须是单份金额的倍数'));
      } else {
        callback();
      }
    },
    //验证------近半年营业收入-出款金额
    validatorMoney(rule, value, callback) {
      if (!value) {
        return callback(new Error('金额不能为空!'));
      }
      let regex = new RegExp(/^[1-9]\d*$/);
      if (regex.test(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的格式,例:10000'));
      }
    },
    //验证表单
    validateForm() {
      let issueBusinessReqVos = this.where.issueBusinessReqVos;
      let length = issueBusinessReqVos.length;
      let isValid = true;
      for (let i = 0; i < length; i++) {
        //验证上标金额

        this.$refs['issueAmount' + i].validate((valid, obj) => {
          if (valid) {
          } else {
            validScrollTop(obj);
            isValid = false;
            return false;
          }
        });
        //第一还款来源
        this.$refs['firstPaymentSource' + i].validate((valid, obj) => {
          if (valid) {
          } else {
            validScrollTop(obj);
            isValid = false;
            return false;
          }
        });
        //第二还款来源
        this.$refs['secondPaymentSource' + i].validate((valid, obj) => {
          if (valid) {
          } else {
            validScrollTop(obj);
            isValid = false;
            return false;
          }
        });
        //借贷用途
        this.$refs['borrowPurposeCode' + i].validate((valid, obj) => {
          if (valid) {
          } else {
            validScrollTop(obj);
            isValid = false;
            return false;
          }
        });
        //近半年收入
        try {
          this.$refs['incomeHalfYear' + i].validate((valid, obj) => {
            if (valid) {
            } else {
              validScrollTop(obj);
              isValid = false;
              return false;
            }
          });
        } catch (error) {}

        //经营所得说明
        try {
          this.$refs['exceptWageIncomeExplain' + i].validate((valid, obj) => {
            if (valid) {
            } else {
              validScrollTop(obj);
              isValid = false;
              return false;
            }
          });
        } catch (error) {}
      }
      return isValid;
    },
    //是否可以删除借款人信息--修改是否显示主借款人信息
    isDeleteLoader(index) {
      let whetherDeleteBorrower = this.where.whetherDeleteBorrower;
      if (whetherDeleteBorrower) {
        return true;
      } else {
        if (index == 0) {
          return false;
        } else {
          return true;
        }
      }
    }
  },
  computed: {
    ...mapGetters(['localTheme', 'asideWidth', 'first_payment_source', 'second_payment_source', 'borrow_purpose']),
    changeCodeName() {
      return changeCodeName;
    },
    //过滤银行卡信息
    filterBankCardInfoList() {
      let bankCardInfoList = this.bankCardInfoList;
      let newArray = [];
      try {
        bankCardInfoList.forEach(x => {
          if (x.depositList.length) {
            if (x.depositList[0].platformType == 'tuandai') {
              newArray.push(x);
            }
            return false;
          }
        });
      } catch (error) {}
      return newArray;
    },

    //汇总费用
    filterIssueApplyOutputList() {
      let issueBusinessReqVos = this.where.issueBusinessReqVos;
      let newArray = [];
      let applyMoney = 0;
      try {
        issueBusinessReqVos.forEach((x, index) => {
          //汇总总申请额度
          if (x.issueAmount) {
            applyMoney += parseFloat(x.issueAmount);
          }
          //汇总费用
          if (x.issueApplyOutputList) {
            x.issueApplyOutputList.forEach((item, idx) => {
              let feeItemName, isOneTimeChargeName, isOnlineCharge, issueBusinessApplyoutputDetailList;
              if (index > 0) {
                item.issueBusinessApplyoutputDetailList.forEach((j, idJ) => {
                  newArray[idx].issueBusinessApplyoutputDetailList.forEach((h, idH) => {
                    h.feeValue += j.feeValue;
                  });
                });
              } else {
                feeItemName = item.feeItemName;
                isOneTimeChargeName = item.isOneTimeChargeName;
                isOnlineCharge = item.isOnlineCharge;
                issueBusinessApplyoutputDetailList = [];
                //-------
                item.issueBusinessApplyoutputDetailList.forEach((j, idJ) => {
                  issueBusinessApplyoutputDetailList.push({
                    feeName: j.feeName,
                    feeChargingTypeName: j.feeChargingTypeName,
                    feeRate: j.feeRate,
                    feeValue: j.feeValue
                  });
                });
                newArray.push({
                  feeItemName: item.feeItemName,
                  isOneTimeChargeName: item.isOneTimeChargeName,
                  isOnlineCharge: item.isOnlineCharge,
                  issueBusinessApplyoutputDetailList: issueBusinessApplyoutputDetailList
                });
              }
            });
          }
        });
      } catch (error) {}
      this.$set(this.where, 'applyMoney', applyMoney);
      return newArray;
    }
  }
};
</script>


<style lang="scss" scoped>
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

/deep/ .el-form-item__label {
  position: absolute;
  left: 3px;
}
/deep/ .el-form-item__error {
  position: relative;
}
</style>

