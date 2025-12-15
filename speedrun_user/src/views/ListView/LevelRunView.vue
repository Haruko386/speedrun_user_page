<template>
    <div class="game-run-card">
        <div class="control-header">
            <div class="main-title">LEVEL RUNS</div>
            <div class="control-switch">
                <div class="items">
                    <el-switch v-model="flag1" size="default"
                        style="--el-switch-on-color: #B2CDD4; --el-switch-off-color: #18222d" />
                    <span>Show obsolete</span>
                </div>
                <div class="items">
                    <el-switch v-model="flag2" size="default"
                        style="--el-switch-on-color: #B2CDD4; --el-switch-off-color: #18222d" />
                    <span>Show misc.</span>
                </div>
            </div>
        </div>

        <div class="list">
            <div v-for="gameGroup in groupedRuns" :key="gameGroup.gameId" class="game-section-wrapper">
                
                <div class="left-cover-col">
                    <div class="cover-wrapper">
                         <img :src="getCoverUrl(gameGroup.gameId)" alt="cover" class="cover-img" @error="onImgError($event)" />
                    </div>
                </div>

                <div class="right-content-col">
                    <div class="game-header-bar">
                        <div class="game-name-title">{{ getGameName(gameGroup.gameId) }}</div>
                    </div>

                    <div class="runs-container">
                        <div v-for="levelGroup in gameGroup.levels" :key="levelGroup.levelId" class="level-group">
                            
                            <div class="level-header-row">
                                Level: {{ getLevelName(levelGroup.levelId) }}
                            </div>

                            <div v-for="(run, index) in levelGroup.runs" :key="run.id" class="run-row"
                                :class="{ 'run-row-odd': index % 2 === 0 }">
                                
                                <div class="run-info-left">
                                    <div class="category-main">{{ getCategoryName(run) }}</div>
                                    <div v-if="run.values && run.values.length" class="category-sub">
                                        {{ formatVariables(run) }}
                                    </div>
                                </div>
                                
                                <div class="run-details">
                                    <div class="time-row">
                                        <span v-if="run.place" class="rank-text">{{ run.place }}th</span>
                                        <span v-if="run.time" class="time">{{ formatTime(run.time) }}</span>
                                        <span v-else class="time">{{ formatTime(run.igt) }}</span>
                                    </div>
                                    <div class="meta-row">
                                        <span v-if="isObsolete(run, levelGroup.runs)" class="obsolete-tag">
                                            <i class="el-icon-warning-outline"></i> Obsolete
                                        </span>
                                        <span class="platform">{{ getPlatformName(run.platformId) }}</span>
                                        <span class="date">{{ formatDateSubmitted(run.dateSubmitted) }}</span>
                                    </div>
                                </div>
                            </div>
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
const flag1 = ref(false) // Show obsolete
const flag2 = ref(false) // Show misc

const platformIdMap = {
    '8gej2n93': 'PC',
    '7vpkd93r': 'Switch',
    'm1p3p7pd': 'PS4',
    'nzelrj6m': 'Emulator',
}

// categoryNameMap 已移除

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

// 这是一个有序对象，我们将利用 keys 的顺序来排序
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

// 将 levelIdMap 的 key 转为数组，用于确定顺序索引
const levelOrder = Object.keys(levelIdMap);

onMounted(async () => {
    try {
        const res = await fetch('/src_user_export.json')
        const data = await res.json()
        runList.value = (data.runList || []).filter(run => run.verified === 1 && run.levelId) 
    } catch (e) {
        console.error('Load Json failed', e)
    }
})

// === 核心数据处理逻辑 ===
const groupedRuns = computed(() => {
    const rawRuns = runList.value;
    
    // 1. 按 gameId 分组
    const gameGroups = new Map();
    rawRuns.forEach(run => {
        if (!gameGroups.has(run.gameId)) gameGroups.set(run.gameId, []);
        gameGroups.get(run.gameId).push(run);
    });

    const result = [];

    gameGroups.forEach((runs, gameId) => {
        // 2. 在每个游戏内，按 levelId 分组
        const levelGroups = new Map();

        runs.forEach(run => {
            if (!levelGroups.has(run.levelId)) levelGroups.set(run.levelId, []);
            levelGroups.get(run.levelId).push(run);
        });

        // 处理每个 Level 的 runs (排序、过滤 Obsolete)
        const processedLevels = [];

        levelGroups.forEach((levelRuns, levelId) => {
            // 先按日期降序排列
            levelRuns.sort((a, b) => b.dateSubmitted - a.dateSubmitted);

            let finalRuns = [];

            if (flag1.value) {
                // 如果显示 Obsolete，显示所有
                finalRuns = levelRuns;
            } else {
                // 如果隐藏 Obsolete，只取每个 Category 的第一名 (最新的)
                const distinctMap = new Map();
                levelRuns.forEach(run => {
                    // key 设为 categoryId，如果有 sub-category 需要结合 values
                    const key = run.categoryId; 
                    if (!distinctMap.has(key)) {
                        distinctMap.set(key, run);
                    }
                });
                finalRuns = Array.from(distinctMap.values());
            }

            if (finalRuns.length > 0) {
                processedLevels.push({
                    levelId: levelId,
                    runs: finalRuns
                });
            }
        });

        // 3. 对 Levels 进行严格排序 (根据 levelIdMap 的顺序)
        processedLevels.sort((a, b) => {
            const indexA = levelOrder.indexOf(a.levelId);
            const indexB = levelOrder.indexOf(b.levelId);
            
            // 如果不在 Map 中，放到最后
            const safeIndexA = indexA === -1 ? 9999 : indexA;
            const safeIndexB = indexB === -1 ? 9999 : indexB;

            return safeIndexA - safeIndexB;
        });

        if (processedLevels.length > 0) {
            result.push({
                gameId: gameId,
                levels: processedLevels
            });
        }
    });

    return result;
});

