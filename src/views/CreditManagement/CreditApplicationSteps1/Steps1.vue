<template>
  <div v-loading="loading">
    <el-form :model='where' ref="formName" size="small" :rules="rules" class='hongte-query-form form-width' :inline='true' label-position="right" label-width="120px" :disabled="disabledForm" validate-on-rule-change>
      <el-form-item label="客户类型" prop="customer_type" class="f-item1">
        <el-radio-group v-model="where.customer_type" :value="0" :disabled="isHtCredit">
          <el-radio label="PERSON">个人客户</el-radio>
          <!-- <el-radio label="ENTERPRISE" v-if="!isHtCredit">企业客户</el-radio> -->
          <!-- <el-radio label="OTHER_ORG" v-if="!isHtCredit">其它组织</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <HtInput class="f-item1" label='客户名称' prop="customer_name" v-model="where.customer_name" :disabled="isHtCredit"></HtInput>
      <!-- 个人客户 -->
      <template v-if="isPerson">
        <HtInput class="f-item1" label='手机号码' prop="phone" v-model="where.phone" maxlength=11 :disabled="isHtCredit"></HtInput>
        <HtSelect class="f-item1" label='证件类型' prop="card_type" type="certificate_type" v-model="where.card_type" :name.sync="where.certificate_type_name" @change="changeCardType" :disabled="isHtCredit"></HtSelect>
        <HtInput v-if="where.card_type==='ID_card'||where.card_type===''" class="f-item1" label='证件号码' prop="card_number" :rules="rules.ID_card" v-model="where.card_number" maxlength=18 :disabled="isHtCredit"></HtInput>
        <HtInput v-if="where.card_type==='home_visit'" class="f-item1" label='证件号码' prop="card_number" :rules="rules.home_visit" v-model="where.card_number" maxlength=18 :disabled="isHtCredit"></HtInput>
        <HtInput v-if="where.card_type==='taiwan_card'" class="f-item1" label='证件号码' prop="card_number" :rules="rules.taiwan_card" v-model="where.card_number" maxlength=18 :disabled="isHtCredit"></HtInput>
      </template>
      <!-- 企业客户 其它组织 -->
      <template v-else>
        <HtInput class="f-item1" label='统一社会信用代码' prop="unified_code" v-model="where.unified_code"></HtInput>
        <HtInput class="f-item1" label='企业法人' prop="company_legal_person" v-model="where.company_legal_person"></HtInput>
        <HtInput class="f-item1" label='法人联系号码' prop="phone" v-model="where.phone" maxlength=11></HtInput>
      </template>
      <!-- 产品信息 -->
      <el-form-item label='产品类型' prop="product_type_code" class="f-item1">
        <el-select v-model='where.product_type_code' placeholder='请选择' :disabled="isHtCredit">
          <el-option v-for="(x,index) in filterProductType" :key="index" :label='x.productTypeName' :value='x.productTypeCode'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='产品系列' prop="product_series_code" class="f-item1">
        <el-select v-model='where.product_series_code' placeholder='请选择' :disabled="where.product_type_code==''||where.product_type_code==null||isHtCredit">
          <el-option v-for="(x,index) in product_series" :key="index" :label='x.productSeriesName' :value='x.productSeriesCode'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='产品' prop="product_code" class="f-item1">
        <el-select v-model='where.product_code' placeholder='请选择' :disabled="where.product_series_code==''||where.product_series_code==null">
          <el-option v-for="(x,index) in product_list" :key="index" :label='x.productName' :value='x.productCode'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='业务获取人' prop="original_id" class="f-item1">
        <el-select filterable v-model='where.original_id' placeholder='请选择'>
          <el-option v-for="(x,index) in sales_person" :key="index" :label='x.userName' :value='x.userId'></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <HtFixedBtn :percentage="percentage" :btnText="[{click:()=>{nextTo()},loading:btnLoading,text:'下一步'}]"></HtFixedBtn>
  </div>
</template>

