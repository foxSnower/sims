<template>
  <div>
    <el-button v-if="!isTracking" type="primary" size="small" @click="addEdit('新增',item,item.tableName,foreignKey);addForeignKeyEdit('新增',item,item.tableName,foreignKey,item.entryElementClassifyName,parentName);">
      <i class="el-icon-plus"></i> 新增</el-button>
    <el-table border ref="tabName" :data="where" class="hongte-table" highlight-current-row @row-click="rowClick">
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column v-if="itemX.controlType!='HIDDEN'" v-for="(itemX,idX) in item.fieldList" :key="idX" :label='itemX.fieldCnName' min-width="150">
        <template slot-scope="scope">
          <span>{{scope.row[itemX.fieldName]|filterFieldName(scope.row,itemX)}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="!isTracking" fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button size='mini' type='text' @click.stop="handleEdit(scope.$index,item,item.tableName,foreignKey);handleForeignKeyEdit(scope.$index,item,item.tableName);">
            <i class="fa fa-edit"></i> 编辑</el-button>
          <el-button class="ht-warning" size='mini' type='text' @click.stop="handleDelete(scope.$index,scope.row,item.tableName,foreignKey);handleForeignKeyDelete(scope.$index,scope.row,item.tableName);">
            <i class="fa fa-trash-o"></i> 删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "TemplateTable",
  props: ["where", "item", "foreignKey", "isTracking", "isForeignKey","parentName"],
  methods: {
    //修改编辑
    handleEdit(id, item, tableName, foreignKey) {
      this.$emit("handleEdit", id, item, tableName, foreignKey);
    },
    //添加编辑
    addEdit(type, item, tableName, foreignKey) {
      this.$emit("addEdit", type, item, tableName, foreignKey);
    },
    //删除table行
    handleDelete(id, row, tableName, foreignKey) {
      this.$emit("handleDelete", id, row, tableName, foreignKey);
    },
    rowClick(row) {
      console.log('rowClick')
      this.$emit("row-click", row, this.foreignKey);
    },
    setCurrentRow() {
      this.$refs.tabName.setCurrentRow();
    },
    //添加编辑handleForeignKeyEdit
    handleForeignKeyEdit(id, item, tableName) {
      this.$emit("handleForeignKeyEdit", id, item, tableName);
    },
    //
    addForeignKeyEdit(
      type,
      item,
      tableName,
      foreignKey,
      entryElementClassifyName,
      parentName
    ) {
      this.$emit(
        "addForeignKeyEdit",
        type,
        item,
        tableName,
        foreignKey,
        entryElementClassifyName,
        parentName
      );
    },
    handleForeignKeyDelete(id, row, tableName) {
      this.$emit("handleForeignKeyDelete", id, row, tableName);
    }
  }
};
</script>

