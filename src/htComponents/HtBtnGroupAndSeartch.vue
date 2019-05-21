<template>
  <div class="aside-btn is-clear">
    <el-row class="buss-btn" v-if="rightBtnText">
      <el-button size="small" type="primary" @click="$emit('rightBtn')" :icon="`fa `+rightIcon"> {{rightBtnText}}</el-button>
    </el-row>
    <el-row class="buss-btn" v-if="centreBtnText">
      <el-button size="small" type="primary" @click="dialogFormVisible = true" :icon="`fa `+centreIcon"> {{centreBtnText}}</el-button>
    </el-row>
    <el-button-group class="selec-btn">
      <el-button :disabled="type==null" size="small" type="primary" icon="fa fa-check" @click="changeType(null)"> 全部</el-button>
      <el-button :disabled="type=='1'" size="small" type="primary" icon="fa fa-skyatlas" @click="changeType('1')"> 草稿</el-button>
      <el-button :disabled="type=='3'" size="small" type="primary" icon="fa fa-spinner" @click="changeType('3')"> 待审</el-button>
      <el-button :disabled="type=='4'" size="small" type="primary" icon="fa fa-star-o" @click="changeType('4')"> 通过</el-button>
      <el-input v-model.trim="keyword" size="small" class="search-input" :placeholder="placeholder" :title="title" @keyup.enter.native="changeType(null)">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </el-button-group>

    <el-dialog title="查询可上标金额" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-width="120px" :rules="rules" ref="canQueryMoney">
        <el-form-item label="平台">
          <el-radio-group v-model="form.platform">
            <el-radio label="1">团贷网</el-radio>
            <el-radio label="2">你我金融</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="证件类型">
          <el-select v-model="form.value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="证件号" prop="cardNumber">
          <el-input v-model="form.cardNumber" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="借款人名字" prop="name" v-if="form.platform=='2'">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="借款人手机号码" prop="phone" v-if="form.platform=='2'">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="可上标金额">{{form.issueMoney}}</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="queryCanIssueMoney('canQueryMoney')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'HtBtnGroupAndSeartch',
  data() {
    return {
      keyword: '',
      type: null,
      form: {
        issueMoney: 0,
        platform: '1',
        value: 'PERSON'
      },
      rules: {
        cardNumber: [{ required: true, message: '请填写证件号码', trigger: 'change' }],
        name: [{ required: true, message: '请填写借款人姓名', trigger: 'change' }],
        phone: [{ required: true, message: '请填写借款人手机号码', trigger: 'change' }]
      },
      options: [
        {
          value: 'PERSON',
          label: '身份证'
        },
        {
          value: 'COMPANY',
          label: '统一社会编码/营业执照号'
        }
      ],
      dialogFormVisible: false
    };
  },
  props: ['rightBtnText', 'rightIcon', 'placeholder', 'centreBtnText', 'centreIcon'],
  methods: {
    changeType(type) {
      this.type = type;
      this.$emit('update:filterTable', {
        keyword: this.keyword,
        query: { status: type }
      });
      this.$emit('update:currentPage', 1);
    },

    queryCanIssueMoney(formName) {
      this.$set(this.form, 'issueMoney', 0);

      this.$refs[formName].validate(valid => {
        if (valid) {
          let borrowType = this.form.value == 'PERSON' ? '1' : '2';
          this.$api
            .queryBorrowLimit({
              identityCard: this.form.cardNumber,
              borrowType: borrowType,
              platformType: this.form.platform
            })
            .then(res => {
              if (res.returnCode == '0000') {
                if (res.data) {
                  let canBorrowLimit = parseFloat(res.data.canBorrowLimit);
                  canBorrowLimit = canBorrowLimit.toFixed(2);
                  // this.form.issueMoney=canBorrowLimit;
                  this.$set(this.form, 'issueMoney', canBorrowLimit);
                }
              } else {
                this.$message.error(res.msg);
              }
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  },
  computed: {
    title() {
      if (this.placeholder) {
        return '请输入' + this.placeholder;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.aside-btn {
  margin: 10px 0;
  margin-top: 20px;
  // overflow: hidden;
  .buss-btn {
    float: left;
    margin-right: 5px;
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