<script>
import HtInput from '@components/HtInput';
import HtSelect from '@components/HtSelect';
import HtFixedBtn from '@components/HtFixedBtn';
import { Steps1Rules } from '@rules';
import { setLocalStorage, getLocalStorage, delLocalStorage, changeCodeName } from '@utils';
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'Steps1',
  data() {
    return {
      // isHaveCache: false,
      loading: false,
      btnLoading: false,
      rules: Steps1Rules,
      // userInfo: {},
      where: {
        customer_type: 'PERSON',
        customer_name: null,
        phone: null,
        card_type: null,
        card_number: null,
        certificate_type_name: null,
        product_type_code: null,
        product_type_name: null,
        product_series_code: null,
        product_series_name: null,
        product_code: null,
        product_name: null,
        product_version: null,
        original_id: null,
        original_name: null,
        original_branch_code: null,
        original_branch_name: null,
        company_legal_person: null,
        unified_code: null
      }
    };
  },
  props: ['isPre', 'productInfo'],
  components: {
    HtInput,
    HtSelect,
    HtFixedBtn
  },
  watch: {
    //产品类型
    'where.product_type_code': {
      handler: function(curVal) {
        if (curVal != null) {
          let name = changeCodeName(curVal, ['productTypeCode', 'productTypeName'], this.product_type);
          this.$set(this.where, 'product_type_name', name);
          this.$set(this.where, 'product_series_code', null);
          this.$set(this.where, 'product_code', null);
          //获取产品系列
          this.productSeries();
        }
      },
      immediate: true
    },
    //产品系列
    'where.product_series_code': {
      handler: function(curVal) {
        if (curVal != null) {
          let name = changeCodeName(curVal, ['productSeriesCode', 'productSeriesName'], this.product_series);
          this.$set(this.where, 'product_series_name', name);
          this.$set(this.where, 'product_code', null);
          //获取产品
          this.productList();
        }
      },
      immediate: true
    },
    //产品
    'where.product_code': {
      handler: function(curVal) {
        if (curVal != null) {
          let name = changeCodeName(curVal, ['productCode', 'productName'], this.product_list);
          let version = changeCodeName(curVal, ['productCode', 'version'], this.product_list);
          this.$set(this.where, 'product_name', name);
          this.$set(this.where, 'product_version', version);
        }
      },
      immediate: true
    },
    //业务获取人
    'where.original_id': {
      handler: function(curVal) {
        if (curVal != null) {
          let original_name = changeCodeName(curVal, ['userId', 'userName'], this.sales_person);
          let original_branch_code = changeCodeName(curVal, ['userId', 'branchCode'], this.sales_person);
          let original_branch_name = changeCodeName(curVal, ['userId', 'branchName'], this.sales_person);
          this.$set(this.where, 'original_name', original_name);
          this.$set(this.where, 'original_branch_code', original_branch_code);
          this.$set(this.where, 'original_branch_name', original_branch_name);
        }
      },
      immediate: true
    }
  },
  mounted() {
    //产品类型
    this.productType();
    //获取业务获取人
    this.getUserListByUserId();
    //获得产品列表后,判断是从哪个页面进入的
    this.initData();
  },
  methods: {
    //产品类型
    productType() {
      this.$api.getProductTypeList({}).then(res => {
        if (res.returnCode == '0000') {
          this.$store.commit('product_type', res.data);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //产品系列
    productSeries() {
      this.$api.getProductSeriesList({ productTypeCode: this.where.product_type_code }).then(res => {
        if (res.returnCode == '0000') {
          this.$store.commit('product_series', res.data);
          if (!this.where.product_series_code) {
            this.$set(this.where, 'product_series_code', res.data[0].productSeriesCode);
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //产品
    productList() {
      this.$api.getProductList({ productSeriesCode: this.where.product_series_code }).then(res => {
        if (res.returnCode == '0000') {
          this.$store.commit('product_list', res.data);
          if (!this.where.product_code) {
            this.$set(this.where, 'product_code', res.data[0].productCode);
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //获取业务获取人
    getUserListByUserId() {
      this.$api.getUserListByUserId({}).then(res => {
        if (res.returnCode == '0000') {
          this.$store.commit('sales_person', res.data);
          var userInfo = getLocalStorage('userInfo');
          this.where.original_id = userInfo.userId;
          this.where.original_name = userInfo.userName;
          this.where.original_branch_code = userInfo.branchCode;
          this.where.original_branch_name = userInfo.branchName;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    initData() {
      let step1 = getLocalStorage('step1');
      if (step1) {
        this.where = Object.assign(this.where, step1);
      } else {
        this.getDetailCofig();
      }
    },
    getDetailCofig() {
      let id = this.$route.query.id;
      if (!id) {
        return false;
      }
      let step1 = {};
      this.$api.detailConfig({ id }).then(res => {
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
          this.where = Object.assign(this.where, step1);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //重置校验规则
    changeCardType(val) {
      this.$nextTick(() => {
        this.$refs.formName.validateField('card_number');
      });
    },
    nextTo() {
      let isPerson = this.isPerson;
      if (this.isPre) {
        this.$emit('nextTo', 1, this.productInfo);
      } else {
        this.$refs.formName.validate(valid => {
          if (valid) {
            //下一步---提交
            this.btnLoading = true;
            let params = this.params;
            let id = this.$route.query.id;
            if (id) {
              params.id = id;
            }
            //保存
            this.$api.saveCreditBasicInfo(params).then(res => {
              this.btnLoading = false;
              if (res.returnCode == '0000') {
                // let productInfo = res.data.sim_business_info.business_id;
                let productInfo = res.data;
                console.log(params);

                setLocalStorage('step1', params);
                this.$emit('nextTo', 1, productInfo);
              } else {
                this.$message.error(res.msg);
              }
            });
          } else {
            return false;
          }
        });
      }
    }
  },
  computed: {
    ...mapGetters(['localTheme', 'asideWidth', 'product_type', 'product_series', 'product_list', 'sales_person']),
    isPerson() {
      try {
        this.$refs.formName.clearValidate();
        this.$nextTick(() => {
          this.$refs.formName.validate(valid => {});
        });
      } catch (error) {}
      if (this.where.customer_type === 'PERSON') {
        return true;
      } else {
        return false;
      }
    },
    disabledForm() {
      return this.isPre;
    },
    //是鸿保贷
    isHtCredit() {
      if (this.$route.query.isHt == 'Y') {
        return true;
      } else {
        return false;
      }
    },
    filterProductType() {
      let product_type = this.product_type;
      if (this.isHtCredit) {
        return product_type;
      } else {
        return product_type.filter(item => item.isNormal == true);
      }
    },
    //资料完成情况
    percentage() {
      let length = 0;
      let finishLength = 0;
      let params = this.params;
      for (const key in params) {
        length++;
        if (params[key] !== null && params[key] !== '') {
          finishLength++;
        }
      }
      let percentage = (finishLength / length) * 100;
      percentage = parseFloat(percentage.toFixed(0));
      percentage = isNaN(percentage) ? 0 : percentage;
      return percentage;
    },
    params() {
      let params = Object.assign({}, this.where);
      let newParams = {};
      if (this.isPerson) {
        delete params.company_legal_person;
        delete params.unified_code;
        newParams = params;
      } else {
        delete params.card_type;
        delete params.certificate_type_name;
        delete params.card_number;
        newParams = params;
      }

      return newParams;
    }
  }
};
</script>

<style lang="scss" scoped>
.form-width {
  width: 500px;
  margin: 0 auto;
}
</style>


