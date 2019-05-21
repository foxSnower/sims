<template>

  <el-collapse v-model="activeNames">
    <el-collapse-item :title="index" :name="index" v-for="(item,index) in myData" :key="index">
      <el-table :data="item" border stripe style="width: 100%" :span-method="arraySpanMethod">
        <el-table-column prop="channel" label="代扣渠道" min-width="180">
        </el-table-column>
        <el-table-column prop="bankName" label="支持银行" min-width="180">
        </el-table-column>
        <el-table-column prop="singleLimit" label="单笔限额(元)" min-width="180">
        </el-table-column>
        <el-table-column prop="dailyLimit" label="单日限额(元)" min-width="180">
        </el-table-column>
        <!-- <el-table-column :prop="idX" label="单笔限额(元)" min-width="180" v-for="(itemX,idX) in item" :key="idX"> -->
        <!-- </el-table-column> -->
      </el-table>
    </el-collapse-item>
    <!-- <el-collapse-item title="宝付代扣" name="1">
      <el-table :data="tableData.baofu" border stripe style="width: 100%" :span-method="arraySpanMethod1">
        <el-table-column prop="channel" label="代扣渠道" min-width="180">
        </el-table-column>
        <el-table-column prop="bank" label="支持银行" min-width="180">
        </el-table-column>
        <el-table-column prop="singleLimit" label="单笔限额(元)" min-width="180">
        </el-table-column>
        <el-table-column prop="dailyLimit" label="单日限额(元)" min-width="180">
        </el-table-column>
      </el-table>
    </el-collapse-item>
    <el-collapse-item title="快钱代扣" name="2">
      <el-table :data="tableData.kuaiqian" border stripe style="width: 100%" :span-method="arraySpanMethod2">
        <el-table-column prop="channel" label="代扣渠道" min-width="180">
        </el-table-column>
        <el-table-column prop="bank" label="支持银行" min-width="180">
        </el-table-column>
        <el-table-column prop="singleLimit" label="单笔限额(元)" min-width="180">
        </el-table-column>
        <el-table-column prop="dailyLimit" label="单日限额(元)" min-width="180">
        </el-table-column>
      </el-table>
    </el-collapse-item>
    <el-collapse-item title="易宝代扣" name="3">
      <el-table :data="tableData.yibao" border stripe style="width: 100%" :span-method="arraySpanMethod3">
        <el-table-column prop="channel" label="代扣渠道" min-width="180">
        </el-table-column>
        <el-table-column prop="bank" label="支持银行" min-width="180">
        </el-table-column>
        <el-table-column prop="singleLimit" label="单笔限额(元)" min-width="180">
        </el-table-column>
        <el-table-column prop="dailyLimit" label="单日限额(元)" min-width="180">
        </el-table-column>
      </el-table>
    </el-collapse-item>
    <el-collapse-item title="银行代扣" name="4">
      <el-table :data="tableData.yinhan" border stripe style="width: 100%" :span-method="arraySpanMethod4">
        <el-table-column prop="channel" label="代扣渠道" min-width="180">
        </el-table-column>
        <el-table-column prop="bank" label="支持银行" min-width="180">
        </el-table-column>
        <el-table-column prop="singleLimit" label="单笔限额(元)" min-width="180">
        </el-table-column>
        <el-table-column prop="dailyLimit" label="单日限额(元)" min-width="180">
        </el-table-column>
      </el-table>
    </el-collapse-item> -->
  </el-collapse>
</template>

<script>
export default {
  name: 'DKLimitTable',
  data() {
    return {
      myData: {},
      activeNames: [],
      //各类型的长度
      typeLength: {}
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$api.getGroupByChannel({}).then(res => {
        if (res.returnCode == '0000') {
          this.myData = res.data;
          this.initData(res.data);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //获取折叠面板的name和各类型的长度
    initData(res) {
      let newArray = [];
      let curChannel = '';
      let typeLength = {};
      for (let i in res) {
        newArray.push(i);
        typeLength[i] = {};
        for (let j in res[i]) {
          if (res[i][j].channel == curChannel) {
            typeLength[i][res[i][j].channel]++;
          } else {
            curChannel = res[i][j].channel;
            typeLength[i][res[i][j].channel] = 1;
          }
        }
      }

      for (let i in typeLength) {
        let addLength = 0;
        for (let j in typeLength[i]) {
          if (addLength) {
            typeLength[i][j] = addLength + typeLength[i][j];
            addLength = typeLength[i][j];
          } else {
            addLength = typeLength[i][j];
          }
        }
        //  console.log(typeLength);
      }
      this.typeLength = typeLength;
      this.activeNames = newArray;
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        // console.log(row, column, rowIndex, columnIndex);
        let typeLength = this.typeLength;
        let length = typeLength[row.type][row.channel];
        if (row.channelCount === length - rowIndex) {
          return {
            rowspan: length - rowIndex,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    arraySpanMethod1({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        let length = this.tableData.baofu.length;
        if (rowIndex % length === 0) {
          return {
            rowspan: length,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    arraySpanMethod4({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        let kuaiqianLength = this.yinhanLength.kuaiqian;
        let xmLength = this.yinhanLength.xm;
        let tonglianLength = this.yinhanLength.tonglian;
        let yibaoLength = this.yinhanLength.yibao;
        if (rowIndex === 0 && row.channel == '快钱') {
          return {
            rowspan: kuaiqianLength,
            colspan: 1
          };
        } else if (rowIndex % kuaiqianLength === 0 && row.channel == '厦门银行XC Pay') {
          return {
            rowspan: xmLength,
            colspan: 1
          };
        } else if (rowIndex % (kuaiqianLength + xmLength) === 0 && row.channel == '通联') {
          return {
            rowspan: tonglianLength,
            colspan: 1
          };
        } else if (rowIndex % (kuaiqianLength + xmLength + tonglianLength) === 0 && row.channel == '易宝') {
          return {
            rowspan: yibaoLength,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  },
  computed: {
    yinhanLength() {
      let yinhanLength = {
        kuaiqian: 0,
        xm: 0,
        tonglian: 0,
        yibao: 0
      };
      let tableData = this.tableData.yinhan;
      for (let i in tableData) {
        if (tableData[i].channel == '快钱') {
          yinhanLength.kuaiqian++;
        }
        if (tableData[i].channel == '厦门银行XC Pay') {
          yinhanLength.xm++;
        }
        if (tableData[i].channel == '通联') {
          yinhanLength.tonglian++;
        }
        if (tableData[i].channel == '易宝') {
          yinhanLength.yibao++;
        }
      }
      return yinhanLength;
    }
  }
};
</script>