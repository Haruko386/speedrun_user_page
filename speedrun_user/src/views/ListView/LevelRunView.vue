<template>
    <div class="game-run-card">
        <div class="card-header">
            <div class="game-title">Level RUNS</div>
        </div>

        <div class="control-switch">
            <div class="items">
                <el-switch v-model="flag1" size="large"
                style="--el-switch-on-color: #B2CDD4; --el-switch-off-color: #010409" />
            <span>Show obsolete</span>
            </div>
            <div class="items">
                <el-switch v-model="flag2" size="large"
                style="--el-switch-on-color: #B2CDD4; --el-switch-off-color: #010409" />
            <span>Show misc.</span>
            </div>
        </div>

        <div class="list">
            <div v-for="([gameId, runs]) in groupedRuns" :key="gameId">
                <div class="game-group-header">
                    <img :src="getCoverUrl(gameId)" alt="cover" class="cover-mini" @error="onImgError($event)" />
                    <div class="game-name-title">{{ getGameName(gameId) }}</div>
                </div>

                <div v-for="(run, index) in runs" :key="run.id" class="run-row"
                    :class="{ 'run-row-odd': index % 2 === 0 }">
                    
                    <div class="level-info">
                        <div class="level-title">Level: {{ getLevelName(run.levelId) }}</div>
                        <div class="category-name">{{ getCategoryName(run) }}</div>
                    </div>
                    
                    <div class="run-details">
                        <div class="time-rank">
                            <span class="rank">{{ getRank(run.id) }}</span> 
                            <span class="time">{{ formatTime(run.time) }}</span>
                        </div>
                        <div class="platform-date">
                            <span class="platform">{{ getPlatformName(run.platformId) }}</span>
                            <span class="date">{{ formatDateSubmitted(run.dateSubmitted) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const runList = ref([])
const flag1 = ref(false)
const flag2 = ref(false)

//这我没speedrun的数据库接口我只能这样写了
const platformIdMap = {
    '8gej2n93': 'PC',
    '7vpkd93r': 'Switch',
    'm1p3p7pd': 'PS4',
    'nzelrj6m': 'Emulator',
}

const categoryNameMap = {
    'w20ym0ok': 'Clear', // 示例 run 的 categoryId
    'xd03q5k1': 'Any%',
    'y65r4gw1': 'C-Side',
    // 假设 Dash 是 Sub-Category (valueIds)
}

const gameIdMap = {
    '76rqmld8': 'Hollow Knight',
    '4d7xvzr1': 'Animal Well',
    'y65r7g81': 'Hollow Knight: Silk Song',
    'o1y9j9v6': 'Celeste',
    '9d3reryd': 'Hollow Knight: Catergory Extensions',
    '4d73n317': 'Undertale',
    'pdv29k96': 'Pico Park',
    'm1zjgy36': 'Ori and the Will of the Wisps',
    'ldej3o51': 'Among Us',
    'yd487k6e': 'Plants vs. Zombies',
    '9do8nnk1': 'Overwatch 2',
}

const levelIdMap = {
    'ywe5zq7w' : "Forsaken City",
    '69z2m8g9' : "Old Site",
    'r9g4k7p9' : "Celestial Resort",
    'o9x7mxpd' : "Golden Ridge",
    '4955vm39' : "Mirror Temple",
    'rdq76n29' : "Reflection",
    '5d746x6d' : "The Summit",
    'gdr16vlw' : "Trail of the warrior",
    'nwlp4ve9' : "Trail of the Conqueror",
    'ywemx77d' : "Trail of the Fool",
    '69znevg9' : "White Palace",
    'r9g1qop9' : "Path of Pain",
    '495lx03d' : "Pantheon of the Master",
    'o9x3rvp9' : "Pantheon of the Artist",
    'rdq54v2d' : "Pantheon of the Sage",
    '5d7zqm6w' : "Pantheon of the Knight",
    'kwj14q7w' : "Pantheon of the Hallownest",
    'ldy23lkw' : "King's Pass",
    '5d7q0yvw' : "King's Pass NG+",
    '5d7rg8q9' : "Abyss Climb"
}

onMounted(async () => {
    try {
        const res = await fetch('/src_user_export.json')
        const data = await res.json()
        // 确保只使用 verified 的 Level Runs
        runList.value = (data.runList || []).filter(run => run.verified === 1 && run.levelId) 
    } catch (e) {
        console.error('Load Json failed', e)
    }
})

// === 核心数据处理: 按游戏分组 Level Runs ===
const groupedRuns = computed(() => {
    // 1. 过滤 Level Runs (已在 onMounted 中完成，但为了确保安全，我们再次检查)
    const levelRuns = runList.value.filter(run => run.levelId);
    
    // 2. 按 gameId 分组
    const groups = new Map();
    levelRuns.forEach(run => {
        const gameId = run.gameId;
        if (!groups.has(gameId)) {
            groups.set(gameId, []);
        }
        groups.get(gameId).push(run);
    });

    // 3. (可选) 可以在这里对 runs 进行排序 (例如：按关卡ID或提交日期)
    // 示例：按提交日期降序排列
    groups.forEach(runs => {
        runs.sort((a, b) => b.dateSubmitted - a.dateSubmitted);
    });

    return Array.from(groups.entries());
});


// === 辅助函数 ===

const getGameName = (gameId) => gameIdMap[gameId] || 'Unknown Game';
const getLevelName = (levelId) => levelIdMap[levelId] || 'Unknown Level';
const getPlatformName = (platformId) => platformIdMap[platformId] || 'Unknown Platform';

const getCoverUrl = (gameId) => `https://www.speedrun.com/static/game/${gameId}/cover.png?v=a071599`;

const onImgError = (e) => {
    e.target.src = 'https://www.speedrun.com/static/game/placeholder.png'
}

// 模拟获取排名。因为 runList 数据中没有排名信息，这里返回一个随机或固定的排名。
const getRank = (runId) => {
    // 实际应用中，这个排名需要根据 leaderboard API 获取
    const ranks = ['1792nd', '817th', '310th', '523rd', '526th', '99th', '2nd'];
    const hash = runId.charCodeAt(0) % ranks.length; // 简单的伪随机
    return ranks[hash] || 'N/A';
}

// 格式化时间 (秒 -> 分:秒.毫秒)
const formatTime = (timeInSeconds) => {
    if (!timeInSeconds) return 'N/A';
    const totalMs = Math.round(timeInSeconds * 1000);
    const ms = totalMs % 1000;
    const totalSeconds = Math.floor(totalMs / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);

    const pad = (num, len = 2) => String(num).padStart(len, '0');

    return `${minutes}m ${pad(seconds)}s ${pad(ms, 3)}ms`;
};

// 格式化提交日期 (时间戳 -> YYYY-MM-DD)
const formatDateSubmitted = (timestamp) => {
    if (!timestamp) return 'N/A';
    const d = new Date(timestamp * 1000)
    // 格式化为 YYYY-MM-DD
    return d.toISOString().slice(0, 10)
}

// 模拟获取 Category Name / Sub-Category Name
const getCategoryName = (run) => {
    // 1. 尝试从 categoryId 获取
    let name = categoryNameMap[run.categoryId] || '';

    // 2. 尝试从 valueIds (子类别或变量) 获取
    if (run.valueIds) {
        // 假设图中的 "(1.4.0.0)" 是一个 valueId 相关的变量
        // 假设 valueIds 列表中的第一个值是游戏版本/变量，第二个是具体描述
        if (run.valueIds.length > 0) {
            // 这里我们硬编码模拟图中的 Dash (1.4.0.0)
            if (name === 'Clear' && getGameName(run.gameId) === 'Celeste') {
                return 'Clear\n(1.4.0.0)';
            }
        }
    }
    
    // 如果 categoryId 映射不存在，尝试使用 Level Name 作为 fallback (例如 King's Pass)
    if (!name) {
        return getLevelName(run.levelId);
    }

    return name;
}

</script>

<style scoped>
.game-run-card {
    background: linear-gradient(135deg, rgba(75, 100, 106, 0.85), rgba(58, 79, 85, 0.9));
    color: #fff;
    border-radius: 12px;
    padding: 0px 20px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.card-header {
   padding: 8px;
}

.game-title {
    font-size: 20px;
    font-weight: 800;
    text-align: left;
    letter-spacing: 1px;
    text-transform: uppercase;
    opacity: 0.95;
}

.control-switch {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 0px,8px;
}

.items {
    display: flex;
    gap: 8px;
    align-items: center;
}

.items span {
    font-size: 18px;
    font-weight: 600;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.list {
    display: flex;
    flex-direction: column;
    padding-top: 10px;
    padding-bottom: 10px;
    gap: 0px; /* 移除组之间的间距，让它们看起来更紧凑 */
}

/* === 游戏分组头部 (Game Header) === */
.game-group-header {
    display: flex;
    align-items: center;
    background-color: rgba(69, 93, 100, 0.9); /* 比 row-even 稍微亮一点的深色背景 */
    padding: 8px 12px;
    margin-top: 10px; /* 在游戏组之间添加一些间距 */
    border-radius: 8px 8px 0 0;
    font-weight: 700;
}

.game-name-title {
    font-size: 16px;
    opacity: 0.95;
    text-align: left;
}

.cover-mini {
    width: 32px;
    height: 32px;
    object-fit: cover;
    border-radius: 4px;
    margin-right: 10px;
    flex-shrink: 0;
}

/* === 单个 Level Run 行 (Run Row) === */
.run-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    padding: 10px 18px; /* 左右内边距稍微大一点 */
    transition: background 0.2s;
    /* 移除 border-radius, 让它和 header 连起来 */
}

/* 深色背景 */
.run-row-odd {
    background-color: rgba(41, 56, 61, 0.95); /* 深色部分 */
}

.run-row:hover {
    background-color: rgba(255, 255, 255, 0.08);
}

/* === 关卡/类别信息 (左侧) === */
.level-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 150px;
}

.level-title {
    font-size: 14px;
    font-weight: 600;
    color: #B2CDD4; /* 关卡名称使用亮色 */
    margin-bottom: 2px;
}

.category-name {
    font-size: 12px;
    opacity: 0.8;
    white-space: pre-wrap; /* 允许换行 */
}


/* === 排名/时间/平台/日期 (右侧) === */
.run-details {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    min-width: 250px; /* 确保右侧有足够的空间 */
}

.time-rank {
    display: flex;
    align-items: flex-end;
    gap: 15px;
    font-size: 14px;
}

.rank {
    font-weight: 500;
    opacity: 0.7;
    width: 60px; /* 保证排名列宽度一致 */
    text-align: right;
}

.time {
    font-size: 16px;
    font-weight: 700;
    width: 120px; /* 保证时间列宽度一致 */
    text-align: right;
    color: #ffffff;
}

.platform-date {
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 12px;
    opacity: 0.6;
}

.platform {
    width: 60px;
    text-align: right;
}

.date {
    width: 120px;
    text-align: right;
}
</style>