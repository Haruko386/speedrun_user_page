<template>
    <div class="game-run-card">
        <div class="card-header">
            <div class="game-title">Following</div>
        </div>

        <div class="game-grid">
            <div v-for="game in games" :key="game.gameId" class="game-card">
                <img class="game-cover" :src="game.cover" :alt="game.name" />

                <div class="game-info">
                    <div class="game-name">{{ game.name }}</div>
                    <div class="game-meta">
                        Last access {{ formatDate(game.lastAccessDate) }} ·
                        {{ game.accessCount }} times
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const gameFollowerList = ref([])

onMounted(async () => {
    try {
        const response = await fetch('/src_user_export.json')
        const data = await response.json()
        gameFollowerList.value = data.gameFollowerList || []
    } catch (error) {
        console.error('Load json failed:', error)
    }
})

const games = computed(() => {
    const map = store.state.gameIdMap || {}

    return gameFollowerList.value.map(item => ({
        gameId: item.gameId,
        name: map[item.gameId] || 'Unknown Game',
        cover: `https://www.speedrun.com/static/game/${item.gameId}/cover.jpg?v=07cf3f1`,
        lastAccessDate: item.lastAccessDate,
        accessCount: item.accessCount
    }))
})

const formatDate = (timestamp) => {
    if (!timestamp) return '-'
    const d = new Date(timestamp * 1000)
    return d.toISOString().slice(0, 10)
}
</script>

<style scoped>
.game-run-card {
    background: linear-gradient(135deg, rgba(75, 100, 106, 0.85), rgba(58, 79, 85, 0.9));
    color: #fff;
    border-radius: 12px;
    padding: 0 20px 16px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.card-header {
    padding: 8px;
}

.game-title {
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
}

/* ===== GRID ===== */
.game-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 14px;
}

/* ===== CARD ===== */
.game-card {
    background: rgba(35, 48, 52, 0.95);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.game-card:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 26px rgba(0, 0, 0, 0.45);
}

.game-cover {
    width: 100%;
    aspect-ratio: 3 / 4;
    object-fit: cover;
    transition: transform 0.25s ease;
}

.game-card:hover .game-cover {
    transform: scale(1.08);
}

/* ===== INFO ===== */
.game-info {
    padding: 10px 10px 12px;
}

.game-name {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 4px;
}

.game-meta {
    font-size: 12px;
    opacity: 0.75;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1400px) {
    .game-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (max-width: 1100px) {
    .game-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 800px) {
    .game-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 520px) {
    .game-grid {
        grid-template-columns: 1fr;
    }
}
</style>