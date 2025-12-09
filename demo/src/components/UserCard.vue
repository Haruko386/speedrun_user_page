<script setup>
import { computed } from 'vue';
import { formatDate } from '../utils';

defineProps({
  user: {
    type: Object,
    required: true
  },
  settings: {
    type: Object,
    default: () => ({})
  },
  socials: {
    type: Array,
    default: () => []
  }
});

// 计算用户头像颜色（模拟 Speedrun.com 风格）
const nameColor = computed(() => {
    // 简单映射，实际可以使用 json 中的 color1Id
    return '#E5E7EB'; 
});
</script>

<template>
  <div class="user-card">
    <div class="header">
      <div class="avatar-placeholder">{{ user.name.charAt(0).toUpperCase() }}</div>
      <div class="info">
        <h1 :style="{ color: nameColor }">{{ user.name }}</h1>
        <p class="location" v-if="user.areaId">📍 {{ user.areaId.toUpperCase() }}</p>
        <p class="join-date">注册于: {{ formatDate(user.signupDate) }}</p>
      </div>
    </div>
    
    <div class="bio" v-if="settings.bio">
      "{{ settings.bio }}"
    </div>

    <div class="socials" v-if="socials.length">
      <h3>社交链接</h3>
      <ul>
        <li v-for="(social, index) in socials" :key="index">
          <a :href="social.value.startsWith('http') ? social.value : '#'" target="_blank">
             链接 {{ index + 1 }} ({{ social.value }})
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.user-card {
  background: #2c3e50;
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
.header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.avatar-placeholder {
  width: 80px;
  height: 80px;
  background: #42b883;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
}
.info h1 { margin: 0; font-size: 2rem; }
.location { margin: 5px 0 0; opacity: 0.8; }
.join-date { font-size: 0.8rem; opacity: 0.6; }
.bio {
  margin-top: 1.5rem;
  font-style: italic;
  background: rgba(255,255,255,0.1);
  padding: 1rem;
  border-left: 4px solid #42b883;
  border-radius: 4px;
}
.socials { margin-top: 1rem; }
.socials ul { list-style: none; padding: 0; display: flex; gap: 10px; flex-wrap: wrap;}
.socials a { color: #42b883; text-decoration: none; background: rgba(0,0,0,0.2); padding: 5px 10px; border-radius: 4px;}
</style>