<template>
  <div style="margin-bottom: 30px;">
    <el-collapse-item class="collapse-head" title="出款信息" name="3">
      <el-form :model='where' ref="formName2" size="small" :rules="rules" class='hongte-query-form f-flex is-clear' :inline='true' label-position="right" label-width="120px">
        <el-form-item label='债权人、借款人' prop="lenderId" class="f-item">
          <el-select v-model='where.lenderId' placeholder='请选择' @change="where.lenderName = changeCodeName(where.lenderId,['value','label'],getNodeListCreditorPledgee)">
            <el-option v-for="(x,index) in getNodeListCreditorPledgee" :key="index" :label='x.label' :value='x.value'></el-option>
          </el-select>
        </el-form-item>
        <div class="f-item">
          <label>所属分公司全称：</label>
          <p><span>{{where.companyName}}</span></p>
        </div>
        <div class="f-item">
          <label>分公司地址：</label>
          <p><span>{{where.companyAddress}}</span></p>
        </div>
        <div class="f-item">
          <label>法人代表：</label>
          <p><span>{{where.legalName}}</span></p>
        </div>
        <div class="f-item">
          <label>联系电话：</label>
          <p><span>{{where.legalTelephone}}</span></p>
        </div>
      </el-form>
      <!-- 出款计划 -->

      <el-button type="primary" size="small" @click="addOutMoney">
        <i class="el-icon-plus"></i> 新增出款计划</el-button>
      <el-table border stripe :data="where.outputListVos" ref="addLoader" class="hongte-table" highlight-current-row>
        <el-table-column fixed type="index" align="center" label="序号" width="50"></el-table-column>
        <el-table-column label="出款计划名称" min-width="120">
          <template slot-scope="scope">
            <p>{{`出款计划 ${scope.row.outputId=scope.$index+1}`}}</p>
          </template>
        </el-table-column>
        <el-table-column label="计划出款日期" min-width="120">
          <template slot-scope="scope">
            <el-form :model="scope.row" :ref="'outputTime'+scope.$index" size="small">
              <el-form-item prop="outputTime" label=' ' :rules="[
                { required: true,message:'请选择计划出款日期'},
              ]">
                <el-date-picker value-format="yyyy-MM-dd" type="date" placeholder="选择日期" v-model="scope.row.outputTime" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="计划出款金额(元)" min-width="120">
          <template slot-scope="scope">
            <el-form :model="scope.row" :ref="'outputMoney'+scope.$index" size="small">
              <el-form-item prop="outputMoney" label=' ' :rules="[
                { required: true,validator:validatorMoney},
              ]">
                <el-input v-model="scope.row.outputMoney"></el-input>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button v-if="scope.$index!==0" type="text" size="small" @click.stop="deleteOutMoney(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 担保主体信息 -->
      <el-form :model='where' ref="formName3" size="small" :rules="rules" class='hongte-query-form f-flex is-clear' :inline='true' label-position="right" label-width="120px" :disabled="where.guaranteeMain==null">
        <div class="f-item1" style="margin-bottom:20px;">
          <label>担保主体信息：</label>
          <p><span>{{where.guaranteeMain|filterNull}}</span></p>
        </div>
        <HtInput class="f-item" label='担保人主体联系人' prop="relationName" v-model="where.relationName" maxlength=25></HtInput>
        <HtInput class="f-item" label='担保地址' prop="relationAddress" v-model="where.relationAddress" maxlength=25></HtInput>
        <HtInput class="f-item" label='担保联系电话' prop="relationTelephone" v-model="where.relationTelephone" maxlength=25></HtInput>
        <HtInput class="f-item" label='担保邮箱' prop="relationEmail" v-model="where.relationEmail" maxlength=25></HtInput>

      </el-form>
      <el-table v-show="houseMortgageList.length" :data="houseMortgageList" :show-header="false" border style="width: 100%">
        <el-table-column fixed type="index" align="center" label="序号" width="50"></el-table-column>
        <el-table-column label="抵押物" min-width="120">
          <template slot-scope="scope">
            <p>{{`抵押物信息 ${scope.row.outputId=scope.$index+1}`}}</p>
            <p class="ht-warning">{{`共 ${houseMortgageList.length} 个抵押物`}}</p>
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
            <el-form :model="scope.row" :ref="'houseMortgageList'+scope.$index" label-width="120px" size="small">
              <el-form-item label="抵押人信息填写" prop="pledgorInfo" class="f-item1" style="display:initial" :rules="[
                { required: true,message:'请选择抵押人信息填写'},
              ]">
                <el-radio-group v-model="scope.row.pledgorInfo">
                  <el-radio label="0">房管所有要求只能填写房产证登记的权属人</el-radio>
                  <el-radio label="1">房管所无特殊要求,按公司要求需填写隐性共有人</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="暂作价填写" prop="temporarilyPriceInfo" class="f-item1" style="display:initial" :rules="[
                { required: true, validator:temporarilyPriceInfo,message:'请选择暂作价填写'},
              ]">
                <el-radio-group v-model="scope.row.temporarilyPriceInfo" @change="handleChangePrice(arguments[0],scope.row)">
                  <el-radio label="0">房管所有特殊要求,暂不填写,待合同打印后再填写</el-radio>
                  <el-radio label="1">房管所有特殊要求,能确定暂作价为：</el-radio>
                  <el-input style="width:200px;" prop="houseProvisionalPrice" v-model="scope.row.houseProvisionalPrice" :disabled="scope.row.temporarilyPriceInfo!='1'"></el-input>
                  <el-radio label="2">按(所有抵押顺位的债权金额总和+本次借款金额)*1.2 倍与房产评估总价对比,取较大值填写</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
    </el-collapse-item>
    <el-collapse-item class="collapse-head" title="合同信息" name="4" style="padding-bottom: 20px;">
      <el-form :model='where' ref="formName3" size="small" :rules="rules" class='hongte-query-form f-flex is-clear' :inline='true' label-position="right" label-width="120px">
        <el-form-item label='合同签订日期' prop="signTime" class="f-item1">
          <el-date-picker style="width:250px;" :editable="false" value-format="yyyy-MM-dd" v-model="where.signTime" type="date" placeholder="请选择">
          </el-date-picker>
        </el-form-item>
        <el-form-item label='抵押物抵押方式' prop="pledgeType" class="f-item1">
          <el-radio-group v-model="where.pledgeType">
            <el-radio label="0" style="text-indent: 0;padding-top: 0;">集中抵押（生成同一份借款抵押合同）</el-radio>
            <el-radio label="1" style="text-indent: 0;padding-top: 0;">单独抵押（生成一份总借款抵押合同，多份（抵押物个数）子借款抵押合同）</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="f-item">
          <label>统一社会信用代码：</label>
          <p><span>{{where.uniteCode}}</span></p>
        </div>
        <div class="f-item">
          <label>电子签章横向文：</label>
          <p><span>{{where.horizontalText}}</span></p>
        </div>
        <div class="f-item">
          <label>电子签章下弦文：</label>
          <p><span>{{where.cosText}}</span></p>
        </div>
        <div class="f-item">
          <label>还款账户名：</label>
          <p><span>{{where.returnAccountName}}</span></p>
        </div>
        <div class="f-item">
          <label>还款开户支行：</label>
          <p><span>{{where.returnBankName}}</span></p>
        </div>
        <div class="f-item">
          <label>还款账号：</label>
          <p><span>{{where.returnAccountNo}}</span></p>
        </div>
        <div class="f-item">
          <label>居间费账户名：</label>
          <p><span>{{where.midAccountName}}</span></p>
        </div>
        <div class="f-item">
          <label>居间费开户支行：</label>
          <p><span>{{where.midBankName}}</span></p>
        </div>
        <div class="f-item">
          <label>居间费账号：</label>
          <p><span>{{where.midAccountNo}}</span></p>
        </div>
      </el-form>
    </el-collapse-item>
  </div>
