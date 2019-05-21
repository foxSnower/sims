<template>
  <div class="table-cont">
    <!--业务状态（1.未提交, 2.风控智审 3.审批中, 4.已完结, 5.注销,6审批回绝） -->
    <!-- 新: (0.草稿, 10.已保存未提交,20.风控智审 30.审批中, 31.审批驳回, 90.审批拒绝 , 99.注销申请, 100.已完结) -->
    <el-progress v-if="row.businessStatus=='20'||row.businessStatus=='30'||row.businessStatus=='40'" color="#409EFF" :percentage="auditPercent"></el-progress>
    <el-progress v-if="row.businessStatus=='100'" status="success" :percentage="auditPercent"></el-progress>
    <el-progress v-if="row.businessStatus=='99'||row.businessStatus=='90'" status="exception" :percentage="auditPercent"></el-progress>
    <el-progress v-if="row.businessStatus=='0'||row.businessStatus=='10'" color="gray" :percentage="auditPercent"></el-progress>
  </div>
</template>

<script>
export default {
  name: 'HtProgressForStatus',
  props: ['row'],
  computed:{
    auditPercent(){
      let auditPercent = this.row.auditPercent
      if(auditPercent){
        return parseFloat(auditPercent)
      }else{
        return 0
      }
    }
  }
};
</script>

