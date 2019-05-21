<template>
  <div class="ht-container">
    <OrderDataShowBlock :order="order"></OrderDataShowBlock>
    <HtBtnGroupAndSeartch rightBtnText="授信申请" centreBtnText="查询可发表额度" centreIcon="el-icon-search" rightIcon="fa-edit" @rightBtn="$router.push({ name:'CreditApplication'})" :filterTable.sync="filterTable" :currentPage.sync="currentPage" placeholder="业务编号、产品类型、产品系列、客户名称"></HtBtnGroupAndSeartch>
    <el-table border stripe :data="myData" class="hongte-table" ref="myTable" v-loading="loading" highlight-current-row>
      <el-table-column fixed label="序号" align="center" type="index" width="55"></el-table-column>
      <el-table-column fixed label="订单信息" min-width="150">
        <template slot-scope="scope">
          <div class="table-cont">
            <!-- <el-button size='mini' type='text' @click="clickBusinessId(scope.row)">{{scope.row.businessId }}</el-button> -->
            <h1 :style="{color:themeColor}" @click.stop="clickBusinessId(scope.row)">{{ scope.row.businessId }}</h1>
            <p>{{ scope.row.productTypeName }}</p>
            <p>{{ scope.row.productName }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="客户信息" min-width="150">
        <template slot-scope="scope">
          <div class="table-cont" v-if="scope.row.customerType=='PERSON'">
            <i :style="{color:themeColor}" class="customer-type fa fa-user-o"></i>
            <p style="padding-right:20px;">{{ scope.row.customerName }}</p>
            <p>{{ scope.row.phone|fiterPrivate('phone') }}</p>
            <p>{{ scope.row.cardNumber| fiterPrivate('identify')}}</p>
          </div>
          <div class="table-cont" v-else>
            <i :style="{color:themeColor}" class="customer-type fa fa-building-o"></i>
            <p style="padding-right:20px;">{{ scope.row.customerName }}</p>
            <p>{{ scope.row.unifiedCode|fiterPrivate('unitCode') }}</p>
            <p>{{ scope.row.legalPerson }}</p>
            <p>{{ scope.row.phone|fiterPrivate('phone') }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="受理人信息" min-width="150">
        <template slot-scope="scope">
          <div class="table-cont">
            <p>{{ scope.row.createUserName }}</p>
            <p>{{ scope.row.createBranchName }}</p>
            <p>{{ scope.row.createDatetime }}</p>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="业务进度" min-width="150">
        <template slot-scope="scope">
          <HtProgressForStatus :row="scope.row"></HtProgressForStatus>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-tag type="info">{{scope.row.businessStatus|businessStatusName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <!-- 0.初始状态, 1.已保存未提交,2.风控智审 3.审批中, 4.已完结, 5.注销,6.拒绝 -->
          <template v-for="(item,index) in scope.row.operations">
            <el-button v-if="!item.moreOperations" :key="index" size='mini' type='text' @click="handleCommand(item.code, scope.row);">
              <i class="fa " :class="item.icon"></i> {{item.name}}</el-button>
            <el-dropdown v-else trigger='click' :key="index" @command="handleCommand(arguments[0], scope.row)">
              <el-button size='mini' type='text'>
                <i class="fa fa-navicon"></i> 更多</el-button>
              <el-dropdown-menu slot="dropdown">
                <template v-for="(y,idY) in item.moreOperations">
                  <el-dropdown-item v-if="y.code!='DOWNLOAD_CONTRACT'" :key="idY" :command='y.code'> {{y.name}} </el-dropdown-item>
                  <a v-if="y.code=='DOWNLOAD_CONTRACT'" :key="idY" :href="scope.row.contractFileUrl" download="下载合同">
                    <el-dropdown-item command='下载合同'> 下载合同 </el-dropdown-item>
                  </a>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <HtPage :total="total" :currentPage.sync="currentPage" :pageSize.sync="pageSize" @getData="getData"></HtPage>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :width="dialogTitle=='填写驳回信息'?'500px':'80%'">
      <template v-if="dialogTitle=='填写驳回信息'">
        <el-form :model='dialogForm' ref="formName" size="small" :rules="rules" class='hongte-query-form form-width' :inline='true' label-position="right" label-width="120px">
          <HtInput class="f-item1" type="textarea" label='审批意见' prop="reason" v-model="dialogForm.reason"></HtInput>
          <el-form-item label='驳回节点' prop="nodeCode" class="f-item1">
            <el-select filterable v-model='dialogForm.nodeCode' placeholder='请选择'>
              <el-option v-for="(x,index) in approvedNodeList" :key="index" :label='x.currentNode' :value='x.nodeCode'></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit(dialogForm);dialogVisible = false">确 定</el-button>
        </span>
      </template>
      <template v-if="dialogTitle=='多次推标'">
        <el-table border stripe :data="getNonPushIssueDataList" class="hongte-table" ref="myTable" v-loading="loading" highlight-current-row @selection-change="handleSelectionChange">
          <el-table-column fixed type="selection" align="center" label="序号" width="50" ></el-table-column>
          <el-table-column label="标号" prop="issueNo" min-width="150"></el-table-column>
          <el-table-column label="上标金额" prop="issueAmount" min-width="150"></el-table-column>
          <el-table-column label="借款利率" prop="applyRate" min-width="150"></el-table-column>
          <el-table-column label="客户名称" prop="customerName" min-width="150"></el-table-column>
          <el-table-column label="客户类型" prop="customerType" min-width="150">
            <template slot-scope="scope">
              <p>{{scope.row.customerType|fiterCustomerType}}</p>
            </template>
          </el-table-column>
          <el-table-column label="标的类型" prop="issueidType" min-width="150">
            <template slot-scope="scope">
              <p v-if="scope.row.issueidType=='1'">主借标</p>
              <p v-if="scope.row.issueidType=='0'">共借标</p>
            </template>
          </el-table-column>
          <el-table-column label="期数类型名称" prop="periodsTypeName" min-width="150"></el-table-column>
          <el-table-column label="还款方式名称" prop="repaymentModeName" min-width="150"></el-table-column>
          <el-table-column label="借款用途名称" prop="borrowPurposeName" min-width="150"></el-table-column>
          <el-table-column label="第二还款来源名称" prop="secondPaymentSourceName" min-width="150"></el-table-column>
          <el-table-column label="近半年营业收入" prop="incomeHalfYear" min-width="150"></el-table-column>
          <el-table-column label="除工资外的经营所得说明" prop="exceptWageIncomeExplain" min-width="150"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitIssue();dialogVisible = false">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import { changeCodeName } from '@utils';
import OrderDataShowBlock from '@htComponents/OrderDataShowBlock';
import HtProgressForStatus from '@htComponents/HtProgressForStatus';
import HtBtnGroupAndSeartch from '@htComponents/HtBtnGroupAndSeartch';
import HtPage from '@htComponents/HtPage';
import HtInput from '@components/HtInput';
import HtSelect from '@components/HtSelect';
import LetterApplication from '@views/LetterManagement/LetterApplication';
export default {
  name: 'CreditList',
  data() {
    return {
      //未上标列表
      getNonPushIssueDataList: [],
      issueBusinessId:'',
      //驳回节点列表
      approvedNodeList: [],
      dialogTitle: '',
      dialogForm: {},
      dialogVisible: false,
      rules: {
        reason: [{ required: true, message: '请输入审批意见', trigger: 'blur' }],
        nodeCode: [{ required: true, message: '请选择驳回节点', trigger: 'change' }]
      },
      // 数据列表
      myData: [],
      // loading
      loading: false,
      // 当前分页
      currentPage: 1,
      // 每页显示条数
      pageSize: 5,
      // 分页总数
      total: 0,
      //订单数量
      order: {
        todayTotal: '',
        allReviewTotal: '',
        monthFinishTotal: ''
      },
      filterTable: {}
    };
  },
  components: {
    OrderDataShowBlock,
    HtProgressForStatus,
    HtBtnGroupAndSeartch,
    HtPage,
    HtInput,
    HtSelect,
    LetterApplication
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

  mounted() {
    this.$nextTick(() => {
      this.getData();
      this.initData();
    });
  },
  methods: {
    //切换check
    handleSelectionChange(row) {
      let getNonPushIssueDataList = this.getNonPushIssueDataList;
      getNonPushIssueDataList.forEach((x, index) => {
        this.$set(x, 'pushIssueState', '0');
      });
      row.forEach((y, idY) => {
        this.$set(y, 'pushIssueState', '1');
      });
    },
    //多次推标提交
    submitIssue() {
      let getNonPushIssueDataList = this.getNonPushIssueDataList;
      let issueIds = [];
      getNonPushIssueDataList.forEach((x, index) => {
        if (x.pushIssueState == '1') {
          issueIds.push(x.issueId);
        }
      });
      this.$api
        .multipleIssueCommit({
          businessId:this.issueBusinessId,
          issueIds
        })
        .then(res => {
          if (res.returnCode == '0000') {
            this.$message.success('提交成功');
          } else {
            this.$message.erroe(res.msg);
          }
        });
    },
    //驳回提交
    submit(dialogForm) {
      let currentNode = changeCodeName(dialogForm.nodeCode, ['nodeCode', 'currentNode'], this.approvedNodeList);
      let params = {
        id: dialogForm.id,
        nodeCode: dialogForm.nodeCode,
        currentNode: currentNode,
        reason: dialogForm.reason
      };
      this.$api.submitReject(params).then(res => {
        if (res.returnCode == '0000') {
          this.$message.success('驳回成功');
          this.getData();
          this.initData();
        }
      });
    },
    getData() {
      this.loading = true;
      // axios
      let params = Object.assign(
        {},
        {
          page: this.currentPage,
          limit: this.pageSize,
          query: {}
        },
        this.filterTable
      );
      console.log(this.currentPage, this.filterTable, params);

      this.$api.creditGetList(params).then(res => {
        this.loading = false;
        if (res.returnCode == '0000') {
          this.total = res.count;
          this.myData = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    initData() {
      this.$api.creditOrderStatistics({}).then(res => {
        if (res.returnCode == '0000') {
          this.order.todayTotal = res.data.todayTotal;
          this.order.allReviewTotal = res.data.allReviewTotal;
          this.order.monthFinishTotal = res.data.monthFinishTotal;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //点击订单编号
    clickBusinessId(row) {
      let isHt = 'Y';
      if (row.productCode != 'P20181012001') {
        isHt = 'N';
      }
      //只有状态0  10是编辑,其他都是进入跟踪也或详情页
      if (row.businessStatus == '0' || row.businessStatus == '10' || row.businessStatus == '31') {
        this.$router.push({ name: 'CreditApplication', query: { id: row.id, customerType: row.customerType, from: 'CreditList', isHt: isHt } });
      } else {
        this.$router.push({ name: 'CreditTracking', query: { id: row.id } });
      }
    },
    //操作
    handleCommand(code, row) {
      switch (code) {
        case 'DELETE':
          this.$confirm('确定执行删除操作？', '提示', {
            distinguishCancelAndClose: true,
            type: 'warning',
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.$api
              .creditDoDelete({
                id: row.id
              })
              .then(res => {
                if (res.returnCode == '0000') {
                  this.getData();
                  this.$message.success('删除成功!');
                } else {
                  this.$message.error(res.msg);
                }
              });
          });
          break;
        case 'REFUSED':
          this.$confirm('是否拒绝?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          })
            .then(() => {
              this.$api.prototypeManageReject({ id: row.id, type: '2' }).then(res => {
                if (res.returnCode == '0000') {
                  this.$message.success('操作消息!');
                  this.getData();
                } else {
                  this.$message.error(res.msg);
                }
                this.loading = false;
              });
            })
            .catch(() => {});
          break;
        case 'CANCEL':
          this.$confirm('确定执行注销操作？', '提示', {
            distinguishCancelAndClose: true,
            type: 'warning',
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.$api
              .creditDoCancel({
                id: row.id
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
          break;
        case 'UPLOAD_FILE':
          row.steps = 2;
          this.$router.push({ name: 'Steps3', query: { id: row.id, customerType: row.customerType, from: 'CreditList', active: row.steps, productCode: row.productCode, businessId: row.businessId } });
          break;
        case 'PAYMENT_EDITOR': //出款编辑
          this.$router.push({ name: 'paymentEdit', query: { id: row.id, productCode: row.productCode } });
          break;
        case 'REJECTED': //驳回
          this.dialogVisible = true;
          this.dialogTitle = '填写驳回信息';
          this.dialogForm = row;
          this.$api
            .queryRejectApprovedNode({
              id: row.id
            })
            .then(res => {
              this.approvedNodeList = res.data;
            });
          break;
        case 'PUSH_ISSUE': //多次推标
          this.dialogVisible = true;
          this.dialogTitle = '多次推标';
          this.issueBusinessId = row.businessId;
          this.$api
            .getNonPushIssueData({
              businessId: row.businessId
            })
            .then(res => {
              this.getNonPushIssueDataList = res.data;
            });
          break;
        case 'TRACK': //跟踪
          this.clickBusinessId(row);
          break;
        case 'VIEW':
          this.$router.push({ name: 'CreditTracking', query: { id: row.id } });
          break;
        case 'EDIT':
          this.clickBusinessId(row);
          break;
        case 'PAYMENT_DETAIL': //出款详情
          this.$router.push({ name: 'PaymentTracking', query: { id: row.id, productCode: row.productCode, from: 'CreditList', useCreditId: row.useCreditId } });
          break;
        default:
          break;
      }
    }
  },
  computed: {
    ...mapGetters(['localTheme']),
    themeColor() {
      return this.localTheme.themeColor;
    }
  }
};
</script>


<style lang="scss" scoped>
// @import '~@/sass/theme';
.ht-container {
  overflow: hidden;
  // width: 100%;
  // margin: 10px 0;

  .table-cont {
    .customer-type {
      position: absolute;
      top: 15px;
      right: 10px;
    }
    h1 {
      font-weight: 700;
      cursor: pointer;
    }
  }
}
a {
  text-decoration: none;
}
</style>

