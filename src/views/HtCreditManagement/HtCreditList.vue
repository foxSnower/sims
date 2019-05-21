<template>
  <div class="ht-container">
    <HtBtnGroupAndSeartch rightBtnText="业务申请" rightIcon="fa-edit"  @rightBtn="dialogVisible=true" :filterTable.sync="filterTable" :currentPage.sync="currentPage" placeholder="客户名称、手机号码、证件号码"></HtBtnGroupAndSeartch>
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
          <div class="table-cont">
            <i :style="{color:themeColor}" class="customer-type fa fa-user-o"></i>
            <p style="padding-right:20px;">{{ scope.row.customerName }}</p>
            <p>{{ scope.row.phone|fiterPrivate('phone') }}</p>
            <p>{{ scope.row.cardNumber|fiterPrivate('identify')}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="授信编号" min-width="150">
        <template slot-scope="scope">
          <div class="table-cont">
            <h1 v-if="scope.row.refBusinessNo" :style="{color:themeColor}" @click.stop="clickRefBusinessId(scope.row)">{{ scope.row.refBusinessNo }}</h1>
            <p v-else>-</p>
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
          <div v-if="scope.row.businessStatus=='20'||scope.row.businessStatus=='30'">
            <el-button size='mini' type='text' @click="$router.push({ name: 'HtCreditTracking', query: { id: scope.row.id}})">
              <i class="fa fa-link"></i> 跟踪</el-button>
            <el-button size='mini' type='text' @click="handleCommand('注销', scope.row)">
              <i class="fa fa-link"></i> 注销</el-button>
          </div>
          <div v-if="scope.row.businessStatus=='100'||scope.row.businessStatus=='99'||scope.row.businessStatus=='90'">
            <el-button size='mini' type='text' @click="$router.push({ name: 'HtCreditTracking', query: { id: scope.row.id}})">
              <i class="fa fa-eye"></i> 查看</el-button>
          </div>
          <div v-if="scope.row.businessStatus=='0'||scope.row.businessStatus=='10'">
            <el-button size='mini' type='text' @click="handleCommand('编辑', scope.row)">
              <i class="fa fa-edit"></i> 编辑</el-button>
            <el-button size='mini' type='text' @click="handleCommand('删除',scope.row)">
              <i class="fa fa-trash-o"></i> 删除</el-button>

          </div>
          <div v-if="scope.row.businessStatus=='31'">
            <el-button size='mini' type='text' @click="handleCommand('编辑', scope.row)">
              <i class="fa fa-edit"></i> 编辑</el-button>
            <el-button size='mini' type='text' @click="$router.push({ name: 'HtCreditTracking', query: { id:scope.row.id}})">
              <i class="fa fa-eye"></i> 跟踪</el-button>
            <el-button size='mini' type='text' @click="handleCommand('删除',scope.row)">
              <i class="fa fa-trash-o"></i> 删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class='hongte-Pagination'>
      <el-pagination background @current-change='handleCurrentChange' @size-change="handleSizeChange" :current-page='currentPage' :page-size="pageSize" :page-sizes="[5 ,10, 20, 30, 40]" :total='total' layout='total, sizes, prev, pager, next, jumper'>
      </el-pagination>
    </div>
    <!-- 业务申请 -->
    <el-dialog class="hongte-dialog" width="600px" :visible.sync='dialogVisible' title='业务申请'>
      <HtApplication @closeDialog="closeDialog" @getData="getData"  :postData="postData"></HtApplication>
    </el-dialog>
  </div>
</template> 
<script>
import { mapGetters, mapMutations } from 'vuex';
import { changeCodeName } from '@utils';
import { HtApplicationRules } from '@rules';
import HtApplication from './HtCreditApplicationSteps/HtApplication';
import HtProgressForStatus from '@htComponents/HtProgressForStatus';
import HtBtnGroupAndSeartch from '@htComponents/HtBtnGroupAndSeartch';

export default {
  name: 'HtCreditList',
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
      dialogVisible: false,
      postData: {}
    };
  },
  components: {
    HtApplication,
    HtProgressForStatus,
    HtBtnGroupAndSeartch
  },
  watch: {
    filterTable: {
      //注意：当观察的数据为对象或数组时，curVal和oldVal是相等的，因为这两个形参指向的是同一个数据对象
      handler(curVal, oldVal) {
        this.getData();
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getData();
    });
  },
  methods: {
    reject(id) {
      this.$confirm('是否拒绝?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
        .then(() => {
          this.$api.prototypeManageReject({ id: id, type: '2' }).then(res => {
            if (res.returnCode == '0000') {
              this.$message({
                message: '操作消息',
                type: 'success'
              });
              this.getData();
            } else {
              this.$message.error(res.msg);
            }
            this.loading = false;
          });
        })
        .catch(() => {});
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
      this.$api.preContractInfoGetList(params).then(res => {
        this.loading = false;
        if (res.returnCode == '0000') {
          this.total = res.count;
          this.myData = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //点击订单编号
    clickBusinessId(row) {
      //只有状态0  10是编辑,其他都是进入跟踪也或详情页
      // this.handleCommand('编辑', row);
      if (row.businessStatus == '0' || row.businessStatus == '10' || row.businessStatus == '31') {
        this.handleCommand('编辑', row);
      } else {
        this.$router.push({ name: 'HtCreditTracking', query: { id: row.id } });
      }
    },
    //点击授信编号
    clickRefBusinessId(row) {
      this.$router.push({ name: 'CreditTracking', query: { id: row.refBusinessId } });
    },
    // //切换类型
    // changeType(type) {
    //   //  this.currentPage = 1;
    //   this.$set(this.filterTable, 'query', { status: type });
    //   this.$set(this.filterTable, 'keyword', this.keyword);
     
    // },
    // 翻页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getData();
    },
    // 每页显示的页数发生变化的时候
    handleSizeChange(size) {
      this.pageSize = size;
      this.getData();
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
              .preContractInfoDelete({
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
              .preContractInfoCancelProcess({
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
        case '编辑':
          this.postData = {};
          this.postData = row;
          this.dialogVisible = true;
          break;
        default:
          break;
      }
    },

    closeDialog() {
      this.dialogVisible = false;
    }
  },
  computed: {
    ...mapGetters(['localTheme', 'product_type', 'product_series', 'product_list']),
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
</style>

