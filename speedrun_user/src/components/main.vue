<template>
  <div class="banner">
    <BannerView />
  </div>
  <div class="panel">
    <AboutMiniView/>
     <GameRunView/>
     <GameFollowedView/>
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
    GameFollowedView
  }
}
</script>

<style scoped>
.banner {
  display: flex;
  width: 70%;
  margin: 0 auto;
  justify-content: center;
  padding-top: 16px;

}

.panel {
  width: 70%;
  margin: 0 auto;
  margin-top: 16px;
  min-height: 400px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
</style>