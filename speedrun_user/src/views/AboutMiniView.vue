<template>
    <div class="about-card">
        <div class="card-header">
            <span v-if="users" class="card-title">ABOUT {{ users.name ? users.name.toUpperCase() : '' }}</span>
            <div class="arrow-icon-wrapper" @click="handleRoute">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="arrow-icon" >
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
            </div>
        </div>

        <div class="card-body">
            <p v-if="userSettings" class="bio-text">
                {{ userSettings.bio || "No bio available." }}
            </p>
        </div>

        <div class="card-footer">
            <div class="stat-item">
                <div class="stat-label">Joined</div>
                <div class="stat-value" v-if="users">{{ formatDateFromTimestamp(users.signupDate) }}</div>
            </div>
            
            <div class="stat-item">
                <div class="stat-label">Online</div>
                <div class="stat-value" v-if="users">{{ formatDateFromTimestamp(users.touchDate) }}</div>
            </div>

            <div class="stat-item">
                <div class="stat-label">Runs</div>
                <div class="stat-value" v-if="runList">{{ getAllVerifiedRunCount() }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const users = ref(null);
const userSettings = ref(null);
const runList = ref([]);

onMounted(async () => {
    try {
        const response = await fetch('/src_user_export.json');
        const data = await response.json();
        users.value = data.user;
        userSettings.value = data.userSettings;
        runList.value = data.runList;
    } catch (error) {
        console.error('Load Json filed:', error);
    }
});

const formatDateFromTimestamp = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getAllVerifiedRunCount = () => {
    if (!runList.value) return 0;
    return runList.value.filter(run => run.verified == 1).length;
};

// 预留的路由跳转函数
const handleRoute = () => {
    console.log("Navigating to nested route...");
};
</script>

<style scoped>
/* 卡片整体容器 */
.about-card {
    background: linear-gradient(135deg, rgba(75, 100, 106, 0.85), rgba(58, 79, 85, 0.9));
    color: #FFFFFF;
    border-radius: 6px;
    padding: 20px 24px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    height: 174px;
    font-family: -apzzple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    padding-bottom: 0px;
}

/* 头部样式 */
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
}

.card-title {
    font-size: 16px;
    font-weight: 800; /* 加粗 */
    letter-spacing: 0.5px;
    text-transform: uppercase; /* 强制大写 */
    opacity: 0.95;
}

/* 箭头图标 */
.arrow-icon-wrapper {
    cursor: pointer;
    transition: transform 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.arrow-icon-wrapper:hover {
    transform: translate(2px, -2px); /* 悬停时向右上角微动 */
}

.arrow-icon {
    width: 20px;
    height: 20px;
    stroke: #E0E0E0; /* 略微发灰的白色 */
}

/* Bio 简介文本 */
.card-body {
    margin-bottom: 24px;
    text-align: left;
}

.bio-text {
    font-size: 15px;
    line-height: 1.4;
    font-weight: 400;
    color: #F0F4F5;
    margin: 0;
}

/* 底部数据区域 */
.card-footer {
    display: flex;
    gap: 40px; /* 控制各列之间的间距 */
}

.stat-item {
    display: flex;
    flex-direction: column;
}

.stat-label {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6); /* 半透明白色，对应截图中的灰色文字 */
    margin-bottom: 4px;
    font-weight: 500;
    text-align: left;
}

.stat-value {
    font-size: 18px;
    font-weight: 700;
    color: #FFFFFF;
}
</style>