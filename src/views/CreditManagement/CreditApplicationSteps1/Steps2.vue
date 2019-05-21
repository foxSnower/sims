<template>
  <div class="ht-form-right" v-loading="pageLoading">
    <!-- 菜单 -->
    <div class="fixed-menu" v-if="computedMyData">
      <div v-for="(item,index) in computedMyData" :key="index" @click="handleSelect(item.entryElementClassifyName)">
        <span>{{item.entryElementClassifyName}}</span>
        <template v-if="item.classifyList.length===0">
          <el-progress v-if="item.showType=='FORM'" :show-text="false" :percentage="computedProgress(item.entryElementClassifyCode,item.tableName,item.fieldList)"></el-progress>
          <el-progress v-else-if="item.showType=='LIST'" :show-text="false" :percentage="computedProgress(item.entryElementClassifyCode,item.tableName)"></el-progress>
        </template>
        <template v-else>
          <el-progress :show-text="false" :percentage="computedProgress2(item.entryElementClassifyCode,item.classifyList)"></el-progress>
        </template>
      </div>
    </div>
    <TemplateIssued :showIssued.sync="showIssued" :IssuedObject="IssuedObject"></TemplateIssued>
    <el-collapse v-model="activeNames">
      <el-collapse-item v-for="(item,index) in myData" :key="index" :title="item.entryElementClassifyName" :name="item.entryElementClassifyCode">
        <template v-if="item.classifyList.length>0">
          <!-- 征信记录 -->
          <div v-if="item.showType=='LIST'" class="classify-list" v-for="(itemM,idM) in item.classifyList" :key="idM">
            <TemplateForm v-if="itemM.showType=='FORM'" v-model="where[itemM.tableName]" :where="where[itemM.tableName]" :item="itemM" ref="form" :model="where[itemM.tableName]" itemClass="f-item3"></TemplateForm>
            <TemplateTable v-else-if="itemM.showType=='LIST'" v-model="where[itemM.tableName]" :where="where[itemM.tableName]" :item="itemM" ref="table" @addEdit="addEdit" @handleEdit="handleEdit" @handleDelete="handleDelete"></TemplateTable>
          </div>
          <!-- 房产信息 个人担保措施-->
          <div v-if="item.showType=='TABLIST'&& itemM.isMain" class="classify-list" v-for="(itemM,idM) in item.classifyList" :key="idM">
            <!-- <template v-if="itemM.isMain"> -->
            <TemplateTable v-model="where[itemM.tableName]" ref="table" :where="where[itemM.tableName]" :item="itemM" @addEdit="addEdit" @handleEdit="handleEdit" @handleDelete="handleDelete" @row-click="clickCurrentForeignKey" :foreignKey="item.foreignKey"></TemplateTable>
            <!-- </template> -->
          </div>
          <el-tabs v-if="item.showType=='TABLIST' && item.foreignKey" type="border-card" style="margin-top:30px;">
            <el-tab-pane :label="itemM.entryElementClassifyName" v-for="(itemM,idM) in item.classifyList" :key="idM" v-if="!itemM.isMain">
              <TemplateTable v-model="where[itemM.tableName]" ref="table" :where="where[itemM.tableName]|filterCurrentForeignKey(foreignKey,currentForeignKey)" :item="itemM" @addForeignKeyEdit="addForeignKeyEdit" @handleForeignKeyEdit="handleForeignKeyEdit" @handleForeignKeyDelete="handleForeignKeyDelete" :foreignKey="item.foreignKey" :isForeignKey="true" :parentName="item.entryElementClassifyName"></TemplateTable>
              <!-- <template>
                <el-button type="primary" size="small" @click="addForeignKeyEdit('新增',itemM,itemM.tableName,item.foreignKey,item.entryElementClassifyName)">
                  <i class="el-icon-plus"></i> 新增</el-button>
                <el-table border :data="where[itemM.tableName]|filterCurrentForeignKey(foreignKey,currentForeignKey)" class="hongte-table" highlight-current-row>
                  <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
                  <el-table-column v-if="itemX.controlType!='HIDDEN'" v-for="(itemX,idX) in itemM.fieldList" :key="idX" :label='itemX.fieldCnName' min-width="150">
                    <template slot-scope="scope">
                      <span>{{scope.row[itemX.fieldName]|filterFieldName(scope.row,itemX)}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column fixed="right" label="操作" width="180">
                    <template slot-scope="scope">
                      <el-button size='mini' type='primary' @click="handleForeignKeyEdit(scope.$index,itemM,itemM.tableName,currentForeignKey)">
                        <i class="fa fa-edit"></i> 编辑</el-button>
                      <el-button size='mini' type='danger' @click.native.prevent="handleForeignKeyDelete(scope.$index,scope.row,itemM.tableName,currentForeignKey)">
                        <i class="fa fa-trash-o"></i> 删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template> -->
            </el-tab-pane>
          </el-tabs>
          <!-- 房产信息 个人担保措施 -->
        </template>
        <template v-if="item.classifyList.length==0">
          <TemplateForm v-if="item.showType=='FORM'" v-model="where[item.tableName]" :where="where[item.tableName]" :item="item" ref="form" :model="where[item.tableName]" itemClass="f-item3"></TemplateForm>
          <TemplateTable v-else-if="item.showType=='LIST'" v-model="where[item.tableName]" :where="where[item.tableName]" :item="item" @addEdit="addEdit" @handleEdit="handleEdit" @handleDelete="handleDelete" ref="table"></TemplateTable>
        </template>
      </el-collapse-item>
      <!-- 分割行啊 -->
    </el-collapse>
    <!-- 弹出框 -->
    <el-dialog class="hongte-dialog" width="50%" :visible.sync='dialogTable.visible' :title='dialogTable.title'>
      <TemplateForm v-model="tableInfo" :where="tableInfo" :item="item" ref="tableForm" :model="tableInfo" itemClass="f-item2"></TemplateForm>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTable.visible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave(tableId)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- {click:()=>{showIssued=true},text:'共借人信息'}, -->
    <HtFixedBtn :percentage="percentage()" :btnText="[
        {click:()=>{showIssued=true},text:'共借人信息'},
        {click:()=>{$emit('preTo',0)},text:'上一步'},
        {click:()=>{save(1)},loading:saveLoading,text:'保存草稿'},
        {click:()=>{save(2)},loading:btnLoading,text:'下一步'},
        {click:()=>{goTo()},text:'返回列表'},
        ]"></HtFixedBtn>

  </div>
