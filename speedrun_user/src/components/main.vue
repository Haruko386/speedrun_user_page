<template>
  <div class="panel">
    <BannerView/>
  </div>
</template>

<script>
import BannerView from '@/views/BannerView.vue';

export default {
  name: 'mid',
  components: {
    BannerView
  }
}
</script>

<style scoped>
  .panel {
  display: flex;
  width: 70%;
  margin: 0 auto; /* 左右 margin 自动分配实现水平居中 */
  justify-content: center;
  padding-top: 16px;
  
}
</style>