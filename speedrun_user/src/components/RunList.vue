<template>
  <section class="runs-card">
    <header class="runs-header">
      <h2>{{ title }}</h2>
      <div class="filters">
        <label class="switch-control">
          <input v-model="showObsolete" type="checkbox">
          <span class="switch"><i></i></span>
          <b>Show obsolete</b>
        </label>
        <label class="switch-control">
          <input v-model="showMisc" type="checkbox">
          <span class="switch"><i></i></span>
          <b>Show misc.</b>
        </label>
      </div>
    </header>

    <div v-if="groupedRuns.length" class="game-list">
      <article v-for="game in groupedRuns" :key="game.gameId" class="game-group">
        <div class="cover-column">
          <img :src="cover(game.gameId)" :alt="game.name" @error="useFallback">
        </div>
        <div class="game-content">
          <h3>{{ game.name }}</h3>
          <div class="levels">
            <section v-for="level in game.levels" :key="level.levelId || 'full-game'" class="level-group">
              <h4 v-if="mode === 'level'">Level: {{ level.name }}</h4>
              <a
                v-for="run in level.runs"
                :key="run.id"
                class="run-row"
                :class="{ obsolete: isObsolete(run, level.allRuns) }"
                :href="runLink(run)"
                target="_blank"
                rel="noreferrer"
              >
                <div class="run-category">
                  <strong>{{ categoryName(run.categoryId) }}</strong>
                  <span v-if="variableText(run)">{{ variableText(run) }}</span>
                </div>
                <div class="rank-time">
                  <strong v-if="rank(run.id)" class="rank">{{ ordinal(rank(run.id)) }}</strong>
                  <strong class="time">{{ formatRunTime(run.time ?? run.igt) }}</strong>
                </div>
                <div class="run-meta">
                  <span v-if="isObsolete(run, level.allRuns)" class="obsolete-label">Obsolete</span>
                  <span>{{ platformName(run.platformId) }}<sup v-if="run.emulator">EMU</sup></span>
                  <span>{{ formatDate(run.date || run.dateSubmitted) }}</span>
                </div>
              </a>
            </section>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="empty-state">
      <h3>No {{ mode === 'level' ? 'level' : 'full game' }} runs</h3>
      <p>{{ userName }} doesn't have any matching runs yet.</p>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { coverUrl, formatDate, formatRunTime, ordinal } from '@/data/catalog'
import fallbackCover from '@/assets/logo.png'

const props = defineProps({
  mode: { type: String, default: 'level', validator: value => ['level', 'full'].includes(value) }
})

const store = useStore()
const showObsolete = ref(false)
const showMisc = ref(false)
const title = computed(() => props.mode === 'level' ? 'LEVEL RUNS' : 'FULL GAME RUNS')
const userName = computed(() => store.getters.user.name || 'This runner')
const sourceRuns = computed(() => props.mode === 'level' ? store.getters.levelRuns : store.getters.fullGameRuns)

const runKey = (run) => [run.categoryId, ...(run.valueIds || []).slice().sort()].join(':')
const bestRun = (runs) => {
  const apiPersonalBest = runs.find(run => store.getters.runRank(run.id))
  if (apiPersonalBest) return apiPersonalBest
  return [...runs].sort((a, b) => Number(a.time ?? a.igt ?? Infinity) - Number(b.time ?? b.igt ?? Infinity))[0]
}

const filteredRuns = computed(() => sourceRuns.value.filter(run => showMisc.value || !store.getters.isMiscCategory(run.categoryId)))

const groupedRuns = computed(() => {
  const games = new Map()
  filteredRuns.value.forEach(run => {
    if (!games.has(run.gameId)) games.set(run.gameId, new Map())
    const levelId = props.mode === 'level' ? run.levelId : ''
    const levels = games.get(run.gameId)
    if (!levels.has(levelId)) levels.set(levelId, [])
    levels.get(levelId).push(run)
  })

  return [...games.entries()].map(([gameId, levels]) => {
    const processedLevels = [...levels.entries()].map(([levelId, allRuns]) => {
      const variants = new Map()
      allRuns.forEach(run => {
        const key = runKey(run)
        if (!variants.has(key)) variants.set(key, [])
        variants.get(key).push(run)
      })
      const visible = showObsolete.value
        ? [...allRuns].sort((a, b) => Number(b.dateSubmitted || b.date || 0) - Number(a.dateSubmitted || a.date || 0))
        : [...variants.values()].map(bestRun)
      return { levelId, name: store.getters.levelName(levelId), runs: visible, allRuns }
    })
    processedLevels.sort((a, b) => {
      const knownOrder = Object.keys(store.state.metadata.levels)
      const aIndex = knownOrder.indexOf(a.levelId)
      const bIndex = knownOrder.indexOf(b.levelId)
      if (aIndex >= 0 && bIndex >= 0) return aIndex - bIndex
      return a.name.localeCompare(b.name)
    })
    return { gameId, name: store.getters.gameName(gameId), levels: processedLevels }
  }).sort((a, b) => a.name.localeCompare(b.name))
})

const categoryName = (id) => store.getters.categoryName(id)
const platformName = (id) => store.getters.platformName(id)
const rank = (id) => store.getters.runRank(id)
const cover = (id) => store.getters.gameCover(id) || coverUrl(id)
const useFallback = (event) => { event.target.src = fallbackCover }

