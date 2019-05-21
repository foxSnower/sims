<template>
  <div style="height: 500px">
    <el-button type="primary" @click="handleView(1)">新增个人</el-button>
    <el-button type="primary" @click="handleView(2)">新增企业</el-button>
    <!-- <el-button type="primary" @click="handleView(3)">新增其他组织</el-button> -->
    <el-table border stripe :data="myData" height="85%" class="hongte-table" v-loading="loading" highlight-current-row >
      <el-table-column fixed label="序号" align="center" type="index" width="55"></el-table-column>
      <el-table-column label="共借人名称" align="center"  width="140">
        <template slot-scope="scope">
          <div class="table-cont">
            <p v-if="scope.row.customerType=='PERSON'">
              <i :style="{color:localTheme.themeColor}" class="customer-type fa fa-user-o"></i>{{ scope.row.customerName }}</p>
            <p v-else>
              <i :style="{color:localTheme.themeColor}" class="customer-type fa fa-building-o"></i>{{ scope.row.customerName }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="证件类型" align="center"   prop=""  width="140">
        <template slot-scope="scope">
          <div class="table-cont">
            <p>{{ scope.row.certificateTypeName }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="证件号" align="center"   width="220" >
        <template slot-scope="scope">
          <div class="table-cont">
            <p>{{ scope.row.certificateNumber|fiterPrivate('identify') }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="80" >
          <template slot-scope="scope">
            <el-button size='mini' type='text' @click="handleView(4,scope.row)">
              <i class="fa fa-eye"></i> 查看</el-button>
            <el-button size='mini' type='text' @click.native.prevent="handleDelete(scope.row)">
              <i class="fa fa-trash-o"></i> 删除</el-button>
          </template>
      </el-table-column>
    </el-table>
    <el-dialog class="hongte-dialog" width="80%" ref="dialog" :visible.sync='innerVisible' :title='dialog.title'  append-to-body >
      <CustomeModifyForPerson :is-view="viewTrue" v-if="dialog.title == '查看个人客户信息'" :postData="dialog.postData" @closeDialog="closeDialog" @getData="queryCustomerTogetherInfo()"></CustomeModifyForPerson>
      <CustomeModifyForEnterprise :is-view="viewTrue" v-if="dialog.title == '查看客户信息'" :postData="dialog.postData" @closeDialog="closeDialog" @getData="queryCustomerTogetherInfo()"></CustomeModifyForEnterprise>
      <CustomeAddForPerson @changeView="changeView" :is-view="viewFalse" v-if="dialog.title == '新增个人客户信息'&&innerVisible" :postData="dialog.postData" @closeDialog="closeDialog" @getData="queryCustomerTogetherInfo()"></CustomeAddForPerson>
      <CustomeAddForEnterprise @changeView="changeView" :is-view="viewFalse" v-if="dialog.title == '新增客户信息'&&innerVisible" :postData="dialog.postData" @closeDialog="closeDialog" @getData="queryCustomerTogetherInfo()"></CustomeAddForEnterprise>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { CustomeModifyForCustomerNameRules } from '@rules';
import { validator } from '@utils';
import CustomeModifyForPerson from '../CustomeModify/CustomeModifyForPerson.vue'; //个人信息修改
import CustomeModifyForEnterprise from '../CustomeModify/CustomeModifyForEnterprise.vue'; //企业信息修改
import CustomeAddForPerson from './CustomeAddForPerson.vue'; //个人信息新增
import CustomeAddForEnterprise from './CustomeAddForEnterprise.vue'; //企业信息新增
export default {
  name: 'BorrowerList',
  data() {
    return {
        loading: false,
        myData: [],
        // dialog
        dialog: {
          title: '',
          // 编辑的列表
          postData: []
        },
        viewFalse:false,
        viewTrue:true,
        innerVisible:false
    };
  },
  components: {CustomeModifyForPerson, CustomeModifyForEnterprise,CustomeAddForPerson,CustomeAddForEnterprise },
  props: ['postData'],
  watch: {
    postData(nVal) {
      if (nVal) {
        this.queryCustomerTogetherInfo();
      }
    }
  },
  beforeMount() {
    this.$nextTick(() => {
      this.queryCustomerTogetherInfo();
    });
  },
  methods: {
    changeView(){
      this.viewFalse=true
    },
    handleView(type,item){
      this.dialog.postData = item;
      this.innerVisible = true;
      this.viewFalse = false
      this.viewTrue = true
      if(type==1){
        this.dialog.title = '新增个人客户信息';
        this.dialog.postData = {"customerCode":this.postData.customerCode,"customerType":"PERSON"};
      }else if(type==2){
        this.dialog.title = '新增客户信息';
        this.dialog.postData = {"customerCode":this.postData.customerCode ,"customerType":"ENTERPRISE"};

      }else if(type==3){
        this.dialog.title = '新增客户信息';
        this.dialog.postData = {"customerCode":this.postData.customerCode,"customerType":"OTHER_ORG"};
      }else if(type==4){
        if(item.customerType=='PERSON'){
          this.dialog.title = '查看个人客户信息';
        }else{
          this.dialog.title = '查看客户信息';
        }
        this.dialog.postData = item;
      }
    },
    queryCustomerTogetherInfo() {
      console.info(this.postData);
      // c3cccba222b4a3a8af07a2138acef03
      // this.postData.customerCode
        this.$api
          .queryCustomerTogetherInfo({
            customerCode: this.postData.customerCode
          })
          .then(res => {
            if (res.returnCode == '0000') {
              this.myData = res.data;
            } else {
              this.$message.error(res.msg);
            }
          });
    },
    handleDelete(item){
      console.info(item)
      this.$confirm('确定执行删除操作？', '提示', {
        distinguishCancelAndClose: true,
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$api
          .deleteCustomerTogether({
            "customerCode": this.postData.customerCode,
            "customerTogetherCode": item.customerCode
          })
          .then(res => {
            if (res.returnCode == '0000') {
              this.myData = res.data;
              this.$message.success('删除成功!');
            } else {
              this.$message.error(res.msg);
            }
            this.queryCustomerTogetherInfo()
          });
      });

    },
    closeDialog() {
      this.innerVisible = false;
      //  this.$set(this.$parent.dialog,'visible',false);
    },
    // getData() {
    //   this.loading = true;
    //   this.myData = [];
    //   let params = Object.assign(
    //     {},
    //     {
    //       page: this.currentPage,
    //       limit: this.pageSize,
    //       query: {}
    //     },
    //     this.filterTable
    //   );
    //   this.$api.getCustemerListBySalesperson(params).then(res => {
    //     this.loading = false;
    //     if (res.returnCode == '0000') {
    //       if (res.data) {
    //         this.myData = res.data.results;
    //         this.total = res.data.total;
    //       }
    //     } else {
    //       this.$message.error(res.msg);
    //     }
    //   });
    // },
    close() {
      this.$emit('closeDialog');
    },
  },
  computed: {
    ...mapGetters(['localTheme'])
  }
};
</script>


<style lang='scss' scoped>
.hongte-query-form {
  width: 500px;
  margin: 0 auto;
}
.bottom-btn {
  width: 100%;
  text-align: center;
  padding-top: 20px;
}
</style>
