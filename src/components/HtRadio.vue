<template>
  <el-form-item :label="label" :prop="prop" :rules="rules">
    <el-radio-group class="ht-group" v-model='code' @change="handleChange()" :disabled="disabled">
      <el-radio v-for="(x,index) in typeList" :key="index" :label="x.code">{{x.name}}</el-radio>
    </el-radio-group>
  </el-form-item>
</template>

<script>
export default {
  name: 'HtRadio',
  data() {
    return {
      code: '',
      data: []
    };
  },
  props: {
    label: String,
    value: {
      default: ''
    },
    name: String,
    prop: String,
    maxlength: {
      type: String,
      default: '64'
    },
    api: {
      type: String,
      default: 'getCurrTypeValList'
    },
    placeholder: String,
    disabled: Boolean,
    append: String,
    type: String,
    rows: String,
    dataSource: String,
    rules: [Object, Array]
  },
  // props: ['value'],
  watch: {
    value(val) {
      this.code = val;
    },
    propsValue(val) {
      this.code = val;
    }
  },
  beforeMount() {
    this.$nextTick(() => {
      this.code = this.value;
      if (this.$store.state.baseData[this.type]) {
        if (this.$store.state.baseData[this.type].length <= 0) {
          this.getBaseData(this.type);
        }
      }
    });
  },
  methods: {
    getBaseData(typeCode) {
      this.$api[this.api]({
        typeCode: typeCode,
        version: 'latest'
      }).then(res => {
        if (res.returnCode == '0000') {
          this.$store.commit(typeCode, res.data);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleChange() {
      this.$emit('input', this.code);
      this.$emit('change', this.code);
      this.$emit('update:name', this.computedName);
      this.$emit('setNameVal');
    },
    codeToName(code, array) {
      let name = null;
      if (array && array.length) {
        array.forEach(x => {
          if (x.code == code) {
            name = x.name;
          }
        });
      }
      return name;
    }
  },
  computed: {
    typeList() {
      if (this.type && this.$store.state.baseData[this.type].length > 0) {
        return this.$store.state.baseData[this.type];
      } else if (this.dataSource) {
        return JSON.parse(this.dataSource);
      }
    },
    computedName() {
      return this.codeToName(this.code, this.typeList);
    },
    propsValue() {
      return this.value;
    }
  }
};
</script>

<style lang="scss" scoped>
.ht-group {
  position: relative;
  top: 2px;
  left: 10px;
}
</style>

