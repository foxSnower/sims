<template>
  <div v-loading="pageLoading">
    <el-card class="box-card">
      <div class="hd">
        <h1 :style="{color:themeColor}">
          <i v-if="sim_customer.customer_type=='PERSON'" class="fa fa-user-o"></i>
          <i v-else class="fa fa-building-o"></i>
          单号：{{sim_customer.business_id}}

        </h1>
        <el-row class="buss-btn">
          <el-button size="small" type="primary" @click="$router.back(-1);$emit('removeCurTag');"> 返回列表</el-button>
          <!-- <el-button v-if="DoRevoke" size="small" type="primary" @click="handleDoRevoke()"> 撤回</el-button> -->
          <el-button v-if="DoCancel" size="small" type="primary" @click="handleCancel()"> 注销</el-button>
        </el-row>
      </div>
      <div class="f-flex hongte-query-form">
        <div class="f-item" v-if="sim_customer.customer_type=='PERSON'">
          <div>
            <label>客户名称：</label>
            <p><span>{{sim_customer.customer_name}}</span></p>
          </div>
          <div>
            <label>手机号码：</label>
            <p><span>{{sim_customer.phone|fiterPrivate('phone')}}</span></p>
          </div>
          <div>
            <label>证件号码：</label>
            <p><span>{{sim_customer.card_number|fiterPrivate('identify')}}</span></p>
          </div>
        </div>
        <div class="f-item" v-else>
          <div>
            <label>客户名称：</label>
            <p><span>{{sim_customer.customer_name}}</span></p>
          </div>
          <div>
            <label>法人名称：</label>
            <p><span>{{sim_customer.company_legal_person}}</span></p>
          </div>
          <div>
            <label>手机号码：</label>
            <p><span>{{sim_customer.phone|fiterPrivate('phone')}}</span></p>
          </div>
          <div>
            <label>统一社会信用代码: </label>
            <p><span>{{sim_customer.unified_code|fiterPrivate('unitCode')}}</span></p>
          </div>
        </div>
        <div class="f-item">
          <div>
            <label>产品类型：</label>
            <p><span>{{sim_business_info.product_type_name}}</span></p>
          </div>
          <div>
            <label>产品系列：</label>
            <p><span>{{sim_business_info.product_series_name}}</span></p>
          </div>
          <div>
            <label>产品：</label>
            <p><span>{{sim_business_info.product_name}}</span></p>
          </div>
        </div>
        <div class="f-item">
          <div>
            <label>受理人：</label>
            <p><span>{{sim_business_info.create_user_name}}</span></p>
          </div>
          <div>
            <label>受理门店：</label>
            <p><span>{{sim_business_info.create_org_name}}</span></p>
          </div>
          <div>
            <label>受理时间：</label>
            <p><span>{{sim_business_info.create_datetime|filtersFormatTime}}</span></p>
          </div>
        </div>

        <div class="f-item">
          <div class="f-item2">
            <div class="label">状态 <el-popover v-if="sim_business_info.business_status=='90'" placement="top" title="拒绝的原因" width="200" trigger="click" :content="sim_business_info.audit_opinion|filterNull">
                <el-button type="text" size="small" slot="reference" @click="visible = !visible">（拒绝的原因）</el-button>
              </el-popover>
            </div>
            <h1 :style="{color:themeColor}">{{sim_business_info.business_status|businessStatusName}}</h1>
          </div>
          <div class="f-item2">
            <div class="label">授信额度</div>
            <h1 :style="{color:themeColor}">{{sim_credit_result.credit_quota|filtersMoney}}</h1>
          </div>
        </div>
      </div>
    </el-card>
    <el-tabs type="border-card" style="margin-top:20px;" @tab-click="handleClick">
      <!-- 详情 -->
      <el-tab-pane label="详情">
        <el-card class="box-card" v-if="sim_business_info.approve_no&&progressFlow">
          <div slot="header" class="is-clear">
            <span class="card-title">流程进度</span>
          </div>
          <ht-steps :active="approveProgressStatus" class="ht-steps">
            <ht-step v-for="(x,index) in progressFlow" :key="index" :title="x.nodeName" :subTitle="x.approveUserName" :dates="x.approvTime"></ht-step>
          </ht-steps>
        </el-card>
        <el-card class="box-card" style="margin-top:20px;">
          <div v-for="(item,index) in configData" :key="index">
            <div class="card-define-title" :style="{paddingTop:index===0?'0':''}">
              <span class="card-title">{{item.entryElementClassifyName}}</span>
            </div>

            <template v-if="item.classifyList.length>0">
              <!-- 征信记录 -->
              <div v-if="item.showType=='LIST'" class="classify-list f-flex is-clear" v-for="(itemM,idM) in item.classifyList" :key="idM">
                <template v-if="itemM.showType==='FORM'">
                  <div v-if="itemX.controlType!=='HIDDEN'&&itemX.isShow" :class="{'f-item1':itemX.isRow,'f-item3':!itemX.isRow}" v-for="(itemX,idX) in itemM.fieldList" :key="idX">
                    <label>{{itemX.fieldCnName}}：</label>
                    <p v-if="myData[itemM.tableName]"><span>{{myData[itemM.tableName][itemX.fieldName]|filterFormName(myData[itemM.tableName],item.fieldList,itemX)}}</span></p>
                  </div>
                </template>
                <TemplateTable v-else-if="itemM.showType=='LIST'" v-model="myData[itemM.tableName]" :where="myData[itemM.tableName]" :item="itemM" :isTracking="true"></TemplateTable>
              </div>
              <!-- 房产信息 个人担保措施-->
              <div v-if="item.showType=='TABLIST'&& itemM.isMain" class="classify-list" v-for="(itemM,idM) in item.classifyList" :key="idM">
                <TemplateTable v-model="myData[itemM.tableName]" :ref="item.entryElementClassifyCode" :where="myData[itemM.tableName]" :item="itemM" :foreignKey="item.foreignKey" @row-click="clickCurrentForeignKey" :isTracking="true"></TemplateTable>
              </div>
              <el-tabs v-if="item.showType=='TABLIST' && item.foreignKey" type="border-card" style="margin-top:30px;">
                <el-tab-pane :label="itemM.entryElementClassifyName" v-for="(itemM,idM) in item.classifyList" :key="idM" v-if="!itemM.isMain">
                  <template>
                    <el-table border :data="myData[itemM.tableName]|filterCurrentForeignKey(foreignKey,currentForeignKey)" class="hongte-table" highlight-current-row>
                      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
                      <el-table-column v-if="itemX.controlType!='HIDDEN'" v-for="(itemX,idX) in itemM.fieldList" :key="idX" :label='itemX.fieldCnName' min-width="150">
                        <template slot-scope="scope">
                          <span>{{scope.row[itemX.fieldName]|filterFieldName(scope.row,itemX)}}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-tab-pane>
              </el-tabs>
              <!-- 房产信息 个人担保措施 -->
            </template>
            <template v-if="item.classifyList.length==0">
              <div v-if="item.showType==='FORM'" class="f-flex is-clear">
                <div v-if="itemX.controlType!=='HIDDEN'&&itemX.isShow" :class="{'f-item1':itemX.isRow,'f-item3':!itemX.isRow}" v-for="(itemX,idX) in item.fieldList" :key="idX">
                  <label>{{itemX.fieldCnName}}：</label>
                  <p v-if="myData[item.tableName]"><span>{{myData[item.tableName][itemX.fieldName]|filterFormName(myData[item.tableName],item.fieldList,itemX)}}</span></p>
                </div>
              </div>
              <TemplateTable v-else-if="item.showType=='LIST'" v-model="myData[item.tableName]" :where="myData[item.tableName]" :item="item" :isTracking="true"></TemplateTable>
            </template>

          </div>
          <!-- 共借人信息 -->
          <div v-show="isIssued">
            <div class="card-define-title">
              <span class="card-title">共借人信息</span>
            </div>
            <div class="f-flex is-clear">
              <Issued ref="Issued" :isIssued.sync="isIssued"></Issued>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
      <!--附件 -->
      <el-tab-pane label="附件">
        <ViewsFile :postData="postData"></ViewsFile>
      </el-tab-pane>
      <!-- 操作记录 -->
      <el-tab-pane label="操作记录">
        <operateTable :postData="postData"></operateTable>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TemplateTable from "./CommonTemplate/TemplateTable";
