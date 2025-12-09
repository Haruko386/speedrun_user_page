<script setup>
import { ref } from 'vue';
// 导入你的 JSON 数据
import rawData from './assets/data.json';

// 将数据结构拆分
const userData = ref(rawData.user);
const userSettings = ref(rawData.userSettings);
const runList = ref(rawData.runList);
const socialConnections = ref(rawData.userSocialConnectionList);

// 提取数据中的统计信息
const totalRuns = runList.value.length;
const verifiedRuns = runList.value.filter(r => r.verified === 1).length;
</script>

<template>
  <div class="app-container">
    <header class="main-header">
      <div class="container">
        <UserCard 
          :user="userData" 
          :settings="userSettings"
          :socials="socialConnections"
        />
        
        <div class="stats-bar">
          <div class="stat-item">
            <span class="stat-value">{{ totalRuns }}</span>
            <span class="stat-label">总提交数</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ verifiedRuns }}</span>
            <span class="stat-label">已核实</span>
          </div>
        </div>

        <RunList :runs="runList" />
      </div>
    </header>
  </div>
</template>

<script>
// 注册子组件
import UserCard from './components/UserCard.vue';
import RunList from './components/RunList.vue';
</script>

<style>
/* 全局样式重置 */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: #f3f4f6;
  color: #333;
}
.app-container {
  padding: 2rem;
  min-height: 100vh;
}
.container {
  max-width: 1000px;
  margin: 0 auto;
}
.stats-bar {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  justify-content: center;
}
.stat-item {
  text-align: center;
}
.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #42b883;
}
.stat-label {
  font-size: 0.85rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>