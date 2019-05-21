<template>
  <div>
    <el-button-group class="selec-btn">
      <el-input size="small" class="search-input" v-model.trim="keyword" @keyup.enter.native="changeType()" placeholder="请输入内容">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </el-button-group>
    <el-table border stripe :data="myData" class="hongte-table" v-loading="loading" highlight-current-row @current-change="setCurrentRow" :row-class-name="tableRowClassName">
      <el-table-column fixed label="序号" align="center" type="index" width="55"></el-table-column>
      <el-table-column label="授信结果编号" min-width="150" prop="resultBusinessId"></el-table-column>
      <el-table-column label="客户名称" min-width="100" prop="customerName"></el-table-column>
      <el-table-column label="客户类型" prop="customerType" min-width="100">
        <template slot-scope="scope">
          <p v-if="scope.row.customerType=='PERSON'">个人客户</p>
          <p v-else>企业客户</p>
        </template>
      </el-table-column>
      <el-table-column label="企业法人" prop="legalPerson" min-width="100"></el-table-column>
      <el-table-column label="联系方式" min-width="100" prop="phone">
        <template slot-scope="scope">
          <p>{{scope.row.phone|fiterPrivate('phone')}}</p>
        </template>
      </el-table-column>
      <el-table-column label="授信单号" min-width="180">
        <template slot-scope="scope">
          <span>{{scope.row.businessId}}</span>
        </template>
      </el-table-column>
      <el-table-column label="授信产品" min-width="100" prop="productName"></el-table-column>
      <el-table-column label="授信额度" min-width="100" prop="creditQuota"></el-table-column>
      <el-table-column fixed="right" label="额度有效期" min-width="100" prop="quotaExpireTime"></el-table-column>
    </el-table>
    <div class='hongte-Pagination'>
      <el-pagination background @current-change='handleCurrentChange' @size-change="handleSizeChange" :current-page='currentPage' :page-size="pageSize" :page-sizes="[10, 20, 30, 40]" :total='total' layout='total, sizes, prev, pager, next, jumper'>
      </el-pagination>
    </div>
    <el-row class="bottom-btn">
      <el-button type="primary" @click="goToApply(row)">确定</el-button>
      <el-button @click="close">关闭</el-button>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { isEmpty, checkDate } from '@utils';
export default {
  name: '',
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
      keyword: '',
      myData: [],
      where: {},
      row: {}
    };
  },
  props: ['postData'],
  watch: {
    where: {
      //注意：当观察的数据为对象或数组时，curVal和oldVal是相等的，因为这两个形参指向的是同一个数据对象
      handler(curVal, oldVal) {
        console.log(curVal);
        this.getData();
      },
      deep: true
    },
    postData(val) {
      this.getData();
    }
  },
  beforeMount() {
    this.$nextTick(() => {
      this.getData();
    });
  },
  methods: {
    getData() {
      this.loading = true;
      let params = Object.assign(
        {},
        {
          page: this.currentPage,
          limit: this.pageSize,
          query: {
            customerCode: this.postData ? this.postData.customerCode : ''
          }
        },
        this.where
      );
      this.$api.creditResultGetList(params).then(res => {
        this.loading = false;
        if (res.returnCode == '0000') {
          this.total = res.count;
          this.myData = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    goToApply(row) {
      console.log(row);
      if (isEmpty(row)) {
        this.$message.error('请先选择一条数据!');
      } else {
        if (row.quotaExpireTime) {
          this.$router.push({ name: 'LetterApplication', query: { id: row.creditResultId, productCode: row.productCode } });
          this.$emit('closeDialog',false);
        } else {
          this.$message.error('额度已过期!');
        }
      }
    },
    //选择的行内信息
    setCurrentRow(row) {
      this.row = row;
    },
    close() {
      this.$emit('closeDialog');
    },
    //切换类型
    changeType() {
      this.$set(this.where, 'keyword', this.keyword);
    },
    // 翻页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getData();
    },
    //每页显示的页数发生变化的时候
    handleSizeChange(size) {
      this.pageSize = size;
      this.getData();
    },
    tableRowClassName({ row, rowIndex }) {
      // console.log(checkDate(row.quotaExpireTime), rowIndex);
      if (!checkDate(row.quotaExpireTime)) {
        row.isExpireTime = true;
        return 'info-row';
      } else {
        row.isExpireTime = false;
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
.selec-btn {
  float: right;
  margin: 10px 0;
}
.search-input {
  width: 200px;
  margin-left: 20px;
}
.ht-link {
  cursor: pointer;
}
.bottom-btn {
  text-align: center;
}
</style>
