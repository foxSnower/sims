<template>
  <div>

      <el-tabs  >
          <el-tab-pane v-for="(item,index) in outplanData" :key="index" :label="item.customerName">
            <!-- 按标的显示  start-->
           <el-card class="box-card">
                <el-table :data="item.outplanData" :span-method="item.objectSpanMethod" border :show-header="true" style="width: 100%; margin-top: 20px">
                  <el-table-column prop='name1' label="费用类型" width="180">
                  </el-table-column>
                  <el-table-column prop='name2' label="费用名称">
                  </el-table-column>
                  <el-table-column prop='timeChargeName' label="收取时机">
                  </el-table-column>
                  <el-table-column prop='chargingTypeName' label="收取方式">
                  </el-table-column>
                  <el-table-column prop='amount' label="费用">
                  </el-table-column>
                </el-table>
              </el-card>
            <!-- 按标的显示  end-->
         </el-tab-pane>
          <!-- 显示业务总的费用详情 start -->
         <el-tab-pane label="费用汇总" v-for="(item,index) in outplanData" :key="index+'费用汇总'" v-if="index==0">
            <el-table :data="item.allbusinessOutplanData" :span-method="item.allobjectSpanMethod" border :show-header="true" style="width: 100%; margin-top: 20px">
              <el-table-column prop="allname1" label="费用类型" width="180">
              </el-table-column>
              <el-table-column prop="allname2" label="费用名称">
              </el-table-column>
              <el-table-column prop="alltimeChargeName" label="收取时机">
              </el-table-column>
              <el-table-column prop="allchargingTypeName" label="收取方式">
              </el-table-column>
              <el-table-column prop="allamount" label="费用">
              </el-table-column>
            </el-table>
          </el-tab-pane>
            <!-- 显示业务总的费用详情 end-->
        </el-tabs>




  </div>
</template>

<script>

import vueshowpdf from 'vueshowpdf';
import { mapGetters, mapMutations } from 'vuex';

