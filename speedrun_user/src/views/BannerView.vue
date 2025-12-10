<template>
    <div class="banner-container">
        <div class="up">
            <div class="up-inner">
                <!-- 左侧区域：头像和基本信息 -->
                <div class="left-section">
                    <div class="avatar">
                        <img src="../assets/avatar.png" class="user-avatar">
                    </div>
                </div>

                <!-- 右侧区域：用户详细信息 -->
                <div class="right-section">
                    <div class="name">
                        <img src="../assets/icon.webp" alt="Verified Icon" width="16" height="16">
                        <span v-if="users" class="username">{{ users.name }}</span>
                    </div>

                    <div class="country">
                        <img src="../assets/cn.png" alt="location" width="18" height="12">
                        <span>China</span>
                    </div>

                    <div class="social">
                        <!-- Discord (networkId: 5) -->
                        <button v-if="getSocialValue(5)" @click="copyToClipboard(getSocialValue(5))">
                            <img src="../assets/logo/discord.png" alt="discord" width="16" height="16"/>
                            @ {{ getSocialValue(5) }}
                        </button>
                        
                        <!-- Twitch (networkId: 29) -->
                        <button v-if="getSocialValue(29)">
                            <img src="../assets/logo/twitch.png" alt="twitch" width="16" height="16"/>
                            {{ getSocialValue(29) }}
                        </button>
                        
                        <!-- YouTube (networkId: 32) -->
                        <button v-if="getSocialValue(32)">
                            <img src="../assets/logo/Youtube.png" alt="youtube" width="16" height="16"/>
                            {{ getSocialValue(32) }}
                        </button>
                        
                        <!-- Instagram (networkId: 11) -->
                        <button v-if="getSocialValue(11)">
                            <img src="../assets/logo/instagram.png" alt="instagram" width="16" height="16"/>
                            {{ getSocialValue(11) }}
                        </button>
                        
                        <!-- Bilibili (networkId: 3) -->
                        <button v-if="getSocialValue(3)">
                            <img src="../assets/logo/bilibili.png" alt="bilibili" width="20" height="20"/>
                            {{ getSocialValue(3) }}
                        </button>
                        
                        <!-- Website (networkId: 31) -->
                        <button v-if="getSocialValue(31)">
                            <a :href="getSocialValue(31)" target="_blank" @click.stop>
                                <img src="../assets/logo/Web.png" alt="website" width="16" height="16"/>
                                {{ formatWebsiteUrl(getSocialValue(31)) }}
                            </a>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="down">
            <!-- 嵌套路由之各项数据 -->
            <div class="nav-links">
                <button>Full game runs</button>
                <button>Level runs</button>
                <button>Comments</button>
                <button>Followers</button>
                <button>Following</button>
                <button>About</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const users = ref(null);
const userSettings = ref(null);
const userSocialConnectionList = ref(null);

onMounted(async () => {
    try {
        const response = await fetch('/src_user_export.json');
        const data = await response.json();
        users.value = data.user;
        userSettings.value = data.userSettings;
        userSocialConnectionList.value = data.userSocialConnectionList;
    } catch (error) {
        console.error('加载JSON数据失败:', error);
    }
});

const getSocialValue = (networkId) => {
    if (!userSocialConnectionList.value) return null;
    const connection = userSocialConnectionList.value.find(conn => conn.networkId === networkId);
    return connection ? connection.value : null;
}

const formatWebsiteUrl = (url) => {
    if (!url) return '';
    return url.replace(/https?:\/\//, '').replace(/\/$/, '');
};

// 复制到剪贴板
const copyToClipboard = (text) => {
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
        alert(`已复制: ${text}`);
    }).catch(err => {
        console.error('复制失败:', err);
    });
};
</script>

<style scoped>
.banner-container {
    width: 100%;
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.up {
    height: 145px;
    background: linear-gradient(135deg, rgba(75, 100, 106, 0.85), rgba(58, 79, 85, 0.9));
    width: 100%;
    position: relative;
}

.up-inner {
    display: flex;
    /* 关键：使用Flexbox布局 */
    height: 100%;
    width: 100%;
    padding: 16px 24px;
    box-sizing: border-box;
}

/* 左侧区域 - 头像 */
.left-section {
    flex: 0 0 110px;
    /* 固定宽度 */
    display: flex;
    align-items: center;
    justify-content: center;
}

.avatar {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid rgba(255, 255, 255, 0.9);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.user-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* 右侧区域 - 用户信息 */
.right-section {
    flex: 1;
    /* 占据剩余空间 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 20px;
    color: white;
}

.name {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 6px;
}

.name img {
    vertical-align: middle;
}

.country {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    opacity: 0.9;
    margin-bottom: 4px;
}

.social {
    font-size: 14px;
    opacity: 0.85;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
}

.social button {
    width: auto;
    color: #ffffff;
    background: rgba(255, 255, 255, 0.14);
    border: none;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
}

.social button:hover {
    background: rgba(255, 255, 255, 0.26);
    transform: translateY(-2px);
}

.social button img {
    width: 18px;
    height: 18px;
}

.social button a {
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 底部区域 */
.down {
    height: 48px;
    background-color: rgba(41, 56, 61, 0.95);
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 24px;
}

.nav-links {
    display: flex;
    gap: 24px;
}

.nav-links button {
    color: #C1D7DD;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.3s;
    /* 移除所有按钮默认样式 */
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    outline: none;
    /* 确保文字对齐一致 */
    text-align: left;
    /* 保留可访问性，添加下划线作为可点击指示 */
    text-decoration: none;
}

/* 保留悬停效果 */
.nav-links button:hover {
    color: white;
    text-decoration: underline;
}

/* 焦点状态，保持可访问性 */
.nav-links button:focus {
    outline: none;
    color: white;
    text-decoration: underline;
    box-shadow: 0 0 2px 1px rgba(255, 255, 255, 0.5);
}

/* 激活状态 */
.nav-links button:active {
    color: #a8d8e6;
    text-decoration: none;
}

.username {
    font-size: 26px;
    background: linear-gradient(to right, #44BBEE, #FFB3F3);
    -webkit-background-clip: text;
    color: transparent;
}
</style>