// === 辅助函数 ===
const getGameName = (gameId) => gameIdMap[gameId] || 'Unknown Game';
const getLevelName = (levelId) => levelIdMap[levelId] || 'Unknown Level';
const getPlatformName = (platformId) => platformIdMap[platformId] || 'PC';
const getCoverUrl = (gameId) => `https://www.speedrun.com/static/game/${gameId}/cover.png?v=a071599`;
const onImgError = (e) => { e.target.src = 'https://www.speedrun.com/static/game/placeholder.png' }

const getCategoryName = (run) => {
    // 优先使用数据中的 categoryName，如果没有则显示 ID 或 placeholder
    // 如果你的 JSON 数据里没有 'categoryName' 字段，请将其替换为实际字段名
    if (run.categoryName) return run.categoryName;
    
    // 简单的 Fallback，根据 Game 特殊处理，或者直接显示 'Any%'
    if (getGameName(run.gameId) === 'Celeste') return 'Clear'; 
    return 'Level';
}

const formatVariables = (run) => {
    // 模拟显示子变量，例如 "Dash (1.4.0.0)"
    return "(1.4.0.0)"; 
}

// 简单判断是否 Obsolete (仅供前端视觉标记，非严谨逻辑)
const isObsolete = (currentRun, allRunsInLevel) => {
    if (!flag1.value) return false; // 如果只显示最新，肯定没有 Obsolete
    // 找到同 category 且日期更新的 run
    return allRunsInLevel.some(r => r.categoryId === currentRun.categoryId && r.dateSubmitted > currentRun.dateSubmitted);
}

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

const formatDateSubmitted = (timestamp) => {
    if (!timestamp) return 'N/A';
    const d = new Date(timestamp * 1000)
    return d.toISOString().slice(0, 10)
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

.control-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    margin-bottom: 10px;
    border-bottom: 2px solid rgba(255,255,255,0.05);
}

.main-title {
    font-size: 20px;
    font-weight: 800;
    color: #E6EDF3;
    letter-spacing: 0.5px;
    text-transform: uppercase;
}

.control-switch {
    display: flex;
    align-items: center;
    gap: 20px;
}

.items {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #B2CDD4;
    font-weight: 600;
    font-size: 14px;
}

/* === 游戏区块 === */
.game-section-wrapper {
    display: flex;
    margin-bottom: 20px;
    align-items: flex-start;
    gap: 10px;
}

.left-cover-col {
    width: 70px;
    flex-shrink: 0;
    margin-right: 2px;
}

.cover-wrapper {
    position: sticky;
    top: 10px;
}

.cover-img {
    width: 100%;
    height: auto;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    object-fit: cover;
}

.right-content-col {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    border-radius: 6px;
    overflow: hidden;
}

.game-header-bar {
    background-color: rgba(22, 27, 34, 0.95);
    padding: 12px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
}

.game-name-title {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.runs-container {
    background-color: rgba(30, 41, 51, 0.9);
}

/* === Level 分组 === */
.level-group {
    border-bottom: 1px solid rgba(255,255,255,0.05);
}

.level-group:last-child {
    border-bottom: none;
}

/* 关卡标题行：模仿截图中的深色横条 */
.level-header-row {
    background-color: rgba(255, 255, 255, 0.05); /* 比 runs 背景稍亮或不同 */
    padding: 8px 18px;
    font-size: 15px;
    font-weight: 700;
    color: #E6EDF3;
    border-bottom: 1px solid rgba(255,255,255,0.02);
}

/* === Run 行样式 === */
.run-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 10px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.02); /* 很淡的分割线 */
}

.run-row:last-child {
    border-bottom: none;
}

.run-row:hover {
    background-color: rgba(255, 255, 255, 0.08);
}

.run-info-left {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.category-main {
    font-size: 14px;
    font-weight: 600;
    color: #B2CDD4; /* 亮青色 */
}

.category-sub {
    font-size: 12px;
    color: #768390;
}

.run-details {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    text-align: right;
}

.time-row {
    display: flex;
    gap: 8px;
    align-items: baseline;
}

.rank-text {
    font-size: 13px;
    color: #E6EDF3;
    font-weight: 700;
}

.time {
    font-family: 'Roboto Mono', monospace;
    font-size: 15px;
    font-weight: 600;
    color: #fff;
}

.meta-row {
    display: flex;
    gap: 12px;
    font-size: 12px;
    color: #768390;
    font-weight: 500;
    align-items: center;
}

.obsolete-tag {
    color: #d2a8a8;
}

.platform {
    text-transform: uppercase;
}
</style>