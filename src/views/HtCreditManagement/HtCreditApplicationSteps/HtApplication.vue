<template>
  <div v-loading="loading">
    <el-form :model='where' ref="formName" size="small" :rules="rules" class='hongte-query-form form-width' :inline='true' label-position="right" label-width="120px" validate-on-rule-change>
      <HtInput class="f-item1" label='客户名称' prop="customerName" v-model="where.customerName"></HtInput>
      <HtInput class="f-item1" label='手机号码' prop="phone" v-model="where.phone" maxlength=11></HtInput>
      <HtSelect class="f-item1" label='证件类型' prop="cardType" type="certificate_type" v-model="where.cardType" :name.sync="where.certificateTypeName" @change="changeCardType"></HtSelect>
      <HtInput v-if="where.cardType==='ID_card'||where.cardType===''" class="f-item1" label='证件号码' prop="cardNumber" :rules="rules.ID_card" v-model="where.cardNumber" maxlength=18></HtInput>
      <HtInput v-if="where.cardType==='home_visit'" class="f-item1" label='证件号码' prop="cardNumber" :rules="rules.home_visit" v-model="where.cardNumber" maxlength=18></HtInput>
      <HtInput v-if="where.cardType==='taiwan_card'" class="f-item1" label='证件号码' prop="cardNumber" :rules="rules.taiwan_card" v-model="where.cardNumber" maxlength=18></HtInput>
      <!-- 产品信息 -->
      <el-form-item label='产品类型' prop="productTypeCode" class="f-item1">
        <el-select v-model='where.productTypeCode' placeholder='请选择' @change="where.productTypeName =changeCodeName(where.productTypeCode,['productTypeCode','productTypeName'],product_type)" disabled>
          <el-option v-for="(x,index) in product_type" :key="index" :label='x.productTypeName' :value='x.productTypeCode'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='产品系列' prop="productSeriesCode" class="f-item1">
        <el-select v-model='where.productSeriesCode' placeholder='请选择' @change="where.productSeriesName =changeCodeName(where.productSeriesCode,['productSeriesCode','productSeriesName'],product_series)">
          <el-option v-for="(x,index) in product_series" :key="index" :label='x.productSeriesName' :value='x.productSeriesCode'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='产品' prop="productCode" class="f-item1">
        <el-select v-model='where.productCode' placeholder='请选择' @change="where.productName = changeCodeName(where.productCode,['productCode','productName'],product_list);where.productVersion = changeCodeName(where.productCode,['productCode','version'],product_list)">
          <el-option v-for="(x,index) in product_list" :key="index" :label='x.productName' :value='x.productCode'></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-row class="bottom-btn">
      <el-button type="primary" @click="submit">提 交</el-button>
      <el-button @click="$emit('closeDialog')">关 闭</el-button>
    </el-row>
    <!-- <HtFixedBtn :percentage="percentage()" :btnText="[{click:()=>{nextTo()},loading:btnLoading,text:'下一步'}]"></HtFixedBtn> -->
  </div>
</template>