export default {

  data() {
    return {

      outplanData: []
    };
  },
    watch: {
    postData: function(newVal,oldVal){
  
      this.getMainData(this.postData.businessId);
    }
  },
  props: ['postData'],
  methods: {
   
    //抵押贷获取费用详情
    getDydIssueCostDetailByBizId(businessId) {
     try {
         this.$api.getIssueCostDetailByBizId({ businessId: businessId }).then(res => {
        if (res.returnCode == '0000') {
          // for (let k in res.data) {
             for (let k=0;k< res.data.length;k++) {
            let d = res.data[k];
            let allTotal = d.allTotal;
            let businessAllTotal=d.businessAllTotal;
            let customerCode = d.customerCode;
            let customerName = d.customerName;
            let issueCost = d.issueCost;
            let allbusinessIssueCost=d.allIssueCost;
            let rowspanData = {};
            let outplanData = [];
            let allbusinessOutplanData=[];
            let allbusinessRowspanData = {};
            console.log(res.data[k])
            for(let i=0;i<allbusinessIssueCost.length; i++)
            {
              let allrowData = allbusinessIssueCost[i];

              if (allrowData.issueBusinessApplyoutputDetailList) {
                let startIndex = allbusinessOutplanData.length;

                let allchildData = allrowData.issueBusinessApplyoutputDetailList;

                
                 for (let j = 0; j < allchildData.length; j++)  {
                  let allrowData2 = allchildData[j];
                  allbusinessOutplanData.push({
                    allname1: allrowData.feeTypeName,
                    allname2: allrowData2.feeName,
                    allamount: allrowData2.feeValue,
                    allchargingTypeName: allrowData2.feeChargingTypeName,
                    alltimeChargeName: allrowData.isOneTimeChargeName
                  });
                }
                allbusinessOutplanData.push({ allname1: allrowData.feeTypeName, allname2: '合计（元）：', allamount: allrowData.total });
                allbusinessRowspanData['idx' + startIndex] = { rowspan: allbusinessOutplanData.length - startIndex, colspan: 1 };
              }  
            }
            allbusinessRowspanData['idx' + allbusinessOutplanData.length] = { rowspan: 1, colspan: 1 };
            allbusinessOutplanData.push({ allname1: '合计（元）：', allname2: '', allamount: businessAllTotal, allchargingTypeName: '', alltimeChargeName: '' });
            for (let i=0;i<issueCost.length;i++) {
              let rowData = issueCost[i];

              if (rowData.issueBusinessApplyoutputDetailList) {
                let startIndex = outplanData.length;

                let childData = rowData.issueBusinessApplyoutputDetailList;

                
                 for (let j = 0; j < childData.length; j++)  {
                  let rowData2 = childData[j];
                  outplanData.push({
                   name1: rowData.feeTypeName,
                    name2: rowData2.feeName,
                    amount: rowData2.feeValue,
                    chargingTypeName: rowData2.feeChargingTypeName,
                    timeChargeName: rowData.isOneTimeChargeName
                  });
                }
                outplanData.push({ name1: rowData.feeTypeName, name2: '合计（元）：', amount: rowData.total });
                rowspanData['idx' + startIndex] = { rowspan: outplanData.length - startIndex, colspan: 1 };
              }
              
            }
            rowspanData['idx' + outplanData.length] = { rowspan: 1, colspan: 1 };
            outplanData.push({ name1: '合计（元）：', name2: '', amount: allTotal, chargingTypeName: '',timeChargeName: '' });

           

            this.outplanData.push({
              customerCode: customerCode,
              customerName: customerName,
              rowspanData: rowspanData,
              outplanData: outplanData,
              allbusinessOutplanData:allbusinessOutplanData,
             allbusinessRowspanData: allbusinessRowspanData,
              objectSpanMethod: function({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0) {
                  if (rowspanData['idx' + rowIndex]) {
                    return rowspanData['idx' + rowIndex];
                  } else {
                    return {
                      rowspan: 0,
                      colspan: 0
                    };
                  }
                }
              }
              ,
              allobjectSpanMethod: function({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0) {
                  if (allbusinessRowspanData['idx' + rowIndex]) {
                    return allbusinessRowspanData['idx' + rowIndex];
                  } else {
                    return {
                      rowspan: 0,
                      colspan: 0
                    };
                  }
                }
              }
            })
            ;
            
          }
        } else {
          // this.$message.error(res.msg);
        }
      });
     } catch (error) {
       
     }
    
    },
    closepdf() {
      this.isshowpdf = false;
    },
    openpdf(url) {
      this.pdfurls = url;
      this.isshowpdf = true;
    },
    pdferr(errurl) {
      this.$message.error('文件异常');
    },
  

    fileTableRowStyle() {
      return { height: '132px' };
    },
    getMainData(businessId) {
      this.$api.getIssueCostDetailByBizId({ businessId: businessId}).then(res => {
        if (res.returnCode == '0000') {
          this.mainData = res.data;
          this.mainDetailData = res.data.childElementClassifys;
          if (businessId) {
            // this.getFileType();
            // this.getFileInfo(res.data.businessId);
            this.getDydIssueCostDetailByBizId(businessId);
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleClick(tab, event) {
      this.$set(this.postData, 'productCode', this.mainData.productCode);
      this.$set(this.postData, 'businessId', this.mainData.businessId);
      this.$set(this.postData, 'customerType', this.mainData.customerType);
      this.$set(this.postData, 'processTypeCode', this.mainData.processTypeCode);
    },
    
  
  },
  computed: {
    ...mapGetters(['localTheme', 'asideWidth']),
    themeColor() {
      return this.localTheme.themeColor;
    },
    fixedBtnWidth() {
      let width = '';
      if (this.asideWidth != '250px') {
        width = 'calc(100% - 68px)';
      } else {
        width = 'calc(100% - 262px)';
      }
      return width;
    },
    fixedBtnHeight() {
      let height = '';
      if (this.isAudit) {
        height = '300px';
      } else {
        height = '80px';
      }
      return height;
    }
  },
  // filerAllbusinessOutplanData(){
  //   let allbusinessOutplanData=[];
  //   if(this.outplanData[0].allbusinessOutplanData){
  //    allbusinessOutplanData = this.outplanData[0].allbusinessOutplanData
  //   }
  //   return allbusinessOutplanData
  // }
 
};
</script>

<style lang='scss' scoped>
 .cpdf .center {
  background-color: wheat;
}
.box-card {
  .ht-steps {
    margin: 10px 30px;
  }
  .hd {
    overflow: hidden;
  }
  h1 {
    float: left;
    font-size: 24px;
  }
  .f-flex {
    margin-top: 15px;
    width: 100%;
    overflow: hidden;
    line-height: 2;
    .f-item,
    .f-item1,
    .f-item2,
    .f-item3 {
      overflow: hidden;
      float: left;
      text-indent: 10px;
      span {
        color: #888;
      }
    }
    .f-item1 {
      float: left;
      width: 100%;
    }
    .f-item3 {
      float: left;
      width: 33.3%;
    }
    .f-item2 {
      float: left;
      width: 50%;
      h1 {
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
      }
    }
  }
  .ht-steps {
    margin: 10px 30px;
  }
  .card-define-title {
    padding: 18px 0;
    padding-top: 30px;
    border-bottom: 1px solid #ebeef5;
    box-sizing: border-box;
    width: calc(100% + 40px);
    margin-left: -20px;
    text-indent: 20px;
  }
  .card-title {
    font-weight: 700;
    font-size: 15px;
  }
  .card-body {
    padding: 20px 0;
    text-align: justify;
  }
  .item-title {
    color: #666;
    font-size: 16px;
    font-weight: 700;
  }
}

.hongte-dialog {
  i {
    position: absolute;
    color: #fff;
    font-size: 50px;
    background: rgba(0, 0, 0, 0.5);
    top: 50%;
    transform: translateY(-50%);
    &.el-icon-arrow-left {
      left: -50px;
    }
    &.el-icon-arrow-right {
      right: -50px;
    }
  }
}

.uplaod-img {
  display: inline-block;
  position: relative;
  height: 100%;
  &:hover {
    i {
      opacity: 1;
    }
  }
  img {
    margin-right: 20px;
    cursor: pointer;
  }
  i {
    cursor: pointer;
    opacity: 0;
    position: absolute;
    top: 40%;
    left: 35%;
    font-size: 20px;
    font-weight: 700;
    transition: opacity 0.2s;
  }
}

.fixed-btn {
  position: fixed;
  height: 80px;
  bottom: 0px;
  width: calc(100% - 380px);
  margin-left: -14px;
  text-align: right;
  background-color: #fff;
  border-top: 1px solid #f2f2f2;
  line-height: 80px;
  padding: 0 40px;
  z-index: 9;
  .left {
    position: absolute;
    .progress {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      margin-left: 20px;
    }
  }
}
</style>
