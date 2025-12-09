<script setup>
import { ref, computed } from 'vue';
import { formatDate, formatTime, getVideoPlatform } from '../utils';

const props = defineProps({
  runs: {
    type: Array,
    required: true
  }
});

// 简单的排序功能
const sortKey = ref('date');
const sortOrder = ref('desc');

const sortedRuns = computed(() => {
  return [...props.runs].sort((a, b) => {
    let valA = a[sortKey.value];
    let valB = b[sortKey.value];
    
    // 如果是时间，优先取 time，没有则取 igt
    if (sortKey.value === 'time') {
        valA = a.time || a.igt || 0;
        valB = b.time || b.igt || 0;
    }

    if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
});

const toggleSort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'desc';
  }
};
</script>

<template>
  <div class="run-container">
    <h2>🏆 速通记录 ({{ runs.length }})</h2>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th @click="toggleSort('gameId')">游戏 ID</th>
            <th @click="toggleSort('date')">日期 ↕</th>
            <th @click="toggleSort('time')">时长 ↕</th>
            <th>视频</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="run in sortedRuns" :key="run.id">
            <td class="game-id">
                <span class="badge">{{ run.gameId }}</span>
                <div class="level-id" v-if="run.levelId">Level: {{ run.levelId }}</div>
            </td>
            <td>{{ formatDate(run.date) }}</td>
            <td class="time-cell">{{ formatTime(run.time || run.igt) }}</td>
            <td>
              <a v-if="run.video" :href="run.video" target="_blank" class="video-btn">
                {{ getVideoPlatform(run.video) }} ↗
              </a>
              <span v-else class="no-video">-</span>
            </td>
            <td class="comment-cell">
              <div v-if="run.comment && run.comment !== 'null'" class="comment-text" :title="run.comment">
                {{ run.comment }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.run-container {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
h2 { color: #2c3e50; margin-bottom: 1rem; }
.table-wrapper { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; min-width: 600px; }
th { text-align: left; padding: 1rem; background: #f8f9fa; cursor: pointer; user-select: none; color: #666;}
th:hover { background: #eee; }
td { padding: 1rem; border-bottom: 1px solid #eee; vertical-align: top; }
tr:hover { background: #f9f9f9; }

.badge {
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
}
.level-id { font-size: 0.75rem; color: #888; margin-top: 4px; }
.time-cell { font-family: monospace; font-weight: bold; color: #2c3e50; font-size: 1.1rem; }
.video-btn {
  text-decoration: none;
  color: white;
  background: #ef4444; /* YouTube Red-ish */
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  transition: opacity 0.2s;
}
.video-btn:hover { opacity: 0.8; }
.no-video { color: #ccc; }

.comment-cell { max-width: 300px; }
.comment-text {
  font-size: 0.9rem;
  color: #555;
  white-space: pre-wrap; /* 允许换行 */
  background: #f1f1f1;
  padding: 8px;
  border-radius: 6px;
}
</style>