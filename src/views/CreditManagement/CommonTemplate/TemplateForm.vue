<template>
  <el-form :model="model" ref="formName" size="small" class='hongte-query-form' :inline='true' label-position="right" label-width="120px">
    <template v-for="(itemX,idX) in item.fieldList">
      <!-- 输入框 -->
      <HtInput v-if="itemX.controlType=='INPUT'&&itemX.isShow&&itemX.fieldDataType!='INT'&&itemX.fieldDataType!='DECIMAL'" :key="idX" :class="fItem(itemX.isRow)" :label='itemX.fieldCnName' :prop="itemX.fieldName" v-model='where[itemX.fieldName]' :maxlength="String(itemX.fieldLength)" :rules="validatorRules(itemX)" @change="handleChange(where[itemX.fieldName],itemX.dataFunctionList)"></HtInput>
      <HtInput v-if="itemX.controlType=='INPUT'&&itemX.isShow&&(itemX.fieldDataType=='INT'||itemX.fieldDataType=='DECIMAL')" :key="idX" :class="fItem(itemX.isRow)" :label='itemX.fieldCnName' :prop="itemX.fieldName" v-model.number='where[itemX.fieldName]' :maxlength="String(itemX.fieldLength)" :rules="validatorRules(itemX)"></HtInput>
      <!-- 文本域 -->
      <HtInput v-else-if="itemX.controlType=='TEXTAREA'&&itemX.isShow" type="textarea" rows=3 :key="idX" :class="fItem(itemX.isRow)" :label='itemX.fieldCnName' :prop="itemX.fieldName" v-model='where[itemX.fieldName]' :maxlength="String(itemX.fieldLength)" :rules="validatorRules(itemX)"></HtInput>
      <!-- 选择框 -->
      <HtSelect v-else-if="itemX.controlType=='SELECT'&&itemX.isShow" :key="idX" filterable :class="fItem(itemX.isRow)" :label='itemX.fieldCnName' :prop="itemX.fieldName" @setNameVal="setNameVal(where,item,itemX)" :name.sync="changeName" :type="itemX.dataSourceType!='JSON'?itemX.dataSource:null" :dataSource="itemX.dataSourceType=='JSON'?itemX.dataSource:null" v-model="where[itemX.fieldName]" :maxlength="String(itemX.fieldLength)" :rules="validatorRules(itemX)"></HtSelect>
      <!-- 单选框 -->
      <HtRadio v-else-if="itemX.controlType=='RADIO'&&itemX.isShow" @setNameVal="setNameVal(where,item,itemX)" :name.sync="changeName" :key="idX" :class="fItem(itemX.isRow)" :label='itemX.fieldCnName' :prop="itemX.fieldName" v-model="where[itemX.fieldName]" :maxlength="String(itemX.fieldLength)" :rules="validatorRules(itemX)" :type="itemX.dataSourceType!='JSON'?itemX.dataSource:null" :dataSource="itemX.dataSourceType=='JSON'?itemX.dataSource:null"></HtRadio>
      <!-- 时间选择器  -->
      <HtPicker v-else-if="itemX.controlType=='DATE'&&itemX.isShow" :key="idX" :class="fItem(itemX.isRow)" :type="formatType(itemX.format)" :label='itemX.fieldCnName' :prop="itemX.fieldName" v-model="where[itemX.fieldName]" :maxlength="String(itemX.fieldLength)" :rules="validatorRules(itemX)" :format="formatDate(itemX.format)"></HtPicker>
      <!-- 级联选择器  -->
      <el-form-item v-else-if="itemX.controlType=='CASCADE_SELECT'&&itemX.isShow" :key="idX" :label='itemX.fieldCnName' :prop="itemX.fieldName" :class="fItem(itemX.isRow)" :rules="validatorRules(itemX)">
        <AddressArea :value="where[itemX.fieldName]" v-model="where[itemX.fieldName]" @getData="getCascadeVal(arguments[0],arguments[1],item,itemX,where)"></AddressArea>
      </el-form-item>

    </template>
  </el-form>
</template>

