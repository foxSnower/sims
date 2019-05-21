<template>
  <div>
    <HtBtnGroupAndSeartchForCustomer :filterTable.sync="filterTable" :currentPage.sync="currentPage" placeholder="客户名称、手机号码、证件号码"></HtBtnGroupAndSeartchForCustomer>
    <el-table border stripe :data="myData" class="hongte-table" v-loading="loading" highlight-current-row style="margin-top:0;">
      <el-table-column fixed label="序号" align="center" type="index" width="55" ></el-table-column>
      <el-table-column fixed label="客户名称" min-width="150" prop="customerName"></el-table-column>
      <el-table-column label="客户类型" min-width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.customerType=='PERSON'">个人客户</span>
          <span v-if="scope.row.customerType=='ENTERPRISE'">企业客户</span>
          <!-- <span v-if="scope.row.customerType=='OTHER_ORG'">其它组织</span> -->
        </template>
      </el-table-column>
      <el-table-column label="企业法人" min-width="150">
        <template slot-scope="scope">
          <span>{{scope.row.enterpriseLegalPerson==null||scope.row.enterpriseLegalPerson==""?'-':scope.row.enterpriseLegalPerson}}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" min-width="150" prop="phone"></el-table-column>

      <el-table-column label="客户负责人" min-width="150" prop="salesUserName"></el-table-column>
      <el-table-column label="客户描述" min-width="150" prop="organizationRemark"></el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button size='mini' type='text' @click="handleCommand(scope.row.customerType=='PERSON'?'编辑个人客户信息':'编辑客户信息',scope.row)">
            <i class="fa fa-edit"></i> 编辑</el-button>
          <el-dropdown trigger='click' @command='handleCommand(arguments[0],scope.row)'>
            <el-button size='mini' type='text'>
              <i class="fa fa-navicon"></i> 更多</el-button>
            <el-dropdown-menu slot='dropdown'>
              <el-dropdown-item command='授信申请' v-if="scope.row.customerType=='PERSON'"> 授信申请</el-dropdown-item>
              <el-dropdown-item command='选择授信结果' v-if="scope.row.customerType=='PERSON'"> 用信申请 </el-dropdown-item>
              <el-dropdown-item command='管理共借人' v-if="scope.row.customerType=='PERSON'"> 管理共借人 </el-dropdown-item>
              <el-dropdown-item command='管理银行卡'> 管理银行卡 </el-dropdown-item>
              <el-dropdown-item command='变更客户名称'> 变更客户名称 </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.customerType=='ENTERPRISE'||scope.row.customerType=='OTHER_ORG'" command='变更法人手机号'> 变更法人手机号 </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.customerType=='PERSON'" command='变更客户手机号'> 变更客户手机号 </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.customerType=='PERSON'" command='变更客户证件号'> 变更客户证件号 </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 页码 -->
    <HtPage :total="total" :currentPage.sync="currentPage" :pageSize.sync="pageSize" @getData="getData"></HtPage>
    <!-- 弹出框 -->
    <el-dialog class="hongte-dialog" :width="dialogWidth" ref="dialog" :visible.sync='dialog.visible' :title='dialog.title' v-if="dialog.visible">
      <CustomeModifyForPerson v-if="dialog.title == '编辑个人客户信息'" :postData="dialog.postData" @closeDialog="closeDialog" @getData="getData()"></CustomeModifyForPerson>
      <CustomeModifyForEnterprise v-if="dialog.title == '编辑客户信息'" :postData="dialog.postData" @closeDialog="closeDialog" @getData="getData()"></CustomeModifyForEnterprise>
      <CustomeModifyForCustomerName v-if="dialog.title == '变更客户名称'" :postData="dialog.postData" @closeDialog="closeDialog" @getData="getData()"></CustomeModifyForCustomerName>
      <CustomeModifyForLegalPhone v-if="dialog.title == '变更法人手机号'" :postData="dialog.postData" @closeDialog="closeDialog" @getData="getData()"></CustomeModifyForLegalPhone>
      <CustomeModifyForCustomerPhone v-if="dialog.title == '变更客户手机号'" :postData="dialog.postData" @closeDialog="closeDialog" @getData="getData()"></CustomeModifyForCustomerPhone>
      <CustomeModifyForCustomerNumber v-if="dialog.title == '变更客户证件号'" :postData="dialog.postData" @closeDialog="closeDialog" @getData="getData()"></CustomeModifyForCustomerNumber>
      <SelectCreditResult v-if="dialog.title == '选择授信结果'" :postData="dialog.postData" @closeDialog="closeDialog"></SelectCreditResult>
      <BorrowerList v-if="dialog.title == '管理共借人'" :postData="dialog.postData" @closeDialog="closeDialog"></BorrowerList>
    </el-dialog>
  </div>
