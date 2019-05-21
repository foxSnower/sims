<template>
<iframe src="https://cn.bing.com/" marginheight="0" marginwidth="0" frameborder="0" scrolling="no" width="100%" height=100% id="iframepage" name="iframepage" ></iframe>
<!-- <frameset border="1" bordercolor="#6699cc" framespacing="20" id="frameset" marginwidth="0" marginheight="0" leftmargin="0" topmargin="0"   cols="100%"> 
  <frame border="0" frameborder="no" marginheight="0" marginwidth="0" name="title" noresize scrolling="no" src="https://cn.bing.com" leftmargin="0" topmargin="0"> 
</frameset> -->
</template>

<script>
export default {
  name: 'otherManagement',
  mounted() {
    setTimeout(() => {
       this.iFrameHeight();
    }, 1000);
  },
  methods: {
    iFrameHeight() {
      var ifm = document.getElementById('iframepage');
      var subWeb = document.frames
        ? document.frames['iframepage'].document
        : ifm.contentDocument;
      if (ifm != null && subWeb != null) {
        ifm.height = subWeb.body.scrollHeight;
      }
    }
  }
};
</script>

<style>
</style>
