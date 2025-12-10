<template>
    <div class="game-run-card">
        <div class="card-header">
            <div class="game-title">GAMES RUN</div>
        </div>

        <div class="list">
            <div v-for="(item, index) in sortedGames" :key="item.gameId" class="row"
                :class="{ 'row-even': index % 2 === 0 }">
                <img :src="`https://www.speedrun.com/static/game/${item.gameId}/cover.png?v=a071599`" alt="cover"
                    class="cover" @error="onImgError($event)" />
                <div class="info">
                    <div class="name">{{ item.name }}</div>
                    <div class="last-run">Last run {{ formatDate(item.lastRun) }}</div>
                </div>
                <div class="count">
                    <span>{{ item.count }}</span>
                    <span class="suffix">{{ item.count > 1 ? 'runs' : 'run' }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const runList = ref([])

//这我没speedrun的数据库接口我只能这样写了
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
    'j1ne9me1': 'Celeste Category Extensions',
    '9do8nnk1': 'Overwatch 2',
}

onMounted(async () => {
    try {
        const res = await fetch('/src_user_export.json')
        const data = await res.json()
        runList.value = data.runList || []
    } catch (e) {
        console.error('Load Json failed', e)
    }
})

const sortedGames = computed(() => {
    const map = {}

    runList.value.forEach((run) => {
        const gid = run.gameId
        if (!gid) return

        if (!map[gid]) {
            map[gid] = {
                gameId: gid,
                name: gameIdMap[gid] || 'Unknown Game',
                count: 0,
                lastRun: 0,
            }
        }
        map[gid].count += 1
        if (run.date > map[gid].lastRun) {
            map[gid].lastRun = run.date
        }
    })

    // 转成数组并按次数降序
    return Object.values(map)
        .sort((a, b) => b.count - a.count)
})

const formatDate = (timestamp) => {
    if (!timestamp) return '-'
    const d = new Date(timestamp * 1000)
    return d.toISOString().slice(0, 10).replace(/-/g, '-')
}

const onImgError = (e) => {
    e.target.src = 'https://www.speedrun.com/static/game/placeholder.png'
}

</script>

<style scoped>
.game-run-card {
    background: linear-gradient(135deg, rgba(75, 100, 106, 0.85), rgba(58, 79, 85, 0.9));
    color: #fff;
    border-radius: 12px;
    padding: 20px 24px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    max-width: 400px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    margin-top: 10px;
}

.card-header {
    margin-bottom: 16px;
}

.game-title {
    font-size: 16px;
    font-weight: 800;
    text-align: left;
    letter-spacing: 1px;
    text-transform: uppercase;
    opacity: 0.95;
}

.list {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.row {
    display: flex;
    align-items: center;
    text-align: left;
    padding: 10px 12px;
    border-radius: 8px;
    transition: background 0.2s;
}

.row-even {
    background-color: rgba(41, 56, 61, 0.95);
}

.row:hover {
    background-color: rgba(255, 255, 255, 0.08);
}

.cover {
    width: 48px;
    height: 64px;
    object-fit: cover;
    border-radius: 6px;
    margin-right: 14px;
    flex-shrink: 0;
}

.info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.name {
    font-size: 15px;
    font-weight: 600;
}

.last-run {
    font-size: 12px;
    opacity: 0.7;
}

.count {
    font-size: 18px;
    font-weight: 700;
    min-width: 70px;
}

.count span {
    display: flex;
    text-align: center;
    flex-direction: column;
}

.suffix {
    font-size: 12px;
    font-weight: normal;
    opacity: 0.7;
    margin-left: 4px;
}
</style>