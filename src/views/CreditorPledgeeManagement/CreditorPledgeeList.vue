<template>
  <div id="company" v-loading="loading">
    <div class="aside-btn is-clear">
      <el-row class="buss-btn">
        <el-button size="small" type="primary" @click="addEdit(myData)" icon="fa fa-edit"> 新增</el-button>
      </el-row>
      <el-button-group class="selec-btn">
        <el-input v-model.trim="keyword" size="small" class="search-input" placeholder="请输入内容" @keyup.enter.native="changeType('null')">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-button-group>
    </div>
    <el-table border stripe :data="myData" class="hongte-table" highlight-current-row>
      <el-table-column label="序号" align="center" type="index" width="55" min-width="200"></el-table-column>
      <el-table-column label="名称" min-width="120" prop="name"></el-table-column>
      <el-table-column label="类型" min-width="100" prop="type">
        <template slot-scope="scope">
          <p v-if="scope.row.type=='1'">个人客户</p>
          <p v-if="scope.row.type=='2'">企业客户</p>
        </template>
      </el-table-column>
      <!-- <el-table-column label="创建人" min-width="150" prop="createUserName"></el-table-column>
      <el-table-column label="创建人机构名称" min-width="150" prop="createOrgName"></el-table-column>
      <el-table-column label="创建人机构编号" min-width="150" prop="createOrgCode"></el-table-column> -->
      <el-table-column label="法人" min-width="100" prop="legalPerson">
         <template slot-scope="scope">
          <p>{{scope.row.legalPerson?scope.row.legalPerson:'-'}}</p>
        </template>
      </el-table-column>
      <el-table-column label="电话号码" min-width="120" prop="phone"></el-table-column>
      <!-- <el-table-column label="身份证" min-width="150" prop="idCard"></el-table-column> -->
      <el-table-column label="地址" min-width="250" prop="address"></el-table-column>
      <el-table-column label="电子邮件" min-width="150" prop="email"></el-table-column>
      <el-table-column label="是否受让人" min-width="120" prop="isAssignee">
        <template slot-scope="scope">
          <p>{{scope.row.isAssignee=='0'?'否':'是'}}</p>
        </template>
      </el-table-column>
      <el-table-column label="是否是抵押权人" min-width="120" prop="isCreaditor">
        <template slot-scope="scope">
          <p>{{scope.row.isCreaditor=='0'?'否':'是'}}</p>
        </template>
      </el-table-column>
      <el-table-column label="是否是债权人" min-width="120" prop="isPledgee">
        <template slot-scope="scope">
          <p>{{scope.row.isPledgee=='0'?'否':'是'}}</p>
        </template>
      </el-table-column>
      <el-table-column label="对应团贷网担保公司名称" width="180" prop="tuandaiGuaranteeCompany"></el-table-column>
      <!-- <el-table-column label="对应团贷网担保公司GUID" min-width="150" prop="tuandaiGuaranteeGuid"></el-table-column>
      <el-table-column label="更新人用户名称" min-width="150" prop="modifedUserName"></el-table-column>
      <el-table-column label="更新人机构名称" min-width="150" prop="modifedOrgName"></el-table-column>
      <el-table-column label="更新人" min-width="150" prop="updateOperator"></el-table-column>
      <el-table-column label="最后更新时间" min-width="150" prop="lastModifiedDatetime"></el-table-column> -->
      <el-table-column fixed="right" label="操作" width="180">
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
    <!-- 页码 -->
    <div class='hongte-Pagination'>
      <el-pagination background @current-change='handleCurrentChange' @size-change="handleSizeChange" :current-page='currentPage' :page-size="pageSize" :page-sizes="[10, 20, 30, 40]" :total='total' layout='total, sizes, prev, pager, next, jumper'>
      </el-pagination>
    </div>
    <!-- 弹出框 -->
    <el-dialog class="hongte-dialog" width="80%" ref="dialog" :visible.sync='dialog.visible' :title='dialog.title'>
      <CreditorPledgee :postData="dialog.postData" @closeDialog="closeDialog" @getData="getData"></CreditorPledgee>
    </el-dialog>
  </div>
</template>

<script>
import CreditorPledgee from './Dialog/CreditorPledgee';
export default {
  name: 'CreditorPledgeeList',
  data() {
    return {
      loading: false,
      // dialog
      dialog: {
        visible: false,
        title: '',
        // 编辑的列表
        postData: {}
      },
      // 当前分页
      currentPage: 1,
      // 每页显示条数
      pageSize: 10,
      // 分页总数
      total: 0,
      keyword: '',
      where: {},
      myData: [],
    };
  },
  components: { CreditorPledgee },
  beforeMount() {
    this.$nextTick(() => {
      this.getData();
    });
  },
  methods: {
    getData() {
      this.loading = true;
      //  let params={};
      let params = Object.assign(
        {},
        {
          page: this.currentPage,
          limit: this.pageSize,
          query: {}
        },
        this.where
      );
      this.$api.creditorPledgeeGetList(params).then(res => {
        this.loading = false;
        if (res.returnCode == '0000') {
          this.myData = res.data;
          this.total = res.count;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    closeDialog() {
      this.dialog.visible = false;
    },
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
    //删除table行
    handleDelete(index, row) {
      this.$confirm('确定删除?', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$api
          .deleteCreditorPledgee({
            id: row.id
          })
          .then(res => {
            if (res.returnCode == '0000') {
              this.$message.success('删除成功！');
              this.getData();
            } else {
              this.$message.error(res.msg);
            }
          });
      });
    },
    //新增编辑
    addEdit() {
      this.dialog.title = '新增抵押权人和债权人配置';
      this.dialog.visible = true;
      this.dialog.postData = {};
    },
    //修改编辑
    handleEdit(row) {
      this.dialog.title = '修改抵押权人和债权人配置';
      this.dialog.visible = true;
      this.dialog.postData = row;
    }
  }
};
</script>

<style lang="scss" scoped>
// #company {
.hongte-query-form {
  &.f-flex {
    .f-item3 {
      // width: 33.3%;
      float: left;
      line-height: 38px;
      label {
        display: inline-block;
        width: 250px;
        text-align: right;
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
</style>