</template>

<script>
import HtInput from '@components/HtInput';
import { validScrollTop, changeCodeName } from '@utils';
export default {
  name: 'InfoForContractAndOutMoneyForTemplateC',
  data() {
    return {
      //债权人、借款人
      getNodeListCreditorPledgee: [],
      //抵押物
      houseMortgageList: []
    };
  },
  components: {
    HtInput
  },
  watch: {
    where: function(newVal) {
      this.$emit('input', newVal);
    },
    businessId: function(cur) {
      if (cur != '' && cur != null) {
        this.getHouseMortgageList();
      }
    }
  },
  props: ['where', 'rules', 'isSub'],
  mounted() {
    this.$nextTick(() => {
      // this.getCompanyInfo();
      this.getNodeList();
    });
  },
  methods: {
    //用信申请--通过userId查询分公司及其账户详情
    getCompanyInfo() { 
      this.$api.getCompanyInfoDetailByUserId({}).then(res => {
        if (res.returnCode == '0000') {
          let companyInfo = res.data.companyInfo;
          let companyAccount = res.data.companyAccount;
          this.$set(this.where, 'companyName', companyInfo.companyNameContract); //所属分公司全称
          this.$set(this.where, 'companyAddress', companyInfo.companyAddressContract); //分公司地址
          this.$set(this.where, 'legalName', companyInfo.legalPerson); //法人代表
          this.$set(this.where, 'legalTelephone', companyInfo.companyPhone); //联系电话
          this.$set(this.where, 'uniteCode', companyInfo.unifiedSocialCreditCode); //统一社会信用代码
          this.$set(this.where, 'horizontalText', companyInfo.horizontalText); //电子签章横向文
          this.$set(this.where, 'cosText', companyInfo.thirdQuarterText); //电子签章下弦文
          if (companyAccount.length !== 0) {
            companyAccount.forEach(x => {
              if (x.retuenAccount) {
                this.$set(this.where, 'returnAccountName', x.accountName); //还款账户名
                this.$set(this.where, 'returnBankName', x.openName); //还款开户支行
                this.$set(this.where, 'returnAccountNo', x.bankCard); //还款账号
              }
              if (x.intermediaryAccount) {
                this.$set(this.where, 'midAccountName', x.accountName); //居间费账户名
                this.$set(this.where, 'midBankName', x.openName); //居间费开户支行
                this.$set(this.where, 'midAccountNo', x.bankCard); //居间费账号
              }
            });
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //债权人、借款人
    getNodeList() {
      this.$api.getNodeListCreditorPledgee({}).then(res => {
        if (res.returnCode == '0000') {
          this.getNodeListCreditorPledgee = res.data;
        } else {
          this.$message.error(re.msg);
        }
      });
    },
    //获取抵押物信息
    getHouseMortgageList() {
      let businessId = this.businessId;
      this.$api
        .getHouseMortgageList({
          businessId: 'YXCL001201811230003'
        })
        .then(res => {
          if (res.returnCode == '0000') {
            this.houseMortgageList = res.data;
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    initList() {
      let _list = this.houseMortgageList;
      if (_list) {
        let houseInfo = {
          houseProvisionalPrice: null,
          id: null,
          pledgorInfo: null,
          temporarilyPriceInfo: null
        };
        _list.forEach(x => {
          this.$set(_list, 'houseMortgageSaveVo', houseInfo);
        });
      }
    },
    //验证temporarilyPriceInfo
    temporarilyPriceInfo(rule, value, callback, houseProvisionalPrice) {
      if (value == null || value == '') {
        return callback(new Error('暂作价不能为空!'));
      } else if (value == '1') {
        let houseMortgageList = this.houseMortgageList;
        houseMortgageList.forEach(x => {
          if (x.temporarilyPriceInfo == '1') {
            if (x.houseProvisionalPrice == '' || x.houseProvisionalPrice == null) {
              return callback(new Error('请输入正确的格式!'));
            }
          }
        });
        callback();
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
      let outputListVos = this.where.outputListVos;
      let isValid = true;
      //出款信息/合同信息
      for (let i = 2; i < 4; i++) {
        this.$refs['formName' + i].validate((valid, obj) => {
          if (valid) {
          } else {
            validScrollTop(obj);
            isValid = false;
            return false;
          }
        });
      }
      //抵押物信息
      let houseMortgageListLength = this.houseMortgageList.length;

      for (let j = 0; j < houseMortgageListLength; j++) {
        this.$refs['houseMortgageList' + j].validate((valid, obj) => {
          if (valid) {
          } else {
            validScrollTop(obj);
            isValid = false;
            return false;
          }
        });
      }

      try {
        let length = outputListVos.length;
        for (let m = 0; m < length; m++) {
          //计划出款日期
          this.$refs['outputTime' + m].validate((valid, obj) => {
            if (valid) {
            } else {
              validScrollTop(obj);
              isValid = false;
              return false;
            }
          });
          //计划出款金额
          this.$refs['outputMoney' + m].validate((valid, obj) => {
            if (valid) {
            } else {
              validScrollTop(obj);
              isValid = false;
              return false;
            }
          });
        }
      } catch (error) {}
      return isValid;
    },
    //新增出款计划
    addOutMoney() {
      let outputListVos = this.where.outputListVos;
      if (!outputListVos) {
        this.$set(this.where, 'outputListVos', []);
      }
      this.where.outputListVos.push({
        outputTime: '',
        outputMoney: ''
      });
    },
    //删除出款计划
    deleteOutMoney(id) {
      let outputListVos = this.where.outputListVos;
      outputListVos.splice(id, 1);
    },
    //暂作价改变
    handleChangePrice(value, row) {
      if (value != '1') {
        row.houseProvisionalPrice = '';
      }
    }
  },
  computed: {
    changeCodeName() {
      return changeCodeName;
    },
    businessId() {
      return this.where.businessId;
    },
    isDisable() {
      return this.isSub;
    }
  }
};
</script>

<style lang="scss" scoped>
.f-flex {
  margin: 20px;
  .f-item {
    float: left;
  }
  label {
    text-indent: 20px;
    display: inline-block;
    // width: 250px;
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
.hongte-table {
  /deep/ .el-form-item__label {
    position: absolute;
    left: 3px;
  }
}
</style>