const variableText = (run) => {
  const values = (run.valueIds || []).map(id => store.getters.variableValue(id)).filter(Boolean)
  if (!values.length) return ''
  const subcategories = values.filter(value => value.isSubcategory).map(value => value.label)
  const details = values.filter(value => !value.isSubcategory).map(value => value.label)
  const left = subcategories.join(', ')
  const right = details.length ? `(${details.join(', ')})` : ''
  return [left, right].filter(Boolean).join(' ')
}

const isObsolete = (run, allRuns) => {
  if (!showObsolete.value) return false
  const peers = allRuns.filter(candidate => runKey(candidate) === runKey(run))
  return bestRun(peers)?.id !== run.id
}
const runLink = (run) => run.id ? `https://www.speedrun.com/runs/${run.id}` : '#'
</script>

<style scoped>
.runs-card { overflow: hidden; border-radius: 7px; background: var(--panel-bg); color: var(--text-main); box-shadow: var(--shadow); text-align: left; }
.runs-header { border-bottom: 1px solid var(--panel-line); }
.runs-header h2 { margin: 0; padding: 14px 17px 10px; font-size: 14px; font-weight: 850; letter-spacing: .4px; }
.filters { min-height: 55px; display: flex; align-items: center; gap: 26px; padding: 8px 17px 12px; }
.switch-control { display: flex; align-items: center; gap: 9px; color: #d3e1e4; font-size: 12px; cursor: pointer; }
.switch-control input { position: absolute; opacity: 0; pointer-events: none; }
.switch { width: 43px; height: 24px; padding: 3px; display: block; border-radius: 15px; background: #08151c; transition: background .18s ease; }
.switch i { width: 18px; height: 18px; display: block; border-radius: 50%; background: #bed0d5; transition: transform .18s ease; }
.switch-control input:checked + .switch { background: #8fb4bd; }
.switch-control input:checked + .switch i { transform: translateX(19px); background: white; }
.switch-control input:focus-visible + .switch { outline: 2px solid white; outline-offset: 2px; }
.switch-control b { font-weight: 700; }
.game-list { padding: 0 17px 18px; }
.game-group { display: grid; grid-template-columns: 68px minmax(0,1fr); gap: 10px; padding-top: 15px; }
.cover-column { padding-top: 29px; }
.cover-column img { width: 66px; max-height: 94px; display: block; border-radius: 4px; object-fit: cover; box-shadow: 0 2px 6px rgba(0,0,0,.3); background: rgba(14,27,32,.4); }
.game-content { min-width: 0; }
.game-content > h3 { height: 29px; display: flex; align-items: center; margin: 0; padding: 0 8px; color: #edf5f6; font-size: 13px; font-weight: 800; }
.levels { overflow: hidden; border-radius: 4px; background: rgba(38,60,67,.54); }
.level-group + .level-group { border-top: 8px solid transparent; }
.level-group h4 { margin: 0; padding: 9px 10px; background: rgba(28,49,57,.55); color: #e5eff1; font-size: 12px; font-weight: 750; }
.run-row { min-height: 70px; display: grid; grid-template-columns: minmax(145px,1fr) minmax(130px,.8fr) minmax(145px,.85fr); align-items: center; column-gap: 12px; padding: 10px; color: inherit; text-decoration: none; border-top: 1px solid rgba(222,238,241,.045); }
.run-row:nth-of-type(odd) { background: rgba(78,106,114,.22); }
.run-row:hover { background: rgba(193,220,226,.11); }
.run-row.obsolete { opacity: .67; }
.run-category { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.run-category strong { color: #d6e4e7; font-size: 12px; }
.run-category span { overflow: hidden; color: #9fb5bb; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
.rank-time { display: flex; flex-direction: column; gap: 3px; align-items: flex-start; }
.rank { color: #eef5f6; font-size: 12px; }
.time { color: #ecf3f5; font-size: 12px; font-weight: 650; font-variant-numeric: tabular-nums; }
.run-meta { display: flex; flex-direction: column; gap: 3px; color: #d1dfe2; font-size: 11px; }
.run-meta sup { margin-left: 2px; color: #a9bec3; font-size: 7px; }
.obsolete-label { color: #e4b1aa; }
.empty-state { padding: 55px 20px 62px; text-align: center; }
.empty-state h3 { margin: 0 0 7px; color: #e8f1f3; font-size: 15px; text-transform: uppercase; }
.empty-state p { margin: 0; color: var(--text-muted); font-size: 12px; }

@media (max-width: 650px) {
  .filters { gap: 15px; flex-wrap: wrap; }
  .game-list { padding: 0 10px 12px; }
  .game-group { grid-template-columns: 48px minmax(0,1fr); gap: 7px; }
  .cover-column img { width: 47px; max-height: 70px; }
  .run-row { grid-template-columns: minmax(100px,1fr) minmax(92px,.75fr); gap: 7px; }
  .run-meta { grid-column: 1 / -1; flex-direction: row; justify-content: space-between; padding-top: 5px; border-top: 1px solid rgba(255,255,255,.06); }
}
</style>
