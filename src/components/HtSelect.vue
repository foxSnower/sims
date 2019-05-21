<template>
  <el-form-item :label='label' :prop="prop" :rules="rules">
    <SelectOption :filterable="filterable" :label='label' v-model='val' @name="getName" :type="type" @change="$emit('input');$emit('change',val)" :dataSource="dataSource" :disabled="disabled"></SelectOption>
  </el-form-item>
</template>

<script>
import SelectOption from '@components/SelectOption';
export default {
  name: 'HtSelect',
  data() {
    return {
      val: null
    };
  },
  props: {
    label: String,
    value: [String, Number, Boolean],
    filterable: {
      type: Boolean,
      default: false
    },
    name: String,
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
    dataSource: String,
    rules: [Object, Array],
    allInfo: [Object],
    beforeModel: String
  },
  components: { SelectOption },
  watch: {
    value(val) {
      this.val = val;
    },
    propsValue(val) {
      this.val = val;
    }
  },
  mounted() {
    this.$nextTick(() => {
      // console.log(this.type);
      
      this.val = this.value;
    });
  },
  methods: {
    //获取name值
    getName(val) {
      this.$emit('input', this.val);
      this.$emit('update:name', val);
      this.$emit('setNameVal');
    }
  },
  computed: {
    propsValue() {
      this.val = this.value;
      return this.value;
    }
  }
};
</script>

