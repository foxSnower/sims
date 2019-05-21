<template>
  <div>
    <el-table border stripe :data="filterQueryCustomerTogetherInfoList" ref="tableName" class="hongte-table" @selection-change="handleSelectionChange" highlight-current-row>
      <el-table-column fixed type="selection" width="50" v-if="showChecked"></el-table-column>
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column label="借款人" prop="customerName" min-width="100"></el-table-column>
      <el-table-column label="借款人类型" min-width="100">
        <template slot-scope="scope">
          <p>{{scope.row.customerType|fiterCustomerType}}</p>
        </template>
      </el-table-column>
      <el-table-column label="证件名称" min-width="100">
        <template slot-scope="scope">
          <p>{{scope.row.certificateTypeName|filterNull}}</p>
        </template>
      </el-table-column>
      <el-table-column label="证件号码/统一社会信用代码" min-width="150">
        <template slot-scope="scope">
          <p v-if="scope.row.customerType=='PERSON'">{{scope.row.certificateNumber|fiterPrivate('identify')}}</p>
          <p v-else>{{scope.row.unifiedSocialCreditCode|fiterPrivate('unitCode')}}</p>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="hongte-dialog" width="80%" ref="dialog" :visible.sync='dialogVisible' title='共借人详情' append-to-body>
       <CustomeModifyForPerson :is-view="true" v-if="dialogData.customerType=='PERSON'" :postData="dialogData" @closeDialog="closeDialog" ></CustomeModifyForPerson>
      <CustomeModifyForEnterprise :is-view="true" v-else :postData="dialogData" @closeDialog="closeDialog" ></CustomeModifyForEnterprise>
    </el-dialog>
  </div>

</template>


<script>
import CustomeModifyForPerson from "@views/CustomeManagement/CustomeModify/CustomeModifyForPerson.vue"; //个人信息新增
import CustomeModifyForEnterprise from "@views/CustomeManagement/CustomeModify/CustomeModifyForEnterprise.vue"; //企业信息新增
export default {
  name: "Issued",
  data() {
    return {
      queryCustomerTogetherInfoList: [],
      checkedAddLoader: [],
      //从接口获取的
      selectedLoader: [],
      dialogVisible: false,
      dialogData:{}
    };
  },
  components: {
    CustomeModifyForPerson,
    CustomeModifyForEnterprise
  },
  props: ["isChecked", "outerVisible", "isIssued"],
  methods: {
    //查询共借人信息
    queryCustomerTogetherInfo(IssuedObject, selectedLoader) {
      if (this.queryCustomerTogetherInfoList.length === 0) {
        this.$api
          .queryCustomerTogetherInfo({
            customerCode: IssuedObject.customerCode,
            businessId: IssuedObject.businessId
          })
          .then(res => {
            if (res.returnCode == "0000") {
              this.queryCustomerTogetherInfoList = res.data;
              this.$nextTick(() => {
                this.toggleSelection(selectedLoader);
              });
            } else {
              this.message.error(res.msg);
            }
          });
      } else {
        this.$nextTick(() => {
          this.toggleSelection(selectedLoader);
        });
      }
    },
    //获取已选的共借人信息
    getCustomerCodeList(IssuedObject) {
      this.$api
        .getCustomerCodeList({
          businessId: IssuedObject.businessId
        })
        .then(res => {
          if (res.returnCode == "0000") {
            let selectedLoader = [];
            if (res.data != null) {
              selectedLoader = res.data;
              this.$emit("update:isIssued", true);
            }
            //查询共借人信息
            this.queryCustomerTogetherInfo(IssuedObject, selectedLoader);
          } else {
            this.message.error(res.msg);
          }
        });
    },
    //点击确定新增共借人
    save(IssuedObject) {
      let checkedAddLoader = this.checkedAddLoader;
      let customerCodes = [];
      checkedAddLoader.forEach(x => {
        customerCodes.push(x.customerCode);
      });
      this.$api
        .saveBorrowerCustomer({
          businessId: IssuedObject.businessId,
          customerCodes: customerCodes
        })
        .then(res => {
          if (res.returnCode == "0000") {
            this.$emit("update:outerVisible", false);
            this.$message.success("保存成功");
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    //多选
    handleSelectionChange(val) {
      this.checkedAddLoader = val;
      // this.$emit('update:checkedAddLoader', val);
    },
    //选中已选的客户
    toggleSelection(selectedLoader) {
      let queryCustomerTogetherInfoList = this.queryCustomerTogetherInfoList;
      let newArray = [];
      selectedLoader.forEach(x => {
        queryCustomerTogetherInfoList.forEach(y => {
          if (y.customerCode == x) {
            newArray.push(y);
            this.$refs.tableName.toggleRowSelection(y);
          }
        });
      });
      this.selectedLoader = newArray;
    },
    //清空选中
    clearSelection() {
      this.$refs.tableName.clearSelection();
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    showDetail(row){
      this.dialogData = {"customerCode":row.customerCode,"customerType":row.customerType};
      this.dialogVisible=true;
    }
  },
  computed: {
    showChecked() {
      if (this.isChecked == null) {
        return false;
      } else {
        return true;
      }
    },
    filterQueryCustomerTogetherInfoList() {
      if (this.isChecked == null) {
        return this.selectedLoader;
      } else {
        return this.queryCustomerTogetherInfoList;
      }
    }
  }
};
</script>
