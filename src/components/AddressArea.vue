
<template>
  <el-cascader @active-item-change="handleItemChange" :props="addrProps" :options="filterOptions" v-model="address" v-loading="loading" @change="$emit('getData',address,name)" @input="$emit('input')" :disabled="disabled" placeholder="请选择地址">
  </el-cascader>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'AddressArea',
  data() {
    return {
      //当前地址
      address: [],
      addressOptions: [],
      // filterOptions:[]
      loading: false,
      addrProps: {
        value: 'code',
        label: 'name',
        children: 'children'
      },
      province: [],
      city: [],
      county: []
    };
  },
  props: {
    value: {
      type: [Array, Object, String]
    },
    showCity: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.address = val;
        this.handleItemChange([val[0], '', '']);
        setTimeout(() => {
          this.handleItemChange([val[0], val[1], '']);
        }, 1000);
      }
    },
    propsValue(val) {
      if (val) {
        this.address = val;
      }else{
        this.address=[]
      }
    }
  },
  mounted() {
    // if (this.value.length) {
    if (this.value) {
      this.address = this.value;
    } else {
      this.address = [];
    }

    // }
    if (!this.provinceCode.length) {
      //省
      this.getBaseData('provinceCode');
    }
    if (!this.cityCode.length) {
      //市
      this.getBaseData('cityCode');
    }
    if (!this.countyCode.length) {
      //区
      this.getBaseData('countyCode');
    }
    this.$api
      .getCurrTypeValList({
        typeCode: 'provinceCode',
        version: 'latest'
      })
      .then(res => {
        if (res.returnCode == '0000') {
          let provinceCode = res.data;
          provinceCode.forEach(x => {
            x.children = [];
          });
          this.addressOptions = provinceCode;
          this.province = provinceCode;
          this.getCity(this.address[0]);
          this.getCounty(this.address[1]);
        } else {
          this.$message.error(res.msg);
        }
      });
  },
  methods: {
    getBaseData(typeCode) {
      this.$api
        .getCurrTypeValList({
          typeCode: typeCode,
          version: 'latest'
        })
        .then(res => {
          if (res.returnCode == '0000') {
            this.$store.commit(typeCode, res.data);
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    getCity(parentCode) {
      if (!parentCode) {
        return false;
      }
      this.$api
        .getNextChildValList({
          typeCode: 'cityCode',
          valCode: parentCode
        })
        .then(res => {
          this.city = res.data;
        });
    },
    getCounty(parentCode) {
      if (!parentCode) {
        return false;
      }
      this.$api
        .getNextChildValList({
          typeCode: 'countyCode',
          valCode: parentCode
        })
        .then(res => {
          this.county = res.data;
        });
    },
    codeToName(code, array) {
      let name = null;
      if (array && array.length > 0) {
        array.forEach(x => {
          if (x.code == code) {
            name = x.name;
          }
        });
      }
      return name;
    },
    handleItemChange(value) {
      var parentId;
      var levelType;
      if (!value[0]) levelType = 0;
      if (value[0] && !value[1]) levelType = 1;
      if (value[0] && value[1]) levelType = 2;
      //点击省份
      if (levelType == 1) {
        parentId = value[0];
      } else if (levelType == 2) {
        //点击市区
        parentId = value[1];
      } else {
        return;
      }
      var _vm = this;
      this.$api
        .getNextChildValList({
          typeCode: levelType == '1' ? 'cityCode' : 'countyCode',
          valCode: parentId
        })
        .then(res => {
          let areas = res.data;
          for (var i in this.addressOptions) {
            //获取获取市区的地区
            if (levelType == 1 && _vm.addressOptions[i].code == parentId && !_vm.addressOptions[i].children.length) {
              //层级
              if (!this.showCity) {
                areas.forEach(x => {
                  x.children = [];
                });
              }
              _vm.addressOptions[i].children = areas;
              this.city = areas;
              //  console.log(this.city);
            }
            //获取区县
            if (levelType == 2) {
              for (var k in _vm.addressOptions[i].children) {
                if (_vm.addressOptions[i].children[k].code == parentId && !_vm.addressOptions[i].children[k].length) {
                  _vm.addressOptions[i].children[k].children = areas;
                  // console.log('areas', areas);
                  this.county = areas;
                }
              }
            }
          }
        });
    },
    //根据最后一个找到整个家族
    familyTree(arr, pCode) {
      var temp = [];
      var forFn = function(arr, pCode) {
        let length = arr.length;
        for (var i = 0; i < length; i++) {
          var item = arr[i];
          if (item.parentCode == pCode) {
            temp.push(item);
          }
        }
      };
      forFn(arr, pCode);
      return temp;
    }
  },
  computed: {
    ...mapGetters(['provinceCode', 'cityCode', 'countyCode']),
    name() {
      let addressOptions = this.addressOptions;
      let address = this.address;
      let name = [];
      if (address) {
        name[0] = this.codeToName(address[0], this.provinceCode);
        name[1] = this.codeToName(address[1], this.cityCode);
        name[2] = this.codeToName(address[2], this.countyCode);
      }
      return name;
    },
    filterOptions() {
      let provinceCodeList = this.province;
      let cityCodeList = this.city;
      let countyCodeList = this.county;
      //将区县装载到城市
      if (this.county.length) {
        cityCodeList.forEach(city => {
          city['children'] = [];
          city['children'] = this.familyTree(countyCodeList, city.code);
        });
      }
      //将城市装载到省份
      if (this.city.length) {
        provinceCodeList.forEach(province => {
          province['children'] = [];
          province['children'] = this.familyTree(cityCodeList, province.code);
        });
      }
      return provinceCodeList;
    },
    propsValue() {
      return this.value;
    }
  }
};
</script>

