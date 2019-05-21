<template>
  <div>
    <iframe ref="iframe" src="../../../static/UploadFile.html" marginheight="0" marginwidth="0" frameborder="0" scrolling="no" width="100%" height="500px" id="iframepage" name="iframepage"></iframe>
    <p>{{fileList}}</p>
    <el-row class="bottom-btn">
      <el-button type="primary" @click="submit()" v-loading="submitLoading">提交</el-button>
      <el-button @click="close">关闭</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'GPUploadFile',
  data() {
    return {
      fileList: '',
      submitLoading:false
    };
  },
  props: ['postData', 'businessId'],
  mounted() {
    setTimeout(() => {
      this.iFrameHeight();
    }, 1000);
  },
  methods: {
    iFrameHeight() {
      var ifm = document.getElementById('iframepage');
      var subWeb = document.frames ? document.frames['iframepage'].document : ifm.contentDocument;
      if (ifm != null && subWeb != null) {
        ifm.height = subWeb.body.scrollHeight;
      }
    },
    close() {
      this.$emit('closeDialog');
    },
    submit() {
      let childWindow = this.$refs.iframe.contentWindow;
      let base64Array = childWindow.getBase64s().base64Array;
      let imgNameArray = childWindow.getBase64s().imgNameArray;
      console.log(childWindow.getBase64s());
      let upfiles = [];
      for (let i = 0; i < base64Array.length; i++) {
        let ff = this.dataURLtoFile(base64Array[i], imgNameArray[i]);
        //全部的高拍仪上传的图片
        upfiles.push(ff);
      }
      this.submitLoading =true;
      for (let i = 0; i < upfiles.length; i++) {
        let formdata = new FormData();
        formdata.append('businessType', postData.pFileTypeCode);
        formdata.append('fileType', postData.fileTypeCode);
        formdata.append('businessId', this.businessId);
        formdata.append('fileList', upfiles[i], upfiles[i].name);
        this.$api.uploadFile(formdata).then(res => {});
      }
      setTimeout(() => {
        this.$emit('getData');
      }, 1000);
      this.submitLoading =false;
      this.$emit('closeDialog');
    },
    //将base64转换为文件
    //data:image/jpeg;base64,/
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }
  },
  computed: {
    childWindow() {
      return this.refs.iframe.contentWindow;
    }
  }
};
</script>

<style lang='scss' scoped>
.bottom-btn {
  width: 100%;
  text-align: center;
  padding-top: 20px;
}
</style>