<script>
import HtInput from '@components/HtInput';
import HtSelect from '@components/HtSelect';
import { HtApplicationRules } from '@rules';
import { setLocalStorage, getLocalStorage, delLocalStorage, changeCodeName, isEmpty } from '@utils';
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'HtApplication',
  data() {
    return {
      loading: false,
      btnLoading: false,
      rules: HtApplicationRules,
      userInfo: {},
      where: {
        customerName: '',
        phone: '',
        cardType: '',
        cardNumber: '',
        certificateTypeName: '',
        productTypeCode: '',
        productTypeName: '',
        productSeriesCode: '',
        productSeriesName: '',
        productCode: '',
        productName: '',
        productVersion: ''
      }
    };
  },
  props: ['postData'],
  components: {
    HtInput,
    HtSelect
  },
  watch: {
    changeProductType(val) {
      this.productSeries();
    },
    changepProductSeries(val) {
      this.productList();
    },
    getNewData(val) {
      this.where = Object.assign(this.where, val);
    }
  },
  beforeMount() {
    //产品类型
    this.productType();
    if (this.postData) {
      this.where = Object.assign(this.where, this.postData);
    }
  },
  methods: {
    clearValidate() {
      this.$refs.formName.clearValidate();
      let vm = this;
      setTimeout(function() {
        vm.$refs.formName.validate(valid => {});
      }, 10);
    },
    productType() {
      this.$api.getProductTypeList({}).then(res => {
        if (res.returnCode == '0000') {
          this.$store.commit('product_type', res.data);
          for (let i in res.data) {
            if (res.data[i].productTypeCode == 'Agency_Loan') {
              this.where.productTypeCode = res.data[i].productTypeCode;
              this.where.productTypeName = res.data[i].productTypeName;
            }
            // this.where.productTypeCode = this.product_type.length ? this.product_type[0].productTypeCode : '';
            // this.where.productTypeName = this.product_type.length ? this.product_type[0].productTypeName : '';
          }

          // this.productSeries();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //产品系列类型
    productSeries() {
      // this.loading = true;
      if (!this.where.productTypeCode) {
        return false;
      }
      this.$api.getProductSeriesList({ productTypeCode: this.where.productTypeCode }).then(res => {
        this.loading = false;
        if (res.returnCode == '0000') {
          this.$store.commit('product_series', res.data);
          this.where.productSeriesCode = this.product_series.length ? this.product_series[0].productSeriesCode : '';
          this.where.productSeriesName = this.product_series.length ? this.product_series[0].productSeriesName : '';
          this.where.productCode = this.product_series.length ? this.product_series[0].productCode : '';
          this.where.productName = this.product_series.length ? this.product_series[0].productName : '';
          this.where.productVersion = this.product_series.length ? this.product_series[0].version : '';
          // this.productList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //产品列表
    productList() {
      // this.loading = true;
      if (!this.where.productSeriesCode) {
        return false;
      }
      this.$api.getProductList({ productSeriesCode: this.where.productSeriesCode }).then(res => {
        this.loading = false;
        if (res.returnCode == '0000') {
          this.$store.commit('product_list', res.data);
          this.where.productCode = this.product_list.length ? this.product_list[0].productCode : '';
          this.where.productName = this.product_list.length ? this.product_list[0].productName : '';
          this.where.productVersion = this.product_list.length ? this.product_list[0].version : '';
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //重置校验规则
    changeCardType(val) {
      setTimeout(() => {
        this.$refs.formName.validateField('cardNumber');
      }, 100);
    },
    //提交
    submit() {
      this.$refs.formName.validate(valid => {
        if (valid) {
          if (!this.where.id) {
            this.addData();
          } else {
            this.modifyData();
          }
        } else {
          return false;
        }
      });
    },
    //修改
    modifyData() {
      this.$api.preContractInfoUpdate(this.where).then(res => {
        if (res.returnCode == '0000') {
          this.where = {};
          this.$message.success('提交成功!');
          this.$emit('closeDialog');
          this.$emit('getData');
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //新增
    addData() {
      this.$api.preContractInfoSave(this.where).then(res => {
        if (res.returnCode == '0000') {
          this.where = {};
          this.$message.success('提交成功!');
          this.$emit('closeDialog');
          this.$emit('getData');
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  },
  computed: {
    ...mapGetters(['product_type', 'product_series', 'product_list', 'sales_person']),
    changeCodeName() {
      return changeCodeName;
    },
    //产品类型改变
    changeProductType() {
      if (this.where.productTypeCode) {
        return this.where.productTypeCode;
      } else {
        return '';
      }
    },
    //产品系列改变
    changepProductSeries() {
      if (this.where.productSeriesCode) {
        return this.where.productSeriesCode;
      } else {
        return '';
      }
    },
    getNewData() {
      return this.postData;
    }
  }
};
</script>

<style lang="scss" scoped>
.form-width {
  width: 500px;
  margin: 0 auto;
}
.bottom-btn {
  width: 100%;
  text-align: center;
  padding-top: 20px;
}
</style>