</template>

<script>
import CustomeModifyForPerson from './CustomeModify/CustomeModifyForPerson.vue'; //个人信息修改
import CustomeModifyForEnterprise from './CustomeModify/CustomeModifyForEnterprise.vue'; //企业信息修改
import CustomeModifyForCustomerName from './CustomeModify/CustomeModifyForCustomerName.vue'; //变更客户名称
import CustomeModifyForLegalPhone from './CustomeModify/CustomeModifyForLegalPhone.vue'; //变更法人手机号
import CustomeModifyForCustomerPhone from './CustomeModify/CustomeModifyForCustomerPhone.vue'; //变更客户手机号
import CustomeModifyForCustomerNumber from './CustomeModify/CustomeModifyForCustomerNumber.vue'; //变更客户证件号
import SelectCreditResult from '@htComponents/SelectCreditResult.vue'; //选择授信结果
import HtBtnGroupAndSeartchForCustomer from '@htComponents/HtBtnGroupAndSeartchForCustomer';//查询条件
import HtPage from '@htComponents/HtPage';//查询条件
import BorrowerList from './Borrower/BorrowerList.vue'; //变更客户证件号

import { setLocalStorage, getLocalStorage, delLocalStorage, changeCodeName } from '@utils';
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'CustomeList',
  data() {
    return {
      // loading
      loading: false,
      // 当前分页
      currentPage: 1,
      // 每页显示条数
      pageSize: 10,
      // 分页总数
      total: 0,
      myData: [],
      // 搜索的关键词
      keyword: '',
      //传参
      filterTable: {},
      // dialog
      dialog: {
        visible: false,
        title: '',
        // 编辑的列表
        postData: []
      }
    };
  },
  components: {
    CustomeModifyForPerson,
    CustomeModifyForEnterprise,
    CustomeModifyForCustomerName,
    CustomeModifyForLegalPhone,
    CustomeModifyForCustomerPhone,
    CustomeModifyForCustomerNumber,
    SelectCreditResult,
    HtBtnGroupAndSeartchForCustomer,
    HtPage,
    BorrowerList
  },
  mounted() {
    this.$nextTick(() => {
      this.getData();
    });
  },
  watch: {
    filterTable: {
      //注意：当观察的数据为对象或数组时，curVal和oldVal是相等的，因为这两个形参指向的是同一个数据对象
      handler(curVal, oldVal) {
        console.log(curVal);
        this.getData();
      },
      deep: true
    }
  },
  methods: {
    //获取数据
    getData() {
      this.loading = true;
      this.myData = [];
      let params = Object.assign(
        {},
        {
          page: this.currentPage,
          limit: this.pageSize,
          query: {}
        },
        this.filterTable
      );
      this.$api.getCustemerListBySalesperson(params).then(res => {
        this.loading = false;
        if (res.returnCode == '0000') {
          if (res.data) {
            this.myData = res.data.results;
            this.total = res.data.total;
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //操作
    handleCommand(title, row) {
      switch (title) {
        case '授信申请':
          this.$router.push({ name: 'CreditApplication' });
          let step1 = {
            card_number: row.cardNumber,
            card_type: row.cardType,
            certificate_type_name: row.certificateTypeName,
            customer_type: row.customerType,
            customer_name: row.customerName
          };
          //个人或企业
          if (step1.customer_type == 'PERSON') {
            step1.phone = row.phone;
          } else {
            step1.company_legal_person = row.enterpriseLegalPerson;
            step1.unified_code = row.unifiedCode;
            step1.phone = row.phone;
          }
          setLocalStorage('step1', step1);
          break;
        case '管理银行卡':
          this.$router.push({
            path: 'BankCardManagement',
            query: {
              customerCode: row.customerCode,
              customerName: row.customerName,
              customerType: row.customerType,
              cardType:row.cardType
            }
          });
          break;
        default:
          this.dialog.visible = true;
          this.dialog.title = title;
          this.dialog.postData = row;
          break;
      }
    },
    closeDialog() {
      this.dialog.visible = false;
      //  this.$set(this.$parent.dialog,'visible',false);
    }
  },
  computed: {
    ...mapGetters(['localTheme']),
    themeColor() {
      return this.localTheme.themeColor;
    },
    dialogWidth() {
      if (this.dialog.title == '编辑个人客户信息' || this.dialog.title == '编辑客户信息' || this.dialog.title == '选择授信结果' ) {
        return '80%';
      } else {
        return '500';
      }
    }
  }
};
</script>


<style lang="scss" scoped>
.selec-btn {
  float: right;
  margin: 10px 0;
}
.search-input {
  width: 220px;
  margin-left: 20px;
}
.ht-link {
  cursor: pointer;
}
</style>
