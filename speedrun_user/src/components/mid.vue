<template>
  <div class="banner">
    <BannerView />
  </div>
  <div class="panel">
    <div class="list-container">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
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
import AboutMiniView from '@/views/AboutMiniView.vue';
import GameRunView from '@/views/GameRunView.vue';
import GameFollowedView from '@/views/GameFollowedView.vue';

export default {
  name: 'mid',
  components: {
    BannerView,
    AboutMiniView,
    GameRunView,
    GameFollowedView
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
  gap: 24px;
}
.list-container {
  flex: 1;
  max-width: 60%;
}
.info-container {
  flex: 0 0 auto;
  width: 35%;
}

/* 可选：添加简单的过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>