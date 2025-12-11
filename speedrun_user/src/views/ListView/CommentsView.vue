<template>
    <div class="game-run-card">
        <div class="card-header">
            <div class="game-title">Comments</div>
        </div>

        <div v-for="(comment, index) in commentList" class="comments">
            <div class="user_info">
                <img src="../../assets/cn.png" alt="location" width="18" height="12">
                <span v-if="users" class="username">{{ users.name }}</span>
                <span v-if="commentList" class="dateTime">{{ formatDate2Sec(comment.editedDate) }}</span>
            </div>

            <div class="text">
                <p>{{ comment.text }}</p>
            </div>
        </div>
        <div class="divider-gradient"></div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const commentList = ref([]);
const users = ref(null)

onMounted(async () => {
    try {
        const response = await fetch('/src_user_export.json');
        const data = await response.json();
        users.value = data.user;
        commentList.value = data.commentList;
    } catch (error) {
        console.error('Load json failed:', error);
    }
});

const formatDate2Sec = (timestamp) => {
    if (!timestamp) return '-';
    const d = new Date(timestamp * 1000);
    const pad = (n) => n.toString().padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hour = pad(d.getHours());
    const min = pad(d.getMinutes());
    const sec = pad(d.getSeconds());
    return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
};
</script>

<style scoped>
.divider-gradient {
    height: 2px;
    background: linear-gradient(90deg, 
        transparent 0%, 
        #e0e0e0 20%, 
        #e0e0e0 80%, 
        transparent 100%
    );
    margin: 20px 0;
}

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

.comments {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 6px;
}

.comments div {
    color: #DADEE1;
    font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    text-align: left;
    font-size: 14px;
    line-height: 1.8;
}

.user_info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-right: auto;
    gap: 10px;
}

.username {
    font-size: 26px;
    background: linear-gradient(to right, #44BBEE, #FFB3F3);
    -webkit-background-clip: text;
    color: transparent;
}

.dateTime {
    font-size: 26px;
}

.text p {
    margin: 0, 0;
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