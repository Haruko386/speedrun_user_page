<template>
    <div class="banner-container">
        <div class="up">
            <div class="up-inner">
                <div class="left-section">
                    <div class="avatar">
                        <img src="../assets/avatar.png" class="user-avatar">
                    </div>
                </div>

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
                        <button v-if="getSocialValue(5)" @click="copyToClipboard(getSocialValue(5))">
                            <img src="../assets/logo/discord.png" alt="discord" width="18" height="18" align="center" />
                            @ {{ getSocialValue(5) }}
                        </button>

                        <!-- Twitch (networkId: 29) -->
                        <button v-if="getSocialValue(29)">
                            <img src="../assets/logo/twitch.png" alt="twitch" width="16" height="16" align="center" />
                            <span> {{ getSocialValue(29) }}</span>
                        </button>

                        <!-- YouTube (networkId: 32) -->
                        <button v-if="getSocialValue(32)">
                            <img src="../assets/logo/Youtube.png" alt="youtube" width="18" height="18" align="center" />
                            {{ getSocialValue(32) }}
                        </button>

                        <!-- Instagram (networkId: 11) -->
                        <button v-if="getSocialValue(11)">
                            <img src="../assets/logo/instagram.png" alt="instagram" width="18" height="18"
                                align="center" />
                            {{ getSocialValue(11) }}
                        </button>

                        <!-- Bilibili (networkId: 3) -->
                        <button v-if="getSocialValue(3)">
                            <a :href="'https://space.bilibili.com/' + getSocialValue(3)" target="_blank" @click.stop>
                                <img src="../assets/logo/bilibili.png" alt="bilibili" width="18" height="18"
                                    align="center" />
                            </a>
                        </button>

                        <!-- Website (networkId: 31) -->
                        <button v-if="getSocialValue(31)">
                            <a :href="getSocialValue(31)" target="_blank" @click.stop>
                                <img src="../assets/logo/Web.png" alt="website" width="18" height="18" align="center" />
                            </a>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="down">
            <div class="nav-links">
                <button v-for="tab in tabs" :key="tab.name" :class="{ 'active': isActive(tab.routeName) }"
                    @click="handleTabClick(tab.routeName)">
                    {{ tab.name }}
                    <span v-if="tab.count !== null" class="badge">{{ tab.count }}</span>
                </button>
            </div>

            <div class="nav-links" id="right-button">
                <button>Settings</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter(); // 用于执行跳转
const route = useRoute();   // 用于获取当前路由状态

const users = ref(null);
const userSettings = ref(null);
const userSocialConnectionList = ref(null);
const runList = ref([]);
const userFollowerList = ref([]);
const commentList = ref([]);
const gameFollowerList = ref([]);

onMounted(async () => {
    try {
        const response = await fetch('/src_user_export.json');
        const data = await response.json();
        users.value = data.user;
        userSettings.value = data.userSettings;
        userSocialConnectionList.value = data.userSocialConnectionList;
        runList.value = data.runList;
        userFollowerList.value = data.userFollowerList;
        commentList.value = data.commentList;
        gameFollowerList.value = data.gameFollowerList;
    } catch (error) {
        console.error('Load json failed:', error);
    }
});

const getAllVerifiedRunCount = () => {
    return runList.value.filter(run => run.verified == 1).length;
};

const getLevelRunCount = () => {
    return runList.value.filter(run => run.levelId && run.verified == 1).length;
};

const getSocialValue = (networkId) => {
    if (!userSocialConnectionList.value) return null;
    const connection = userSocialConnectionList.value.find(conn => conn.networkId === networkId);
    return connection ? connection.value : null;
}
const copyToClipboard = (text) => { navigator.clipboard.writeText(text); };

const tabs = computed(() => [
    { name: 'Full game runs', routeName: 'FullGameRuns', count: getAllVerifiedRunCount() - getLevelRunCount() },
    { name: 'Level runs', routeName: 'LevelRuns', count: getLevelRunCount() },
    { name: 'Threads', routeName: 'Threads', count: null }, // 需在 router 中定义
    { name: 'Comments', routeName: 'Comments', count: commentList.value ? commentList.value.length : 0 },
    { name: 'Followers', routeName: 'Followers', count: 11 },
    { name: 'Following', routeName: 'Following', count: (userFollowerList.value ? userFollowerList.value.length : 0) + (gameFollowerList.value ? gameFollowerList.value.length : 0) },
    { name: 'Pending', routeName: 'Pending', count: null },
    { name: 'About', routeName: 'About', count: null },
]);

const isActive = (routeName) => {
    // 如果没有配置routeName（暂时不可点的），则不激活
    if (!routeName) return false;
    // 判断当前路由的名字是否匹配
    return route.name === routeName;
};

// 处理点击
const handleTabClick = (routeName) => {
    if (routeName) {
        router.push({ name: routeName });
    } else {
        // 如果还没有配置路由页面，暂时什么都不做或弹出提示
        console.log("No route defined for this tab yet");
    }
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
    height: 100%;
    width: 100%;
    padding: 16px 24px;
    box-sizing: border-box;
}

.left-section {
    flex: 0 0 110px;
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

.right-section {
    flex: 1;
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

.username {
    font-size: 26px;
    background: linear-gradient(to right, #44BBEE, #FFB3F3);
    -webkit-background-clip: text;
    color: transparent;
}

.down {
    height: 48px;
    background-color: rgba(41, 56, 61, 0.95);
    width: auto;
    display: flex;
    align-items: stretch;
    padding: 0 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-links {
    display: flex;
    gap: 0;
    height: 100%;
}

.nav-links button {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;

    color: #C1D7DD;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    background: none;
    border: none;
    padding: 0 16px;
    margin: 0;
    outline: none;
    text-decoration: none;
}

.badge {
    background-color: rgba(255, 255, 255, 0.15);
    color: #fff;
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 10px;
    margin-left: 6px;
    transition: background-color 0.2s;
}

.nav-links button:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.05);
    /* 悬停时增加一点微弱的背景色 */
    text-decoration: none;
    /* 移除旧的下划线 */
}

.nav-links button:hover .badge {
    background-color: rgba(255, 255, 255, 0.25);
}

/* --- 激活 (Active/Current) 状态 --- */
.nav-links button.active {
    color: white;
    /* 不一定要背景色，但可以加深一点 */
}

.nav-links button.active .badge {
    background-color: #5d757d;
    /* 激活时徽章颜色加深 */
}

/* --- 底部横线动画 (核心逻辑) --- */
.nav-links button::after {
    content: '';
    position: absolute;
    bottom: 0;
    /* 紧贴底部 */
    left: 0;
    width: 100%;
    height: 3px;
    /* 横线高度 */
    background-color: white;
    /* 横线颜色 */

    /* 动画效果：默认缩放为0 (隐藏) */
    transform: scaleX(0);
    transform-origin: center;
    /* 从中间向两边展开 */
    transition: transform 0.25s ease-out;
    opacity: 0;
}

/* 当 active 类存在时，或者 hover 时，显示横线 */
.nav-links button.active::after,
.nav-links button:hover::after {
    transform: scaleX(1);
    /* 展开 */
    opacity: 1;
}

/* 右侧设置按钮单独处理 */
#right-button {
    margin-left: auto;
}
</style>