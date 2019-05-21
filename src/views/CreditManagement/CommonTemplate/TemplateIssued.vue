<template>
  <el-dialog width="70%" title="管理共借人" :visible.sync="outerVisible">
    <Issued ref="Issued" :outerVisible.sync="outerVisible" isChecked></Issued>
    <span slot="footer" class="dialog-footer">
      <el-button @click="outerVisible = false">关 闭</el-button>
      <el-button type="primary" @click="save">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'TemplateIssued',
  data() {
    return {
      outerVisible: false
    };
  },
  props: ['showIssued', 'IssuedObject'],
  components: {
    Issued: () => import('./Issued')
  },
  watch: {
    showIssued(newVal) {
      if (newVal) {
        this.outerVisible = newVal;
        this.$nextTick(() => {
          this.$refs.Issued.getCustomerCodeList(this.IssuedObject);
        });
      } else {
        //清空选择
        this.$refs.Issued.clearSelection();
      }
    },
    outerVisible(newVal) {
      if (!newVal) {
        this.$emit('update:showIssued', false);
      }
    }
  },
  methods: {
    save() {
      this.$refs.Issued.save(this.IssuedObject);
    }
  }
};
</script>

<style lang="scss" scoped>
.issued {
  position: fixed;
}
</style>

