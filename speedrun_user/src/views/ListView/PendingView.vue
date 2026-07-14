<template>
  <section class="tab-card">
    <header><h2>PENDING RUNS</h2></header>
    <div v-if="pending.length" class="pending-list">
      <article v-for="run in pending" :key="run.id">
        <div><strong>{{ gameName(run.gameId) }}</strong><span>{{ categoryName(run.categoryId) }}</span></div>
        <div><strong>{{ formatRunTime(run.time ?? run.igt) }}</strong><span>{{ formatDate(run.dateSubmitted || run.date) }}</span></div>
      </article>
    </div>
    <div v-else class="empty-state"><h3>NO PENDING RUNS</h3><p>{{ user.name || 'This runner' }} doesn't have any runs pending verification.</p></div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { formatDate, formatRunTime } from '@/data/catalog'
const store=useStore()
const user=computed(()=>store.getters.user)
const pending=computed(()=>store.getters.pendingRuns)
const gameName=id=>store.getters.gameName(id)
const categoryName=id=>store.getters.categoryName(id)
</script>

<style scoped>
.tab-card{overflow:hidden;border-radius:7px;color:var(--text-main);background:var(--panel-bg);box-shadow:var(--shadow);text-align:left}header{padding:14px 17px;border-bottom:1px solid var(--panel-line)}h2{margin:0;font-size:14px;font-weight:850;letter-spacing:.4px}.pending-list{padding:8px 17px 16px}.pending-list article{display:flex;justify-content:space-between;gap:15px;padding:13px;border-bottom:1px solid var(--panel-line)}.pending-list article>div{display:flex;flex-direction:column;gap:3px}.pending-list article>div:last-child{text-align:right}.pending-list strong{font-size:12px}.pending-list span{color:var(--text-muted);font-size:10px}.empty-state{padding:55px 20px 62px;text-align:center}.empty-state h3{margin:0 0 7px;font-size:15px}.empty-state p{margin:0;color:var(--text-muted);font-size:12px}
</style>