<script>
import AddressArea from '@components/AddressArea';
import HtRadio from '@components/HtRadio';
import HtPicker from '@components/HtPicker';
import HtInput from '@components/HtInput';
import HtSelect from '@components/HtSelect';
import { isEmpty, GetAge, validateIdCard } from '@utils';
export default {
  name: 'TemplateForm',
  data() {
    return {
      //选择的要素名字
      changeName: ''
    };
  },
  props: ['where', 'item', 'model', 'itemClass'],
  components: {
    AddressArea,
    HtRadio,
    HtPicker,
    HtInput,
    HtSelect
  },
  methods: {
    //级联选择器
    getCascadeVal(code, name, item, itemX, tableName) {
      // debugger
      let hideFieldName;
      let fieldList = item.fieldList;
      console.log(item, itemX);
      let dataFillingList = itemX.dataFillingList;
      //判断下拉框或单选框的选择值的名称
      if (dataFillingList && dataFillingList.length > 0) {
        for (let i in dataFillingList) {
          let fillingFieldCode = dataFillingList[i].fillingFieldCode;
          let fillingParamName = dataFillingList[i].fillingParamName;
          for (let j in fieldList) {
            if (fillingFieldCode == fieldList[j].fieldCode) {
              console.info(fieldList[j].fieldName);
              hideFieldName = fieldList[j].fieldName;
              if (fillingParamName == 'code[0]') {
                this.$set(tableName, hideFieldName, code[0]);
              } else if (fillingParamName == 'code[1]') {
                this.$set(tableName, hideFieldName, code[1]);
              } else if (fillingParamName == 'code[2]') {
                this.$set(tableName, hideFieldName, code[2]);
              } else if (fillingParamName == 'name[0]') {
                this.$set(tableName, hideFieldName, name[0]);
              } else if (fillingParamName == 'name[1]') {
                this.$set(tableName, hideFieldName, name[1]);
              } else if (fillingParamName == 'name[2]') {
                this.$set(tableName, hideFieldName, name[2]);
              }
              this.$set(tableName, itemX.fieldName, [code[0], code[1], code[2]]);

              break;
            }
          }
        }
      }
    },
    //验证规则
    validatorRules(item) {
      let validatorMethod = (rule, value, callback) => {
        if (item.dataValidateList.length && value !== '' && value != null) {
          item.dataValidateList.forEach(x => {
            //验证规则----正则方法
            if (x.validationMode == 'FORMAL_EXPRESSION') {
              let ruleName = x.validationRule;
              let validationTip = x.validationTip;
              let regex =null;
              try {
                regex = new RegExp(eval(ruleName));
              } catch (error) {
                callback(new Error('正则配置错误,请前往产品中心修改'));
              }
              if (regex.test(value)) {
                callback();
              } else {
                if (validationTip != '') {
                  callback(new Error(validationTip));
                } else {
                  callback(new Error('请输入正确的格式'));
                }
              }
              //其他验证方法
            } else {
              callback();
              // return callback(new Error('请输入数值'));
            }
          });
        } else {
          callback();
        }
      };
      let trigger = [];
      if (item.controlType == 'SELECT' || item.controlType == 'RADIO'||item.controlType == 'CASCADE_SELECT') {
        trigger = ['blur', 'change'];
      } else {
        trigger = ['blur'];
      }
      return [{ required: item.isRequired, message: '请输入' + item.fieldCnName, trigger: 'blur' }, { validator: validatorMethod, trigger: trigger }];
    },
    //判断是否有onchange方法
    handleChange(val, methodList) {
      // console.log(222, val, isEmpty(methodList));
      if (!isEmpty(methodList)) {
        let funcName = methodList[0].function;
        let functionType = methodList[0].functionType;
        if (functionType == 'FUNCTION_NAME' && funcName == 'getAgeForIdentify') {
          if (validateIdCard(val)) {
            let Obj = validateIdCard(val, true);
            this.$set(this.where.sim_customer, 'sex', Obj.sex);
            this.$set(this.where.sim_customer, 'age', GetAge(val));
            // console.log(Obj);
          }
        }
      }
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
          return 'yyyy-MM-dd';
        }
      } else {
        return 'yyyy-MM-dd';
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
    //选择器
    setNameVal(Obj, item, itemX) {
      let hideFieldName;
      let fieldList = item.fieldList;
      let dataFillingList = itemX.dataFillingList;
      //判断下拉框或单选框的选择值的名称
      if (dataFillingList && dataFillingList.length > 0) {
        for (let i in dataFillingList) {
          let fillingFieldCode = dataFillingList[i].fillingFieldCode;
          let fillingParamName = dataFillingList[i].fillingParamName;
          for (let j in fieldList) {
            if (fillingFieldCode == fieldList[j].fieldCode) {
              // console.info(fieldList[j].fieldName);
              hideFieldName = fieldList[j].fieldName;
              if (fillingParamName == 'name') {
                // console.log(hideFieldName);
                //给name赋值
                if (this.changeName) {
                  Obj[hideFieldName] = this.changeName;
                }
              } else {
              }
              break;
            }
          }
        }
      }
      //设置联动
      this.setGangedList(Obj,Obj[itemX.fieldName], itemX.gangedList, fieldList, item);
    },
    //验证规则
    validateForm() {
      let flag = {
        flag: false,
        obj: ''
      };
      this.$refs['formName'].validate((valid, obj) => {
        flag.flag = valid;
        flag.obj = obj;
      });
      return flag;
    },
    //清除已验证的情况
    clearValidate() {
      this.$refs['formName'].clearValidate();
    },
    //设置联动
    setGangedList(Obj,curSelectValue, gangedList, fieldList, _list) {
      //判断下拉框或单选框选择值后的联动值
      if (gangedList && gangedList.length > 0) {
        // for (let i in gangedList) {
        for(let i=0;i<gangedList.length;i++){
          let selectValue = gangedList[i].selectValue;
          //当前值等于此对象的值,则其联动如下
          if (curSelectValue == selectValue) {
            let showFieldCodeArray = gangedList[i].showFieldCode.split(',');
            let hideFieldCodeArray = gangedList[i].hideFieldCode.split(',');
            // for (let m in showFieldCodeArray) {
            for(let m=0;m<showFieldCodeArray.length;m++){
              let fieldCode = showFieldCodeArray[m];
              // for (let j in fieldList) {
              for(let j=0;j<fieldList.length;j++){
                //找到要的值--为空
                let fieldName = fieldList[j].fieldName;
                if (fieldCode == fieldList[j].fieldCode) {
                  this.$set(_list.fieldList[j], 'isShow', true);
                }
              }
            }
            // for (let m in hideFieldCodeArray) {
            for(let m=0;m<hideFieldCodeArray.length;m++){
              let fieldCode = hideFieldCodeArray[m];
              // for (let j in fieldList) {
                for(let j=0;j<fieldList.length;j++){
                //找到要的值
                let fieldName = fieldList[j].fieldName;
                if (fieldCode == fieldList[j].fieldCode) {
                  this.$set(_list.fieldList[j], 'isShow', false);
                  //隐藏的值至为空
                  this.$set(Obj, fieldName, null);
                }
              }
            }
          }
        }
      }
    },
    //表单样式
    fItem(isRow) {
      if (isRow) {
        return 'f-item1';
      } else {
        return this.itemClass;
      }
    }
  }
};
</script>
