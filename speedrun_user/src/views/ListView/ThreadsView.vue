<template>
    <div class="game-run-card">
        <div class="card-header">
            <div class="game-title">User stats</div>
        </div>
        <div class="content">
            <div>
                <span class="game-title">NO THREADS</span>
            </div>
            <div>
                <span>Limpid hasn't created any threads yet.</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

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

const formatDate = (timestamp) => {
    if (!timestamp) return '-'
    const d = new Date(timestamp * 1000)
    return d.toISOString().slice(0, 10).replace(/-/g, '-')
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
    font-size: 16px;
    font-weight: 800;
    text-align: left;
    letter-spacing: 1px;
    text-transform: uppercase;
    opacity: 0.95;
}

.content {
    padding: 32px;
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