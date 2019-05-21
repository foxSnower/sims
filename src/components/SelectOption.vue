<template>
  <el-select :filterable="filterable" v-model='code' @change="$emit('input',code);$emit('change',code);$emit('name',name);" :disabled="disabled" :placeholder="placeholderName" @focus="getData">
    <el-option v-for="(x,index) in typeList" :key="index" :label='x.name' :value='x.code'></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'SelectOption',
  data() {
    return {
      code: '',
      data: [],
      selectlist: []
    };
  },
  props: {
    filterable: {
      type: Boolean,
      default: false
    },
    disabled: Boolean,
    value: [String, Number, Boolean],
    type: {
      type: String,
      default: null
    },
    api: {
      type: String,
      default: 'getCurrTypeValList'
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    label: String,
    dataSource: {
      type: String,
      default: null
    }
  },
  watch: {
    value(val) {
      this.code = val;
    },
    propsValue(val) {
      // console.log(val);
      this.code = val;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.code = this.value;
      this.getData();
    });
  },
  methods: {
    getData() {
      // console.log(this.type,this.$store.state.baseData[this.type],this.$store.state.baseData[this.type].length);
      if (this.$store.state.baseData[this.type]) {
        if (this.$store.state.baseData[this.type].length <= 0) {
          this.getBaseData(this.type);
        }
      } else {
        this.getBaseData(this.type);
      }
    },
    getBaseData(typeCode) {
      if (!typeCode) {
        return false;
      }
      this.$api[this.api]({
        typeCode: typeCode,
        version: 'latest'
      }).then(res => {
        if (res.returnCode == '0000') {
          if (this.$store.state.baseData[this.type]) {
            this.$store.commit(typeCode, res.data);
          }
          this.selectlist = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    codeToName(code, array) {
      let name = null;
      if (array && array.length > 0) {
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
      if (this.type) {
        if (this.$store.state.baseData[this.type] && this.$store.state.baseData[this.type].length > 0) {
          return this.$store.state.baseData[this.type];
        } else {
          return this.selectlist;
        }
      } else if (this.dataSource) {
        return JSON.parse(this.dataSource);
      } else if (!this.$store.state.baseData[this.type]) {
        return this.selectlist;
      }
    },
    name() {
      // console.log(this.code);

      return this.codeToName(this.code, this.typeList);
    },
    propsValue() {
      this.code = this.value;
      return this.value;
    },
    placeholderName() {
      let label = this.label ? this.label : '';
      return '请选择' + label;
    }
    // dataSourceArray() {
    //   if (this.dataSource) {
    //     return JSON.parse(this.dataSource);
    //   } else {
    //     return [];
    //   }
    // }
  }
};
</script>
