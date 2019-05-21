<template>
  <el-form-item :label='label' :prop="prop" :rules="rules">
    <el-input :type="type" :rows="rows" v-model='val' :maxlength="maxlength" :placeholder='placeholderName' @input="handleInput" @change="$emit('change')" :disabled="disabled" :value="val">
      <template v-if="append" slot="append">{{append}}</template>
    </el-input>
  </el-form-item>
</template>

<script>
export default {
  name: 'HtInput',
  data() {
    return {
      val: null
    };
  },
  props: {
    label: String,
    value:[String, Number],
    prop: String,
    maxlength: {
      type: String,
      default: '64'
    },
    placeholder: String,
    disabled: Boolean,
    append: String,
    type: String,
    rows: String,
    rules: [Object, Array]
  },
  mounted() {
    this.$nextTick(() => {
      this.val = this.value;
    });
  },
  watch: {
    value(val) {
      this.val = val;
    },
    propsValue(val, oldVal) {
      this.val = val;
    }
  },
  methods: {
    handleInput() {
      // debugger
      this.$emit('input', this.val);
      // this.$parent.value = this.val;
    }
  },
  computed: {
    placeholderName() {
      return '请输入' + this.label;
    },
    propsValue() {
      return this.value;
    }
  }
};
</script>

