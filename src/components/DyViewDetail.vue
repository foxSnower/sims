<template>
  <div>
    <!--循环一层框-->
    <el-card v-for="(item, index) in rsData" class="box-card" :key="index" style="margin-top:20px;">

      <div slot="header" class="is-clear">
        <span class="card-title" v-if="item.isShowTitle!=''">{{item.entryElementClassifyName}}</span>
      </div>

      <!--循环一层框字段-->
      <div class="f-flex is-clear">
        <!--表单-->
        <div v-if="item.showType=='FORM'">
          <div v-for="(elem, i ) in item.entryElements">
            <!-- GRID_1_COL：格栅1列；GRID_2_COL：格栅2列，GRID_3_COL：格栅3列，GRID_4_COL：格栅4列-->
            <el-col :span="colData[item.layoutType.trim()]">
              <div class="grid-content bg-purple" v-if="elem.fieldName=='sex'">{{elem.fieldCnName}}：{{(elem.fieldValue=='0'?'女':'男')}}</div>
              <div class="grid-content bg-purple" v-else >{{elem.fieldCnName}}：{{elem.fieldValue}}</div>
            </el-col>
            <el-row :gutter="20" v-if="(i+1)%(24/colData[item.layoutType])==0"></el-row>
          </div>
        </div>
        <!--表格-->
        <div v-else>
          <el-table border
            :data="(item.entryElementsListMap?item.entryElementsListMap:[])"
            style="width: 100%">
            <el-table-column v-for="(elem4, i4 ) in item.tableTitleMap"
                             :prop="i4"
                             :key="i4"
                             :label="elem4"
                             >
            </el-table-column>
          </el-table>
        </div>
        <!--循环二层框-->
        <el-card v-for="(elem2, i2 ) in item.childElementClassifys" :key="i2" class="box-card" style="margin-top:20px;">
          <div slot="header" class="is-clear">
            <span class="card-title" v-if="elem2.isShowTitle!=''">{{elem2.entryElementClassifyName}}</span>
          </div>
          <!--循环二层框字段-->
          <div class="f-flex is-clear">
            <!--表单-->
            <div v-if="elem2.showType=='FORM'">
              <div v-for="(elem3, i3 ) in elem2.entryElements">
                <el-col :span="colData[elem2.layoutType.trim()]">
                  <div class="grid-content bg-purple">{{elem3.fieldCnName}}：{{elem3.fieldValue}}</div>
                </el-col>
                <el-row :gutter="20" v-if="(i3+1)%(24/colData[elem2.layoutType])==0"></el-row>
              </div>
            </div>
            <!--表格-->
            <div v-else>
              <el-table border
                :data="(elem2.entryElementsListMap?elem2.entryElementsListMap:[])"
                style="width: 100%">
                <el-table-column v-for="(elem5, i5 ) in elem2.tableTitleMap"
                                 :prop="i5"
                                 :key="i5"
                                 :label="elem5"
                                 >
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-card>


      </div>

    </el-card>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex';

  export default {
    data() {
      return {
        colData:{'GRID_1_COL':24,'GRID_2_COL':12,'GRID_3_COL':8,'GRID_4_COL':6}
      };
    },
    watch: {},
    props: ['rsData'],
    mounted() {
    },
    methods: {
    },
    computed: {
      ...mapGetters({
        localTheme: 'localTheme'
      }),
      activeColor() {
        return this.localTheme.themeColor
          ? this.localTheme.themeColor
          : '#56C499';
      }
    }
  };
</script>

<style lang="scss" scoped>
  .is-clear::after {
    content: "";
    display: table;
    clear: both;
  }

  .box-card {
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
</style>
