<template>
  <section class="tab-card">
    <header><h2>COMMENTS</h2></header>
    <div v-if="comments.length" class="comment-list">
      <article v-for="comment in comments" :key="comment.id">
        <div class="comment-meta">
          <span class="flag">{{ flag }}</span>
          <strong>{{ user.name || 'Runner' }}</strong>
          <time>{{ formatDate(comment.editedDate || comment.date) }}</time>
        </div>
        <p>{{ comment.text }}</p>
      </article>
    </div>
    <div v-else class="empty-state"><h3>NO COMMENTS</h3><p>{{ user.name || 'This runner' }} hasn't posted any comments yet.</p></div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { countryFlag, formatDate } from '@/data/catalog'

const store = useStore()
const user = computed(() => store.getters.user)
const comments = computed(() => store.getters.comments.filter(comment => !comment.deleted))
const flag = computed(() => countryFlag(user.value.areaId))
</script>

<style scoped>
.tab-card { overflow:hidden; border-radius:7px; color:var(--text-main); background:var(--panel-bg); box-shadow:var(--shadow); text-align:left; }
header { padding:14px 17px; border-bottom:1px solid var(--panel-line); }
h2 { margin:0; font-size:14px; font-weight:850; letter-spacing:.4px; }
.comment-list { padding:0 17px; }
article { padding:18px 2px 20px; border-bottom:1px solid rgba(218,235,239,.11); }
.comment-meta { display:flex; align-items:center; gap:8px; }
.flag { font-size:15px; }
.comment-meta strong { font-size:13px; background:linear-gradient(90deg,#44bbee,#ffb3f3); background-clip:text; -webkit-background-clip:text; color:transparent; }
time { margin-left:auto; color:#9fb5bb; font-size:10px; }
article p { margin:12px 0 0; color:#dbe7e9; font-size:12px; line-height:1.65; white-space:pre-wrap; }
.empty-state { padding:55px 20px 62px; text-align:center; }
.empty-state h3 { margin:0 0 7px; font-size:15px; }
.empty-state p { margin:0; color:var(--text-muted); font-size:12px; }
</style>
