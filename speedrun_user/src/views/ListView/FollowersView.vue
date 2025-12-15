<!-- 我服了，没有接口根据id调数据的，甚至src.json都没有粉丝的数据记录，我只能假设我的userFollowerList是我的粉丝和我关注一样了 -->
<template>
    <div class="game-run-card">
        <div class="card-header">
            <div class="game-title">Followers</div>
        </div>
        <div class="list">
            <div v-for="(user, index) in followers" :key="user.id" class="row">
                <img class="cover" :src="getAvatar(user.id)" />

                <div class="info">
                    <div class="name">
                        {{ user.name }}
                        <span v-if="user.pronouns">· {{ user.pronouns }}</span>
                    </div>
                    <div class="last-run">
                        Joined {{ formatDate(user.joined) }} · {{ user.country }}
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex';

const userFollowerList = ref([]);
const store = useStore();

onMounted(async () => {
    try {
        const response = await fetch('/src_user_export.json');
        const data = await response.json();
        userFollowerList.value = data.userFollowerList;
    } catch (error) {
        console.error('Load json failed:', error);
    }
});

const followers = computed(() => {
    return userFollowerList.value.map(rel => {
        const userId = rel.userId

        const dbUser =
            store.state.UserFollowerMock.find(u => u.id === userId) || {}

        return {
            id: userId,
            name: store.state.UserIdMap[userId] || 'Unknown',
            pronouns: dbUser.pronouns || null,
            country: dbUser.country || 'Unknown',
            joined: dbUser.joined || null
        }
    })
})


const getAvatar = (id) => {
    if (id == 'j4qdm2vx') return `./speedrun_user/src/assets/logo/0.png`
    return `https://www.speedrun.com/static/user/${id}/image.png?v=10f4481`
}

const onImgError = (e) => {
    e.target.src = 'speedrun_user\src\assets\logo\0.png'
}

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

.list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
}

.row {
    display: flex;
    align-items: center;
    text-align: left;
    background-color: rgba(41, 56, 61, 0.6);
    padding: 10px 12px;
    border-radius: 8px;
    transition: transform 0.2s ease, background 0.2s ease;
}

.row:hover {
    background-color: rgba(255, 255, 255, 0.08);
    transform: scale(1.015);
}

.cover {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin-right: 14px;
    transition: transform 0.2s ease;
}

.row:hover .cover {
    transform: scale(1.08);
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

@media (max-width: 700px) {
    .list {
        grid-template-columns: 1fr;
    }
}
</style>