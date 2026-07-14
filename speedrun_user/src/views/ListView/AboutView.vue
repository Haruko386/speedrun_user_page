<template>
  <section class="stats-card">
    <header><h2>USER STATS</h2></header>

    <div class="stats-content">
      <h3>Speedrun stats</h3>
      <div class="stats-grid">
        <div v-for="item in speedrunStats" :key="item.label" class="stat">
          <span>{{ item.label }}</span><strong>{{ item.value }}</strong>
        </div>
      </div>

      <h3>Community stats</h3>
      <div class="stats-grid">
        <div v-for="item in communityStats" :key="item.label" class="stat">
          <span>{{ item.label }}</span><strong>{{ item.value }}</strong>
        </div>
      </div>

      <h3>About {{ user.name || 'runner' }}</h3>
      <p class="bio">{{ settings.bio || `${user.name || 'This runner'} hasn't added a bio yet.` }}</p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { formatDate, formatRunTime } from '@/data/catalog'

const store = useStore()
const user = computed(() => store.getters.user)
const settings = computed(() => store.getters.userSettings)
const verified = computed(() => store.getters.verifiedRuns)

const speedrunStats = computed(() => {
  const runs = verified.value
  const dates = runs.map(run => Number(run.date || run.dateSubmitted || 0)).filter(Boolean).sort((a,b) => a-b)
  const totalTime = runs.reduce((sum, run) => sum + Number(run.time ?? run.igt ?? 0), 0)
  return [
    { label: 'Total runs', value: runs.length },
    { label: 'Full game runs', value: store.getters.fullGameRuns.length },
    { label: 'Level runs', value: store.getters.levelRuns.length },
    { label: 'Pending runs', value: store.getters.pendingRuns.length },
    { label: 'Total run time', value: formatRunTime(totalTime) },
    { label: 'Unique games', value: new Set(runs.map(run => run.gameId).filter(Boolean)).size },
    { label: 'Unique categories', value: new Set(runs.map(run => run.categoryId).filter(Boolean)).size },
    { label: 'Unique levels', value: new Set(runs.map(run => run.levelId).filter(Boolean)).size },
    { label: 'First run', value: formatDate(dates[0]) },
    { label: 'Last run', value: formatDate(dates.at(-1)) }
  ]
})

const communityStats = computed(() => [
  { label: 'Joined', value: formatDate(user.value.signupDate) },
  { label: 'Last visit', value: formatDate(user.value.touchDate || user.value.onlineDate) },
  { label: 'Followers', value: store.getters.followers.length },
  { label: 'Games followed', value: store.getters.followedGames.length },
  { label: 'Comments', value: store.getters.comments.length },
  { label: 'Threads created', value: store.getters.threads.length }
])
</script>

<style scoped>
.stats-card { overflow: hidden; border-radius: 7px; background: var(--panel-bg); box-shadow: var(--shadow); color: var(--text-main); text-align: left; }
header { padding: 14px 17px; border-bottom: 1px solid var(--panel-line); }
h2 { margin: 0; font-size: 14px; font-weight: 850; letter-spacing: .4px; }
.stats-content { padding: 16px 17px 22px; }
h3 { margin: 4px 0 10px; color: #dce9eb; font-size: 12px; text-transform: uppercase; letter-spacing: .4px; }
h3:not(:first-child) { margin-top: 24px; }
.stats-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 8px; }
.stat { min-height: 62px; display: flex; flex-direction: column; justify-content: center; gap: 5px; padding: 10px 12px; border-radius: 5px; background: rgba(35,56,63,.55); }
.stat span { color: #9fb5bb; font-size: 10px; }
.stat strong { color: #f0f6f7; font-size: 14px; font-variant-numeric: tabular-nums; }
.bio { margin: 0; padding: 14px; border-left: 3px solid rgba(171,205,213,.6); background: rgba(35,56,63,.35); color: #d8e5e7; font-size: 12px; line-height: 1.6; }
@media (max-width:600px){ .stats-grid{grid-template-columns:repeat(2,minmax(0,1fr));} }
</style>
