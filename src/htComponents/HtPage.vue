<template>
  <div class='hongte-Pagination'>
      <el-pagination background @current-change='handleCurrentChange' @size-change="handleSizeChange" :current-page='currentPage' :page-size="pageSize" :page-sizes="[5 ,10, 20, 30, 40]" :total='total' layout='total, sizes, prev, pager, next, jumper'>
      </el-pagination>
    </div>
</template>

<script>
export default {
  name:'HtPage',
  props:['total','currentPage','pageSize'],
  methods:{
    // 翻页
    handleCurrentChange(page) {
      this.$emit('update:currentPage',page);
      this.$emit('getData');
    },
    // 每页显示的页数发生变化的时候
    handleSizeChange(size) {
      this.$emit('update:pageSize',size);
      this.$emit('getData');
    }
  }
}
</script>

