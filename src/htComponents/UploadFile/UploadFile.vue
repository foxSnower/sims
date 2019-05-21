<template>
  <div class="uplaod-img">
    <span class="img-box" v-for="(item ,index ) in filterFileInfoData" :key="index" :title="item.fileName">
      <img v-if="isImage(item)" :src="item.fileUrl">
      <img v-else :src="imgShow(item)" onerror="javascript:this.src='/images/default.png'">
      <span class="img-action">
        <p class="img-icon">
          <i class="el-icon-search" v-if="isImage(item)" @click="$emit('handelImg',item)"></i>
          <i class="el-icon-search" v-else @click="$emit('handleDialog',item)"></i>
          <a :href="item.fileUrl"><i class="el-icon-download"></i></a>
          <i class="el-icon-delete" @click="handleRemove(item,fileInfoData)"></i>
        </p>
      </span>
    </span>
    <span class="img-box" v-if="showUploadBtn">
      <el-upload class="avatar-uploader" :action="uploadFileAction" :headers="hearderApp" :data="{
              businessType: row.pFileTypeCode,
              fileType: row.fileTypeCode,
              businessId:businessId,
            }" name="fileList" :show-file-list="false" :before-upload="beforeAvatarUpload" :before-remove="handleRemove" :on-success="handleSuccess" :on-error="handleError">
        <i v-if="!GPOpen" slot="trigger" class="el-icon-plus"></i>
        <i v-else class="el-icon-plus" @click.stop="$emit('GaoPaiYi',row)"></i>
      </el-upload>
    </span>
  </div>
</template>

<script>
export default {
  name: 'UploadFile',
  data() {
    return {
      //上传文件的地址
      uploadFileAction: this.$GLOBAL.BASE_URL + '/cmp/fms/fileInfo/uploadFileNew',
      //上传文件的头信息
      hearderApp: {
        app: this.$GLOBAL.APP,
        Authorization: 'Bearer ' + this.$cookie.get(this.$GLOBAL.APP+'token')
      }
    };
  },
  props: ['fileInfoData', 'row', 'businessId', 'GPOpen', 'accept', 'uploadQty'],
  methods: {
    imgShow(item){
      let fileStyle = item.fileStyle.toLowerCase();
      let imgurl = '';
      if(fileStyle!='doc'&&fileStyle!='doc'&&fileStyle!='docx'&&fileStyle!='ppt'&&fileStyle!='pdf'&&fileStyle!='pptx'&&fileStyle!='rar'&&fileStyle!='txt'&&fileStyle!='xls'&&fileStyle!='xlsx'&&fileStyle!='zip'){
        imgurl = require('@assets/default.png');
      }else{
        imgurl = require('@assets/' + item.fileStyle.toLowerCase() + '.png');
      }
      return imgurl
    },
    //判断是否为图片类型
    isImage(item) {
      return item.fileStyle.toLowerCase() == 'png' || item.fileStyle.toLowerCase() == 'jpg' || item.fileStyle.toLowerCase() == 'jpeg';
    },
    //删除附件
    handleRemove(file, fileList) {
      // let isAccept = this.isAccept(file);
      let isAccept = true;
      let isLt5M = file.size / 1024 / 1024 < 5 || !file.size;
      if (isAccept) {
        if (isLt5M) {
          let optUserId = JSON.parse(localStorage.getItem('userInfo')).userId;
          this.$api
            .fileDel({
              fileKey: file.fileCode,
              optUserId
            })
            .then(res => {
              if (res.code == 0) {
                this.$message.success('删除成功! ');
                for (let i in this.fileInfoData) {
                  let fileCode = this.fileInfoData[i].fileCode;
                  if (file.fileCode === fileCode) {
                    this.fileInfoData.splice(i, 1);
                  }
                }
              } else {
                this.$message.error(res.msg);
              }
            });
        }
      }
    },
    //文件上传之前判断是否允许上传
    beforeAvatarUpload(file) {
      let isAccept = this.isAccept(file);
      let isLt5M = file.size / 1024 / 1024 < 5;
      if (!isAccept) {
        this.$message.error('该格式的文件不支持上传!');
      }
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 5MB!');
      }
      return isLt5M && isAccept;
    },
    //上传附件成功后
    handleSuccess(res, file, fileList) {
      console.log(res);
      if (res.code === 0) {
        // this.initData(res.data);
        this.fileInfoData.push(res.data[0]);
        this.$message.success('上传成功!');
      } else {
        // this.handleRemove(file, fileList);
        this.$message.error(res.msg);
      }
    },
    //上传失败后
    handleError(err, file, fileList) {
      this.$message.error('上传失败!');
    },
    //判断是否允许上传的格式
    isAccept(file) {
      console.log(file);
      let type = file.name || file.fileName;
      type = type.substring(type.lastIndexOf('.') + 1, type.length);
      type = type.toLowerCase();
      let ACCEPT = [];
      if (this.accept != null) {
        ACCEPT = this.accept;
      } else {
        ACCEPT = ['jpg', 'png', 'jpeg', 'xls', 'xlsx', 'doc', 'docx', 'ppt', 'pptx', 'zip', 'rar', 'pdf', 'txt'];
      }

      let noAccept = ACCEPT.every(x => {
        return x !== type;
      });
      return !noAccept;
    },
    //文件上传之前判断是否允许上传
    beforeAvatarUpload(file) {
      // let isAccept = this.isAccept(file);
      let isAccept = true;
      let isLt5M = file.size / 1024 / 1024 < 5;
      if (!isAccept) {
        this.$message.error('该格式的文件不支持上传!');
      }
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 5MB!');
      }
      return isLt5M && isAccept;
    },
    //上传附件成功后
    handleSuccess(res, file, fileList) {
      console.log(res);
      if (res.code === 0) {
        // this.initData(res.data);
        this.fileInfoData.push(res.data[0]);
        this.$message.success('上传成功!');
      } else {
        // this.handleRemove(file, fileList);
        this.$message.error(res.msg);
      }
    },
    //上传失败后
    handleError(err, file, fileList) {
      this.$message.error('上传失败!');
    }
  },
  computed: {
    filterFileInfoData() {
      let fileInfoData = this.fileInfoData;
      return fileInfoData.filter(item => item.fileType == this.row.fileTypeCode);
    },
    showUploadBtn() {
      let flag = true;
      let uploadQty = this.uploadQty;
      if (uploadQty) {
        if (parseFloat(uploadQty) > this.filterFileInfoData.length) {
          flag = true;
        } else {
          flag = false;
        }
      } else {
        flag = true;
      }
      return flag;
    }
  }
};
</script>

<style lang="scss" scoped>
.uplaod-img {
  display: inline-block;
  position: relative;
  height: 100%;
  text-align: left;
  .img-box {
    position: relative;
    display: inline-block;
    width: 100px;
    height: 100px;
    margin-right: 20px;
    .img-action {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, 0.5);
      transition: opacity 0.3s;
      .img-icon {
        position: absolute;
        color: #fff;
        width: 100px;
        height: 20px;
        top: 50%;
        left: 50%;
        margin-top: -10px;
        margin-left: -50px;
      }
    }

    &:hover {
      .img-action {
        opacity: 1;
      }
    }
  }
  img {
    width: 100px;
    height: 100px;
    cursor: pointer;
    display: inline-block;
  }
  p {
    display: inline-block;
  }
  a {
    color: #fff;
  }
  .el-icon-plus {
    width: 100px;
    height: 100px;
    font-size: 20px;
    color: #8c939d;
    &:before {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>

