<template>
  <section class="side-card">
    <h2>GAMES RUN</h2>
    <div class="game-list">
      <article v-for="(game, index) in games" :key="game.gameId" :class="{ alternate: index % 2 === 0 }">
        <img :src="cover(game.gameId)" :alt="game.name" @error="useFallback">
        <div class="game-info">
          <strong>{{ game.name }}</strong>
          <span>Last run {{ formatDate(game.lastRun) }}</span>
        </div>
        <div class="count"><strong>{{ game.count }}</strong><span>{{ game.count === 1 ? 'run' : 'runs' }}</span></div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { coverUrl, formatDate } from '@/data/catalog'
import fallbackCover from '../assets/logo.png'

const store = useStore()
const games = computed(() => {
  const groups = new Map()
  store.getters.verifiedRuns.forEach(run => {
    if (!run.gameId) return
    const group = groups.get(run.gameId) || { gameId: run.gameId, count: 0, lastRun: 0 }
    group.count += 1
    group.lastRun = Math.max(group.lastRun, Number(run.date || run.dateSubmitted || 0))
    groups.set(run.gameId, group)
  })
  return [...groups.values()]
    .map(game => ({ ...game, name: store.getters.gameName(game.gameId) }))
    .sort((a, b) => b.count - a.count || b.lastRun - a.lastRun)
})
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
</style>
