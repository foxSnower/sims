<template>
  <div class="ht-container">
    <HtBtnGroupAndSeartchForPrototype :filterTable.sync="filterTable" :currentPage.sync="currentPage" placeholder="单号、客户名称、产品名称"></HtBtnGroupAndSeartchForPrototype>
    <el-table border stripe :data="myData" class="hongte-table" ref="myTable" v-loading="loading" highlight-current-row>
      <el-table-column fixed label="序号" align="center" type="index" width="55"></el-table-column>
      <el-table-column fixed label="申请编号" min-width="150">
        <template slot-scope="scope">
          <div class="table-cont">
            <p>{{ scope.row.applyNo }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="客户名称" min-width="120">
        <template slot-scope="scope">
          <div class="table-cont">
            <p>{{ scope.row.customerName }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="客户类型" min-width="120">
        <template slot-scope="scope">
          <div class="table-cont">
            <p>{{ scope.row.customerType|fiterCustomerType }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" min-width="120">
        <template slot-scope="scope">
          <div class="table-cont">
            <p>{{ scope.row.phone |fiterPrivate('phone')}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="证件类型" min-width="120">
        <template slot-scope="scope">
          <div class="table-cont">
            <p>{{ scope.row.cardTypeName }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="证件号码" min-width="180">
        <template slot-scope="scope">
          <div class="table-cont">
            <p>{{ scope.row.cardNumber|fiterPrivate('identify') }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="产品类型名称" min-width="150">
        <template slot-scope="scope">
          <div class="table-cont">
            <p>{{ scope.row.productTypeName }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="产品系列名称" min-width="150">
        <template slot-scope="scope">
          <div class="table-cont">
            <p>{{ scope.row.productSeriesName }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" min-width="150">
        <template slot-scope="scope">
          <div class="table-cont">
            <p>{{ scope.row.productName }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="业务来源" min-width="120">
        <template slot-scope="scope">
          <div class="table-cont">
            <p>{{ scope.row.source | filterSource }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="处理状态" min-width="120">
        <template slot-scope="scope">
          <div class="table-cont">
            <p>{{ scope.row.status | filterStatus }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="业务获取人" min-width="150">
        <template slot-scope="scope">
          <div class="table-cont">
            <p>{{ scope.row.originalName }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="业务获取人所属分公司" min-width="180">
        <template slot-scope="scope">
          <div class="table-cont">
            <p>{{ scope.row.originalBranchName }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="180">

        <template slot-scope="scope">
          <el-button v-if="scope.row.status=='0'" size='mini' type='text' @click="openDialog(scope.row.id)">
            <i class="fa fa-eye"></i> 分配
          </el-button>
          <el-button v-if="scope.row.status=='0'" size='mini' type='text' @click="reject(scope.row.id)">
            <i class="fa fa-eye"></i> 拒绝
          </el-button>
        </template>

      </el-table-column>
    </el-table>
    <el-dialog class="hongte-dialog" width="500px" :visible.sync='dialog.visible' :title='dialog.title'>
      <el-form :model='fpdata' size="small" :rules="formRules" class='hongte-query-form' :inline='true' ref="fpdata" label-position="right" label-width="120px">
        <el-form-item label='机构' class="f-item1" prop="originalBranchCode">
          <el-select v-model='fpdata.originalBranchCode' filterable placeholder='请选择机构' @change="getOriginal">
            <el-option :key="k" v-for="(v,k) in orgData" :label='v.businessOrgName' :value='v.businessOrgCode'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='人员' class="f-item1" prop="originalId">
          <el-select v-model='fpdata.originalId' filterable placeholder='请选择人员' @change="getPersonName">
            <el-option :key="k" v-for="(v,k) in personData" :label='v.userName' :value='v.userId'></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="prototypeManageDistribution">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 页码 -->
    <HtPage :total="total" :currentPage.sync="currentPage" :pageSize.sync="pageSize" @getData="getData"></HtPage>
  </div>
</template>


<script>
import HtBtnGroupAndSeartchForPrototype from '@htComponents/HtBtnGroupAndSeartchForPrototype'; //查询条件
import HtPage from '@htComponents/HtPage';//查询条件
import { mapGetters, mapMutations } from 'vuex';
import { validator } from '@utils';

export default {
  name: '',
  data() {
    return {
      formRules: {
        originalId: [{ required: true, message: '必填项', trigger: 'change' }],
        originalBranchCode: [{ required: true, message: '必填项', trigger: 'change' }]
      },
      dialog: {
        visible: false,
        title: '分配'
      },
      isShowOtherSearch: false,
      otherSearchForm: {},
      myData: [],
      // 当前分页
      currentPage: 1,
      // 每页显示条数
      pageSize: 10,
      // 分页总数
      total: 0,
      filterText: '',
      data2: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      loading: true,
      fpdata: {},
      orgData: [],
      personData: [],
      rowKey: 'id',
      filterTable:{}
    };
  },
  components: {
    HtBtnGroupAndSeartchForPrototype,
    HtPage
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
  beforeMount() {
    this.$nextTick(() => {
      this.getData();
      this.getBusiOrgList();
    });
  },
  filters: {
    filterStatus(value) {
      switch (value) {
        case '-2': {
          return '已拒绝';
        }
        case '-1': {
          return '已取消';
        }
        case '0': {
          return '待处理';
        }
        case '1': {
          return '已转业务';
        }
      }
      return '';
    },
    filterSource(value) {
      switch (value) {
        case 'WECHAT': {
          return '微信';
        }
        case 'APP': {
          return 'APP';
        }
      }
      return '';
    }
  },
  methods: {
    openDialog(id) {
      this.dialog.visible = true;
      this.fpdata = { id: id };
      let that = this;
      setTimeout(function() {
        that.$refs['fpdata'].clearValidate();
      }, 0);
    },
    getPersonName() {
      let obj = {};
      obj = this.personData.find(item => {
        return item.userId === this.fpdata.originalId;
      });
      this.fpdata.originalName = obj.userName;
    },
    getOriginal() {
      this.$api.getUserListByBusiOrg({ busiOrgCode: this.fpdata.originalBranchCode }).then(res => {
        if (res.returnCode == '0000') {
          this.personData = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
      let obj = {};
      obj = this.orgData.find(item => {
        return item.businessOrgCode === this.fpdata.originalBranchCode;
      });
      this.fpdata.originalBranchName = obj.businessOrgName;
    },
    prototypeManageDistribution() {
      this.$refs.fpdata.validate(valid => {
        if (valid) {
          this.$api.prototypeManageDistribution(this.fpdata).then(res => {
            if (res.returnCode == '0000') {
              this.$message.success('分配成功!');
              this.$set(this.dialog, 'visible', false);
              this.getData();
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    getBusiOrgList() {
      this.$api.getBusiOrgList().then(res => {
        if (res.returnCode == '0000') {
          this.orgData = res.data;
        } else {
          this.$message.error(res.msg);
        }
        this.loading = false;
      });
    },
    reject(id) {
      this.$confirm('是否拒绝?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.$api.prototypeManageReject({ id: id, type: '1' }).then(res => {
            if (res.returnCode == '0000') {
              this.$message({
                message: '拒绝成功!',
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
    //跳转
    goTo(name, query) {
      console.log(name, query);
      this.$router.push({ name: name, query: { bussId: query } });
    },
    getData() {
      let params = Object.assign(
        {},
        {
          page: this.currentPage,
          limit: this.pageSize
        },
        this.filterTable
      );
      this.$api.queryPrototypeManage(params).then(res => {
        if (res.returnCode == '0000') {
          this.total = parseInt(res.count);
          this.myData = res.data;
        } else {
          this.$message.error(res.msg);
        }
        this.loading = false;
      });
    },
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
.ht-container {
  margin-left: 20px;
  flex: 1;
  .hongte-table {
    width: 100%;
  }
  .aside-btn {
    .buss-btn {
      float: left;
    }
    .selec-btn {
      float: right;
    }
    .search-input {
      width: 200px;
      margin-left: 20px;
    }
  }
  .search-form {
    margin-top: 20px;
  }
}
</style>
