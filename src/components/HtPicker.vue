<template>
  <el-form-item :label="label" :prop="prop" :rules="rules">
    <el-date-picker :type="type" :editable="false" :value-format="computedFormat" v-model="val" :placeholder='placeholderName' :maxlength="maxlength" @input="handleInput" :disabled="disabled">
    </el-date-picker>
  </el-form-item>
</template>

<script>
export default {
  name: 'HtPicker',
  data() {
    return {
      val: ''
    };
  },
  props: {
    label: String,
    value: [String, Number],
    format:{
      type:String,
      default:'yyyy-MM-dd'
    },
    prop: String,
    maxlength: {
      type: String,
      default: '64'
    },
    placeholder: String,
    disabled: Boolean,
    append: String,
    type: {
      type:String,
       default: 'date'
    },
    rules: [Object, Array]
  },
  watch: {
    value(val) {
      this.val = val;
    },
    propsValue(val, oldVal) {
      this.val = val;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.val = this.value;
    });
  },
  methods: {
    handleInput() {
      this.$emit('input', this.val);
    }
  },
  computed: {
    placeholderName() {
      return '请输入' + this.label;
    },
    propsValue() {
      return this.value;
    },
    computedFormat(){
      if(this.format){
        return this.format
      }else{
        return 'yyyy-MM-dd'
      }
    }
  }
};
</script>


