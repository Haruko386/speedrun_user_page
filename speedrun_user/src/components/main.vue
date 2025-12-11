<template>
  <div class="banner">
    <BannerView />
  </div>
  <div class="panel">
    <div class="list-container">
      <ListView/>
    </div>
    <div class="info-container">
      <AboutMiniView/>
      <GameRunView/>
      <GameFollowedView/>
    </div>
  </div>

</template>

<script>
import BannerView from '@/views/BannerView.vue';
import ListView from '@/views/ListView.vue';
import AboutMiniView from '@/views/AboutMiniView.vue';
import GameRunView from '@/views/GameRunView.vue';
import GameFollowedView from '@/views/GameFollowedView.vue';

export default {
  name: 'mid',
  components: {
    BannerView,
    ListView,
    AboutMiniView,
    GameRunView,
    GameFollowedView,
    ListView
  }
}
</script>

<style scoped>
.banner {
  display: flex;
  width: 75%;
  margin: 0 auto;
  justify-content: center;
  padding-top: 16px;

}
.panel {
  width: 75%;
  margin: 0 auto;
  margin-top: 16px;
  min-height: 400px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px; /* 在 flex 布局中设置中间间距（现代浏览器支持） */
}

.list-container {
  flex: 1; /* 占据左侧剩余空间 */
  max-width: 60%; /* 可选：限制最大宽度 */
}

.info-container {
  flex: 0 0 auto; /* 不伸缩，只占自身宽度 */
  width: 35%; /* 或者用固定宽度如 300px */
}
</style>