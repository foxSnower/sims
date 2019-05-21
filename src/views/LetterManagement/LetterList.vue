<template>
	<div class="ht-container">
    <OrderDataShowBlock :order="order"></OrderDataShowBlock>
		<HtBtnGroupAndSeartch rightBtnText="用信申请" rightIcon="fa-edit" @rightBtn="CreditApplication('选择授信结果')" :filterTable.sync="filterTable" :currentPage.sync="currentPage" placeholder="业务编号、产品类型、产品系列、客户名称"></HtBtnGroupAndSeartch>
		<el-table border stripe :data="myData" class="hongte-table" ref="myTable" v-loading="loading" highlight-current-row>
			<el-table-column fixed label="序号" align="center" type="index" width="55"></el-table-column>
			<el-table-column fixed label="订单信息" min-width="150">
				<template slot-scope="scope">
					<div class="table-cont">
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
						<p>{{ scope.row.phone |fiterPrivate('phone')}}</p>
						<p>{{ scope.row.cardNumber|fiterPrivate('identify') }}</p>
					</div>
					<div class="table-cont" v-if="scope.row.customerType=='ENTERPRISE'||scope.row.customerType=='OTHER_ORG'">
						<i :style="{color:themeColor}" class="customer-type fa fa-building-o"></i>
						<p style="padding-right:20px;">{{ scope.row.customerName }}</p>
						<p>{{ scope.row.unifiedSocialCreditCode|fiterPrivate('unitCode') }}</p>
						<p>{{ scope.row.legalPerson }}</p>
						<p>{{ scope.row.phone |fiterPrivate('phone') }}</p>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="贷款情况" min-width="150">
				<template slot-scope="scope">
					<div class="table-cont">
						<p class="ht-warning">￥ {{ scope.row.applyMoney }}</p>
						<p>{{ scope.row.applyLimit}} {{scope.row.periodsTypeName}}</p>
						<p>{{ scope.row.repaymentModeName }}</p>
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
				<!-- 0.初始状态, 1.已保存未提交,2.风控智审 3.审批中, 4.已完结, 5.注销,6.拒绝 -->
				<!-- 新: (0.草稿, 10.已保存未提交,20.风控智审 30.审批中, 31.审批驳回, 90.审批拒绝 , 99.注销申请, 100.已完结) -->
				<template slot-scope="scope">
					<!-- 待审中 -->
					<div v-if="scope.row.businessStatus=='20'||scope.row.businessStatus=='30'">
						<el-button size='mini' type='text' @click="goLetterTracking(scope.row)">
							<i class="fa fa-link"></i> 跟踪</el-button>
						<el-dropdown trigger='click' @command="handleCommand(arguments[0], scope.row)">
							<el-button size='mini' type='text'>
								<i class="fa fa-navicon"></i> 更多</el-button>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command='上传附件'> 上传附件 </el-dropdown-item>
								<!-- 审核进度大于0后不能撤回只能注销 -->
								<a :href="scope.row.contractFileUrl" download="下载合同">
									<!-- scope.row.hasDownloadContract=='Y'&&  -->
									<el-dropdown-item v-if="scope.row.contractStatus === '1'" command='下载合同'>下载合同 </el-dropdown-item>
								</a>
								<el-dropdown-item command='注销' v-if="parseFloat(scope.row.auditPercent)>=0"> 注销 </el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</div>
					<!-- 已审批/已撤回/已注销-->
					<div v-if="scope.row.businessStatus=='100'||scope.row.businessStatus=='99'||scope.row.businessStatus=='90'">
						<el-button size='mini' type='text' @click="goLetterTracking(scope.row)">
							<i class="fa fa-eye"></i> 查看</el-button>
						<a :href="scope.row.contractFileUrl" download="下载合同">
							<el-button size='mini' type='text' v-if="scope.row.hasDownloadContract=='Y'&&  scope.row.contractStatus === '1'">
								<i class="fa fa-download"></i>下载合同 </el-button>
						</a>
					</div>
					<!-- 草稿 -->
					<div v-if="scope.row.businessStatus=='0'||scope.row.businessStatus=='10'">
						<el-button size='mini' type='text' @click="goLetterApplication(scope.row)">
							<i class="fa fa-edit"></i> 编辑</el-button>
						<el-dropdown trigger='click' @command="handleCommand(arguments[0], scope.row)">
							<el-button size='mini' type='text'>
								<i class="fa fa-navicon"></i> 更多</el-button>
							<el-dropdown-menu slot="dropdown">
								<a :href="scope.row.contractFileUrl" download="下载合同">
									<el-dropdown-item command='下载合同' v-if="scope.row.hasDownloadContract=='Y'&&  scope.row.contractStatus === '1'"> 下载合同 </el-dropdown-item>
								</a>
								<el-dropdown-item command='删除'> 删除 </el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
						<!-- <el-button size='mini' type='text' @click="handleCommand('删除',scope.row)">
              <i class="fa fa-trash-o"></i> 删除</el-button> -->
					</div>
					<div v-if="scope.row.businessStatus=='31'">
						<el-button size='mini' type='text' @click="goLetterApplication(scope.row)">
							<i class="fa fa-edit"></i> 编辑</el-button>
						<el-dropdown trigger='click' @command="handleCommand(arguments[0], scope.row)">
							<el-button size='mini' type='text'>
								<i class="fa fa-navicon"></i> 更多</el-button>
							<el-dropdown-menu slot="dropdown">
								<a :href="scope.row.contractFileUrl" download="下载合同">
									<el-dropdown-item command='下载合同' v-if="scope.row.hasDownloadContract=='Y'&&  scope.row.contractStatus === '1'"> 下载合同 </el-dropdown-item>
								</a>
								<el-dropdown-item command='跟踪'> 跟踪 </el-dropdown-item>
								<el-dropdown-item command='删除'> 删除 </el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
						<!-- <el-button size='mini' type='text' @click="goLetterTracking(scope.row)">
              <i class="fa fa-eye"></i> 跟踪</el-button>
            <el-button size='mini' type='text' @click="handleCommand('删除',scope.row)">
              <i class="fa fa-trash-o"></i> 删除</el-button> -->
					</div>
				</template>
			</el-table-column>
		</el-table>

		<HtPage :total="total" :currentPage.sync="currentPage" :pageSize.sync="pageSize" @getData="getData"></HtPage>
		<!-- 弹出框 -->
		<el-dialog class="hongte-dialog" width="80%" ref="dialog" :visible.sync='dialog.visible' :title='dialog.title'>
			<SelectCreditResult v-if="dialog.title == '选择授信结果'" :postData="dialog.postData" @closeDialog="closeDialog"></SelectCreditResult>
		</el-dialog>
	</div>