</template>

<script>
import HtFixedBtn from '@components/HtFixedBtn';
import TemplateForm from '../CommonTemplate/TemplateForm';
import TemplateTable from '../CommonTemplate/TemplateTable';
// import TemplateIssued from '../CommonTemplate/TemplateIssued';

import { rules } from '@rules';
import { setLocalStorage, getLocalStorage, codeToName, MsFormatDate, isEmpty, validScrollTop, GetAge, validateIdCard } from '@utils';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Steps2',
  data() {
    return {
      //选择的要素名字
      changeName: '',
      //获取进件要素
      myData: [],
      where: {},
      productInfoFromData: [],

      // filterParams: {},
      dialogTable: {
        visible: false,
        title: '标题'
      },
      //收集的表单信息
      tableId: '',
      tableName: '',
      tableInfo: {},
      //当前选中的基本房产信息
      currentForeignKey: '',
      foreignKey: '',
      //当前正在删除的基本房产信息
      curForeignkeyDelete: '',
      item: {},
      //表单字段
      formList: [],
      // visible: true,
      pageLoading: false,
      saveLoading: false,
      btnLoading: false,
      //折叠面板的名字
      activeNames: [],
      //记录折叠面板------触发验证时打开对应折叠面板
      validActiveNames: [],

      //记录各个面板的完成进度
      progressName: {},

      showIssued: false
    };
  },
  props: ['productInfo'],
  components: {
    HtFixedBtn,
    TemplateForm,
    TemplateTable,
    TemplateIssued: () => import('../CommonTemplate/TemplateIssued')
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
    }
  },
  watch: {
    //监听身份证的变化获取年龄与性别
    watchIdentify(val) {
      this.$set(this.where.sim_customer, 'sex', validateIdCard(val, true).sex);
      this.$set(this.where.sim_customer, 'age', GetAge(val));
    },
    //当前正在删除的基本房产信息
    curForeignkeyDelete(val) {
      let where = this.where;
      let foreignKey = this.foreignKey;
      for (let i in where) {
        //判断为数组
        if (Object.prototype.toString.call(where[i]) === '[object Array]') {
          where[i] = where[i].filter(item => item[foreignKey] !== val);
        }
      }
    }
  },
  mounted() {
    //编辑页面进入的获取数据-----授信申请进入-----查询客户信息.如果有该用户信息则用该信息,否则把step1所填的信息记录
    this.getData();
  },
  methods: {
    //获取数据
    getData() {
      let step1 = getLocalStorage('step1');
      let params = {};
      //如果有step1的数据那么就是从第一部进来,否则从编辑页进入
      // console.log(step1);
      this.pageLoading = true;
      this.$api
        .detailConfig({
          id: this.$route.query.id ? this.$route.query.id : this.productInfo.sim_business_info.id
        })
        .then(res => {
          if (res.returnCode == '0000') {
            //获取数据
            this.productInfoFromData = res.data;
            let sim_customer = res.data.sim_customer;
            let sim_business_info = res.data.sim_business_info;
            step1 = {
              customer_type: sim_customer.customer_type,
              customer_name: sim_customer.customer_name,
              phone: sim_customer.phone,
              card_type: sim_customer.card_type,
              card_number: sim_customer.card_number,
              certificate_type_name: sim_customer.certificate_type_name,
              company_legal_person: sim_customer.company_legal_person,
              unified_code: sim_customer.unified_code,
              product_type_code: sim_business_info.product_type_code,
              product_type_name: sim_business_info.product_type_name,
              product_series_code: sim_business_info.product_series_code,
              product_series_name: sim_business_info.product_series_name,
              product_code: sim_business_info.product_code,
              product_name: sim_business_info.product_name,
              product_version: sim_business_info.product_version,
              original_id: sim_business_info.original_id,
              original_name: sim_business_info.original_name,
              original_branch_code: sim_business_info.original_branch_code,
              original_branch_name: sim_business_info.original_branch_name
            };
            setLocalStorage('step1', step1);
            //获取进件要素的配置
            params.productCode = step1.product_code;
            params.entryElementType = 'ACCREDIT_CREDIT_ELEMENTS';
            params.customerType = step1.customer_type;
            params.productVersion = step1.product_version;
            this.getEntryElementInfoDetai(params);
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    //获取动态的配置
    getEntryElementInfoDetai(params) {
      this.$api.getEntryElementInfoDetai(params).then(res => {
        if (res.returnCode == '0000') {
          this.myData = res.data;
          // this.initData(this.myData);
          this.forInInitMyData(this.myData);
          this.pageLoading = false;
        } else {
          this.$message.error('获取数据异常!');
        }
      });
    },
    //给虚拟字段赋值,给联动初始化,配置默认值
    forInInitMyData(_list) {
      this.where = this.detailData;
      //先把产品信息单独拿出来
      // this.$set(this.where, 'sim_business_info', local.sim_business_info);
      // for (let m in _list) {
      _list.forEach(x => {
        this.activeNames.push(x.entryElementClassifyCode);
        this.validActiveNames = this.activeNames;
        let showType = x.showType;
        let classifyList = x.classifyList;
        let fieldList = x.fieldList;
        let tableName = x.tableName;
        if (showType === 'LIST') {
          //配置信息在第一层
          if (classifyList.length === 0) {
            //判断是否有值,没有赋值为空数组
            if (!this.where[tableName]) {
              this.where[tableName] = [];
            } else {
              //给数组赋值
              for (let i = 0; i < this.where[tableName].length; i++) {
                this.forFieldList(this.where[tableName][i], fieldList, x);
              }
            }
          } else {
            //配置信息在第二层--递归
            this.forInInitMyData(classifyList);
          }
        }
        if (showType === 'FORM') {
          //判断是否有值,有值带上id
          if (!this.where[tableName]) {
            this.where[tableName] = {};
          } else {
            this.forFieldList(this.where[tableName], fieldList, x);
          }
        }
        if (showType === 'TABLIST') {
          //配置信息在第二层--递归
          this.forInInitMyData(classifyList);
        }
      });
    },
    //给虚拟字段赋值,给联动初始化,配置默认值
    forFieldList(tableName, fieldList, _list) {
      for (let k in fieldList) {
        //目前只有级联选择器是虚拟字段
        if (fieldList[k].controlType === 'CASCADE_SELECT') {
          let fillingFieldCode = null;
          let fillingParamName = null;
          let addressCode = [];
          let addressName = [];
          let dataFillingList = fieldList[k].dataFillingList;
          for (let z in dataFillingList) {
            fillingFieldCode = dataFillingList[z].fillingFieldCode;
            fillingParamName = dataFillingList[z].fillingParamName;
            for (let m in fieldList) {
              if (fieldList[m].fieldCode === fillingFieldCode) {
                if (fillingParamName == 'name[0]') {
                  addressName[0] = tableName[fieldList[m].fieldName];
                } else if (fillingParamName == 'name[1]') {
                  addressName[1] = tableName[fieldList[m].fieldName];
                } else if (fillingParamName == 'name[2]') {
                  addressName[2] = tableName[fieldList[m].fieldName];
                } else if (fillingParamName == 'code[0]') {
                  addressCode[0] = tableName[fieldList[m].fieldName];
                } else if (fillingParamName == 'code[1]') {
                  addressCode[1] = tableName[fieldList[m].fieldName];
                } else if (fillingParamName == 'code[2]') {
                  addressCode[2] = tableName[fieldList[m].fieldName];
                }
              }
            }
          }
          if (addressName[0] == null) {
            this.$set(tableName, fieldList[k].fieldName, null);
          } else {
            this.$set(tableName, fieldList[k].fieldName, addressCode);
          }
        }
        // 配置里是否要默认值,如果获取的数据里为null或空,则可以附默认值
        if (fieldList[k].defaultValue !== '') {
          if (tableName[fieldList[k].fieldName] == null || tableName[fieldList[k].fieldName] == '') {
            let defaultValue = fieldList[k].defaultValue;
            this.$set(tableName, fieldList[k].fieldName, defaultValue);
            //如果有填充数据,则默认的填充数据也要填上
            let dataFillingList = fieldList[k].dataFillingList;
            if (dataFillingList) {
              for (let h in dataFillingList) {
                let fillingFieldCode = dataFillingList[h].fillingFieldCode;
                let fillingParamName = dataFillingList[h].fillingParamName;
                for (let z in fieldList) {
                  if (fieldList[z].fieldCode === fillingFieldCode) {
                    if (fillingParamName == 'name') {
                      // 数据来源PCC
                      if (fieldList[k].dataSourceType == 'PCC') {
                        let dataSource = this.$store.state.baseData[fieldList[k].dataSource];
                        let defaultValueName = codeToName(defaultValue, dataSource);
                        this.$set(tableName, fieldList[z].fieldName, defaultValueName);
                        // 数据来源JSON
                      } else if (fieldList[k].dataSourceType == 'JSON') {
                        let dataSource = JSON.parse(itemX.dataSource);
                        for (let n in dataSource) {
                          if (dataSource[n].code == itemX.defaultValue) {
                            this.$set(tableName, fieldList[z].fieldName, dataSource[n].name);
                            break;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        // 联动初始化
        if (fieldList[k].gangedList) {
          this.setGangedList(tableName[fieldList[k].fieldName], fieldList[k].gangedList, fieldList, _list);
        }
      }
    },
    //设置联动
    setGangedList(curSelectValue, gangedList, fieldList, _list) {
      //判断下拉框或单选框选择值后的联动值
      if (gangedList && gangedList.length > 0) {
        // for (let i in gangedList) {
        gangedList.forEach(x => {
          let selectValue = x.selectValue;
          //当前值等于此对象的值,则其联动如下
          if (curSelectValue == selectValue) {
            let showFieldCodeArray = x.showFieldCode.split(',');
            let hideFieldCodeArray = x.hideFieldCode.split(',');
            for (let m in showFieldCodeArray) {
              let fieldCode = showFieldCodeArray[m];
              for (let j in fieldList) {
                //找到要的值
                if (fieldCode == fieldList[j].fieldCode) {
                  this.$set(_list.fieldList[j], 'isShow', true);
                }
              }
            }
            for (let m in hideFieldCodeArray) {
              let fieldCode = hideFieldCodeArray[m];
              for (let j in fieldList) {
                //找到要的值
                if (fieldCode == fieldList[j].fieldCode) {
                  this.$set(_list.fieldList[j], 'isShow', false);
                }
              }
            }
          }
        });

        // }
      }
    },
    //监听子元素的方法
    clickDialogTable(title) {
      this.dialogTable.visible = true;
      this.dialogTable.title = title;
    },
    //保存--------
    save(type) {
      let myData = this.myData;
      //过滤params
      let params = this.forInMyData(myData);
      // 保存草稿
      if (type == 1) {
        this.saveConfig(1, params);
        return false;
      }
      //下一步
      let flag = this.validateForm();
      if (flag) {
        this.saveConfig(2, params);
      } else {
        return false;
      }
    },
    //保存/下一步
    saveConfig(type, params) {
      let loading, message;
      if (type == 1) {
        loading = this.saveLoading;
        message = '保存草稿成功';
      } else {
        loading = this.btnLoading;
        message = '保存成功';
      }
      loading = true;
      this.$api.saveConfig(params).then(res => {
        loading = false;
        if (res.returnCode == '0000') {
          if (type == 1) {
            for (let i in res.data) {
              this.$set(this.where, i, res.data[i]);
              this.forInInitMyData(this.myData);
            }
          } else {
            this.$emit('nextTo', 2, res.data);
          }
          this.$message.success(message);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //验证是否有未填的必填信息--并跳转至未填信息处
    validateForm() {
      let flag = true;
      let formValidate = this.$refs.form;
      let tableValidate = this.$refs.table;
      let formLength = this.$refs.form.length;
      let tableLength = this.$refs.table.length;
      try {
        for (let i = 0; i < formLength; i++) {
          let validate = formValidate[i];
          flag = validate.validateForm().flag;
          let obj = validate.validateForm().obj;
          //如果有一个验证不通过.终止验证
          if (!flag) {
            // 验证不通过-滚动到相应表单
            validScrollTop(obj);
            //打开所有折叠面板
            this.activeNames = this.validActiveNames;
            break;
          }
        }
        for (let i = 0; i < tableLength; i++) {
          let validate = tableValidate[i];
          let item = validate.item;
          let isRequied = item.isNeedData;
          if (isRequied) {
            if (!this.where[item.tableName].length) {
              this.$message.error('请至少填写一条' + item.entryElementClassifyName);
              flag = false;
              break;
            }
          }
        }
      } catch (error) {}
      return flag;
    },
    //过滤数据---运用了递归函数
    forInMyData(_list) {
      let params = this.filterParams;
      for (let m in _list) {
        let showType = _list[m].showType;
        let classifyList = _list[m].classifyList;
        let fieldList = _list[m].fieldList;
        let tableName = _list[m].tableName;
        if (showType === 'LIST') {
          //配置信息在第一层
          if (classifyList.length === 0) {
            for (let k in fieldList) {
              //是否虚拟数据
              let isVirtual = fieldList[k].isVirtual;
              let fieldName = fieldList[k].fieldName;
              for (let j in params[tableName]) {
                if (isVirtual) {
                  delete params[tableName][j][fieldName];
                }
                // debugger
                //删除多余数据
                this.deleteTableCrateInfo(params[tableName][j]);
              }
            }
          } else {
            //配置信息在第二层--递归
            this.forInMyData(classifyList);
          }
        }
        if (showType === 'FORM') {
          for (let k in fieldList) {
            //是否虚拟数据
            let isVirtual = fieldList[k].isVirtual;
            let fieldName = fieldList[k].fieldName;
            if (isVirtual) {
              delete params[tableName][fieldName];
            }
          }
          //删除多余数据
          this.deleteTableCrateInfo(params[tableName]);
        }
        if (showType === 'TABLIST') {
          //配置信息在第二层--递归
          this.forInMyData(classifyList);
        }
        //
      }
      // 去除业务其他信息,只保留id & business_id
      let id = params.sim_business_info.id;
      let business_id = params.sim_business_info.business_id;
      params.sim_business_info = {};
      params.sim_business_info.id = id;
      params.sim_business_info.business_id = business_id;

      return params;
    },
    //删除多余数据
    deleteTableCrateInfo(tableName) {
      delete tableName.create_datetime;
      delete tableName.create_operator;
      delete tableName.create_org_code;
      delete tableName.create_datetime;
      delete tableName.create_org_name;
      delete tableName.create_user_name;
      delete tableName.modifed_org_code;
      delete tableName.modifed_org_name;
      delete tableName.modifed_user_name;
      delete tableName.last_modified_datetime;
    },
    //格式化日期
    formatDate(format) {
      if (format != '' && format != null) {
        let _Array = format.split(':');
        let _Name = _Array[0];
        let _Rules = _Array[1];
        if (_Name == 'formatDate') {
          return _Rules;
        } else {
          return '';
        }
      } else {
        return format;
      }
    },
    //格式化日期的类型
    formatType(format) {
      if (format != '' && format != null) {
        let _Array = format.split(':');
        let _Name = _Array[0];
        let _Rules = _Array[1];
        if (_Name == 'formatDate') {
          if (_Rules == 'yyyy-MM-dd') {
            return 'date';
          }
          if (_Rules == 'yyyy-MM') {
            return 'month';
          }
          return;
        } else {
          return '';
        }
      } else {
        return format;
      }
    },
    //添加编辑
    addEdit(type, item, tableName, foreignKey) {
      this.currentForeignKey = '';//要清空当前的foreignKey,避免bug的发生
      // debugger
      this.foreignKey = foreignKey; //在此判断是否有附属关系tabList
      this.formList = item.fieldList;
      this.item = item;
      this.tableId = '';
      let tableInfo = {};
      this.tableName = tableName;
      this.formList.forEach(x => {
        if (!x.defaultValue) {
          tableInfo[x.fieldName] = null;
        } else {
          tableInfo[x.fieldName] = x.defaultValue;
        }
      });

      this.tableInfo = Object.assign({}, tableInfo);
      //重置校验规则
      if (this.$refs.tableForm) {
        this.$refs.tableForm.clearValidate();
      }
      //-----添加房产信息编辑
      if (foreignKey) {
        //新增房产信息不同之处在于它需要与权属人信息和房产抵押信息一对多---生成房产编号
        this.$api.getUniqCode({}).then(res => {
          if (res.returnCode == '0000') {
            this.$set(this.tableInfo, foreignKey, res.data);
          }
        });
      }
      this.dialogTable.visible = true;
      this.dialogTable.title = type + item.entryElementClassifyName;
    },
    //点击当前选中的基本房产信息-----其他信息
    addForeignKeyEdit(type, item, tableName, foreignKey, entryElementClassifyName, parentName) {
      console.log(type, item, tableName, foreignKey, entryElementClassifyName,parentName);
      if (this.currentForeignKey == '' || this.foreignKey != foreignKey) {
        this.$message.error('请先选择一条' + parentName);
        return false;
      }
      this.dialogTable.visible = true;
      this.dialogTable.title = type + item.entryElementClassifyName;
      this.formList = item.fieldList;
      this.item = item;
      this.tableName = tableName;
      this.tableId = '';
      let tableInfo = {};
      //新增--的名字及内容
      this.formList.forEach(x => {
        if (!x.defaultValue) {
          tableInfo[x.fieldName] = null;
        } else {
          tableInfo[x.fieldName] = x.defaultValue;
        }
      });
      this.tableInfo = Object.assign({}, tableInfo);
      //重置校验规则
      if (this.$refs.tableForm) {
        this.$refs.tableForm.clearValidate();
      }
      //-----添加房产信息编辑
      this.$set(this.tableInfo, foreignKey, this.currentForeignKey);
      this.foreignKey = foreignKey;
    },
    //点击当前选中的基本房产信息
    clickCurrentForeignKey(row, foreignKey) {
      if (row) {
        this.currentForeignKey = row[foreignKey];
        this.foreignKey = foreignKey;
      } else {
        this.currentForeignKey = '';
      }
      //消除除了当前table的选中状态
      for (let i in this.$refs) {
        let validateTable = this.$refs[i][0];

        try {
          if (validateTable.foreignKey && validateTable.foreignKey != foreignKey) {
            validateTable.setCurrentRow();
          }
        } catch (error) {}
      }
    },
    //保存编辑
    handleSave(tableId) {
      let foreignKey = this.foreignKey;
      //验证表单
      let flag = this.$refs.tableForm.validateForm().flag;
      if (flag) {
        let tableInfo = Object.assign({}, this.tableInfo);
        //区别是新增还是修改
        if (tableId !== '') {
          //相应数组进行更新
          this.$set(this.where[this.tableName], tableId, tableInfo);
          this.dialogTable.visible = false;
        } else {
          this.where[this.tableName].push(tableInfo);
          this.dialogTable.visible = false;
        }
      }
    },
    //修改编辑
    handleEdit(id, item, tableName, foreignKey) {
      this.dialogTable.visible = true;
      this.dialogTable.title = '修改' + item.entryElementClassifyName;
      this.tableName = tableName;
      this.item = item;
      this.formList = item.fieldList;
      this.tableInfo = {};
      //索引
      this.tableId = id;
      this.tableInfo = Object.assign({}, this.where[tableName][id]);
      //给虚拟字段赋值,给联动初始化,配置默认值
      this.forFieldList(this.tableInfo, item.fieldList, item);
      //清除验证
      if (this.$refs.tableForm) {
        this.$refs.tableForm.clearValidate();
      }
    },
    //修改foreignKey编辑
    handleForeignKeyEdit(id, item, tableName) {
      let curForeignKey = this.currentForeignKey;
      let foreignKey = this.foreignKey;
      this.dialogTable.visible = true;
      this.dialogTable.title = '修改' + item.entryElementClassifyName;
      this.tableName = tableName;
      this.item = item;
      this.formList = item.fieldList;
      // debugger
      this.tableInfo = {};
      console.log(id, item, tableName, foreignKey);
      //索引
      this.tableId = id;
      if (curForeignKey) {
        let curIndex = 0;
        for (let i = 0; i < this.where[tableName].length; i++) {
          if (this.where[tableName][i][foreignKey] == curForeignKey) {
            if (id == curIndex) {
              this.tableInfo = Object.assign({}, this.where[tableName][i]);
            }
            curIndex++;
          }
        }
      }
      //给虚拟字段赋值,给联动初始化,配置默认值
      this.forFieldList(this.tableInfo, item.fieldList, item);
      //清除验证
      if (this.$refs.tableForm) {
        this.$refs.tableForm.clearValidate();
      }
    },
    //删除table行
    handleDelete(id, row, tableName, foreignKey) {
      console.log(id, row, tableName, foreignKey);
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          //-----删除房产信息编辑-----监听房产当前要删除的房产信息---连带删除其他附属信息
          if (foreignKey) {
            this.curForeignkeyDelete = row[foreignKey];
            this.currentForeignKey = '';
            this.foreignKey = foreignKey;
          }
          this.where[tableName].splice(id, 1);
          this.$message.success('删除成功！');
        })
        .catch(() => {});
    },
    //删除房产信息其他附属信息table行
    handleForeignKeyDelete(id, row, tableName) {
      let currentForeignKey = this.currentForeignKey;
      let foreignKey = this.foreignKey;
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          if (currentForeignKey) {
            let curIndex = 0;
            for (let i = 0; i < this.where[tableName].length; i++) {
              if (this.where[tableName][i][foreignKey] == currentForeignKey) {
                if (id == curIndex) {
                  this.where[tableName].splice(i, 1);
                }
                curIndex++;
              }
            }
          }

          this.$message.success('删除成功！');
        })
        .catch(() => {});
    },
    handleSelect(menu) {
      //自制锚点
      let htTitle = document.querySelectorAll('.el-collapse-item__header');
      htTitle.forEach(x => {
        if (x.innerText === menu) {
          let scrollTopDom = document.querySelector('.el-main');
          scrollTopDom.scrollTop = x.offsetTop;
        }
      });
    },
    goTo() {
      // console.log('goBack');
      this.$router.back(-1);
      this.$emit('removeCurTag');
    },
    //计算每个菜单的进度条
    computedProgress(entryElementClassifyCode, tableName, fieldList) {
      //  console.log(111111111,tableName);

      let finishLength = 0;
      let finish = 0;
      if (fieldList != null) {
        //  console.log(fieldList);
        for (let i in fieldList) {
          // console.log(fieldList[i].fieldName);

          //非虚拟数据
          if (!fieldList[i].isVirtual && fieldList[i].isShow && this.where[tableName]) {
            finishLength++;
            //  console.log(fieldList[i].fieldName,this.where[tableName][fieldList[i].fieldName]);
            //非空数据
            if ((this.where[tableName][fieldList[i].fieldName] != null && this.where[tableName][fieldList[i].fieldName] !== '') || this.where[tableName][fieldList[i].fieldName] === 0) {
              // console.log(555555,fieldList[i].fieldName, this.where[tableName][fieldList[i].fieldName]);
              finish++;
            }
          }
        }
      } else {
        if (tableName && this.where[tableName]) {
          // console.log(this.where[tableName]);

          finishLength = this.where[tableName].length;
          finish = this.where[tableName].length;
        }
      }

      let percentage = (finish / finishLength) * 100;
      percentage = parseFloat(percentage.toFixed(0));
      percentage = isNaN(percentage) ? 0 : percentage;
      // console.log('111111111111', entryElementClassifyCode,finishLength, finish, percentage);
      //记录每个面板的进度
      this.$set(this.progressName, entryElementClassifyCode, percentage);
      return percentage;
    },
    computedProgress2(entryElementClassifyCode, classifyList) {
      // console.log(2222222,entryElementClassifyCode);
      let finishLength = 0;
      let finish = 0;
      if (classifyList) {
        classifyList.forEach((x, i) => {
          //完成情况为classifyList的长度*200;
          finishLength = (parseFloat(i) + 1) * 100;
          if (x.showType == 'FORM') {
            finish += this.computedProgress(x.entryElementClassifyCode, x.tableName, x.fieldList);
          } else if (x.showType == 'LIST') {
            finish += this.computedProgress(x.entryElementClassifyCode, x.tableName);
            // console.log(this.computedProgress(x.tableName));
          }
        });
      }
      let percentage = (finish / finishLength) * 100;
      percentage = parseFloat(percentage.toFixed(0));
      percentage = isNaN(percentage) ? 0 : percentage;
      // console.log(finishLength, finish, percentage);
      //记录每个面板的进度
      this.$set(this.progressName, entryElementClassifyCode, percentage);
      return percentage;
    },
    percentage() {
      let finishLength = 0;
      let finish = 0;
      let prototypeNum = 0;
      for (let i in this.progressName) {
        prototypeNum++;
        finish += this.progressName[i];
      }
      finishLength = parseFloat(prototypeNum) * 100;
      let percentage = (finish / finishLength) * 100;
      percentage = parseFloat(percentage.toFixed(0));
      percentage = isNaN(percentage) ? 0 : percentage;
      // console.log(finishLength, finish, percentage);
      return percentage;
    }
  },
  computed: {
    computedMyData() {
      if (this.myData.length) {
        return this.myData;
      }
    },
    //数据可能是从第一步穿过来,也可能是重新获取而来
    detailData() {
      if (!isEmpty(this.productInfo)) {
        return this.productInfo;
      } else if (!isEmpty(this.productInfoFromData)) {
        return this.productInfoFromData;
      }
    },
    watchIdentify() {
      try {
        if (this.where.sim_customer.card_number) {
          return this.where.sim_customer.card_number;
        }
      } catch (error) {}
    },
    filterParams() {
      var obj = {};
      obj = JSON.parse(JSON.stringify(this.where));
      return obj;
    },
    //获取共借人信息的必要条件
    IssuedObject() {
      try {
        let customerCode = this.where.sim_customer.customer_code;
        let businessId = this.where.sim_business_info.business_id;
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

<style lang="scss" scoped>
.classify-list + .classify-list {
  margin-top: 30px;
}
.ht-form-right {
  padding: 20px;
  margin-right: 100px !important;
  margin-bottom: 60px !important;
}
.item-title {
  font-size: 16px;
  line-height: 60px;
  color: #999;
  font-weight: 700;
  padding-left: 50px;
  // background: #f2f2f2;
}
.fixed-menu {
  line-height: 3;
  padding: 20px;
  padding-top: 10px;
  position: fixed;
  right: 10px;
  background: #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
  z-index: 9;
  cursor: pointer;
  overflow-y: auto;
  max-height: 65%;
  top: 15%;
}
</style>

