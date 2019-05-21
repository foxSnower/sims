<template>
  <div id="company" v-loading="loading">
    <el-card shadow='always'>
      <el-form :model='where' ref="where" size="small" :rules="companyRules" class='hongte-query-form f-flex is-clear' :inline='true' label-position="right" label-width="250px">
        <template v-if="isEdit">
          <el-form-item label='分公司名称' class="f-item2" prop="companyName">
            <el-input v-model='where.companyName' placeholder='请输入'></el-input>
          </el-form-item>
          <el-form-item label='分公司地址' class="f-item2" prop="companyAddress">
            <el-input v-model='where.companyAddress' placeholder='请输入'></el-input>
          </el-form-item>
          <el-form-item label='法人代表' class="f-item2" prop="legalPerson">
            <el-input v-model='where.legalPerson' placeholder='请输入'></el-input>
          </el-form-item>
          <el-form-item label='分公司电话' class="f-item2" prop="companyPhone">
            <el-input v-model='where.companyPhone' companyPhone='请输入'></el-input>
          </el-form-item>
          <el-form-item label='统一社会信用代码' class="f-item2" prop="unifiedSocialCreditCode">
            <el-input v-model='where.unifiedSocialCreditCode' placeholder='请输入'></el-input>
          </el-form-item>
          <el-form-item label='业务专用客服电话' class="f-item2" prop="businessPhone">
            <el-input v-model='where.businessPhone' placeholder='请输入'></el-input>
          </el-form-item>
          <el-form-item label='分公司所在地标准件房产最高负债率' class="f-item2" prop="highestDebtRatio">
            <el-input v-model='where.highestDebtRatio' maxlength="6" placeholder='请输入'></el-input>
          </el-form-item>
          <el-form-item label='团贷网对应GUID' class="f-item2">
            <el-input v-model='where.tuandaiGuid' companyPhone='请输入'></el-input>
          </el-form-item>
          <el-form-item label='分公司名称(合同)' class="f-item2" prop="companyNameContract">
            <el-input v-model='where.companyNameContract' placeholder='请输入'></el-input>
          </el-form-item>
          <el-form-item label='分公司地址(合同)' class="f-item2" prop="companyAddressContract">
            <el-input v-model='where.companyAddressContract' placeholder='请输入'></el-input>
          </el-form-item>
          <el-form-item label='分公司电话(合同)' class="f-item2" prop="companyPhoneContract">
            <el-input v-model='where.companyPhoneContract' placeholder='请输入'></el-input>
          </el-form-item>
          <el-form-item label='分公司抵押权人电子邮件地址(合同)' class="f-item2" prop="companyPledgeEmailContract">
            <el-input v-model='where.companyPledgeEmailContract' companyPhone='请输入'></el-input>
          </el-form-item>
          <el-form-item label='电子签章横向文' class="f-item2">
            <el-input v-model='where.horizontalText' companyPhone='请输入'></el-input>
          </el-form-item>
          <el-form-item label='电子签章下弦文' class="f-item2">
            <el-input v-model='where.thirdQuarterText' companyPhone='请输入'></el-input>
          </el-form-item>
        </template>
        <template v-else>
          <div class="f-item2">
            <label>分公司名称：</label>
            <p>
              <span>{{where.companyName}}</span>
            </p>
          </div>
          <div class="f-item2">
            <label>分公司地址：</label>
            <p>
              <span>{{where.companyAddress}}</span>
            </p>
          </div>
          <div class="f-item2">
            <label>法人代表：</label>
            <p>
              <span>{{where.legalPerson}}</span>
            </p>
          </div>
          <div class="f-item2">
            <label>分公司电话：</label>
            <p>
              <span>{{where.companyPhone}}</span>
            </p>
          </div>
          <div class="f-item2">
            <label>统一社会信用代码：</label>
            <p>
              <span>{{where.unifiedSocialCreditCode}}</span>
            </p>
          </div>
          <div class="f-item2">
            <label>业务专用客服电话：</label>
            <p>
              <span>{{where.businessPhone}}</span>
            </p>
          </div>
          <div class="f-item2">
            <label>分公司所在地标准件房产最高负债率：</label>
            <p>
              <span>{{where.highestDebtRatio}}</span>
            </p>
          </div>

          <div class="f-item2">
            <label>团贷网对应GUID：</label>
            <p>
              <span>{{where.tuandaiGuid}}</span>
            </p>
          </div>

          <div class="f-item2">
            <label>分公司名称(合同)：</label>
            <p>
              <span>{{where.companyNameContract}}</span>
            </p>
          </div>
          <div class="f-item2">
            <label>分公司地址(合同)：</label>
            <p>
              <span>{{where.companyAddressContract}}</span>
            </p>
          </div>
          <div class="f-item2">
            <label>分公司电话(合同)：</label>
            <p>
              <span>{{where.companyPhoneContract}}</span>
            </p>
          </div>
          <div class="f-item2">
            <label>分公司抵押权人电子邮件地址(合同)：</label>
            <p>
              <span>{{where.companyPledgeEmailContract}}</span>
            </p>
          </div>

          <div class="f-item2">
            <label>电子签章横向文：</label>
            <p>
              <span>{{where.horizontalText}}</span>
            </p>
          </div>
          <div class="f-item2">
            <label>电子签章下弦文：</label>
            <p>
              <span>{{where.thirdQuarterText}}</span>
            </p>
          </div>
        </template>
      </el-form>
      <el-row class="bottom-btn">
        <template v-if="isEdit">
          <el-button size="small" type="primary" @click="save()">保存</el-button>
          <el-button size="small" type="primary" @click="reset()">重置</el-button>
          <el-button size="small" @click="handleCancel()">取消</el-button>
        </template>
        <template v-else>
          <el-button size="small" type="primary" @click="edit()">编辑</el-button>
        </template>
      </el-row>
    </el-card>
    <el-button style="margin-top:20px;" type="primary" size="small" @click="addEdit()">
      <i class="el-icon-plus"></i> 新增</el-button>
    <el-table border stripe :data="myData" class="hongte-table" highlight-current-row style="margin-top:20px;">
      <el-table-column label="序号" align="center" type="index" width="55" min-width="200"></el-table-column>
      <el-table-column label="用户名称" min-width="200" prop="accountName">
        <template slot-scope="scope">
          <span>{{scope.row.accountName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="银行卡号码" min-width="200" prop="bankCard">
        <template slot-scope="scope">
          <span>{{scope.row.bankCard|filtersBankAccount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开户银行" min-width="200" prop="bankName">
        <template slot-scope="scope">
          <span>{{scope.row.bankName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开户银行支行" min-width="200" prop="openName">
        <template slot-scope="scope">
          <span>{{scope.row.openName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否是还款账户" min-width="200" prop="intermediaryAccount">
        <template slot-scope="scope">
          <template>
            <p v-if="scope.row.intermediaryAccount">是</p>
            <p v-else>否</p>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="是否是居间费账户" min-width="200" prop="retuenAccount">
        <template slot-scope="scope">
          <template>
            <p v-if="scope.row.retuenAccount">是</p>
            <p v-else>否</p>
          </template>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="180">
        <template slot-scope="scope">
          <template>
            <el-button size='mini' type='text' @click="handleEdit(scope.row)">
              <i class="fa fa-edit"></i> 编辑</el-button>
            <el-button size='mini' type='text' @click.native.prevent="handleDelete(scope.$index,scope.row)">
              <i class="fa fa-trash-o"></i> 删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="hongte-dialog" width="50%" :visible.sync='dialogTable.visible' :title='dialogTable.title'>
      <el-form :model="tableInfo" ref="tableForm" size="small" :rules="CompanyAccountListRules" class='hongte-query-form' :inline='true' label-position="right" label-width="150px">
        <HtInput class="f-item2" label='用户名称' prop="accountName" v-model='tableInfo.accountName'></HtInput>
        <HtInput class="f-item2" label='银行卡号码' prop="bankCard" v-model.trim='tableInfo.bankCard' @change="getBankBin(tableInfo.bankCard)" @input="tableInfo.bankCard = validateNum(tableInfo.bankCard)" maxlength=23></HtInput>
        <HtSelect class="f-item2" label='开户银行' prop="bankCode" type="bank" v-model="tableInfo.bankCode" :name.sync="tableInfo.bankName"></HtSelect>
        <HtInput class="f-item2" label='开户银行支行' prop="openName" v-model='tableInfo.openName'></HtInput>
        <HtSelect class="f-item2" label='是否是还款账户' prop="intermediaryAccount" type="is_data" v-model="tableInfo.intermediaryAccount"></HtSelect>
        <HtSelect class="f-item2" label='是否是居间费账户' prop="retuenAccount" type="is_data" v-model="tableInfo.retuenAccount"></HtSelect>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTable.visible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BIN from 'bankcardinfo';
import { companyRules, CompanyAccountListRules } from '@rules';
import HtInput from '@components/HtInput';
import HtSelect from '@components/HtSelect';
export default {
  name: 'CompanyAccountList',
  data() {
    return {
      dialogTable: {
        visible: false,
        title: '标题'
      },
      //收集的表单信息
      tableInfo: {},

      companyRules: companyRules,
      CompanyAccountListRules: CompanyAccountListRules,

      loading: false,
      oldData: {},
      where: {},
      myData: [],
      whereParams: {},
      myDataParams: [],

      isEdit: false
    };
  },
  components: {
    HtInput,
    HtSelect
  },
  beforeMount() {
    this.$nextTick(() => {
      this.getData();
    });
  },
  methods: {
    getData() {
      this.loading = true;
      this.$api.getCompanyDetail({}).then(res => {
        this.loading = false;
        if (res.returnCode == '0000') {
          this.where = res.data.companyInfo;
          this.myData = res.data.companyAccount;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    edit() {
      this.isEdit = true;
      this.oldData = Object.assign({}, this.where);
    },
    //重置
    reset() {
      this.$refs.where.resetFields();
      this.where = Object.assign({}, this.oldData);
    },
    save() {
      let params = Object.assign({}, this.where);
      this.$refs.where.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$api.updateCompanyInfo(params).then(res => {
            this.loading = false;
            if (res.returnCode == '0000') {
              this.isEdit = false;
              this.$message.success('修改成功！');
              this.getData();
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    //取消编辑分公司信息
    handleCancel() {
      this.isEdit = false;
      this.$refs.where.resetFields();
      this.where = Object.assign({}, this.oldData);
    },
    //删除table行
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除条数据, 是否继续?', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$api
          .deleteCompanyAccount({
            accountCode: row.accountCode
          })
          .then(res => {
            if (res.returnCode == '0000') {
              this.$message.success('删除成功！');
              // this.getData();
              this.myData.splice(index, 1);
            } else {
              this.$message.error(res.msg);
            }
          });
      });
    },
    //保存编辑
    handleSave() {
      //判断是否有未填项，都填了可以保存
      let tableInfo = this.tableInfo;
      console.log(tableInfo);
      
      let _vm = this;
      this.$refs.tableForm.validate(valid => {
        console.log(valid);
        if (valid) {
          tableInfo.bankCard = _vm.Trim(tableInfo.bankCard);
          _vm.$api.addOrModifyCompanyAccount(tableInfo).then(res => {
            if (res.returnCode == '0000') {
              _vm.dialogTable.visible = false;
              _vm.$message.success('操作成功!');
              _vm.getData();
            } else {
              _vm.$message.error(res.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    //编辑行
    handleEdit(row) {
      this.dialogTable.visible = true;
      this.dialogTable.title = '修改银行信息';
      let tableInfo = row;
      this.tableInfo = Object.assign({}, tableInfo);
    },
    //添加编辑
    addEdit() {
      // debugger
      this.dialogTable.visible = true;
      this.dialogTable.title = '新增银行信息';
      let tableInfo = {};
      tableInfo = {
        companyCode: this.where.companyCode,
        accountName: '',
        bankCard: '',
        bankName: '',
        openName: '',
        intermediaryAccount: false,
        retuenAccount: false
      };
      this.tableInfo = Object.assign({}, tableInfo);
      //重置校验规则
      if (this.$refs.tableForm) {
        this.$refs.tableForm.clearValidate();
      }
    },
    getBankBin(bankCard) {
      // debugger;
      let _vm = this;
      bankCard = this.Trim(bankCard);
      BIN.getBankBin(bankCard)
        .then(function(data) {
          _vm.$set(_vm.tableInfo, 'bankName', data.bankName);
          _vm.$set(_vm.tableInfo, 'bankCode', data.bankCode);
        })
    },
    Trim(str, is_global) {
      var result;
      is_global = is_global ? is_global : 'g';
      result = str.replace(/(^\s+)|(\s+$)/g, '');
      if (is_global.toLowerCase() == 'g') {
        result = result.replace(/\s/g, '');
      }
      return result;
    },
    //格式化银行号码
    validateNum(bankCard) {
      bankCard = bankCard
        .replace(/\s/g, '')
        .replace(/[^\d]/g, '')
        .replace(/(\d{4})(?=\d)/g, '$1 ');
      return bankCard;
    }
  }
};
</script>

<style lang="scss" scoped>
// #company {
.hongte-query-form {
  &.f-flex {
    .f-item2 {
      width: 50%;
      float: left;
      line-height: 38px;
      label {
        display: inline-block;
        width: 250px;
        text-align: right;
        text-align: right;
        float: left;
        font-size: 14px;
        color: #606266;
        line-height: 40px;
        padding: 0 12px 0 0;
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
      }
    }
  }
}
// }

.bottom-btn {
  width: 100%;
  text-align: center;
  padding-top: 20px;
}
</style>

