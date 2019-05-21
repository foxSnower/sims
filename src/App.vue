<template>
  <div>
    <P404 v-if="invalidRoute"></P404>
    <router-view v-else></router-view>
  </div>
</template>

<script>
// require('./sass/theme/defult/index.css');
require('./sass/theme/56C499/index.css');
require('./sass/theme/86B4F3/index.css');
require('./sass/theme/409eff/index.css');
require('./sass/theme/B994DD/index.css');
require('./sass/theme/F3ACAC/index.css');
require('./sass/theme/81B0F1/index.css');
require('font-awesome/css/font-awesome.min.css');
require('./sass/common.scss');
require('./sass/hongte.scss');
import P404 from '@views/Common/404';
export default {
  name: 'App',
  data() {
    return {
      invalidRoute: false
    };
  },
  watch: {
    computedInvalidRoute(val) {
      this.invalidRoute = val;
    }
  },
  components: {
    P404
  },
  computed: {
    computedInvalidRoute() {
      return !this.$route.matched || this.$route.matched.length === 0;
    }
  }
};
</script>


