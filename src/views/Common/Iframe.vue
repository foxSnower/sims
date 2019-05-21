<template>
    <div class="ht-iframe">
        <iframe  id="myiframe" frameborder="0" scrolling="no" width="100%" :src="filterUrl" height="1000">
            <p>你的浏览器不支持iframe标签，建议使用谷歌浏览器查看</p>
        </iframe>
    </div>
</template>

<script>
export default {
  name: "Iframe",
  mounted() {
    this.$nextTick(() => {
    });
  },
  methods: {
    
  },
  computed: {
    filterUrl(){
      return this.$route.params.url
    }
  }
};
</script>

<style scoped>

</style>