<template>
  <section class="side-card">
    <h2>GAMES FOLLOWED</h2>
    <div class="game-list">
      <article v-for="(item, index) in followedGames" :key="item.gameId" :class="{ alternate: index % 2 === 0 }">
        <img :src="cover(item.gameId)" :alt="gameName(item.gameId)" @error="useFallback">
        <div class="game-info">
          <strong>{{ gameName(item.gameId) }}</strong>
          <span>Last visit {{ formatDate(item.lastAccessDate) }}</span>
        </div>
        <div class="count"><strong>{{ item.accessCount || 0 }}</strong><span>{{ Number(item.accessCount) === 1 ? 'visit' : 'visits' }}</span></div>
      </article>
      <p v-if="!followedGames.length" class="empty">No followed games</p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { coverUrl, formatDate } from '@/data/catalog'
import fallbackCover from '../assets/logo.png'

const store = useStore()
const followedGames = computed(() => store.getters.followedGames)
const gameName = (id) => store.getters.gameName(id)
const cover = (id) => store.getters.gameCover(id) || coverUrl(id)
const useFallback = (event) => { event.target.src = fallbackCover }
</script>

<style scoped>
.side-card { overflow: hidden; border-radius: 7px; color: var(--text-main); background: var(--panel-bg); box-shadow: var(--shadow); text-align: left; }
h2 { margin: 0; padding: 15px 17px 12px; font-size: 14px; font-weight: 850; letter-spacing: .35px; }
.game-list { display: flex; flex-direction: column; }
article { min-height: 68px; display: flex; align-items: center; gap: 12px; padding: 8px 15px; }
article.alternate { background: rgba(33,53,60,.42); }
article:hover { background: rgba(218,237,241,.09); }
article > img { width: 38px; height: 50px; flex: 0 0 auto; border-radius: 4px; object-fit: cover; background: rgba(13,26,31,.4); }
.game-info { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 2px; }
.game-info strong { overflow: hidden; color: #e8f1f3; font-size: 13px; text-overflow: ellipsis; white-space: nowrap; }
.game-info span { color: #9fb5bb; font-size: 10px; }
.count { min-width: 40px; display: flex; flex-direction: column; align-items: center; color: #d6e4e7; }
.count strong { font-size: 13px; }
.count span { color: #9fb5bb; font-size: 10px; }
.empty { padding: 16px; margin: 0; color: var(--text-muted); font-size: 12px; }
</style>
