<template>
  <div class="profile-layout">
    <BannerView @open-settings="$emit('open-settings')" />
    <div class="content-grid">
      <section class="primary-column">
        <router-view v-slot="{ Component }">
          <transition name="route-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </section>
      <aside class="side-column">
        <AboutMiniView />
        <GameRunView />
        <GameFollowedView />
      </aside>
    </div>
  </div>
</template>

<script setup>
import BannerView from '@/views/BannerView.vue'
import AboutMiniView from '@/views/AboutMiniView.vue'
import GameRunView from '@/views/GameRunView.vue'
import GameFollowedView from '@/views/GameFollowedView.vue'

defineEmits(['open-settings'])
</script>

<style scoped>
.profile-layout {
  max-width: var(--content-width);
  width: calc(100% - 32px);
  margin: 0 auto;
  padding-top: 16px;
}
.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 2.15fr) minmax(310px, 1fr);
  align-items: start;
  gap: 16px;
  margin-top: 16px;
}
.primary-column,.side-column { min-width: 0; }
.side-column { display: flex; flex-direction: column; gap: 14px; }
.route-fade-enter-active,.route-fade-leave-active { transition: opacity .16s ease, transform .16s ease; }
.route-fade-enter-from { opacity: 0; transform: translateY(4px); }
.route-fade-leave-to { opacity: 0; }

@media (max-width: 900px) {
  .content-grid { grid-template-columns: 1fr; }
  .side-column { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); }
  .side-column > :first-child { grid-column: 1 / -1; }
}

@media (max-width: 600px) {
  .profile-layout { width: calc(100% - 20px); padding-top: 10px; }
  .content-grid { margin-top: 10px; gap: 10px; }
  .side-column { display: flex; }
}
</style>