import HtSteps from "@components/steps/src/steps";
import HtStep from "@components/steps/src/step";
import ViewsFile from "@htComponents/UploadFile/ViewsFile";
import operateTable from "@htComponents/operateTable";
import { mapGetters, mapMutations } from "vuex";
import { setLocalStorage, getLocalStorage, codeToName } from "@utils";
export default {
  name: "CreditTracking",
  components: {
    TemplateTable,
    HtSteps,
    HtStep,
    ViewsFile,
    operateTable,
    Issued: () => import("./CommonTemplate/Issued")
  },
  data() {
    return {
      pageLoading: false,
      // 撤回
      DoRevoke: false,
      //注销
      DoCancel: false,
      progressFlow: {},
      //个人信息
      sim_customer: {},
      //产品信息
      sim_business_info: {},
      //授信额度
      sim_credit_result: {},
      configData: {},
      //当前选中的房产信息
      currentHouseCode: "",
      myData: {},
      //查看附件需要的数据
      postData: {},
      //   myFileData: [],
      //操作记录
      operateData: [],
      approveProgressStatus: 0,
      //是否有共借人
      isIssued: false,

      //当前选中的基本房产信息
      currentForeignKey: "",
      foreignKey: ""
    };
  },
  watch: {
    //获取共借人信息
    IssuedObject: {
      handler(curVal, newVal) {
        if (curVal) {
          this.$nextTick(() => {
            this.$refs.Issued.getCustomerCodeList(curVal);
          });
        }
      }
    },
    deep: true
  },
  filters: {
    filterCurrentForeignKey(list, foreignKey, currentForeignKey) {
      let newArray = [];
      for (let i in list) {
        if (list[i][foreignKey] == currentForeignKey) {
          newArray.push(list[i]);
        }
      }
      return newArray;
    },
    filterFormName(value, tableName, fieldList, itemX) {
      let setNewVal = null;
      if (itemX.dataFillingList.length === 0) {
        if (itemX.fieldName == "sex") {
          if (value == "0") {
            setNewVal = "男";
          } else if (value == "1") {
            setNewVal = "女";
          } else {
            setNewVal = value;
          }
        } else {
          setNewVal = value;
        }
      } else {
        // if (itemX.controlType === 'CASCADE_SELECT') {
        let fillingFieldCode = null;
        let fillingParamName = null;
        // let addressCode = [];
        let addressName = [];
        let selectName = null;
        let dataFillingList = itemX.dataFillingList;
        // for (let z in dataFillingList) {
        for (let z = 0; z < dataFillingList.length; z++) {
          // debugger
          fillingFieldCode = dataFillingList[z].fillingFieldCode;
          fillingParamName = dataFillingList[z].fillingParamName;
          // for (let m in fieldList) {
          for (let m = 0; m < fieldList.length; m++) {
            if (fieldList[m].fieldCode === fillingFieldCode) {
              if (fillingParamName == "name[0]") {
                addressName[0] = tableName[fieldList[m].fieldName];
              } else if (fillingParamName == "name[1]") {
                addressName[1] = tableName[fieldList[m].fieldName];
              } else if (fillingParamName == "name[2]") {
                addressName[2] = tableName[fieldList[m].fieldName];
              } else if (fillingParamName == "code[0]") {
                // addressCode[0] = tableName[fieldList[m].fieldName];
              } else if (fillingParamName == "code[1]") {
                // addressCode[1] = tableName[fieldList[m].fieldName];
              } else if (fillingParamName == "code[2]") {
                // addressCode[2] = tableName[fieldList[m].fieldName];
              } else if (fillingParamName == "name") {
                selectName = tableName[fieldList[m].fieldName];
              }
            }
          }
        }
        // console.log(value, itemX.dataFillingList.length == 0, itemX);
        // console.log(addressName, addressName.length);
        if (selectName) {
          setNewVal = selectName;
        } else if (addressName.length && addressName[0] != null) {
          setNewVal = addressName.join("/");
        }
      }
      return setNewVal;
    }
  },
  beforeMount() {
    this.$nextTick(() => {
      this.getData();
    });
  },
  methods: {
    getData() {
      this.$api.detailConfig({ id: this.$route.query.id }).then(res => {
        if (res.returnCode == "0000") {
          let result = res.data;
          this.getEntryElementInfoDetai(result);
          this.sim_customer = res.data.sim_customer;
          this.sim_business_info = res.data.sim_business_info;
          this.sim_credit_result = res.data.sim_credit_result
            ? res.data.sim_credit_result
            : {};
          this.myData = res.data;
          this.initData(result);
          //传入附件的数据
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //获取动态的配置
    getEntryElementInfoDetai(result) {
      this.pageLoading = true;
      this.$api
        .getEntryElementInfoDetai({
          productCode: result.sim_business_info.product_code,
          entryElementType: "ACCREDIT_CREDIT_ELEMENTS",
          customerType: result.sim_customer.customer_type,
          productVersion: result.sim_business_info.product_version
        })
        .then(res => {
          if (res.returnCode == "0000") {
            this.configData = res.data;
            this.pageLoading = false;
            this.pushData(this.configData);
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    initData(result) {
      //获取流程----
      let approveNo = result.sim_business_info.approve_no;
      if (approveNo) {
        this.$api
          .creditQueryApproveProgress({
            approveNo
          })
          .then(res => {
            if (res.returnCode == "0000") {
              this.progressFlow = res.data;
              for (let i = 0; i < res.data.length; i++) {
                let row = res.data[i];
                if (!row.approvTime) {
                  this.approveProgressStatus = i;
                  return false;
                } else {
                  this.approveProgressStatus = res.data.length;
                }
              }
            } else {
              this.$message.error(res.msg);
            }
          });
      }
      //判断该单号的流程进度---进行按钮配置
      this.initPermission(result);
    },
    // 进行按钮配置
    initPermission(result) {
      // 审核进度大于0后不能撤回只能注销
      if (result.sim_business_info) {
        let businessStatusCode = result.sim_business_info.business_status;
        let auditPercent = parseFloat(result.sim_business_info.audit_percent);
        switch (businessStatusCode) {
          case "0":
          case "10":
            break;
          case "20":
          case "30":
            if (auditPercent > 0) {
              this.DoRevoke = false;
              this.DoCancel = true;
            } else {
              this.DoRevoke = true;
              this.DoCancel = true;
            }
            break;
          case "100":
          case "90":
          case "99":
          case "31":
            this.DoCancel = false;
            this.DoRevoke = false;
            break;
          default:
            break;
        }
      }
    },
    //配置数据
    pushData(configData) {
      let myData = this.myData;
      let _vm = this;
      function forInMyData(_list) {
        for (let m in _list) {
          let myDataForTableName = myData[_list[m].tableName];
          let showType = _list[m].showType;
          let classifyList = _list[m].classifyList;
          let fieldList = _list[m].fieldList;
          let tableName = _list[m].tableName;
          if (showType === "LIST") {
            //配置信息在第一层
            if (classifyList.length === 0) {
              _vm.$set(_list[m], "addDetailVal", myDataForTableName);
            } else {
              //配置信息在第二层--递归
              forInMyData(classifyList);
            }
          }
          if (showType === "FORM") {
            for (let k in fieldList) {
              if (
                fieldList[k].controlType === "SELECT" ||
                fieldList[k].controlType === "RADIO"
              ) {
                let fillingFieldCode = null;
                let dataFillingList = fieldList[k].dataFillingList;
                let computedData = myDataForTableName[fieldList[k].fieldName];
                if (dataFillingList.length === 0) {
                  //获得源数据name
                  let computedDataName = codeToName(
                    computedData,
                    JSON.parse(fieldList[k].dataSource)
                  );
                  _vm.$set(fieldList[k], "addDetailVal", computedDataName);
                } else {
                  for (let z in dataFillingList) {
                    fillingFieldCode = dataFillingList[z].fillingFieldCode;
                    for (let m in fieldList) {
                      if (fieldList[m].fieldCode === fillingFieldCode) {
                        //获得源数据name
                        let computedDataName =
                          myDataForTableName[fieldList[m].fieldName];
                        // console.log(fieldList[y].fieldName);
                        _vm.$set(
                          fieldList[k],
                          "addDetailVal",
                          computedDataName
                        );
                      }
                    }
                  }
                }
                //判断下拉框或单选框选择值后的联动值
                let gangedList = fieldList[k].gangedList;
                if (gangedList && gangedList.length > 0) {
                  for (let i in gangedList) {
                    // let fieldCode = gangedList[i].fieldCode;
                    let selectValue = gangedList[i].selectValue;
                    let curSelectValue = computedData;
                    // console.log(selectValue, computedData);
                    //当前值等于此对象的值,则其联动如下
                    if (curSelectValue == selectValue) {
                      try {
                        let showFieldCodeArray = gangedList[
                          i
                        ].showFieldCode.split(",");
                        let hideFieldCodeArray = gangedList[
                          i
                        ].hideFieldCode.split(",");
                        for (let m in showFieldCodeArray) {
                          let fieldCode = showFieldCodeArray[m];
                          for (let j in fieldList) {
                            //找到要的值
                            if (fieldCode == fieldList[j].fieldCode) {
                              _vm.$set(fieldList[j], "isShow", true);
                            }
                          }
                        }
                        for (let m in hideFieldCodeArray) {
                          let fieldCode = hideFieldCodeArray[m];
                          for (let j in fieldList) {
                            //找到要的值
                            if (fieldCode == fieldList[j].fieldCode) {
                              _vm.$set(fieldList[j], "isShow", false);
                            }
                          }
                        }
                      } catch (error) {}
                    }
                  }
                }
              } else if (fieldList[k].controlType === "CASCADE_SELECT") {
                let fillingFieldCode = null;
                let fillingParamName = null;
                let address = [];
                let dataFillingList = fieldList[k].dataFillingList;
                dataFillingList.forEach(z => {
                  fillingFieldCode = z.fillingFieldCode;
                  fillingParamName = z.fillingParamName;
                  fieldList.forEach(m => {
                    if (
                      m.fieldCode === fillingFieldCode &&
                      fillingParamName.indexOf("name") >= 0
                    ) {
                      if (fillingParamName == "name[0]") {
                        address[0] = myDataForTableName[m.fieldName];
                      } else if (fillingParamName == "name[1]") {
                        address[1] = myDataForTableName[m.fieldName];
                      } else if (fillingParamName == "name[2]") {
                        address[2] = myDataForTableName[m.fieldName];
                      }
                    }
                  });
                });
                //给住址赋值
                let allNull = address.every((n, idN) => {
                  return n == null || n == "";
                });
                if (!allNull) {
                  address = address.join("/");
                  _vm.$set(fieldList[k], "addDetailVal", address);
                }
                //其他类
              } else {
                try {
                  _vm.$set(
                    fieldList[k],
                    "addDetailVal",
                    myDataForTableName[fieldList[k].fieldName]
                  );
                } catch (error) {}
              }
            }
          }
          if (showType === "TABLIST") {
            //配置信息在第二层--递归
            forInMyData(classifyList);
          }
        }
      }
      forInMyData(configData);
    },
    handleClick(tab, event) {
      this.$set(
        this.postData,
        "productCode",
        this.sim_business_info.product_code
      );
      this.$set(
        this.postData,
        "businessId",
        this.sim_business_info.business_id
      );
      this.$set(this.postData, "customerType", this.sim_customer.customer_type);
    },
    //发送钉钉消息
    goDing() {
      this.$message({
        type: "success",
        message: "已发送成功！"
      });
    },
    //撤回
    handleDoRevoke() {
      this.$confirm("确定执行撤回操作？", "提示", {
        distinguishCancelAndClose: true,
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        this.$api
          .creditDoRevoke({
            id: this.$route.query.id
          })
          .then(res => {
            if (res.returnCode == "0000") {
              this.isDoRevoke = true;
              this.getData();
              this.$message.success("撤回成功!");
            } else {
              this.$message.error(res.msg);
            }
          });
      });
    },
    //注销
    handleCancel() {
      this.$confirm("确定执行注销操作？", "提示", {
        distinguishCancelAndClose: true,
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        this.$api
          .creditDoCancel({
            id: this.$route.query.id
          })
          .then(res => {
            if (res.returnCode == "0000") {
              this.getData();
              this.$message.success("注销成功!");
            } else {
              this.$message.error(res.msg);
            }
          });
      });
    },
    //点击当前选中的基本房产信息
    clickCurrentForeignKey(row, foreignKey) {
      if (row) {
        this.currentForeignKey = row[foreignKey];
        this.foreignKey = foreignKey;
      } else {
        this.currentForeignKey = "";
      }
      //消除除了当前table的选中状态
      for (let i in this.$refs) {
        let validateTable = this.$refs[i][0];

        try {
          if (
            validateTable.foreignKey &&
            validateTable.foreignKey != foreignKey
          ) {
            validateTable.setCurrentRow();
          }
        } catch (error) {}
      }
    }
  },
  computed: {
    ...mapGetters(["localTheme"]),
    themeColor() {
      return this.localTheme.themeColor;
    },
    computedMyData() {
      if (this.myData) {
        return this.myData;
      }
    },
    //获取共借人信息的必要条件
    IssuedObject() {
      try {
        let customerCode = this.myData.sim_customer.customer_code;
        let businessId = this.myData.sim_business_info.business_id;
        if (customerCode && businessId) {
          return {
            customerCode,
            businessId
          };
        }
      } catch (error) {}
    }
  }
};
</script>

<style lang='scss' scoped>
.box-card {
  .hd {
    overflow: hidden;
  }
  h1 {
    float: left;
    font-size: 24px;
  }
  .el-row {
    float: right;
  }
  .f-flex {
    margin-top: 15px;
    width: 100%;
    overflow: hidden;
    line-height: 2;
    .f-item,
    .f-item1,
    .f-item2,
    .f-item3 {
      overflow: hidden;
      float: left;
      text-indent: 10px;
      span {
        color: #888;
      }
    }
    .f-item1 {
      float: left;
      width: 100%;
    }
    .f-item3 {
      float: left;
      width: 33.3%;
    }
    .f-item2 {
      float: left;
      width: 50%;
      h1 {
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
      }
    }
    label {
      display: inline-block;
      // width: 250px;
      text-align: right;
      text-align: right;
      float: left;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
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
      margin-right: 20px;
      text-align: justify;
    }
    span {
      color: #888;
    }
  }
  .ht-steps {
    margin: 10px 30px;
  }
  .card-define-title {
    padding: 18px 0;
    padding-top: 30px;
    border-bottom: 1px solid #ebeef5;
    box-sizing: border-box;
    width: calc(100% + 40px);
    margin-left: -20px;
    text-indent: 20px;
  }
  .card-title {
    font-weight: 700;
    font-size: 15px;
  }
  .card-body {
    padding: 20px 0;
    // text-align: justify;
    word-wrap: break-word;
    text-align: left;
  }
  .item-title {
    color: #666;
    font-size: 16px;
    font-weight: 700;
  }
}
</style>