</template>
<script>
import SelectCreditResult from '@htComponents/SelectCreditResult.vue'; //选择授信结果
import OrderDataShowBlock from '@htComponents/OrderDataShowBlock';
import HtProgressForStatus from '@htComponents/HtProgressForStatus';
import HtBtnGroupAndSeartch from '@htComponents/HtBtnGroupAndSeartch';
import HtPage from '@htComponents/HtPage';
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'CreditList',
  data() {
    return {
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
      filterTable: {},
      // dialog
      dialog: {
        visible: false,
        title: ''
      }
    };
  },
  components: { SelectCreditResult,OrderDataShowBlock, HtProgressForStatus, HtBtnGroupAndSeartch,HtPage },
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
      this.$api.yongxinGetList(params).then(res => {
        this.loading = false;
        if (res.returnCode == '0000') {
          this.total = res.count;
          this.myData = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
      this.$api.yongxinOrderStatistics({}).then(res => {
        if (res.returnCode == '0000') {
          this.order.todayTotal = res.data.todayTotal;
          this.order.allReviewTotal = res.data.allReviewTotal;
          this.order.monthFinishTotal = res.data.monthFinishTotal;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //
    closeDialog() {
      this.dialog.visible = false;
    },
    //点击订单编号---
    clickBusinessId(row) {
      //只有状态1是编辑,其他都是进入跟踪也或详情页
      if (row.businessStatus == '10') {
        this.goLetterApplication(row);
      } else {
        this.goLetterTracking(row);
      }
    },
    //跳转
    goTo(name, query) {
      if (!query) {
        this.$message.error('缺少索引id!');
      } else {
        this.$router.push({ name: name, query: { id: query, from: 'LetterList' } });
      }
    },
    goLetterApplication(row) {
      this.$router.push({
        name: 'LetterApplication',
        query: { id: row.id, from: 'LetterList', useCreditId: row.useCreditId, productCode: row.productCode }
      });
    },
    goLetterTracking(row) {
      this.$router.push({
        name: 'LetterTracking',
        query: { id: row.id, from: 'LetterList', useCreditId: row.useCreditId, productCode: row.productCode }
      });
    },
    //操作
    handleCommand(title, row) {
      switch (title) {
        case '删除':
          this.$confirm('确定执行删除操作？', '提示', {
            distinguishCancelAndClose: true,
            type: 'warning',
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.$api
              .yongxinDoDelete({
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
        case '注销':
          this.$confirm('确定执行注销操作？', '提示', {
            distinguishCancelAndClose: true,
            type: 'warning',
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.$api
              .yongxinDoCancel({
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
        case '撤回':
          this.$confirm('确定执行撤回操作？', '提示', {
            distinguishCancelAndClose: true,
            type: 'warning',
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.$api
              .yongxinDoRevoke({
                id: row.id
              })
              .then(res => {
                if (res.returnCode == '0000') {
                  this.getData();
                  this.$message.success('撤回成功!');
                } else {
                  this.$message.error(res.msg);
                }
              });
          });
          break;
        case '跟踪':
          this.goLetterTracking(row);
          break;
        case '上传附件':
          // this.goTo('LetterManagement', row.id);
          this.$router.push({
            name: 'LetterUpload',
            query: {
              id: row.id,
              productCode: row.productCode,
              customerType: row.customerType,
              from: 'LetterList',
              businessId: row.businessId
            }
          });

        default:
          break;
      }
    },
    //用信申请
    CreditApplication(title) {
      this.dialog.visible = true;
      this.dialog.title = title;
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
  .box {
    float: left;
    width: 33.3%;
    // margin-bottom: 20px;
    .box-card {
      margin: 0 8px;
      text-align: center;
      line-height: 1.8;
      p {
        color: #888;
      }
      h1 {
        font-size: 24px;
      }
    }
  }
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

