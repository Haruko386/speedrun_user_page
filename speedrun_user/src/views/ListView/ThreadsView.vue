<template>
  <section class="tab-card">
    <header><h2>THREADS</h2></header>
    <div v-if="threads.length" class="thread-list">
      <article v-for="thread in threads" :key="thread.id">
        <strong>{{ thread.title || thread.name || `Thread ${thread.id}` }}</strong>
        <span>{{ formatDate(thread.date || thread.createdDate) }}</span>
      </article>
    </div>
    <div v-else class="empty-state"><h3>NO THREADS</h3><p>{{ user.name || 'This runner' }} hasn't created any threads yet.</p></div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { formatDate } from '@/data/catalog'
const store = useStore()
const user = computed(() => store.getters.user)
const threads = computed(() => store.getters.threads)
</script>

<style scoped>
.tab-card{overflow:hidden;border-radius:7px;color:var(--text-main);background:var(--panel-bg);box-shadow:var(--shadow);text-align:left}header{padding:14px 17px;border-bottom:1px solid var(--panel-line)}h2{margin:0;font-size:14px;font-weight:850;letter-spacing:.4px}.thread-list{padding:8px 17px 16px}.thread-list article{display:flex;justify-content:space-between;gap:15px;padding:13px;border-bottom:1px solid var(--panel-line);font-size:12px}.thread-list span{color:var(--text-muted)}.empty-state{padding:55px 20px 62px;text-align:center}.empty-state h3{margin:0 0 7px;font-size:15px}.empty-state p{margin:0;color:var(--text-muted);font-size:12px}
</style>
