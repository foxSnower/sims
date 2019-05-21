<template>
  <el-table border :data='operateData' class='hongte-table' highlight-current-row>
    <el-table-column fixed type="index" align="center" label='序号' width="50"></el-table-column>
    <el-table-column prop='createUserName' label='操作员' min-width="150"></el-table-column>
    <el-table-column prop='operateType' label='操作类型' min-width="150"> </el-table-column>
    <el-table-column prop='operateType' label='操作描述' min-width="150"> </el-table-column>
    <el-table-column prop='createDatetime' label='操作时间' min-width="150"> </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'operateTable',
  data() {
    return {
      operateData: []
    };
  },
  props: ['postData'],
  watch: {
    postData(val) {
      this.getData();
    }
  },
  methods: {
    getData() {
      let params = {
        keyword: '',
        limit: 10,
        page: 0,
        query: {
          businessId: this.postData.businessId
        }
      };
      this.$api.operateDataGetList(params).then(res => {
        this.operateData = res.data;
        // console.log(res.data);
      });
    }
  }
};
</script>

